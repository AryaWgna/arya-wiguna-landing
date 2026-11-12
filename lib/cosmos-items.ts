import { projects, type Project } from "@/lib/data/projects";
import { certifications, type Certification } from "@/lib/data/certifications";

export type CosmosPiece = {
  id: string;
  itemIndex: number;
  mediaIndex: number;
  src: string;
  title: { en: string; id: string };
  kind: { en: string; id: string };
  isCaseStudy: boolean;
};

export type CosmosWorkItem = {
  id: string;
  kind: "project" | "cert";
  title: { en: string; id: string };
  subtitle: { en: string; id: string };
  description: { en: string; id: string };
  tags: string[];
  thumb: string;
  caseStudyUrl?: string;
  externalUrl?: string;
  externalLabel?: { en: string; id: string };
  secondaryUrl?: string;
  secondaryLabel?: { en: string; id: string };
  projectData?: Project;
  certData?: Certification;
  media: {
    src: string;
    caption: { en: string; id: string };
    description: { en: string; id: string };
  }[];
};

const PROJECT_TITLES: Record<string, { en: string; id: string }> = {
  "simaru-mobile-app": {
    en: "SIMARU — Hospital Asset & Opname App",
    id: "SIMARU — Aplikasi Aset & Stock Opname RS",
  },
  "digital-skyboard-announcement": {
    en: "Digital Skyboard — Airport FIDS System",
    id: "Digital Skyboard — Sistem FIDS Bandara",
  },
  streamely: {
    en: "StreamEly — In-Memory VOD & Bun Proxy",
    id: "StreamEly — Platform VOD & Proxy Bun",
  },
};

export function buildCosmosDataset(): {
  items: CosmosWorkItem[];
  pieces: CosmosPiece[];
} {
  const items: CosmosWorkItem[] = [];
  const pieces: CosmosPiece[] = [];

  projects.forEach((p) => {
    const title = PROJECT_TITLES[p.slug] ?? { en: p.slug, id: p.slug };
    const descEn = p.highlights.map((h) => `• ${h.en}`).join("\n");
    const descId = p.highlights.map((h) => `• ${h.id}`).join("\n");
    const itemIndex = items.length;

    const media = p.screenshots.map((s, mi) => {
      const src = s.src.startsWith("/") ? s.src : `/${s.src}`;
      pieces.push({
        id: `${p.slug}-${mi}`,
        itemIndex,
        mediaIndex: mi,
        src,
        title: {
          en: `${title.en} (${s.caption.en})`,
          id: `${title.id} (${s.caption.id})`,
        },
        kind: p.contextBadge,
        isCaseStudy: true,
      });
      return {
        src,
        caption: s.caption,
        description: s.description,
      };
    });

    items.push({
      id: p.slug,
      kind: "project",
      title,
      subtitle: {
        en: `${p.contextBadge.en}${p.year ? ` · ${p.year}` : ""}`,
        id: `${p.contextBadge.id}${p.year ? ` · ${p.year}` : ""}`,
      },
      description: {
        en: `${p.roleNote?.en ?? ""}\n\n${descEn}`,
        id: `${p.roleNote?.id ?? ""}\n\n${descId}`,
      },
      tags: p.stack,
      thumb: p.thumb.startsWith("/") ? p.thumb : `/${p.thumb}`,
      caseStudyUrl: `/work/${p.slug}`,
      externalUrl: p.liveUrl,
      externalLabel: p.liveUrl
        ? { en: "Live demo ↗", id: "Demo live ↗" }
        : undefined,
      secondaryUrl: undefined,
      secondaryLabel: undefined,
      projectData: p,
      media,
    });
  });

  certifications.forEach((c) => {
    const itemIndex = items.length;
    const src = c.img.startsWith("/") ? c.img : `/${c.img}`;
    const pdfUrl = c.pdf ? (c.pdf.startsWith("/") ? c.pdf : `/${c.pdf}`) : src;

    pieces.push({
      id: c.slug,
      itemIndex,
      mediaIndex: 0,
      src,
      title: { en: c.alt, id: c.alt },
      kind: {
        en: `${c.issuer} · ${c.date.en}`,
        id: `${c.issuer} · ${c.date.id}`,
      },
      isCaseStudy: Boolean(c.featured),
    });

    const noteEn = [
      c.note?.en,
      c.credentialId ? `Credential ID: ${c.credentialId}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
    const noteId = [
      c.note?.id,
      c.credentialId ? `ID Kredensial: ${c.credentialId}` : null,
    ]
      .filter(Boolean)
      .join(" · ");

    items.push({
      id: c.slug,
      kind: "cert",
      title: { en: c.alt, id: c.alt },
      subtitle: {
        en: `${c.issuer} · ${c.date.en}`,
        id: `${c.issuer} · ${c.date.id}`,
      },
      description: {
        en:
          noteEn ||
          `Official certification issued by ${c.issuer} (${c.date.en}).`,
        id:
          noteId ||
          `Sertifikasi resmi diterbitkan oleh ${c.issuer} (${c.date.id}).`,
      },
      tags: [
        c.category.toUpperCase(),
        c.issuer.split("·")[0].trim(),
        c.date.en,
      ],
      thumb: src,
      externalUrl: pdfUrl,
      externalLabel: { en: "Open official PDF ↗", id: "Buka PDF resmi ↗" },
      secondaryUrl: c.verifyUrl ?? undefined,
      secondaryLabel: c.verifyUrl
        ? { en: "Verify online ↗", id: "Verifikasi online ↗" }
        : undefined,
      certData: c,
      media: [
        {
          src,
          caption: { en: c.alt, id: c.alt },
          description: {
            en: `${c.issuer} — ${c.date.en}`,
            id: `${c.issuer} — ${c.date.id}`,
          },
        },
      ],
    });
  });

  return { items, pieces };
}

export function rng(a: number, b: number): () => number {
  let t = (a * 374761393 + b * 668265263) >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export type PortraitCell = {
  pieceIndex: number;
  r: number;
  g: number;
  b: number;
  rgbStr: string;
  d: number;
  col: number;
  row: number;
  hs: number;
  dim: number;
  filler: boolean;
  float?: [number, number, number, number, number];
  fromX: number;
  fromY: number;
  fromZ: number;
  delay: number;
  dur: number;
};

export const PORTRAIT_CONFIG = {
  cols: 92,
  rows: 104,
  cellW: 1.05,
  cellH: 0.90,
  D0: 175,
  // Tight bust crop window in /assets/avatar.jpg normalized coordinates (0..1)
  crop: {
    u0: 0.22,
    u1: 0.64,
    v0: 0.04,
    v1: 0.50,
  },
};

/**
 * Shared anatomical & chroma mask for Arya Wiguna's bust in /assets/avatar.jpg.
 * Rejects 100% of outdoor yellow/green tree bokeh above the sloping shoulders
 * and below the right ear while preserving the exact contour of the face, hair,
 * ear, neck, and black overshirt.
 */
function evaluateBustMask(
  u: number,
  v: number,
  rawR: number,
  rawG: number,
  rawB: number,
  luma: number
) {
  const cosH = 0.9945;
  const sinH = 0.1045;

  // 1. Face oval (tilted -6 deg)
  const fdx = u - 0.415;
  const fdy = v - 0.196;
  const rfx = fdx * cosH - fdy * sinH;
  const rfy = fdx * sinH + fdy * cosH;
  const dFace = Math.hypot(rfx / 0.082, rfy / 0.106);

  // 2. Hair crown & temples
  const crdx = u - 0.411;
  const crdy = v - 0.134;
  const rcx = crdx * cosH - crdy * sinH;
  const rcy = crdx * sinH + crdy * cosH;
  const dHair = Math.hypot(rcx / 0.095, rcy / 0.082);

  // 3. Right ear & left cheek contour
  const dEar = Math.hypot((u - 0.500) / 0.020, (v - 0.195) / 0.028);
  const dLeftCheek = Math.hypot((u - 0.347) / 0.022, (v - 0.204) / 0.045);

  const dHeadZone = Math.min(dFace, dHair, dEar, dLeftCheek);

  // 4. Neck & open collar V-zone
  const dNeck = Math.hypot((u - 0.453) / 0.052, (v - 0.315) / 0.074);

  // 5. Sloping shoulders & upper chest bust
  const tdx = u - 0.474;
  const tdy = v - 0.448;
  const dTorso = Math.pow(
    Math.pow(Math.abs(tdx / 0.214), 2.3) +
      Math.pow(Math.abs(tdy / 0.146), 2.1),
    0.45
  );

  // Anatomical shoulder slope lines to cut out the tree bokeh triangles above shoulders
  const leftShoulderTop = 0.312 + Math.max(0, 0.406 - u) * 0.62;
  const rightShoulderTop = 0.268 + Math.max(0, u - 0.508) * 0.56;
  const aboveLeftShoulder =
    u < 0.406 && dHeadZone > 0.94 && dNeck > 0.92 && v < leftShoulderTop;
  const aboveRightShoulder =
    u > 0.506 && dHeadZone > 0.94 && dNeck > 0.92 && v < rightShoulderTop;
  const belowRightEarGap =
    u > 0.492 && v > 0.214 && v < 0.266 && dFace > 0.92;

  const dSilhouette = Math.min(dHeadZone, dNeck, dTorso);

  // Strict anatomical skin region (ONLY face, ear, and neck V-opening)
  const isSkinZone =
    (dFace <= 0.96 ||
      (dEar <= 0.96 && v >= 0.162 && v <= 0.216) ||
      (dLeftCheek <= 0.95 && v >= 0.155 && v <= 0.245) ||
      (dNeck <= 0.92 && u >= 0.402 && u <= 0.510 && v >= 0.235 && v <= 0.392)) &&
    rawR > rawG + 5 &&
    rawG > rawB &&
    rawR > 52;

  // Outside the skin zone, Arya only has black hair and a black overshirt/tee.
  // Any bright or yellow/green-tinted pixel outside isSkinZone is 100% outdoor background bokeh!
  const isNonSkinBokeh =
    !isSkinZone &&
    (luma > 66 ||
      rawG > rawB + 7 ||
      (rawR > rawB + 11 && luma > 42));

  const rejected =
    dSilhouette > 0.97 ||
    aboveLeftShoulder ||
    aboveRightShoulder ||
    belowRightEarGap ||
    isNonSkinBokeh;

  return {
    rejected,
    isSkinZone,
    dFace,
    dHair,
    dHeadZone,
    dNeck,
    dTorso,
    dSilhouette,
  };
}

/**
 * Extracts a high-definition studio-lit halftone bust mosaic from /assets/avatar.jpg,
 * tightly framed on Arya's head, face, neck, and upper shoulders, with local unsharp-mask
 * facial feature contrast and outer halo floaters drifting in from the dark void.
 */
export function buildPortraitCells(
  avatarImg: HTMLImageElement,
  pieceCount: number,
  lowPower = false
): PortraitCell[] {
  const { cols, rows, D0, crop } = PORTRAIT_CONFIG;
  const S = lowPower ? 280 : 380;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = S;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(avatarImg, 0, 0, S, S);
  const imgData = ctx.getImageData(0, 0, S, S).data;

  const sampleLuma = (px: number, py: number): number => {
    const x = Math.min(S - 1, Math.max(0, px));
    const y = Math.min(S - 1, Math.max(0, py));
    const i = (y * S + x) * 4;
    return 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
  };

  const cells: PortraitCell[] = [];
  const { u0, u1, v0, v1 } = crop;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const fx = (col + 0.5) / cols;
      const fy = (row + 0.5) / rows;
      const u = u0 + fx * (u1 - u0);
      const v = v0 + fy * (v1 - v0);

      const px = Math.min(S - 1, Math.max(0, Math.round(u * S)));
      const py = Math.min(S - 1, Math.max(0, Math.round(v * S)));
      const idx = (py * S + px) * 4;
      const rawR = imgData[idx];
      const rawG = imgData[idx + 1];
      const rawB = imgData[idx + 2];
      const luma = 0.299 * rawR + 0.587 * rawG + 0.114 * rawB;

      // Local neighborhood average for unsharp-mask facial feature definition
      const avgLuma =
        (luma * 2 +
          sampleLuma(px - 2, py) +
          sampleLuma(px + 2, py) +
          sampleLuma(px, py - 2) +
          sampleLuma(px, py + 2) +
          sampleLuma(px - 2, py - 2) +
          sampleLuma(px + 2, py + 2)) /
        8;
      const highPass = luma - avgLuma;

      const mask = evaluateBustMask(u, v, rawR, rawG, rawB, luma);
      const {
        rejected,
        isSkinZone,
        dFace,
        dHair,
        dNeck,
        dTorso,
        dSilhouette,
      } = mask;

      const rGen = rng(row * cols + col + 1, 17);

      // Outer halo floaters drifting in from the dark void
      if (rejected) {
        const floatChance = lowPower ? 0.08 : 0.14;
        if (dSilhouette <= 1.36 && rGen() < floatChance) {
          const d = D0 * (0.72 + rGen() * 0.68);
          const k = d / D0;
          const ang = rGen() * Math.PI * 2;
          const rad = (70 + rGen() * 110) * k;
          const dim = 0.22 + rGen() * 0.38;
          cells.push({
            pieceIndex: Math.floor(rGen() * pieceCount),
            r: 150,
            g: 146,
            b: 142,
            rgbStr: "rgb(150,146,142)",
            d,
            col,
            row,
            hs: 0.42 + rGen() * 0.36,
            dim,
            filler: true,
            float: [
              0.045 + rGen() * 0.065,
              0,
              rGen(),
              rGen() * 40,
              18 + rGen() * 42 + (1 - dim) * 35,
            ],
            fromX: Math.cos(ang) * rad,
            fromY: Math.sin(ang) * rad,
            fromZ: -d * (1.4 + rGen() * 1.1),
            delay:
              rGen() * 1400 +
              Math.hypot(col - cols / 2, row - rows * 0.4) * 5.5,
            dur: 1300 + rGen() * 850,
          });
        }
        continue;
      }

      // Smooth bottom bust vignette so the shoulders dissolve cleanly behind the giant name
      const bottomFade =
        v > 0.43 ? Math.max(0, 1 - (v - 0.43) / 0.072) : 1;
      const edgeFade =
        dSilhouette > 0.86
          ? Math.max(0.22, 1 - (dSilhouette - 0.86) / 0.12)
          : 1;
      let dim = Math.min(1, bottomFade * edgeFade);
      if (dim < 0.12) continue;

      let outR = rawR;
      let outG = rawG;
      let outB = rawB;
      let hs = 0.62;

      if (isSkinZone || dFace < 0.86) {
        // Face, eyes, brows, nose, mouth, ear & neck:
        // Unsharp-mask contrast so eyes, brows, nostrils, and smile are crisp
        const sharpLuma = Math.min(
          255,
          Math.max(10, luma + highPass * 2.25)
        );
        const normL = Math.min(1, Math.max(0, (sharpLuma - 20) / 188));
        const curved = Math.pow(normL, 0.76);

        hs = 0.28 + 0.68 * curved;
        const featureContrast = 0.38 + 0.62 * Math.pow(normL, 0.62);
        dim *= featureContrast;

        const gain = (sharpLuma / Math.max(12, luma)) * 1.09;
        outR = Math.min(255, Math.max(20, Math.round(rawR * gain + 8)));
        outG = Math.min(255, Math.max(16, Math.round(rawG * gain + 5)));
        outB = Math.min(255, Math.max(14, Math.round(rawB * gain + 3)));
      } else if (v < 0.23) {
        // Hair & upper temples: clean neutral charcoal + subtle studio rim light
        const rim =
          Math.max(0, 1 - Math.abs(dHair - 0.76) * 2.8) * 32 +
          (u > 0.41 ? 14 : 5);
        const strand = Math.max(0, luma + highPass * 1.4 - 8) * 1.35;
        const hairTone = Math.min(138, 30 + strand + rim);
        outR = Math.round(hairTone * 0.97);
        outG = Math.round(hairTone * 0.97);
        outB = Math.round(hairTone * 1.02);
        hs = 0.42 + Math.min(0.44, hairTone / 185);
        dim *= 0.64 + 0.36 * (hairTone / 138);
      } else {
        // Black overshirt, collar lapels & inner crew-neck tee (pure studio charcoal, zero yellow tint)
        const fold = Math.max(0, luma + highPass * 1.5 - 10) * 2.1;
        const shoulderRim =
          Math.max(0, 1 - Math.abs(dTorso - 0.76) * 3.0) * 34;
        const collarLight = dNeck < 1.15 ? (1.15 - dNeck) * 24 : 0;
        const tone = Math.min(128, 26 + fold + shoulderRim + collarLight);
        outR = Math.round(tone * 0.96);
        outG = Math.round(tone * 0.98);
        outB = Math.round(tone * 1.04);
        hs =
          (0.36 + Math.min(0.46, tone / 165)) * Math.sqrt(bottomFade);
        dim *= 0.56 + 0.44 * (tone / 128);
      }

      // Keep face cells tighter in Z-depth so facial features align with razor-sharp precision at rest
      const depthSpread = isSkinZone || dFace < 0.92 ? 0.16 : 0.54;
      const d = D0 * (1 - depthSpread * 0.5 + rGen() * depthSpread);
      const k = d / D0;
      const ang = rGen() * Math.PI * 2;
      const rad = (60 + rGen() * 120) * k;

      const isEdgeFloater =
        dim < 0.52 && dSilhouette > 0.88 && rGen() < (lowPower ? 0.20 : 0.34);

      cells.push({
        pieceIndex: (row * 7 + col * 3) % pieceCount,
        r: outR,
        g: outG,
        b: outB,
        rgbStr: `rgb(${outR},${outG},${outB})`,
        d,
        col,
        row,
        hs: Math.max(0.22, Math.min(0.96, hs)),
        dim: Math.max(0.18, Math.min(1, dim)),
        filler: rGen() < 0.32,
        float: isEdgeFloater
          ? [
              0.05 + rGen() * 0.06,
              0,
              rGen(),
              rGen() * 40,
              16 + rGen() * 32,
            ]
          : undefined,
        fromX: Math.cos(ang) * rad,
        fromY: Math.sin(ang) * rad,
        fromZ: -d * (1.4 + rGen() * 1.2),
        delay:
          rGen() * 1350 +
          Math.hypot(col - cols / 2, row - rows * 0.36) * 4.6,
        dur: 1200 + rGen() * 800,
      });
    }
  }

  return cells;
}

/**
 * Builds a high-definition, unsharp-masked, studio-lit portrait canvas of Arya Wiguna
 * with a subtle micro-halftone grid screen engraved into it. Rendered over the 3D tile
 * matrix at rest so the eyes, eyebrows, nose, smile, and jawline are crystal-clear while
 * preserving the signature Vadim Carazan mosaic aesthetic.
 */
export function buildStudioPortraitCanvas(
  avatarImg: HTMLImageElement,
  lowPower = false
): HTMLCanvasElement {
  const { cols, rows, crop } = PORTRAIT_CONFIG;
  const W = lowPower ? 420 : 600;
  const H = lowPower ? 475 : 678;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  if (!ctx) return cv;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const srcW = avatarImg.naturalWidth || avatarImg.width || 460;
  const srcH = avatarImg.naturalHeight || avatarImg.height || 460;
  const sx = crop.u0 * srcW;
  const sy = crop.v0 * srcH;
  const sw = (crop.u1 - crop.u0) * srcW;
  const sh = (crop.v1 - crop.v0) * srcH;

  ctx.drawImage(avatarImg, sx, sy, sw, sh, 0, 0, W, H);
  const imgData = ctx.getImageData(0, 0, W, H);
  const src = new Uint8ClampedArray(imgData.data);
  const d = imgData.data;

  const getLumaAt = (px: number, py: number): number => {
    const cx = Math.min(W - 1, Math.max(0, px));
    const cy = Math.min(H - 1, Math.max(0, py));
    const idx = (cy * W + cx) * 4;
    return 0.299 * src[idx] + 0.587 * src[idx + 1] + 0.114 * src[idx + 2];
  };

  for (let y = 0; y < H; y++) {
    const fy = (y + 0.5) / H;
    const v = crop.v0 + fy * (crop.v1 - crop.v0);

    // Subtle horizontal micro-halftone grid line
    const cellRowPos = (fy * rows) % 1;
    const isGridRow = cellRowPos < 0.085 || cellRowPos > 0.915;

    for (let x = 0; x < W; x++) {
      const fx = (x + 0.5) / W;
      const u = crop.u0 + fx * (crop.u1 - crop.u0);

      const i = (y * W + x) * 4;
      const rawR = src[i];
      const rawG = src[i + 1];
      const rawB = src[i + 2];
      const luma = 0.299 * rawR + 0.587 * rawG + 0.114 * rawB;

      const mask = evaluateBustMask(u, v, rawR, rawG, rawB, luma);
      if (mask.rejected) {
        d[i + 3] = 0;
        continue;
      }

      const { isSkinZone, dFace, dSilhouette } = mask;

      // Soft feathering at silhouette boundary and bottom bust fade
      const edgeAlpha =
        dSilhouette > 0.82
          ? Math.max(0, 1 - (dSilhouette - 0.82) / 0.15)
          : 1;
      const bottomAlpha =
        v > 0.42 ? Math.max(0, 1 - (v - 0.42) / 0.075) : 1;

      // Higher clarity on face/head/neck, softer blend on outer shoulders
      const focusWeight =
        dFace < 0.92
          ? 0.92
          : isSkinZone
            ? 0.86
            : Math.max(0.38, 0.68 - dSilhouette * 0.28);

      // Subtle micro-grid perforation so the high-res portrait looks constructed of fine halftone cells
      const cellColPos = (fx * cols) % 1;
      const isGridCol = cellColPos < 0.085 || cellColPos > 0.915;
      const gridMask = isGridRow || isGridCol ? 0.36 : 1.0;

      const alpha = edgeAlpha * bottomAlpha * focusWeight * gridMask;
      if (alpha <= 0.01) {
        d[i + 3] = 0;
        continue;
      }

      // Unsharp-mask detail enhancement for eyes, eyebrows, nose, and smile
      const blurLuma =
        (getLumaAt(x - 2, y) +
          getLumaAt(x + 2, y) +
          getLumaAt(x, y - 2) +
          getLumaAt(x, y + 2) +
          getLumaAt(x - 1, y - 1) +
          getLumaAt(x + 1, y + 1)) /
        6;
      const detail = luma - blurLuma;

      if (isSkinZone || dFace < 0.88) {
        const sharpGain = (luma + detail * 1.85) / Math.max(10, luma);
        const cGain = 1.12;
        const r = (rawR * sharpGain - 108) * cGain + 116;
        const g = (rawG * sharpGain - 103) * cGain + 109;
        const b = (rawB * sharpGain - 98) * cGain + 101;
        d[i] = Math.min(255, Math.max(8, Math.round(r)));
        d[i + 1] = Math.min(255, Math.max(6, Math.round(g)));
        d[i + 2] = Math.min(255, Math.max(5, Math.round(b)));
      } else {
        // Clean studio charcoal for hair and black overshirt (removes any warm outdoor cast)
        const neutralTone = Math.min(
          135,
          Math.max(12, Math.round((luma + detail * 1.35) * 1.15 + 8))
        );
        d[i] = Math.round(neutralTone * 0.96);
        d[i + 1] = Math.round(neutralTone * 0.98);
        d[i + 2] = Math.round(neutralTone * 1.03);
      }

      d[i + 3] = Math.round(alpha * 255);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return cv;
}


