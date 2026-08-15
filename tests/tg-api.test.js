// Tests for src/tg-api.js — token pool, rotation on 429, checkToken semantics.
//
// Module-load hazards handled here:
// - dotenv.config runs at load and would pull the user's real .env/.env.local
//   with override — mocked to a no-op so process.env stays test-controlled.
// - loadTokens() runs at load and throws without TOKEN_ARRAY — env is set in
//   beforeEach BEFORE each dynamic import.
// - tokenIndex is module-level mutable state — vi.resetModules() + fresh
//   dynamic import per test.
// - state.js is a real shared singleton; a fresh instance is imported per test
//   and state.active set true (most functions bail early when false).
// All 429 fixtures deliberately omit parameters.retry_after so waitForRetry
// never sleeps — tests stay deterministic and fast.

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getFirstArgs } from "./helpers/mock-calls.js";

vi.mock("dotenv", () => ({
  default: { config: vi.fn() },
  config: vi.fn(),
}));

vi.mock("axios", () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

const BASE_URL = "https://tg.test/bot";

const OK_BODY = { ok: true, result: { message_id: 1 } };
const RATE_LIMIT_BODY = { ok: false, error_code: 429, description: "Too Many Requests" };
const BAD_REQUEST_BODY = { ok: false, error_code: 400, description: "Bad Request: chat not found" };

const importFresh = async () => {
  const axios = (await import("axios")).default;
  const state = (await import("../src/util/state.js")).default;
  const api = await import("../src/tg-api.js");
  state.active = true;
  return { api, axios, state };
};

beforeEach(() => {
  vi.resetModules();
  // Mocked modules (axios/dotenv) are NOT recreated by resetModules — wipe
  // their call history and per-test implementations so tests stay independent.
  vi.resetAllMocks();
  vi.stubEnv("BASE_URL", BASE_URL);
  vi.stubEnv("TOKEN_ARRAY", "T_A,T_B,T_C");
  vi.stubEnv("T_A", "token-a");
  vi.stubEnv("T_B", "token-b");
  vi.stubEnv("T_C", "token-c");
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("module load", () => {
  it("throws at import time when TOKEN_ARRAY is unset", async () => {
    // Empty string is falsy, so it exercises the same `!tokenKeys` guard as an
    // unset var in src/tg-api.js's loadTokens().
    vi.stubEnv("TOKEN_ARRAY", "");
    await expect(import("../src/tg-api.js")).rejects.toThrow("TOKEN_ARRAY is not set or contains no usable tokens");
  });
});

describe("checkToken", () => {
  it("returns true for an ok:true payload", async () => {
    const { api } = await importFresh();
    expect(await api.checkToken({ ok: true })).toBe(true);
  });

  it("returns true for a non-429 error payload (400 is treated as accepted, no rotation)", async () => {
    const { api } = await importFresh();
    expect(await api.checkToken(BAD_REQUEST_BODY)).toBe(true);
  });

  it("returns null (rotates) for a 429 payload", async () => {
    const { api } = await importFresh();
    expect(await api.checkToken(RATE_LIMIT_BODY)).toBeNull();
  });

  it("returns null (rotates) for null data", async () => {
    const { api } = await importFresh();
    expect(await api.checkToken(null)).toBeNull();
  });

  it("returns null (rotates) for undefined data", async () => {
    const { api } = await importFresh();
    expect(await api.checkToken(undefined)).toBeNull();
  });

  it("returns null immediately when state.active is false, without rotating the token", async () => {
    const { api, axios, state } = await importFresh();

    state.active = false;
    expect(await api.checkToken({ ok: true })).toBeNull();

    // prove no rotation happened: the next request still uses the first token
    state.active = true;
    axios.post.mockResolvedValueOnce({ data: OK_BODY });
    await api.tgSendMessage({ chatId: 1, text: "hi" });
    expect(axios.post.mock.calls[0][0]).toBe(`${BASE_URL}token-a/sendMessage`);
  });

  it("rotating past the last token wraps the index back to the first token", async () => {
    const { api, axios } = await importFresh();

    // three rotations: 0 -> 1 -> 2 -> wraps to 0
    await api.checkToken(RATE_LIMIT_BODY);
    await api.checkToken(RATE_LIMIT_BODY);
    await api.checkToken(RATE_LIMIT_BODY);

    axios.post.mockResolvedValueOnce({ data: OK_BODY });
    await api.tgSendMessage({ chatId: 1, text: "hi" });
    expect(axios.post.mock.calls[0][0]).toBe(`${BASE_URL}token-a/sendMessage`);
  });
});

describe("token rotation through request URLs", () => {
  it("first request uses the first token from TOKEN_ARRAY", async () => {
    const { api, axios } = await importFresh();
    axios.post.mockResolvedValueOnce({ data: OK_BODY });

    const result = await api.tgSendMessage({ chatId: 42, text: "hello" });

    expect(axios.post).toHaveBeenCalledWith(`${BASE_URL}token-a/sendMessage`, { chat_id: 42, text: "hello" });
    expect(result).toEqual(OK_BODY);
  });

  it("after a 429 response the retry request uses the second token", async () => {
    const { api, axios } = await importFresh();
    axios.post.mockResolvedValueOnce({ data: RATE_LIMIT_BODY }).mockResolvedValueOnce({ data: OK_BODY });

    const result = await api.tgSendMessage({ chatId: 42, text: "hello" });

    expect(axios.post.mock.calls[0][0]).toBe(`${BASE_URL}token-a/sendMessage`);
    expect(axios.post.mock.calls[1][0]).toBe(`${BASE_URL}token-b/sendMessage`);
    expect(result).toEqual(OK_BODY);
  });

  it("gives up and returns null after exactly tokenArray.length attempts when every token is rate-limited", async () => {
    const { api, axios } = await importFresh();
    axios.post.mockResolvedValue({ data: RATE_LIMIT_BODY });

    const result = await api.tgSendMessage({ chatId: 42, text: "hello" });

    expect(result).toBeNull();
    expect(axios.post).toHaveBeenCalledTimes(3);
    expect(getFirstArgs(axios.post)).toEqual([
      `${BASE_URL}token-a/sendMessage`,
      `${BASE_URL}token-b/sendMessage`,
      `${BASE_URL}token-c/sendMessage`,
    ]);
  });

  it("rotated index persists across operations — after two 429s the next operation starts at the third token", async () => {
    const { api, axios } = await importFresh();
    axios.post
      .mockResolvedValueOnce({ data: RATE_LIMIT_BODY })
      .mockResolvedValueOnce({ data: RATE_LIMIT_BODY })
      .mockResolvedValueOnce({ data: OK_BODY })
      .mockResolvedValueOnce({ data: OK_BODY });

    await api.tgSendMessage({ chatId: 1, text: "first" });
    await api.tgSendMessage({ chatId: 1, text: "second" });

    expect(axios.post.mock.calls[3][0]).toBe(`${BASE_URL}token-c/sendMessage`);
  });

  it("after full exhaustion (all tokens 429) the next operation wraps back to the first token", async () => {
    const { api, axios } = await importFresh();
    axios.post
      .mockResolvedValueOnce({ data: RATE_LIMIT_BODY })
      .mockResolvedValueOnce({ data: RATE_LIMIT_BODY })
      .mockResolvedValueOnce({ data: RATE_LIMIT_BODY })
      .mockResolvedValueOnce({ data: OK_BODY });

    const exhausted = await api.tgSendMessage({ chatId: 1, text: "first" });
    expect(exhausted).toBeNull();

    await api.tgSendMessage({ chatId: 1, text: "second" });
    expect(axios.post.mock.calls[3][0]).toBe(`${BASE_URL}token-a/sendMessage`);
  });
});

describe("error bodies and guards", () => {
  it("a non-429 HTTP error body (400) is returned to the caller as-is, with no retry", async () => {
    const { api, axios } = await importFresh();
    const httpError = new Error("Request failed with status code 400");
    httpError.response = { data: BAD_REQUEST_BODY };
    axios.post.mockRejectedValueOnce(httpError);

    const result = await api.tgSendMessage({ chatId: 42, text: "hello" });

    // looks like success to callers — the raw error body comes back
    expect(result).toEqual(BAD_REQUEST_BODY);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("a network error with no response body exhausts every token and returns null", async () => {
    const { api, axios } = await importFresh();
    axios.post.mockRejectedValue(new Error("ECONNREFUSED"));

    const result = await api.tgSendMessage({ chatId: 42, text: "hello" });

    expect(result).toBeNull();
    expect(axios.post).toHaveBeenCalledTimes(3);
  });

  it("tgGetUpdates builds the getUpdates URL with the offset and the current token", async () => {
    const { api, axios } = await importFresh();
    axios.get.mockResolvedValueOnce({ data: OK_BODY });

    const result = await api.tgGetUpdates({ offset: 99 });

    expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}token-a/getUpdates?offset=99`);
    expect(result).toEqual(OK_BODY);
  });

  it("tgSendMessage returns null without any request when state.active is false", async () => {
    const { api, axios, state } = await importFresh();
    state.active = false;

    expect(await api.tgSendMessage({ chatId: 1, text: "hi" })).toBeNull();
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("tgGetReq returns null when url is missing", async () => {
    const { api, axios } = await importFresh();
    expect(await api.tgGetReq(undefined)).toBeNull();
    expect(axios.get).not.toHaveBeenCalled();
  });

  it("tgPostReq returns null when params are missing", async () => {
    const { api, axios } = await importFresh();
    expect(await api.tgPostReq(`${BASE_URL}token-a/sendMessage`, undefined)).toBeNull();
    expect(axios.post).not.toHaveBeenCalled();
  });
});
