import { readFileSync, existsSync } from "node:fs";

const src = readFileSync(new URL("../lib/data/certifications.ts", import.meta.url), "utf8");

const imgs = [...src.matchAll(/"img": "([^"]+)"/g)].map((m) => m[1]);
const pdfs = [...src.matchAll(/"pdf": "([^"]+)"/g)].map((m) => m[1]);

const bad = [];
for (const p of [...imgs, ...pdfs]) {
  if (!existsSync(`public/${p}`)) bad.push(p);
}

console.log(`Total img refs: ${imgs.length} | Total pdf refs: ${pdfs.length}`);
console.log(bad.length ? `MISSING: ${bad.join(", ")}` : "ALL ASSETS OK");
