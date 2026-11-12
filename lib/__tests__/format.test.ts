import { describe, expect, it } from "vitest";
import { formatBytes, clipToLength } from "../format";

describe("formatBytes", () => {
  it("formats zero & small byte counts", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(512)).toBe("512 B");
  });

  it("formats kilobytes with one decimal", () => {
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(1024)).toBe("1.0 KB");
  });

  it("formats megabytes with two decimals", () => {
    expect(formatBytes(2 * 1024 * 1024)).toBe("2.00 MB");
  });
});

describe("clipToLength", () => {
  it("returns short text unchanged", () => {
    expect(clipToLength("hello world", 180)).toBe("hello world");
  });

  it("clips at sentence boundary when one exists in the second half", () => {
    const text =
      "A short intro. AAA BBB CCC DDD EEE FFF GGG. Now padding continues well beyond the limit of sixty chars so the clipping must occur.";
    const out = clipToLength(text, 60);
    expect(out.endsWith(".")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(62);
  });

  it("clips at last word when no sentence boundary", () => {
    const text = "a".repeat(50) + " bbb";
    const out = clipToLength(text, 40);
    expect(out.length).toBeLessThanOrEqual(41);
    expect(out.endsWith("…")).toBe(true);
  });
});
