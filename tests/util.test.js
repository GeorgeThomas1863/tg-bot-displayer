import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkPicURL } from "../src/util/util.js";

describe("checkPicURL", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("accepts an https URL ending in a known image extension", async () => {
    expect(await checkPicURL("https://example.com/photo.png")).toBe(true);
  });

  it("accepts an image URL whose extension is followed by a query string", async () => {
    expect(await checkPicURL("https://example.com/image.jpg?size=large")).toBe(true);
  });

  it("rejects a non-http(s) protocol even when the path ends in an image extension", async () => {
    expect(await checkPicURL("ftp://example.com/image.jpg")).toBe(false);
  });

  it("rejects a syntactically invalid URL instead of throwing", async () => {
    expect(await checkPicURL("not a url at all")).toBe(false);
  });

  it("rejects an http(s) URL whose path has no image extension", async () => {
    expect(await checkPicURL("https://example.com/page.html")).toBe(false);
  });
});
