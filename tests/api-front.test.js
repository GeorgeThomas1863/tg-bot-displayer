import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendToBack } from "../public/js/util/api-front.js";

const makeRes = ({ ok = true, status = 200, statusText = "OK", json }) => ({
  ok,
  status,
  statusText,
  json,
});

describe("sendToBack", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns the parsed JSON body untouched on a successful response", async () => {
    const payload = { ok: true, result: [{ message_id: 1 }] };
    fetch.mockResolvedValue(makeRes({ json: async () => payload }));

    const result = await sendToBack({ route: "/tg-submit-route", command: "getMe" });

    expect(result).toBe(payload);
  });

  it("returns an {error: '<status> <statusText>'} object when the response body is not JSON", async () => {
    fetch.mockResolvedValue(
      makeRes({
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
        json: async () => {
          throw new SyntaxError("Unexpected token < in JSON");
        },
      })
    );

    const result = await sendToBack({ route: "/tg-submit-route", command: "getMe" });

    expect(result).toEqual({ error: "502 Bad Gateway" });
  });

  it("passes the backend's own error payload through unchanged on a non-ok response", async () => {
    const backendError = { error: "invalid message range", code: 400 };
    fetch.mockResolvedValue(
      makeRes({ ok: false, status: 400, statusText: "Bad Request", json: async () => backendError })
    );

    const result = await sendToBack({ route: "/tg-submit-route", command: "forwardAll" });

    expect(result).toBe(backendError);
  });

  it("synthesizes '<status> <statusText>' when a non-ok response has JSON without an error field", async () => {
    fetch.mockResolvedValue(
      makeRes({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ ok: false }),
      })
    );

    const result = await sendToBack({ route: "/tg-submit-route", command: "getMe" });

    expect(result).toEqual({ error: "500 Internal Server Error" });
  });

  it("returns {error: message} when fetch itself rejects (network failure)", async () => {
    fetch.mockRejectedValue(new TypeError("Failed to fetch"));

    const result = await sendToBack({ route: "/tg-submit-route", command: "getMe" });

    expect(result).toEqual({ error: "Failed to fetch" });
  });

  it("POSTs the full payload as JSON to the route named inside the payload", async () => {
    fetch.mockResolvedValue(makeRes({ json: async () => ({}) }));
    const payload = { route: "/tg-submit-route", command: "forwardAll", startId: 1, endId: 5 };

    await sendToBack(payload);

    expect(fetch).toHaveBeenCalledWith("/tg-submit-route", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
  });
});
