// Tests for controllers/auth-controller.js (authController) and
// middleware/auth-config.js (requireAuth).
// No HTTP server, no mocks of project modules — hand-rolled fake req/res only.
// NOTE: req.session is always present on fake requests because both sources
// dereference req.session without optional chaining.

import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { authController } from "../controllers/auth-controller.js";
import requireAuth from "../middleware/auth-config.js";
import { makeRes } from "./helpers/make-res.js";

const CORRECT_PW = "correct-horse-battery-staple";

describe("authController (controllers/auth-controller.js)", () => {
  beforeEach(() => {
    vi.stubEnv("PW", CORRECT_PW);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("responds {success:false, redirect:'/401'} when req.body is missing entirely", () => {
    const req = { session: {} }; // no body property at all
    const res = makeRes();

    authController(req, res);

    expect(res.jsonCalls).toEqual([{ success: false, redirect: "/401" }]);
  });

  it("responds {success:false, redirect:'/401'} when body has no pw field", () => {
    const req = { body: {}, session: {} };
    const res = makeRes();

    authController(req, res);

    expect(res.jsonCalls).toEqual([{ success: false, redirect: "/401" }]);
  });

  it("responds {success:false, redirect:'/401'} when pw does not match process.env.PW", () => {
    const req = { body: { pw: "wrong-password" }, session: {} };
    const res = makeRes();

    authController(req, res);

    expect(res.jsonCalls).toEqual([{ success: false, redirect: "/401" }]);
  });

  it("does NOT set req.session.authenticated when pw is wrong", () => {
    const req = { body: { pw: "wrong-password" }, session: {} };
    const res = makeRes();

    authController(req, res);

    expect(req.session.authenticated).toBeUndefined();
  });

  it("failed login still returns HTTP 200 — res.status() is never called, the failure signal lives only in the body", () => {
    const req = { body: { pw: "wrong-password" }, session: {} };
    const res = makeRes();

    authController(req, res);

    expect(res.statusCalls).toEqual([]);
    expect(res.statusCode).toBe(200);
  });

  it("sets req.session.authenticated = true when pw matches process.env.PW", () => {
    const req = { body: { pw: CORRECT_PW }, session: {} };
    const res = makeRes();

    authController(req, res);

    expect(req.session.authenticated).toBe(true);
  });

  it("responds {success:true, redirect:'/'} when pw matches process.env.PW", () => {
    const req = { body: { pw: CORRECT_PW }, session: {} };
    const res = makeRes();

    authController(req, res);

    expect(res.jsonCalls).toEqual([{ success: true, redirect: "/" }]);
  });

  it("reads process.env.PW at call time — a PW change between calls takes effect immediately", () => {
    const req = { body: { pw: "second-password" }, session: {} };
    const res = makeRes();

    vi.stubEnv("PW", "second-password");
    authController(req, res);

    expect(res.jsonCalls).toEqual([{ success: true, redirect: "/" }]);
  });
});

describe("requireAuth (middleware/auth-config.js)", () => {
  const makeReq = ({ method = "GET", session = {}, headers = {} } = {}) => {
    const normalized = {};
    for (const key of Object.keys(headers)) {
      normalized[key.toLowerCase()] = headers[key];
    }
    return {
      method,
      session,
      get(name) {
        return normalized[String(name).toLowerCase()];
      },
    };
  };

  it("sets Cache-Control: no-store when the session IS authenticated", () => {
    const req = makeReq({ session: { authenticated: true } });
    const res = makeRes();

    requireAuth(req, res, vi.fn());

    expect(res.headers["Cache-Control"]).toBe("no-store");
  });

  it("sets Cache-Control: no-store when the session is NOT authenticated", () => {
    const req = makeReq({ method: "POST" });
    const res = makeRes();

    requireAuth(req, res, vi.fn());

    expect(res.headers["Cache-Control"]).toBe("no-store");
  });

  it("authenticated session: calls next() exactly once", () => {
    const req = makeReq({ session: { authenticated: true } });
    const res = makeRes();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("authenticated session: sends no response of its own (no json, no sendFile, no status)", () => {
    const req = makeReq({ session: { authenticated: true } });
    const res = makeRes();

    requireAuth(req, res, vi.fn());

    expect(res.jsonCalls).toEqual([]);
    expect(res.sendFileCalls).toEqual([]);
    expect(res.statusCalls).toEqual([]);
  });

  it("unauthenticated POST: responds 401 with {error:'not authenticated'} JSON even when Accept is text/html — every POST is treated as JSON", () => {
    const req = makeReq({ method: "POST", headers: { Accept: "text/html" } });
    const res = makeRes();

    requireAuth(req, res, vi.fn());

    expect(res.statusCalls).toEqual([401]);
    expect(res.jsonCalls).toEqual([{ error: "not authenticated" }]);
  });

  it("unauthenticated POST: never calls next()", () => {
    const req = makeReq({ method: "POST" });
    const res = makeRes();
    const next = vi.fn();

    requireAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("unauthenticated GET with Accept: application/json responds 401 with {error:'not authenticated'} JSON", () => {
    const req = makeReq({ method: "GET", headers: { Accept: "application/json" } });
    const res = makeRes();

    requireAuth(req, res, vi.fn());

    expect(res.statusCalls).toEqual([401]);
    expect(res.jsonCalls).toEqual([{ error: "not authenticated" }]);
  });

  it("unauthenticated GET with Accept: text/html calls res.sendFile with a path ending in html/auth.html", () => {
    const req = makeReq({ method: "GET", headers: { Accept: "text/html" } });
    const res = makeRes();

    requireAuth(req, res, vi.fn());

    expect(res.sendFileCalls).toHaveLength(1);
    expect(res.sendFileCalls[0].endsWith(path.join("html", "auth.html"))).toBe(true);
  });
});
