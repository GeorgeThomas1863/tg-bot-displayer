// Tests for src/forward-all/forward-all-store.js — range loop semantics.
//
// Module-load hazards handled here:
// - models/db-model.js has a top-level `await dbConnect()` that would hang the
//   test run against a real MongoDB — mocked with a benign fake class.
// - src/tg-api.js has dotenv + loadTokens load-time side effects — mocked.
// - src/util/params-back.js and src/util/state.js are used REAL: fixtures are
//   shaped so the real builders produce store objects, and the real shared
//   state singleton drives the stop mechanism.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { storeAnyMock } = vi.hoisted(() => ({ storeAnyMock: vi.fn() }));

vi.mock("../models/db-model.js", () => {
  class FakeDbModel {
    constructor(dataObject, collection) {
      this.dataObject = dataObject;
      this.collection = collection;
    }
    async storeAny() {
      return storeAnyMock(this.dataObject, this.collection);
    }
  }
  return { default: FakeDbModel };
});

vi.mock("../src/tg-api.js", () => ({
  tgForwardMessage: vi.fn(),
}));

import { runForwardAllStore } from "../src/forward-all/forward-all-store.js";
import { tgForwardMessage } from "../src/tg-api.js";
import state from "../src/util/state.js";
import { getFirstArgField } from "./helpers/mock-calls.js";

const baseParams = {
  messageStart: 1,
  messageStop: 4,
  forwardAllType: "storeEverything",
  collectionSaveTo: "test-collection",
  dataType: "test",
  forwardFromId: "from-chat-1",
  forwardToId: "to-chat-1",
};

// A text-type forward result that the REAL params-back buildTextParams accepts.
const makeForwardData = (messageId) => ({
  ok: true,
  result: {
    message_id: 1000 + messageId,
    forward_from_message_id: messageId,
    text: `msg-${messageId}`,
    forward_from_chat: { id: -100111, title: "Source Channel" },
    chat: { id: -100222, title: "Target Channel" },
    date: 1700000100,
    forward_date: 1700000000,
  },
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "log").mockImplementation(() => {});
  state.active = true;
  storeAnyMock.mockImplementation(async (dataObject) => ({ acknowledged: true, storedText: dataObject.text }));
});

afterEach(() => {
  vi.restoreAllMocks();
  state.active = false;
});

describe("range bounds", () => {
  it("messageStop is EXCLUSIVE: start=1 stop=4 forwards exactly ids 1, 2, 3 — the stop message is never forwarded", async () => {
    tgForwardMessage.mockImplementation(async ({ messageId }) => makeForwardData(messageId));

    await runForwardAllStore({ ...baseParams });

    expect(getFirstArgField(tgForwardMessage, "messageId")).toEqual([1, 2, 3]);
    expect(storeAnyMock.mock.calls[0][0]).toMatchObject({ text: "msg-1", paramType: "textParams" });
    expect(storeAnyMock.mock.calls[0][1]).toBe("test-collection");
  });

  it("returns one stored result per forwarded message in the range", async () => {
    tgForwardMessage.mockImplementation(async ({ messageId }) => makeForwardData(messageId));

    const result = await runForwardAllStore({ ...baseParams });

    expect(result).toEqual([
      { acknowledged: true, storedText: "msg-1" },
      { acknowledged: true, storedText: "msg-2" },
      { acknowledged: true, storedText: "msg-3" },
    ]);
  });

  it("passes the configured from/to chat ids to every forward call", async () => {
    tgForwardMessage.mockImplementation(async ({ messageId }) => makeForwardData(messageId));

    await runForwardAllStore({ ...baseParams });

    expect(tgForwardMessage.mock.calls[0][0]).toEqual({
      forwardToId: "to-chat-1",
      forwardFromId: "from-chat-1",
      messageId: 1,
    });
  });
});

describe("stop mechanism", () => {
  it("returns null without forwarding anything when state.active is false at entry", async () => {
    state.active = false;

    expect(await runForwardAllStore({ ...baseParams })).toBeNull();
    expect(tgForwardMessage).not.toHaveBeenCalled();
  });

  it("state.active flipped false mid-run returns null — partial results already stored are discarded", async () => {
    tgForwardMessage.mockImplementation(async ({ messageId }) => {
      if (messageId === 2) state.active = false; // stop lands during the 2nd iteration
      return makeForwardData(messageId);
    });

    const result = await runForwardAllStore({ ...baseParams });

    expect(result).toBeNull();
    expect(tgForwardMessage).toHaveBeenCalledTimes(2);
    expect(storeAnyMock).toHaveBeenCalledTimes(2); // work happened, then got thrown away
  });
});

describe("per-iteration failure handling", () => {
  it("a tgForwardMessage throw on one id is swallowed and the loop continues to the next id", async () => {
    tgForwardMessage.mockImplementation(async ({ messageId }) => {
      if (messageId === 2) throw new Error("boom");
      return makeForwardData(messageId);
    });

    const result = await runForwardAllStore({ ...baseParams });

    expect(getFirstArgField(tgForwardMessage, "messageId")).toEqual([1, 2, 3]);
    expect(result).toEqual([
      { acknowledged: true, storedText: "msg-1" },
      { acknowledged: true, storedText: "msg-3" },
    ]);
  });

  it("a falsy forwardData skips that iteration — no store call for the failed id", async () => {
    tgForwardMessage.mockImplementation(async ({ messageId }) => (messageId === 2 ? null : makeForwardData(messageId)));

    const result = await runForwardAllStore({ ...baseParams });

    expect(storeAnyMock).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);
  });

  it("a forward whose payload cannot build a store object is skipped without storing (storeVids on a text message)", async () => {
    tgForwardMessage.mockImplementation(async ({ messageId }) => makeForwardData(messageId));

    const result = await runForwardAllStore({ ...baseParams, forwardAllType: "storeVids" });

    expect(storeAnyMock).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
