// Tests that runCaptionAllLookup and runUploadPics pass dbName through as the
// 3rd argument to `new dbModel(...)`.
//
// Mocking notes (same approach as tests/forward-range.test.js):
// - models/db-model.js has a top-level `await dbConnect()` — mocked with a fake class.
// - src/tg-api.js has dotenv/token load-time side effects — mocked.
// - src/util/state.js is used REAL so the stop flag works as in production.
// - Upload path uses uploadSingleFS pointed at this project's package.json, a real
//   file that always exists, so the real fs check passes without fs mocking.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fileURLToPath } from "url";

const { storeAnyMock, dbModelCtorMock } = vi.hoisted(() => ({ storeAnyMock: vi.fn(), dbModelCtorMock: vi.fn() }));

vi.mock("../models/db-model.js", () => {
  class FakeDbModel {
    constructor(dataObject, collection, dbName) {
      this.dataObject = dataObject;
      this.collection = collection;
      dbModelCtorMock(dataObject, collection, dbName);
    }
    async storeAny() {
      return storeAnyMock(this.dataObject, this.collection);
    }
  }
  return { default: FakeDbModel };
});

vi.mock("../src/tg-api.js", () => ({
  tgForwardMessage: vi.fn(),
  tgEditMessageCaption: vi.fn(),
  tgPostPicFS: vi.fn(),
  tgPostPicURL: vi.fn(),
}));

import { runCaptionAllLookup } from "../src/caption-all/caption-all-lookup.js";
import { runUploadPics } from "../src/upload-pics/upload-pics.js";
import { tgForwardMessage, tgEditMessageCaption, tgPostPicFS } from "../src/tg-api.js";
import state from "../src/util/state.js";

const PROJECT_PACKAGE_JSON = fileURLToPath(new URL("../package.json", import.meta.url));

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "log").mockImplementation(() => {});
  state.active = true;
  storeAnyMock.mockImplementation(async () => ({ acknowledged: true }));
});

afterEach(() => {
  vi.restoreAllMocks();
  state.active = false;
});

describe("runCaptionAllLookup dbName passthrough", () => {
  it("passes dbName 'userdb' as the 3rd constructor argument on the store dbModel", async () => {
    tgForwardMessage.mockResolvedValue({
      ok: true,
      result: { forward_from_message_id: 1, forward_from_chat: { id: -100111 } },
    });
    tgEditMessageCaption.mockResolvedValue({ ok: true, result: { message_id: 1 } });

    await runCaptionAllLookup({
      captionAllType: "clearVidCaptions", // returns "" without any DB lookup
      messageStart: 1,
      messageStop: 2, // one message only
      collectionSaveTo: "save-collection",
      dbName: "userdb",
      editChannelId: "edit-chat",
      forwardToId: "forward-chat",
    });

    expect(dbModelCtorMock).toHaveBeenCalledTimes(1);
    expect(dbModelCtorMock.mock.calls[0][1]).toBe("save-collection");
    expect(dbModelCtorMock.mock.calls[0][2]).toBe("userdb");
  });
});

describe("runUploadPics dbName passthrough", () => {
  it("passes dbName 'userdb' as the 3rd constructor argument on the store dbModel (uploadSingleFS)", async () => {
    tgPostPicFS.mockResolvedValue({ ok: true, result: { message_id: 7 } });

    await runUploadPics({
      uploadPicType: "uploadSingleFS",
      picPath: PROJECT_PACKAGE_JSON,
      uploadToId: "upload-chat",
      collectionSaveTo: "pics-collection",
      dbName: "userdb",
    });

    expect(dbModelCtorMock).toHaveBeenCalledTimes(1);
    expect(dbModelCtorMock.mock.calls[0][1]).toBe("pics-collection");
    expect(dbModelCtorMock.mock.calls[0][2]).toBe("userdb");
  });
});
