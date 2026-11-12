import { clipToLength } from "./format";

// Extract the first meaningful block of comments from the source code so it can
// be used as a short auto-description when no curated summary exists.
export function extractHeaderComment(code: string): string {
  const lines = code.split("\n");
  const parts: string[] = [];
  let inBlock = false;
  let blockParts: string[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (inBlock) continue;
      if (parts.length > 0) break;
      continue;
    }
    if (inBlock) {
      const endIdx = line.indexOf("*/");
      if (endIdx >= 0) {
        blockParts.push(line.slice(0, endIdx));
        inBlock = false;
        parts.push(blockParts.join(" ").trim());
        blockParts = [];
      } else {
        blockParts.push(line);
      }
      continue;
    }
    if (line.startsWith("/*")) {
      const endIdx = line.indexOf("*/", 2);
      if (endIdx >= 0) {
        parts.push(line.slice(2, endIdx).trim());
      } else {
        inBlock = true;
        blockParts.push(line.slice(2).trim());
      }
      continue;
    }
    if (line.startsWith("//")) {
      parts.push(line.slice(2).trim());
      continue;
    }
    if (line.startsWith("#!")) continue;
    if (line.startsWith("#")) {
      parts.push(line.slice(1).trim());
      continue;
    }
    if (line.startsWith("--")) {
      parts.push(line.slice(2).trim());
      continue;
    }
    if (line.startsWith("<!--")) {
      const rest = line.slice(4);
      const endIdx = rest.indexOf("-->");
      if (endIdx >= 0) parts.push(rest.slice(0, endIdx).trim());
      else parts.push(rest.trim());
      continue;
    }
    if (parts.length > 0 || blockParts.length > 0) break;
  }
  if (inBlock && blockParts.length) {
    parts.push(blockParts.join(" ").trim());
  }
  const clean = parts
    .map((p) => p.replace(/^[\s*#!>\-]+/, "").replace(/\s+$/, "").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return clipToLength(clean, 180);
}

export function autoRoleForExtension(
  ext: string,
  filePath: string,
  isId: boolean
): string {
  const lower = filePath.toLowerCase();
  if (lower.includes("dockerfile")) {
    return isId ? "Konfigurasi build kontainer" : "Container build configuration";
  }
  if (lower.endsWith("makefile")) {
    return isId ? "Otomasi build" : "Build automation";
  }
  switch (ext) {
    case "svelte":
      return isId ? "Komponen Svelte" : "Svelte component";
    case "dart":
      return isId ? "Modul Dart" : "Dart module";
    case "ts":
    case "tsx":
      return isId ? "Kode sumber TypeScript" : "TypeScript source";
    case "js":
    case "jsx":
      return isId ? "Kode sumber JavaScript" : "JavaScript source";
    case "css":
    case "scss":
    case "sass":
    case "less":
      return isId ? "Lembar gaya" : "Stylesheet";
    case "html":
    case "htm":
      return isId ? "Markup HTML" : "HTML markup";
    case "sql":
      return isId ? "Skema/kueri basis data" : "Database schema/query";
    case "yaml":
    case "yml":
    case "toml":
    case "json":
    case "config":
      return isId ? "Berkas konfigurasi/definisi" : "Configuration / definition file";
    case "sh":
    case "bash":
    case "zsh":
      return isId ? "Skrip shell" : "Shell script";
    case "md":
    case "markdown":
      return isId ? "Dokumentasi Markdown" : "Markdown documentation";
    case "lock":
      return isId ? "Berkas kunci dependensi" : "Dependency lockfile";
    case "py":
      return isId ? "Kode sumber Python" : "Python source";
    case "java":
      return isId ? "Kode sumber Java" : "Java source";
    case "go":
      return isId ? "Kode sumber Go" : "Go source";
    case "rs":
      return isId ? "Kode sumber Rust" : "Rust source";
    case "php":
      return isId ? "Kode sumber PHP" : "PHP source";
    case "cpp":
    case "c":
    case "h":
      return isId ? "Kode sumber C/C++" : "C/C++ source";
    default:
      return isId ? "Berkas proyek" : "Project file";
  }
}

export function deriveAutoSummary(
  filePath: string,
  ext: string,
  code: string,
  isImageFile: boolean,
  isBinaryFile: boolean,
  isId: boolean
): string {
  if (isImageFile || isBinaryFile) {
    return isId
      ? "Aset statis yang digunakan oleh proyek."
      : "Static asset used by this project.";
  }
  const fromComment = extractHeaderComment(code);
  if (fromComment) return fromComment;
  const baseName = filePath.split("/").pop() ?? filePath;
  const role = autoRoleForExtension(ext, filePath, isId);
  return `${role}: ${baseName}.`;
}
