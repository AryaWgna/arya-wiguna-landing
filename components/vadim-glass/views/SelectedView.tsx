"use client";

import React from "react";
import Link from "next/link";
import type { BoxView } from "../../vadim-glass-box";
import type { CosmosWorkItem } from "@/lib/cosmos-items";
import { SourceCodeExplorer } from "@/components/source-code-explorer";
import { TechIcon } from "@/components/tech-icon";
import { ViewHead } from "../ViewHead";
import { BoxNav } from "../BoxNav";

export function SelectedView({
  lang,
  onChangeView,
  onClose,
  onFlyToItem,
  onFlyAll,
  projectItems,
  openSourceSlug,
  setOpenSourceSlug,
  setActiveArchStep,
}: {
  lang: "en" | "id";
  onChangeView: (v: BoxView) => void;
  onClose: () => void;
  onFlyToItem: (itemIdx: number) => void;
  onFlyAll: () => void;
  projectItems: { item: CosmosWorkItem; idx: number }[];
  openSourceSlug: string | null;
  setOpenSourceSlug: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveArchStep: (n: number) => void;
}) {
  const isId = lang === "id";

  return (
    <section className="view v-selected" aria-labelledby="selected-title">
      <ViewHead
        onClose={onClose}
        isId={isId}
        label={isId ? "3 Proyek Produksi Utama" : "3 Production Case Studies"}
      />

      <BoxNav current="selected" isId={isId} onChangeView={onChangeView} />

      <div className="p-scroll">
        <h2 id="selected-title">
          {isId
            ? "Sistem produksi yang dirancang untuk operasional nyata."
            : "Production systems engineered for daily operation."}
        </h2>
        <p className="body">
          {isId
            ? "Setiap proyek di bawah memiliki arsitektur terukur, repositori kode asli, dan dokumentasi teknis lengkap. Klik kartu untuk terbang di ruang 3D atau buka studi kasusnya."
            : "Every project below is backed by real architecture, source code repositories, and technical specs. Click any card to inspect in 3D or read the full case study."}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            marginTop: "4px",
          }}
        >
          {projectItems.map(({ item, idx }, n) => {
            const pData = item.projectData;
            const num = String(n + 1).padStart(2, "0");
            return (
              <article key={item.id} className="rec-card">
                {/* Top Meta Row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span className="rec-badge">
                    <strong>#{num}</strong> · {item.subtitle[lang]}
                  </span>
                  {pData?.roleNote ? (
                    <span
                      style={{ fontSize: "11.5px", color: "var(--mute)" }}
                    >
                      {pData.roleNote[lang].split("—")[0]}
                    </span>
                  ) : null}
                </div>

                {/* Clickable 16:9 Preview Banner */}
                <div
                  className="rec-proj-thumb"
                  onClick={() => {
                    setActiveArchStep(0);
                    onFlyToItem(idx);
                  }}
                  title={
                    isId
                      ? "Klik untuk inspeksi 3D & arsitektur"
                      : "Click to inspect in 3D & view architecture"
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumb}
                    alt={item.title[lang]}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Title & Key Highlights */}
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--serif)",
                      fontStyle: "italic",
                      fontWeight: 400,
                      fontSize: "25px",
                      lineHeight: 1.1,
                    }}
                  >
                    {item.title[lang]}
                  </h3>

                  {pData?.highlights ? (
                    <ul
                      style={{
                        paddingLeft: "16px",
                        marginTop: "8px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "5px",
                        fontSize: "13px",
                        lineHeight: 1.5,
                        color: "rgba(242, 242, 242, 0.82)",
                      }}
                    >
                      {pData.highlights.map((h, hi) => (
                        <li key={hi}>{h[lang]}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                {/* Telemetry Strip */}
                {pData?.telemetry && pData.telemetry.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "6px",
                    }}
                  >
                    {pData.telemetry.map((tm) => (
                      <div
                        key={tm.id}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "10px",
                          background: "rgba(242, 242, 242, 0.03)",
                          border: "1px solid rgba(242, 242, 242, 0.07)",
                        }}
                      >
                        <div
                          style={{
                            fontFamily: "var(--serif)",
                            fontStyle: "italic",
                            fontSize: "18px",
                            lineHeight: 1.05,
                            color: "#ffffff",
                          }}
                        >
                          {tm.value}
                        </div>
                        <div
                          style={{
                            fontSize: "10.5px",
                            color: "var(--mute)",
                            marginTop: "2px",
                          }}
                        >
                          {tm.label[lang]}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Tech Stack Pills with Icons */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "5px",
                  }}
                >
                  {item.tags.map((tag) => (
                    <span key={tag} className="rec-pill-icon">
                      <TechIcon name={tag} />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "8px",
                    paddingTop: "6px",
                    borderTop: "1px solid rgba(242, 242, 242, 0.08)",
                  }}
                >
                  <button
                    type="button"
                    className="link"
                    onClick={() => {
                      setActiveArchStep(0);
                      onFlyToItem(idx);
                    }}
                  >
                    {isId ? "Inspeksi 3D & Detail" : "Inspect in 3D"}
                  </button>

                  {item.caseStudyUrl ? (
                    <Link className="back-link" href={item.caseStudyUrl}>
                      <span>
                        {isId ? "Studi Kasus Lengkap ↗" : "Full Case Study ↗"}
                      </span>
                    </Link>
                  ) : null}

                  {item.externalUrl ? (
                    <a
                      className="back-link"
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>{item.externalLabel?.[lang]}</span>
                    </a>
                  ) : null}

                  <button
                    type="button"
                    className="back-link"
                    onClick={() =>
                      setOpenSourceSlug((prev) =>
                        prev === item.id ? null : item.id
                      )
                    }
                    style={
                      openSourceSlug === item.id
                        ? {
                            background: "rgba(242, 242, 242, 0.14)",
                            borderColor: "rgba(242, 242, 242, 0.34)",
                            color: "#ffffff",
                          }
                        : undefined
                    }
                  >
                    <span>
                      {openSourceSlug === item.id
                        ? isId
                          ? "Tutup Kode Sumber ▴"
                          : "Hide Source Code ▴"
                        : isId
                          ? "Lihat Kode Sumber ▾"
                          : "View Source Code ▾"}
                    </span>
                  </button>
                </div>

                {openSourceSlug === item.id ? (
                  <SourceCodeExplorer
                    projectSlug={item.id}
                    lang={lang}
                    compact
                  />
                ) : null}
              </article>
            );
          })}
        </div>

        <p className="sel-foot">
          {isId ? "Ingin melihat mode eksplorasi penuh? " : "Want the full 3D tour? "}
          <button type="button" className="sel-all" onClick={onFlyAll}>
            {isId ? "Terbang menjelajahi 31 visual" : "Fly through all 31 pieces"}
          </button>{" "}
          {isId ? "atau buka " : "or check "}
          <button
            type="button"
            className="sel-all"
            onClick={() => onChangeView("experience")}
          >
            {isId ? "riwayat pengalaman kerja →" : "career experience →"}
          </button>
        </p>
      </div>
    </section>
  );
}
