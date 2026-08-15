// Tests for controllers/data-controller.js (tgCommandControl).
// src/src.js is mocked (it transitively pulls in the whole backend, including a
// top-level-await MongoDB connect). "../src/src.js" from this file resolves to
// the same module as the "../src/src.js" specifier inside controllers/, so the
// mock intercepts the controller's import. src/util/state.js is the REAL
// singleton — reset in beforeEach.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/src.js", () => ({
  tgCommandRun: vi.fn(),
}));

import { tgCommandRun } from "../src/src.js";
import state from "../src/util/state.js";
import { tgCommandControl } from "../controllers/data-controller.js";
import { makeRes } from "./helpers/make-res.js";

describe("tgCommandControl (controllers/data-controller.js)", () => {
  beforeEach(() => {
    tgCommandRun.mockReset();
    state.active = false;
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("'stop' command: flips state.active from true to false", async () => {
    state.active = true;
    const res = makeRes();

    await tgCommandControl({ body: { command: "stop" } }, res);

    expect(state.active).toBe(false);
  });

  it("'stop' command: responds {message:'STOPPED'}", async () => {
    const res = makeRes();

    await tgCommandControl({ body: { command: "stop" } }, res);

    expect(res.jsonCalls).toEqual([{ message: "STOPPED" }]);
  });

  it("'stop' command: never invokes tgCommandRun", async () => {
    const res = makeRes();

    await tgCommandControl({ body: { command: "stop" } }, res);

    expect(tgCommandRun).not.toHaveBeenCalled();
  });

  it("normal command: state.active is true at the moment tgCommandRun executes", async () => {
    let activeDuringRun = null;
    tgCommandRun.mockImplementation(async () => {
      activeDuringRun = state.active;
      return {};
    });
    const res = makeRes();

    await tgCommandControl({ body: { command: "getUpdates" } }, res);

    expect(activeDuringRun).toBe(true);
  });

  it("normal command: passes req.body through to tgCommandRun by reference", async () => {
    tgCommandRun.mockResolvedValue({});
    const body = { command: "getUpdates", chatId: "123" };
    const res = makeRes();

    await tgCommandControl({ body }, res);

    expect(tgCommandRun.mock.calls[0][0]).toBe(body);
  });

  it("normal command: responds with exactly the object tgCommandRun resolved", async () => {
    const data = { ok: true, result: [{ message_id: 42 }] };
    tgCommandRun.mockResolvedValue(data);
    const res = makeRes();

    await tgCommandControl({ body: { command: "getUpdates" } }, res);

    expect(res.jsonCalls).toHaveLength(1);
    expect(res.jsonCalls[0]).toBe(data);
  });

  it("normal command: state.active is reset to false after a successful run (finally block)", async () => {
    tgCommandRun.mockResolvedValue({ ok: true });
    const res = makeRes();

    await tgCommandControl({ body: { command: "getUpdates" } }, res);

    expect(state.active).toBe(false);
  });

  it("tgCommandRun throws: responds HTTP 500", async () => {
    tgCommandRun.mockRejectedValue(new Error("boom"));
    const res = makeRes();

    await tgCommandControl({ body: { command: "getUpdates" } }, res);

    expect(res.statusCalls).toEqual([500]);
  });

  it("tgCommandRun throws: responds {error: <error message>}", async () => {
    tgCommandRun.mockRejectedValue(new Error("telegram exploded"));
    const res = makeRes();

    await tgCommandControl({ body: { command: "getUpdates" } }, res);

    expect(res.jsonCalls).toEqual([{ error: "telegram exploded" }]);
  });

  it("tgCommandRun throws a non-Error value: responds {error: String(value)}", async () => {
    tgCommandRun.mockRejectedValue("plain string failure");
    const res = makeRes();

    await tgCommandControl({ body: { command: "getUpdates" } }, res);

    expect(res.jsonCalls).toEqual([{ error: "plain string failure" }]);
  });

  it("tgCommandRun throws: state.active is still reset to false (finally block)", async () => {
    tgCommandRun.mockRejectedValue(new Error("boom"));
    const res = makeRes();

    await tgCommandControl({ body: { command: "getUpdates" } }, res);

    expect(state.active).toBe(false);
  });

  it("req without a body responds 400 with an error message and does not call tgCommandRun", async () => {
    const res = makeRes();

    await tgCommandControl({}, res);

    expect(res.statusCalls).toEqual([400]);
    expect(res.jsonCalls).toEqual([{ error: "Missing request body" }]);
    expect(tgCommandRun).not.toHaveBeenCalled();
  });

  it("missing req entirely responds 400 with an error message and does not call tgCommandRun", async () => {
    const res = makeRes();

    await tgCommandControl(undefined, res);

    expect(res.statusCalls).toEqual([400]);
    expect(res.jsonCalls).toEqual([{ error: "Missing request body" }]);
    expect(tgCommandRun).not.toHaveBeenCalled();
  });
});
