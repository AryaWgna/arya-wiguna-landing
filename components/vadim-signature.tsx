"use client";

import React from "react";

/**
 * Continuous calligraphic cursive centerline path for "Arya Wiguna"
 * in viewBox="0 0 1708 753", designed to be drawn by the curvature-paced
 * hand-signing engine with liquid-ink filter (#sig-ink) and glowing pen nib (#sig-tip).
 */
export const ARYA_SIGNATURE_PATH =
  "M 118 545 C 142 415, 205 210, 262 118 C 282 86, 298 92, 296 135 C 292 225, 268 385, 255 495 C 248 542, 224 520, 198 465 C 175 418, 228 368, 312 372 C 352 374, 378 395, 368 428 C 356 465, 382 472, 412 430 C 432 402, 448 378, 468 382 C 488 386, 482 445, 512 442 C 538 438, 562 392, 578 375 C 588 365, 584 425, 562 515 C 542 598, 502 658, 468 642 C 438 628, 465 558, 545 485 C 605 430, 648 382, 678 382 C 702 382, 682 435, 658 442 C 635 448, 642 395, 678 382 C 698 375, 702 428, 732 432 C 765 436, 815 350, 855 245 C 892 148, 922 88, 936 95 C 948 102, 918 265, 898 395 C 885 475, 898 485, 932 415 C 962 352, 992 275, 1008 278 C 1022 282, 998 392, 995 452 C 992 498, 1018 492, 1058 412 C 1098 332, 1142 205, 1168 125 C 1182 82, 1152 245, 1138 365 C 1130 432, 1158 442, 1192 392 C 1212 362, 1218 422, 1248 422 C 1278 422, 1318 368, 1342 368 C 1365 368, 1345 422, 1318 426 C 1292 430, 1302 375, 1342 368 C 1362 365, 1352 445, 1328 538 C 1305 625, 1265 675, 1235 655 C 1208 638, 1245 555, 1335 475 C 1392 425, 1428 372, 1445 375 C 1458 378, 1438 428, 1462 428 C 1485 428, 1512 372, 1528 375 C 1542 378, 1525 428, 1552 428 C 1578 428, 1605 375, 1625 378 C 1642 380, 1625 425, 1652 422 C 1682 418, 1715 375, 1692 365 C 1645 345, 1385 465, 1085 545 C 845 608, 625 648, 1665 485";

export function VadimSignature({
  svgRef,
  strokeRef,
  softRef,
  tipRef,
  glowRef,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  strokeRef: React.RefObject<SVGPathElement | null>;
  softRef: React.RefObject<SVGPathElement | null>;
  tipRef: React.RefObject<SVGPathElement | null>;
  glowRef: React.RefObject<SVGCircleElement | null>;
}) {
  return (
    <svg
      ref={svgRef}
      className="sig"
      id="sig"
      viewBox="0 0 1707.93 752.83"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="sig-glowgrad">
          <stop offset="0" stopColor="#fff" stopOpacity="0.52" />
          <stop offset="0.32" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g id="sig-rot">
        <path
          ref={softRef}
          id="sig-stroke-soft"
          d={ARYA_SIGNATURE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.14"
          style={{ strokeDasharray: "0 9999" }}
        />
        <path
          ref={strokeRef}
          id="sig-stroke"
          d={ARYA_SIGNATURE_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.46"
          style={{ strokeDasharray: "0 9999" }}
        />
        <path
          ref={tipRef}
          id="sig-tip"
          d={ARYA_SIGNATURE_PATH}
          fill="none"
          stroke="#fff"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0 }}
        />
        <circle
          ref={glowRef}
          id="sig-glow"
          r="18"
          fill="url(#sig-glowgrad)"
          style={{ opacity: 0 }}
        />
      </g>
    </svg>
  );
}

/**
 * Edge-to-edge giant italic serif name ("Arya Wiguna") along the bottom of the screen,
 * matching Vadim Carazan's `.bigname` SVG lockup (single line on desktop, stacked on mobile).
 */
export function VadimBigName() {
  return (
    <h1 className="bigname" id="bigname" aria-label="Arya Wiguna">
      {/* Desktop single-line full-bleed SVG */}
      <svg
        className="namesvg"
        viewBox="0 0 1560 228"
        aria-hidden="true"
        focusable="false"
      >
        <text
          x="780"
          y="186"
          textAnchor="middle"
          textLength="1548"
          lengthAdjust="spacingAndGlyphs"
          style={{
            fontFamily: 'var(--serif), "Instrument Serif", Georgia, serif',
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "238px",
            letterSpacing: "-0.02em",
          }}
        >
          Arya Wiguna
        </text>
      </svg>

      {/* Mobile two-line stacked SVG */}
      <svg
        className="namesvg-stack"
        viewBox="0 0 920 390"
        aria-hidden="true"
        focusable="false"
      >
        <text
          x="10"
          y="175"
          style={{
            fontFamily: 'var(--serif), "Instrument Serif", Georgia, serif',
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "208px",
            letterSpacing: "-0.025em",
          }}
        >
          Arya
        </text>
        <text
          x="460"
          y="355"
          textAnchor="middle"
          textLength="900"
          lengthAdjust="spacingAndGlyphs"
          style={{
            fontFamily: 'var(--serif), "Instrument Serif", Georgia, serif',
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "208px",
            letterSpacing: "-0.025em",
          }}
        >
          Wiguna
        </text>
      </svg>
    </h1>
  );
}

