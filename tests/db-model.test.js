import { describe, it, expect, vi, beforeEach } from "vitest";

// db-model.js calls dbConnect() at import time and uses dbGet(name).collection(name) in every method.
// Stub the db-config module so no real Mongo connection is made.
const { dbGetMock, collectionMock, collectionObj, findMock, sortMock, limitMock, toArrayMock, findOneMock, insertOneMock, chain } = vi.hoisted(() => {
  const toArrayMock = vi.fn();
  const sortMock = vi.fn();
  const limitMock = vi.fn();
  const findMock = vi.fn();
  const findOneMock = vi.fn();
  const insertOneMock = vi.fn();
  // find() returns a chainable cursor: find().sort().limit().toArray()
  const chain = { sort: sortMock, limit: limitMock, toArray: toArrayMock };
  const collectionObj = { find: findMock, findOne: findOneMock, insertOne: insertOneMock };
  const collectionMock = vi.fn(() => collectionObj);
  const dbGetMock = vi.fn(() => ({ collection: collectionMock }));
  return { dbGetMock, collectionMock, collectionObj, findMock, sortMock, limitMock, toArrayMock, findOneMock, insertOneMock, chain };
});

vi.mock("../middleware/db-config.js", () => ({
  dbConnect: vi.fn(),
  dbGet: dbGetMock,
}));

import dbModel from "../models/db-model.js";

const DB_NAME = "userdb";
const COLLECTION_NAME = "testcol";
const VALID_OBJECT_ID = "64b7f0c2a1b2c3d4e5f60718";

// One entry per live (non-commented) method of dbModel.
const methodCases = [
  { name: "storeAny", dataObject: { a: 1 }, call: (m) => m.storeAny() },
  { name: "storeUniqueVid", dataObject: { forwardFromChannelId: 1, forwardFromMessageId: 2 }, call: (m) => m.storeUniqueVid() },
  { name: "vidAlreadyStored", dataObject: { forwardFromChannelId: 1, forwardFromMessageId: 2 }, call: (m) => m.vidAlreadyStored() },
  { name: "getAll", dataObject: {}, call: (m) => m.getAll() },
  { name: "getUniqueItem", dataObject: { keyToLookup: "name", itemValue: "x" }, call: (m) => m.getUniqueItem() },
  { name: "getRegexItem", dataObject: { keyToLookup: "name", regexValue: "x" }, call: (m) => m.getRegexItem() },
  { name: "getUniqueArray", dataObject: { keyToLookup: "_id", itemValue: VALID_OBJECT_ID }, call: (m) => m.getUniqueArray() },
  { name: "getScrapeData", dataObject: { scrapeId: VALID_OBJECT_ID }, call: (m) => m.getScrapeData() },
  { name: "getNewestItemsArray", dataObject: { sortKey: "date", sortKey2: "id", howMany: "2" }, call: (m) => m.getNewestItemsArray() },
  { name: "getNewestItemsByTypeArray", dataObject: { sortKey: "date", howMany: "2", filterKey: "type", filterValue: "pic" }, call: (m) => m.getNewestItemsByTypeArray() },
  { name: "getOldestItemsArray", dataObject: { sortKey: "date", sortKey2: "id", howMany: "2" }, call: (m) => m.getOldestItemsArray() },
  { name: "getOldestItemsByTypeArray", dataObject: { sortKey: "date", sortKey2: "id", howMany: "2", filterKey: "type", filterValue: "pic" }, call: (m) => m.getOldestItemsByTypeArray() },
];

describe("dbModel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    insertOneMock.mockResolvedValue({ acknowledged: true });
    findOneMock.mockResolvedValue(null);
    toArrayMock.mockResolvedValue([]);
    sortMock.mockReturnValue(chain);
    limitMock.mockReturnValue(chain);
    findMock.mockReturnValue(chain);
  });

  describe("every live method uses the instance db name and collection", () => {
    for (const { name, dataObject, call } of methodCases) {
      it(`${name} calls dbGet("${DB_NAME}") and collection("${COLLECTION_NAME}")`, async () => {
        const model = new dbModel(dataObject, COLLECTION_NAME, DB_NAME);

        await call(model);

        expect(dbGetMock).toHaveBeenCalledWith(DB_NAME);
        expect(collectionMock).toHaveBeenCalledWith(COLLECTION_NAME);
      });
    }
  });

  describe("storeUniqueVid", () => {
    it("inserts the document when no matching vid is stored", async () => {
      const dataObject = { forwardFromChannelId: 1, forwardFromMessageId: 2 };
      const model = new dbModel(dataObject, COLLECTION_NAME, DB_NAME);

      await expect(model.storeUniqueVid()).resolves.toEqual({ acknowledged: true });

      expect(findOneMock).toHaveBeenCalledWith({ forwardFromChannelId: 1, forwardFromMessageId: 2 });
      expect(insertOneMock).toHaveBeenCalledWith(dataObject);
    });

    it("throws VID ALREADY STORED and does not insert when a matching doc exists", async () => {
      findOneMock.mockResolvedValue({ _id: "existing" });
      const model = new dbModel({ forwardFromChannelId: 1, forwardFromMessageId: 2 }, COLLECTION_NAME, DB_NAME);

      await expect(model.storeUniqueVid()).rejects.toThrow("VID ALREADY STORED");
      expect(insertOneMock).not.toHaveBeenCalled();
    });
  });

  describe("vidAlreadyStored", () => {
    it("returns true without querying the db when identifiers are missing", async () => {
      const model = new dbModel({ forwardFromChannelId: 1 }, COLLECTION_NAME, DB_NAME);

      await expect(model.vidAlreadyStored()).resolves.toBe(true);

      expect(dbGetMock).not.toHaveBeenCalled();
    });
  });
});
