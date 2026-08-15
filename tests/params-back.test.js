import { describe, it, expect } from "vitest";
import { buildVidParams, buildPicParams, buildTextParams } from "../src/util/params-back.js";

const makeVidMessage = (overrides = {}) => ({
  message_id: 42,
  forward_from_message_id: 7,
  forward_from_chat: { id: -100111, title: "Source Channel" },
  chat: { id: -100222, title: "Target Chat" },
  caption: "a caption",
  date: 1700000100,
  forward_date: 1690000000,
  video: {
    file_id: "vid-file-id",
    file_unique_id: "vid-unique",
    file_name: "clip.mp4",
    file_size: 12345,
    duration: 60,
  },
  ...overrides,
});

const makePicMessage = (overrides = {}) => ({
  message_id: 43,
  forward_from_message_id: 8,
  forward_from_chat: { id: -100111, title: "Source Channel" },
  chat: { id: -100222, title: "Target Chat" },
  caption: "pic caption",
  date: 1700000100,
  forward_date: 1690000000,
  photo: [
    { file_id: "small-id", file_unique_id: "small-uid", file_size: 100, width: 90, height: 90 },
    { file_id: "medium-id", file_unique_id: "medium-uid", file_size: 500, width: 320, height: 320 },
    { file_id: "large-id", file_unique_id: "large-uid", file_size: 900, width: 1280, height: 1280 },
  ],
  ...overrides,
});

const makeTextMessage = (overrides = {}) => ({
  message_id: 44,
  forward_from_message_id: 9,
  forward_from_chat: { id: -100111, title: "Source Channel" },
  chat: { id: -100222, title: "Target Chat" },
  date: 1700000100,
  forward_date: 1690000000,
  text: "hello world",
  ...overrides,
});

describe("buildVidParams", () => {
  it("returns null when the message has no video field", async () => {
    const msg = makeVidMessage();
    delete msg.video;
    expect(await buildVidParams(msg)).toBeNull();
  });

  it("returns null when forward_from_chat.id is missing", async () => {
    const msg = makeVidMessage({ forward_from_chat: { title: "no id here" } });
    expect(await buildVidParams(msg)).toBeNull();
  });

  it("returns null when chat.id is missing", async () => {
    const msg = makeVidMessage({ chat: { title: "no id here" } });
    expect(await buildVidParams(msg)).toBeNull();
  });

  it("labels the result with paramType 'vidParams'", async () => {
    const result = await buildVidParams(makeVidMessage());
    expect(result.paramType).toBe("vidParams");
  });

  it("cross-assigns dates: datePosted takes forward_date and dateForwarded takes date (current behavior, looks swapped but matches TG semantics)", async () => {
    const result = await buildVidParams(makeVidMessage({ date: 222, forward_date: 111 }));
    expect({ datePosted: result.datePosted, dateForwarded: result.dateForwarded }).toEqual({
      datePosted: 111,
      dateForwarded: 222,
    });
  });

  it("stamps dateStored with a Date instance, not a raw timestamp", async () => {
    const result = await buildVidParams(makeVidMessage());
    expect(result).toEqual(expect.objectContaining({ dateStored: expect.any(Date) }));
  });
});

describe("buildPicParams", () => {
  it("returns null when photo is not an array", async () => {
    const msg = makePicMessage({ photo: { file_id: "not-an-array" } });
    expect(await buildPicParams(msg)).toBeNull();
  });

  it("returns null when photo is an empty array", async () => {
    const msg = makePicMessage({ photo: [] });
    expect(await buildPicParams(msg)).toBeNull();
  });

  it("returns null when forward_from_chat.id is null", async () => {
    const msg = makePicMessage({ forward_from_chat: { id: null, title: "x" } });
    expect(await buildPicParams(msg)).toBeNull();
  });

  it("takes file_id from the LAST photo entry (largest size), not the first", async () => {
    const result = await buildPicParams(makePicMessage());
    expect(result.fileFullId).toBe("large-id");
  });

  it("takes pic dimensions from the LAST photo entry, not the first", async () => {
    const result = await buildPicParams(makePicMessage());
    expect({ picWidth: result.picWidth, picHeight: result.picHeight }).toEqual({
      picWidth: 1280,
      picHeight: 1280,
    });
  });

  it("labels the result with paramType 'picParams'", async () => {
    const result = await buildPicParams(makePicMessage());
    expect(result.paramType).toBe("picParams");
  });

  it("cross-assigns dates: datePosted takes forward_date and dateForwarded takes date (current behavior)", async () => {
    const result = await buildPicParams(makePicMessage({ date: 222, forward_date: 111 }));
    expect({ datePosted: result.datePosted, dateForwarded: result.dateForwarded }).toEqual({
      datePosted: 111,
      dateForwarded: 222,
    });
  });
});

describe("buildTextParams", () => {
  it("returns null when the message has no text field", async () => {
    const msg = makeTextMessage();
    delete msg.text;
    expect(await buildTextParams(msg)).toBeNull();
  });

  it("returns null for an empty-string text (falsy guard drops caption-less document messages)", async () => {
    const msg = makeTextMessage({ text: "" });
    expect(await buildTextParams(msg)).toBeNull();
  });

  it("returns null when chat is missing entirely", async () => {
    const msg = makeTextMessage();
    delete msg.chat;
    expect(await buildTextParams(msg)).toBeNull();
  });

  it("labels the result with paramType 'textParams'", async () => {
    const result = await buildTextParams(makeTextMessage());
    expect(result.paramType).toBe("textParams");
  });

  it("cross-assigns dates: datePosted takes forward_date and dateForwarded takes date (current behavior)", async () => {
    const result = await buildTextParams(makeTextMessage({ date: 222, forward_date: 111 }));
    expect({ datePosted: result.datePosted, dateForwarded: result.dateForwarded }).toEqual({
      datePosted: 111,
      dateForwarded: 222,
    });
  });
});
