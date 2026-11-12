import { describe, expect, it } from "vitest";
import {
  autoRoleForExtension,
  deriveAutoSummary,
  extractHeaderComment,
} from "../summary";

describe("extractHeaderComment", () => {
  it("extracts stacked double-slash comments", () => {
    const code = [
      "// Svelte client computing Jaccard genre similarity recommendations.",
      "// Instant catalog filtering and multi-server playback switching.",
      "",
      "export let items = [];",
    ].join("\n");
    const s = extractHeaderComment(code);
    expect(s).toContain("Svelte client");
    expect(s).toContain("Jaccard");
  });

  it("extracts multi-line block comments", () => {
    const code =
      "/*\n * Camera QR stock opname controller\n * scoped by building.\n */\nclass X {}";
    expect(extractHeaderComment(code)).toContain(
      "Camera QR stock opname controller"
    );
  });

  it("skips shebang then finds the next comment", () => {
    const code = "#!/usr/bin/env bash\n# Build & deploy script\nset -e";
    expect(extractHeaderComment(code)).toContain("Build & deploy script");
  });

  it("returns empty string when code has no leading comments", () => {
    expect(extractHeaderComment("const x = 1;\nconst y = 2;")).toBe("");
  });
});

describe("autoRoleForExtension", () => {
  it("maps svelte extension", () => {
    expect(autoRoleForExtension("svelte", "frontend/src/App.svelte", false)).toBe(
      "Svelte component"
    );
  });

  it("detects Dockerfile by path", () => {
    expect(autoRoleForExtension("", "Dockerfile", false)).toBe(
      "Container build configuration"
    );
  });
});

describe("deriveAutoSummary", () => {
  it("prefers the header comment", () => {
    const s = deriveAutoSummary(
      "lib/math.ts",
      "ts",
      "// Pure helpers for arithmetic\nconst add = (a: number, b: number) => a + b;",
      false,
      false,
      false
    );
    expect(s).toContain("Pure helpers for arithmetic");
  });

  it("falls back to a role-based template without comments", () => {
    const s = deriveAutoSummary(
      "frontend/src/App.svelte",
      "svelte",
      "<script>const a = 1;</script>",
      false,
      false,
      false
    );
    expect(s).toBe("Svelte component: App.svelte.");
  });

  it("labels static assets", () => {
    const s = deriveAutoSummary("assets/logo.png", "png", "", true, false, false);
    expect(s).toBe("Static asset used by this project.");
  });
});
