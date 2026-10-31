/**
 * Ekstraksi konten dari index.html lama (single-file static)
 * → menghasilkan data TypeScript untuk aplikasi Next.js baru.
 *
 * - messages.ts : kamus EN/ID (dari var MAP).
 * - certifications.ts : daftar sertifikat + hasil verifikasi PDF
 *   (penerbit/tanggal/ID/URL verifikasi — dicek via scripts/pdfscan.py).
 *
 * Proyek TIDAK lagi digenerate (ditulis tangan di lib/data/projects.ts
 * berdasarkan bukti repo GitHub).
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OLD = join(ROOT, "index.html");

if (!existsSync(OLD)) {
  console.error("index.html lama tidak ditemukan — jalankan dari repo landing/ (sebelum migrasi).");
  process.exit(0);
}

const html = readFileSync(OLD, "utf8");

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

/* ── 2. Sertifikat (slug c1..c22) ────────────── */
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

/* ── 3. Enrichment hasil verifikasi PDF (pdfscan.py) ── */
const ENRICH = {
  c1: { issuer: "Cisco Networking Academy", date: "Sep 06, 2025", category: "cisco" },
  c2: { issuer: "Cisco Networking Academy", date: "Sep 02, 2025", category: "cisco" },
  c3: { issuer: "Cisco Networking Academy", date: "Sep 11, 2025", category: "cisco" },
  c4: { category: "lainnya", note: "Sertifikat magang RS UMMI (gambar) — tanggal belum terverifikasi" },
  c5: { issuer: "Universitas Binaniaga Indonesia", date: "31 Agustus 2026", category: "akademik", note: "SKL No. 258/UNBIN-C/FINKOM/IX/2026 — lulus 31 Agustus 2026" },
  c6: { category: "lainnya", note: "Penerbit/tanggal belum terverifikasi (PDF berbasis gambar)" },
  c7: { issuer: "MAC Training", date: "Agustus 2026", category: "lainnya", note: "No. 1384/MAC.TRA/VIII/2026" },
  c8: { issuer: "UIN Syarif Hidayatullah Jakarta (MTI)", date: "27 Juni 2025", category: "akademik", note: "No. B-675/F.9/KM.03.2/06/2025" },
  c9: { issuer: "IDwebTalks by IDwebhost", date: "12 Juni 2025", category: "webinar", note: "No. 012/IDWEBTALKS-06/I/2025" },
  c10: { issuer: "IDwebTalks by IDwebhost", date: "14 Maret 2025", category: "webinar", note: "No. 030/IDWEBTALKS-03/I/2025" },
  c11: { issuer: "IDwebTalks by IDwebhost", date: "14 Februari 2025", category: "webinar" },
  c12: { issuer: "IDwebTalks by IDwebhost", date: "31 Januari 2025", category: "webinar" },
  c13: { category: "lainnya", note: "Penerbit/tanggal belum terverifikasi" },
  c14: { issuer: "IDwebTalks by IDwebhost", date: "14 Januari 2025", category: "webinar" },
  c15: { issuer: "RevoU", date: "10 Mei 2024", category: "lainnya", note: "Certified online course 2 minggu — CEO RevoU: Matteo Sutto" },
  c16: { issuer: "Dicoding Indonesia", date: "04 Oktober 2026", credentialId: "QLZ9NVNL9Z5D", category: "dicoding" },
  c17: { issuer: "Dicoding Indonesia", date: "04 Oktober 2026", credentialId: "0LZ0J6490X65", category: "dicoding" },
  c18: { issuer: "Dicoding Indonesia", date: "30 September 2026", credentialId: "1RXYD1JM3XVM", category: "dicoding" },
  c19: { issuer: "Dicoding Indonesia", date: "30 September 2026", credentialId: "NVP7WQ4ORZR0", category: "dicoding" },
  c20: { issuer: "Dicoding Indonesia", date: "30 September 2026", credentialId: "72ZDMY6QJZYW", category: "dicoding" },
  c21: { issuer: "Dicoding Indonesia", date: "20 Juni 2025", credentialId: "GRX5350LYZ0M", category: "dicoding" },
  c22: { issuer: "Dicoding Indonesia", date: "06 Juni 2024", credentialId: "4EXGQ7M1QZRL", category: "dicoding" },
};

const enriched = certs.map((cert) => {
  const e = ENRICH[cert.slug] ?? { category: "lainnya" };
  return {
    ...cert,
    category: e.category,
    issuer: e.issuer ?? null,
    date: e.date ?? null,
    credentialId: e.credentialId ?? null,
    verifyUrl: e.credentialId
      ? `https://www.dicoding.com/certificates/${e.credentialId}`
      : null,
    note: e.note ?? null,
  };
});

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
// Sumber: index.html lama + verifikasi PDF (scripts/pdfscan.py).
export type CertificationCategory =
  | "dicoding"
  | "cisco"
  | "webinar"
  | "akademik"
  | "lainnya";

export type Certification = {
  slug: string;
  titleKey: string;
  descKey: string | null;
  img: string;
  pdf: string | null;
  alt: string;
  category: CertificationCategory;
  issuer: string | null;
  date: string | null;
  credentialId: string | null;
  verifyUrl: string | null;
  note: string | null;
};

export const certifications: Certification[] = ${tsLiteral(enriched)};
`;

writeFileSync(join(outDir, "messages.ts"), messagesTs);
writeFileSync(join(outData, "certifications.ts"), certsTs);

console.log("── Hasil ekstraksi ──");
console.log("Map keys:", Object.keys(MAP).length);
console.log("Sertifikat:", enriched.length, "(ter-enrich:", Object.keys(ENRICH).length, ")");
console.log("Kategori:", [...new Set(enriched.map((c) => c.category))].join(", "));

