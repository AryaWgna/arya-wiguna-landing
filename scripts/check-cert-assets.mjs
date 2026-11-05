import { readFileSync, existsSync } from "node:fs";

const certsSrc = readFileSync(new URL("../lib/data/certifications.ts", import.meta.url), "utf8");
const projectsSrc = readFileSync(new URL("../lib/data/projects.ts", import.meta.url), "utf8");
const profileSrc = readFileSync(new URL("../lib/data/profile.ts", import.meta.url), "utf8");

const certImgs = [...certsSrc.matchAll(/\bimg:\s*"([^"]+)"/g)].map((m) => m[1]);
const certPdfs = [...certsSrc.matchAll(/\bpdf:\s*"([^"]+)"/g)].map((m) => m[1]);
const projectImgs = [...projectsSrc.matchAll(/\bsrc:\s*"([^"]+)"/g)].map((m) => m[1]);
const profileAssets = [...profileSrc.matchAll(/"(\/assets\/[^"]+)"/g)].map((m) => m[1]);

const missing = [];
for (const p of [...certImgs, ...certPdfs, ...projectImgs, ...profileAssets]) {
  const rel = p.replace(/^\//, "");
  if (!existsSync(`public/${rel}`)) missing.push(p);
}

console.log(
  `Cert imgs: ${certImgs.length} | Cert pdfs: ${certPdfs.length} | Project imgs: ${projectImgs.length} | Profile assets: ${profileAssets.length}`
);
if (missing.length) {
  console.error(`MISSING: ${missing.join(", ")}`);
  process.exit(1);
}
console.log("ALL ASSETS OK");
