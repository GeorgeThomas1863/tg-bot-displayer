import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

// params-front.js imports define-things.js, which calls document.getElementById at import time.
// Static imports are hoisted above the stub, so load the module dynamically after stubbing.
let buildInputParams;

describe("buildInputParams", () => {
  beforeAll(async () => {
    vi.stubGlobal("document", {
      getElementById: (id) => ({ value: id === "db-name-input" ? "mydb" : "" }),
    });
    ({ buildInputParams } = await import("../public/js/util/params-front.js"));
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it("returns dbName equal to the value of #db-name-input", async () => {
    const params = await buildInputParams();

    expect(params.dbName).toBe("mydb");
  });
});
