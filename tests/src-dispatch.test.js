// Tests for src/src.js — command dispatch and env-default merging (addDefaultParams
// and getCaption are private, so they are tested through tgCommandRun by mocking
// the four handler modules and inspecting the params they receive).
//
// Module-load hazards handled here:
// - src.js builds defaultObject from process.env AT LOAD — env is set in
//   beforeEach BEFORE the dynamic import, with vi.resetModules() per test.
// - All four handler modules are mocked; this also prevents the transitive
//   top-level-await MongoDB connect in models/db-model.js (via forward-all /
//   caption-all / upload-pics) and the dotenv/loadTokens side effects in
//   tg-api.js from ever running.

import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from "vitest";

vi.mock("../src/tg-api.js", () => ({
  tgGetUpdates: vi.fn().mockResolvedValue("getUpdates-result"),
  tgSendMessage: vi.fn().mockResolvedValue("sendMessage-result"),
  tgForwardMessage: vi.fn().mockResolvedValue("forwardMessage-result"),
  tgEditMessageCaption: vi.fn().mockResolvedValue("editCaption-result"),
}));

vi.mock("../src/forward-all/forward-all-store.js", () => ({
  runForwardAllStore: vi.fn().mockResolvedValue("forwardAllStore-result"),
}));

vi.mock("../src/caption-all/caption-all-lookup.js", () => ({
  runCaptionAllLookup: vi.fn().mockResolvedValue("captionAllLookup-result"),
}));

vi.mock("../src/upload-pics/upload-pics.js", () => ({
  runUploadPics: vi.fn().mockResolvedValue("uploadPics-result"),
}));

const ENV_DEFAULTS = {
  MESSAGE_START: "5",
  MESSAGE_STOP: "10",
  FORWARD_FROM_ID: "env-forward-from",
  FORWARD_TO_ID: "env-forward-to",
  UPLOAD_TO_ID: "env-upload-to",
  EDIT_CHANNEL_ID: "env-edit-channel",
  COLLECTION_PULL_FROM: "env-coll-pull",
  COLLECTION_EXTRA: "env-coll-extra",
  COLLECTION_SAVE_TO: "env-coll-save",
  PIC_PATH: "env-pic-path",
  CHAT_ID: "env-chat",
  MESSAGE_ID: "env-message-id",
  TEXT: "env-text",
  CAPTION: "env-caption",
  DATA_TYPE: "env-data-type",
};

let tgCommandRun;
let tgApi;
let forwardAll;
let captionAll;
let uploadPics;
let state;

beforeEach(async () => {
  vi.resetModules();
  // Mocked handler modules are NOT recreated by resetModules — clear their call
  // history (keeping the factory-set resolved values) so tests stay independent.
  vi.clearAllMocks();
  for (const key in ENV_DEFAULTS) {
    vi.stubEnv(key, ENV_DEFAULTS[key]);
  }
  vi.spyOn(console, "log").mockImplementation(() => {});

  tgApi = await import("../src/tg-api.js");
  forwardAll = await import("../src/forward-all/forward-all-store.js");
  captionAll = await import("../src/caption-all/caption-all-lookup.js");
  uploadPics = await import("../src/upload-pics/upload-pics.js");
  state = (await import("../src/util/state.js")).default;
  ({ tgCommandRun } = await import("../src/src.js"));

  state.active = true;
});

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("dispatch guards", () => {
  it("returns null when inputParams is missing", async () => {
    expect(await tgCommandRun(undefined)).toBeNull();
  });

  it("returns null when state.active is false", async () => {
    state.active = false;
    expect(await tgCommandRun({ command: "sendMessage", chatId: "1", text: "hi" })).toBeNull();
    expect(tgApi.tgSendMessage).not.toHaveBeenCalled();
  });

  it("returns null when command is missing", async () => {
    expect(await tgCommandRun({ chatId: "1", text: "hi" })).toBeNull();
  });

  it("returns null for an unknown command", async () => {
    expect(await tgCommandRun({ command: "definitelyNotACommand" })).toBeNull();
  });
});

describe("env-default merging (through the params the handler receives)", () => {
  it("replaces an empty-string field with the env default", async () => {
    await tgCommandRun({ command: "sendMessage", chatId: "", text: "hello" });

    const received = tgApi.tgSendMessage.mock.calls[0][0];
    expect(received.chatId).toBe("env-chat");
  });

  it("numeric 0 is treated as blank and replaced by the env default (the frontend sends +value, so 0 means an empty field)", async () => {
    await tgCommandRun({ command: "sendMessage", chatId: 0, text: "hello" });

    const received = tgApi.tgSendMessage.mock.calls[0][0];
    expect(received.chatId).toBe("env-chat");
  });

  it('does NOT replace the string "0"', async () => {
    await tgCommandRun({ command: "sendMessage", chatId: "0", text: "hello" });

    const received = tgApi.tgSendMessage.mock.calls[0][0];
    expect(received.chatId).toBe("0");
  });

  it("does NOT add a default for a field that was never submitted (undefined/absent keys are skipped)", async () => {
    await tgCommandRun({ command: "sendMessage", text: "hello" });

    const received = tgApi.tgSendMessage.mock.calls[0][0];
    expect("chatId" in received).toBe(false);
  });

  it("leaves a populated field untouched", async () => {
    await tgCommandRun({ command: "sendMessage", chatId: "12345", text: "hello" });

    const received = tgApi.tgSendMessage.mock.calls[0][0];
    expect(received.chatId).toBe("12345");
  });

  it("env-default range bounds are coerced to numbers before reaching the range handler", async () => {
    await tgCommandRun({ command: "forwardAllStore", messageStart: "", messageStop: "", forwardAllType: "storeEverything" });

    const received = forwardAll.runForwardAllStore.mock.calls[0][0];
    expect(received.messageStart).toBe(5);
    expect(received.messageStop).toBe(10);
  });

  it("range bounds submitted as STRINGS by a non-browser client also reach the range handler as numbers", async () => {
    await tgCommandRun({ command: "forwardAllStore", messageStart: "9", messageStop: "10", forwardAllType: "storeEverything" });

    const received = forwardAll.runForwardAllStore.mock.calls[0][0];
    expect(received.messageStart).toBe(9);
    expect(received.messageStop).toBe(10);
  });
});

describe("editMessageCaption caption resolution", () => {
  it("a submitted non-empty caption wins over text and the env default", async () => {
    await tgCommandRun({ command: "editMessageCaption", caption: "mine", text: "other", editChannelId: "e1", messageId: "7" });

    const received = tgApi.tgEditMessageCaption.mock.calls[0][0];
    expect(received.caption).toBe("mine");
  });

  it("empty caption with non-empty text falls back to the text", async () => {
    await tgCommandRun({ command: "editMessageCaption", caption: "", text: "fallback-text", editChannelId: "e1", messageId: "7" });

    const received = tgApi.tgEditMessageCaption.mock.calls[0][0];
    expect(received.caption).toBe("fallback-text");
  });

  it("empty caption and empty text fall back to process.env.CAPTION", async () => {
    await tgCommandRun({ command: "editMessageCaption", caption: "", text: "", editChannelId: "e1", messageId: "7" });

    const received = tgApi.tgEditMessageCaption.mock.calls[0][0];
    expect(received.caption).toBe("env-caption");
  });
});

describe("handler routing", () => {
  it("getUpdates receives ONLY { offset }, not the full params object", async () => {
    await tgCommandRun({ command: "getUpdates", offset: 7, chatId: "x", text: "y" });

    expect(tgApi.tgGetUpdates).toHaveBeenCalledTimes(1);
    const received = tgApi.tgGetUpdates.mock.calls[0][0];
    expect(received).toEqual({ offset: 7 });
    expect(Object.keys(received)).toEqual(["offset"]);
  });

  it("returns the handler's result for a dispatched command", async () => {
    const result = await tgCommandRun({ command: "captionAllLookup" });
    expect(result).toBe("captionAllLookup-result");
    expect(captionAll.runCaptionAllLookup).toHaveBeenCalledTimes(1);
  });

  it("sendPhoto dispatches to runUploadPics with the merged params", async () => {
    await tgCommandRun({ command: "sendPhoto", picPath: "", uploadToId: "u1" });

    const received = uploadPics.runUploadPics.mock.calls[0][0];
    expect(received.picPath).toBe("env-pic-path");
    expect(received.uploadToId).toBe("u1");
  });
});
