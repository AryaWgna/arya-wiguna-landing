/**
 * Ekstraksi konten dari index.html lama (single-file static)
 * → menghasilkan data TypeScript untuk aplikasi Next.js baru.
 * Sumber kebenaran: index.html commit sebelumnya (tidak diubah).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OLD = join(ROOT, "index.html");
const html = readFileSync(OLD, "utf8");

/* ── 1. Kamus EN/ID (var MAP = {...}) ─────────── */
const mapMatch = html.match(/var MAP=(\{[\s\S]*?\n\});/);
if (!mapMatch) {
  console.error("FATAL: var MAP tidak ditemukan di index.html");
  process.exit(1);
}
let MAP;
try {
  MAP = Function(`"use strict"; return (${mapMatch[1]});`)();
} catch (e) {
  console.error("FATAL: gagal parse MAP:", e.message);
  process.exit(1);
}

/* ── 2. Sertifikat ────────────────────────────── */
const certRe = /<article class="cert[^"]*">([\s\S]*?)<\/article>/g;
const certs = [];
let m;
while ((m = certRe.exec(html))) {
  const block = m[1];
  const img = block.match(/<img src="assets\/sertifikat\/([^"]+)"/);
  const pdf = block.match(/href="assets\/sertifikat\/([^"]+\.pdf)"/);
  const titleKey = block.match(/data-i18n="(c\d+-title)"/);
  const descKey = block.match(/data-i18n="(c\d+-desc)"/);
  const alt = block.match(/alt="([^"]+)"/);
  if (!img || !titleKey) continue;
  certs.push({
    slug: titleKey[1].replace("-title", ""),
    titleKey: titleKey[1],
    descKey: descKey?.[1] ?? null,
    img: `assets/sertifikat/${img[1]}`,
    pdf: pdf ? `assets/sertifikat/${pdf[1]}` : null,
    alt: alt?.[1] ?? "",
  });
}

/* ── 3. Proyek ────────────────────────────────── */
const projRe = /<article class="proj[^"]*">([\s\S]*?)<\/article>/g;
const projects = [];
while ((m = projRe.exec(html))) {
  const block = m[1];
  const thumb = block.match(/<img src="assets\/projects\/([^"]+)"/);
  const title = block.match(/<h3>([^<]+)<\/h3>/);
  const desc = block.match(/<p>([\s\S]*?)<\/p>/);
  const repo = block.match(/href="(https:\/\/github\.com\/[^"]+)"/);
  const chips = [...block.matchAll(/<span class="bchip">(?:(?:<img[^>]*>))?([^<]+)<\/span>/g)].map(
    (c) => c[1].trim()
  );
  projects.push({
    slug: title?.[1].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ?? "",
    title: title?.[1] ?? "",
    desc: desc?.[1].replace(/\s+/g, " ").trim() ?? "",
    repo: repo?.[1] ?? null,
    thumb: thumb ? `assets/projects/${thumb[1]}` : null,
    chips,
  });
}

/* ── 4. Data i18n lain yang dipakai elemen ────── */
const usedKeys = new Set(
  [...html.matchAll(/data-i18n="([^"]+)"/g)].map((k) => k[1])
);
const missingKeys = [...usedKeys].filter((k) => !(k in MAP));

/* ── Output ───────────────────────────────────── */
const outDir = join(ROOT, "lib", "i18n");
mkdirSync(outDir, { recursive: true });
const outData = join(ROOT, "lib", "data");
mkdirSync(outData, { recursive: true });

function tsLiteral(v) {
  return JSON.stringify(v, null, 2).replace(/\u2014/g, "—").replace(/\u00b7/g, "·");
}

const messagesTs = `// GENERATED oleh scripts/extract-content.mjs — jangan edit manual.
// Sumber: index.html lama. Struktur: key → [EN, ID].
export const messages = ${tsLiteral(MAP)} as const;

export type Locale = "en" | "id";
export type MessageKey = keyof typeof messages;
`;

const certsTs = `// GENERATED oleh scripts/extract-content.mjs — jangan edit manual.
export type Certification = {
  slug: string;
  titleKey: string;
  descKey: string | null;
  img: string;
  pdf: string | null;
  alt: string;
};

export const certifications: Certification[] = ${tsLiteral(certs)};
`;

const projectsTs = `// GENERATED oleh scripts/extract-content.mjs — jangan edit manual.
export type ProjectIndex = {
  slug: string;
  title: string;
  desc: string;
  repo: string | null;
  thumb: string | null;
  chips: string[];
};

export const projects: ProjectIndex[] = ${tsLiteral(projects)};
`;

writeFileSync(join(outDir, "messages.ts"), messagesTs);
writeFileSync(join(outData, "certifications.ts"), certsTs);
writeFileSync(join(outData, "projects.ts"), projectsTs);

console.log("── Hasil ekstraksi ──");
console.log("Map keys:", Object.keys(MAP).length);
console.log("Sertifikat:", certs.length);
console.log("Proyek:", projects.length);
console.log("data-i18n yang dipakai elemen:", usedKeys.size);
console.log("Key yang dipakai tapi tidak ada di MAP:", missingKeys);
console.log("Contoh cert pertama:", certs[0]);
console.log("Contoh proyek:", JSON.stringify(projects[0], null, 2));
