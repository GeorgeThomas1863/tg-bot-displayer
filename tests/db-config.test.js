import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// db-config.js keeps a module-level client, so each test loads a fresh copy of the module.
// Mock mongodb and dotenv so no real connection is made and no .env file is loaded.
const { connectMock, dbMock, fakeClient } = vi.hoisted(() => {
  const dbMock = vi.fn((name) => ({ name }));
  const fakeClient = { db: dbMock };
  const connectMock = vi.fn(async () => fakeClient);
  return { connectMock, dbMock, fakeClient };
});

vi.mock("mongodb", () => ({
  MongoClient: { connect: connectMock },
}));

vi.mock("dotenv", () => ({
  default: { config: vi.fn() },
}));

const loadModule = async () => {
  vi.resetModules();
  return import("../middleware/db-config.js");
};

describe("db-config", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("MONGO_URI", "mongodb://fake");
    vi.stubEnv("DB_NAME", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("dbGet throws when dbConnect has not been called", async () => {
    const { dbGet } = await loadModule();

    expect(() => dbGet()).toThrow();
    expect(connectMock).not.toHaveBeenCalled();
  });

  it("dbGet with no argument and DB_NAME unset uses the default db name tg", async () => {
    const { dbConnect, dbGet } = await loadModule();
    await dbConnect();

    const result = dbGet();

    expect(dbMock).toHaveBeenCalledWith("tg");
    expect(result).toEqual({ name: "tg" });
  });

  it("dbGet with no argument uses DB_NAME from the environment", async () => {
    vi.stubEnv("DB_NAME", "envdb");
    const { dbConnect, dbGet } = await loadModule();
    await dbConnect();

    dbGet();

    expect(dbMock).toHaveBeenCalledWith("envdb");
  });

  it("dbGet with an argument overrides DB_NAME from the environment", async () => {
    vi.stubEnv("DB_NAME", "envdb");
    const { dbConnect, dbGet } = await loadModule();
    await dbConnect();

    dbGet("userdb");

    expect(dbMock).toHaveBeenCalledWith("userdb");
    expect(dbMock).not.toHaveBeenCalledWith("envdb");
  });

  it("dbGet throws Invalid database name for names with forbidden characters", async () => {
    const { dbConnect, dbGet } = await loadModule();
    await dbConnect();

    expect(() => dbGet("bad.name")).toThrow(/Invalid database name/);
    expect(() => dbGet("a b")).toThrow(/Invalid database name/);
  });

  it("dbGet rejects a 64 byte name and accepts a 63 byte name", async () => {
    const { dbConnect, dbGet } = await loadModule();
    await dbConnect();

    expect(() => dbGet("x".repeat(64))).toThrow(/Invalid database name/);
    expect(() => dbGet("x".repeat(63))).not.toThrow();
  });

  it("checkDbName returns tg with no argument and DB_NAME unset", async () => {
    const { checkDbName } = await loadModule();

    expect(checkDbName()).toBe("tg");
  });

  it("checkDbName returns the passed name", async () => {
    vi.stubEnv("DB_NAME", "envdb");
    const { checkDbName } = await loadModule();

    expect(checkDbName("userdb")).toBe("userdb");
  });

  it("checkDbName throws Invalid database name for bad.name", async () => {
    const { checkDbName } = await loadModule();

    expect(() => checkDbName("bad.name")).toThrow(/Invalid database name/);
  });

  it("dbConnect calls MongoClient.connect only once across repeated calls", async () => {
    const { dbConnect } = await loadModule();

    await dbConnect();
    await dbConnect();

    expect(connectMock).toHaveBeenCalledTimes(1);
    expect(connectMock).toHaveBeenCalledWith("mongodb://fake");
  });
});
