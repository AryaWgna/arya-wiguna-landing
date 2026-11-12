"use client";

import React from "react";
import Link from "next/link";
import type { BoxView } from "../../vadim-glass-box";
import type { CosmosWorkItem } from "@/lib/cosmos-items";
import { SourceCodeExplorer } from "@/components/source-code-explorer";
import { TechIcon } from "@/components/tech-icon";
import { BoxNav } from "../BoxNav";

export function ProjectView({
  lang,
  activeItem,
  activeMediaIndex,
  copied,
  onCopyLink,
  scrollToProjectSource,
  activeArchStep,
  setActiveArchStep,
  projectItems,
  onFlyToItem,
  onClose,
  onChangeView,
}: {
  lang: "en" | "id";
  activeItem: CosmosWorkItem | null;
  activeMediaIndex: number;
  copied: boolean;
  onCopyLink: () => void;
  scrollToProjectSource: (slug: string) => void;
  activeArchStep: number;
  setActiveArchStep: (n: number) => void;
  projectItems: { item: CosmosWorkItem; idx: number }[];
  onFlyToItem: (itemIdx: number) => void;
  onClose: () => void;
  onChangeView: (v: BoxView) => void;
}) {
  const isId = lang === "id";

  if (!activeItem) return null;

  const arch = activeItem.projectData?.architecture;
  const telemetry = activeItem.projectData?.telemetry;
  const orderedMedia = (() => {
    const m = activeItem.media;
    const first = m[activeMediaIndex] ?? m[0];
    if (!first) return [];
    return [first, ...m.filter((_, idx) => idx !== activeMediaIndex)];
  })();

  return (
<section className="view v-project" aria-labelledby="p-title">
        <div className="v-head">
          <button
            type="button"
            className="back-link"
            onClick={() =>
              onChangeView(
                activeItem?.kind === "cert" ? "credentials" : "selected"
              )
            }
            aria-label="Back to list"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M10 3 5 8l5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              {activeItem?.kind === "cert"
                ? isId
                  ? "Semua Sertifikat"
                  : "All Certs"
                : isId
                  ? "Semua Proyek"
                  : "All Projects"}
            </span>
          </button>

          <div className="v-acts">
            <button
              type="button"
              className={`back-link copy-link${copied ? " done" : ""}`}
              onClick={onCopyLink}
              aria-label="Copy a link to this work"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="M6.6 9.4a2.8 2.8 0 0 0 4 0l2.2-2.2a2.8 2.8 0 0 0-4-4l-.9.9M9.4 6.6a2.8 2.8 0 0 0-4 0L3.2 8.8a2.8 2.8 0 0 0 4 4l.9-.9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>
                {copied
                  ? isId
                    ? "Tersalin"
                    : "Copied"
                  : isId
                    ? "Salin"
                    : "Copy"}
              </span>
            </button>

            {activeItem?.kind === "project" ? (
              <button
                type="button"
                className="back-link"
                onClick={() => scrollToProjectSource(activeItem.id)}
              >
                <span>
                  {isId ? "Lihat Kode Sumber ↓" : "View Source Code ↓"}
                </span>
              </button>
            ) : null}

            {activeItem?.secondaryUrl ? (
              <a
                className="back-link"
                href={activeItem.secondaryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  {activeItem.secondaryLabel?.[lang] ??
                    (isId ? "Tautan" : "Link")}
                </span>
              </a>
            ) : null}

            {activeItem?.caseStudyUrl ? (
              <Link className="link" href={activeItem.caseStudyUrl}>
                {isId ? "Studi Kasus Penuh ↗" : "Full Case Study ↗"}
              </Link>
            ) : activeItem?.externalUrl ? (
              <a
                className="link"
                href={activeItem.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {activeItem.externalLabel?.[lang] ??
                  (isId ? "Buka Dokumen ↗" : "Open Document ↗")}
              </a>
            ) : null}

            <button
              type="button"
              className="back-link"
              onClick={onClose}
              aria-label="Close drawer"
              style={{ padding: "6px 10px" }}
            >
              ✕
            </button>
          </div>
        </div>

        <BoxNav
          current={activeItem?.kind === "cert" ? "credentials" : "selected"}
          isId={isId}
          onChangeView={onChangeView}
        />

        <div className="p-scroll p-fit multi" id="p-scroll">
          {activeItem ? (
            <>
              {/* Quick Switcher Pill Bar between Projects & Certs */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "6px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid rgba(242, 242, 242, 0.08)",
                }}
              >
                <span style={{ fontSize: "11.5px", color: "var(--mute)", marginRight: "4px" }}>
                  {isId ? "Pilih Cepat:" : "Quick Jump:"}
                </span>
                {projectItems.map(({ item: pItem, idx: pIdx }, pN) => {
                  const isCurrent = activeItem.id === pItem.id;
                  return (
                    <button
                      key={pItem.id}
                      type="button"
                      className={`box-tab${isCurrent ? " active" : ""}`}
                      style={{ fontSize: "11.5px", padding: "4px 10px" }}
                      onClick={() => {
                        setActiveArchStep(0);
                        onFlyToItem(pIdx);
                      }}
                    >
                      0{pN + 1}. {pItem.title[lang].split("—")[0].trim()}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="box-tab"
                  style={{ fontSize: "11.5px", padding: "4px 10px" }}
                  onClick={() => onChangeView("credentials")}
                >
                  {isId ? "21 Sertifikat →" : "21 Certs →"}
                </button>
              </div>

              <p className="p-kind">
                <span>{activeItem.subtitle[lang]}</span>
                {orderedMedia.length > 1 ? (
                  <span className="p-count">
                    {orderedMedia.length} {isId ? "tampilan" : "screens"}
                  </span>
                ) : null}
              </p>
              <h2 id="p-title">{activeItem.title[lang]}</h2>

              {/* Role, Operational Context & Public Code Evidence Callout for Projects */}
              {activeItem.projectData ? (
                <div className="rec-card" style={{ gap: "8px" }}>
                  <span className="label">
                    {isId
                      ? "RINGKASAN PERAN & BUKTI IMPLEMENTASI"
                      : "ROLE CONTEXT & IMPLEMENTATION EVIDENCE"}
                  </span>
                  {activeItem.projectData.roleNote ? (
                    <p
                      style={{
                        fontSize: "13.5px",
                        lineHeight: 1.55,
                        color: "#ffffff",
                        fontWeight: 500,
                      }}
                    >
                      {activeItem.projectData.roleNote[lang]}
                    </p>
                  ) : null}
                  {activeItem.projectData.evidenceNote ? (
                    <p
                      style={{
                        fontSize: "12.5px",
                        lineHeight: 1.5,
                        color: "rgba(242, 242, 242, 0.78)",
                        paddingTop: "6px",
                        borderTop: "1px solid rgba(242, 242, 242, 0.08)",
                      }}
                    >
                      {activeItem.projectData.evidenceNote[lang]}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {/* Official Credential Verification Card for Certificates */}
              {activeItem.certData ? (
                <div className="rec-card" style={{ gap: "10px" }}>
                  <span className="label">
                    {isId
                      ? "RINCIAN DOKUMEN SERTIFIKASI RESMI"
                      : "OFFICIAL CREDENTIAL METADATA"}
                  </span>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px 14px",
                      fontSize: "13px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--mute)" }}>
                        {isId ? "Lembaga Penerbit" : "Issuing Organization"}
                      </div>
                      <div style={{ fontWeight: 600, color: "#ffffff", marginTop: "2px" }}>
                        {activeItem.certData.issuer}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "var(--mute)" }}>
                        {isId ? "Tanggal Terbit" : "Issue Date"}
                      </div>
                      <div style={{ fontWeight: 600, color: "#ffffff", marginTop: "2px" }}>
                        {activeItem.certData.date[lang]}
                      </div>
                    </div>
                    {activeItem.certData.credentialId ? (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div style={{ fontSize: "11px", color: "var(--mute)" }}>
                          {isId
                            ? "Nomor Registrasi / ID Kredensial"
                            : "Registration / Credential ID"}
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "12.5px",
                            color: "#ffffff",
                            marginTop: "2px",
                          }}
                        >
                          {activeItem.certData.credentialId}
                        </div>
                      </div>
                    ) : null}
                    {activeItem.certData.note ? (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div style={{ fontSize: "11px", color: "var(--mute)" }}>
                          {isId ? "Keterangan & Masa Berlaku" : "Notes & Validity"}
                        </div>
                        <div style={{ color: "rgba(242, 242, 242, 0.88)", marginTop: "2px" }}>
                          {activeItem.certData.note[lang]}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      paddingTop: "8px",
                      borderTop: "1px solid rgba(242, 242, 242, 0.08)",
                    }}
                  >
                    {activeItem.externalUrl ? (
                      <a
                        className="link"
                        href={activeItem.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {isId
                          ? "Buka Dokumen PDF Resmi ↗"
                          : "Open Official PDF Document ↗"}
                      </a>
                    ) : null}
                    <button
                      type="button"
                      className="back-link"
                      onClick={() => onChangeView("credentials")}
                    >
                      <span>
                        {isId
                          ? "Lihat Semua 21 Sertifikat"
                          : "Browse All 21 Certificates"}
                      </span>
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Key Features & Highlights List for Projects */}
              {activeItem.projectData?.highlights ? (
                <div className="rec-card" style={{ gap: "8px" }}>
                  <span className="label">
                    {isId
                      ? "FITUR & MODUL TEKNIS UTAMA"
                      : "KEY ENGINEERING FEATURES & MODULES"}
                  </span>
                  <ul
                    style={{
                      paddingLeft: "18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      fontSize: "13.5px",
                      lineHeight: 1.52,
                      color: "rgba(242, 242, 242, 0.88)",
                    }}
                  >
                    {activeItem.projectData.highlights.map((h, hi) => (
                      <li key={hi}>{h[lang]}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="desc">{activeItem.description[lang]}</p>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {activeItem.tags.map((tag) => (
                  <span key={tag} className="rec-pill-icon">
                    <TechIcon name={tag} />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Telemetry Metrics Strip for Engineering Case Studies */}
              {telemetry && telemetry.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "8px",
                    marginTop: "2px",
                  }}
                >
                  {telemetry.map((m) => (
                    <div key={m.id} className="rec-kpi">
                      <div className="rec-kpi-val">{m.value}</div>
                      <div
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 600,
                          color: "#ffffff",
                          marginTop: "2px",
                        }}
                      >
                        {m.label[lang]}
                      </div>
                      <div className="rec-kpi-lbl">{m.detail[lang]}</div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Interactive System Architecture Inspector + Code/Payload Preview */}
              {arch && arch.steps.length > 0 ? (
                <div className="rec-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <span className="label">{arch.title[lang]}</span>
                      <p style={{ fontSize: "11.5px", color: "var(--mute)", marginTop: "2px" }}>
                        {arch.subtitle[lang]}
                      </p>
                    </div>
                    {activeItem.externalUrl ? (
                      <a
                        href={activeItem.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "12px",
                          textDecoration: "underline",
                          textUnderlineOffset: "3px",
                          color: "#ffffff",
                        }}
                      >
                        {activeItem.externalLabel?.[lang]}
                      </a>
                    ) : null}
                  </div>
                  <div className="chips">
                    {arch.steps.map((s, idx) => {
                      const active = activeArchStep === idx;
                      return (
                        <button
                          key={s.step}
                          type="button"
                          onClick={() => setActiveArchStep(idx)}
                          style={{
                            fontSize: "12px",
                            padding: "5px 11px",
                            borderRadius: "999px",
                            border: "1px solid var(--line)",
                            background: active
                              ? "#ffffff"
                              : "rgba(242, 242, 242, 0.04)",
                            color: active ? "#000" : "rgba(242, 242, 242, 0.82)",
                            fontWeight: active ? 600 : 400,
                          }}
                        >
                          0{s.step}. {s.node}
                        </button>
                      );
                    })}
                  </div>
                  {arch.steps[activeArchStep] ? (
                    <div
                      style={{
                        fontSize: "13px",
                        lineHeight: 1.5,
                        color: "rgba(242, 242, 242, 0.88)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "6px",
                          fontSize: "11.5px",
                          color: "rgba(242, 242, 242, 0.85)",
                        }}
                      >
                        <strong>
                          {arch.steps[activeArchStep].role[lang]} ·{" "}
                          {arch.steps[activeArchStep].protocol}
                        </strong>
                        {arch.steps[activeArchStep].codeLabel ? (
                          <code
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "11px",
                              color: "var(--mute)",
                              background: "rgba(0,0,0,0.35)",
                              padding: "2px 7px",
                              borderRadius: "6px",
                            }}
                          >
                            {arch.steps[activeArchStep].codeLabel}
                          </code>
                        ) : null}
                      </div>
                      <p>{arch.steps[activeArchStep].description[lang]}</p>
                      {arch.steps[activeArchStep].payloadExample ? (
                        <pre
                          style={{
                            margin: 0,
                            padding: "10px 12px",
                            borderRadius: "10px",
                            background: "rgba(0, 0, 0, 0.52)",
                            border: "1px solid rgba(242, 242, 242, 0.1)",
                            fontFamily: "var(--font-mono)",
                            fontSize: "11.5px",
                            lineHeight: 1.45,
                            color: "#e2e8f0",
                            overflowX: "auto",
                          }}
                        >
                          <code>{arch.steps[activeArchStep].payloadExample}</code>
                        </pre>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* Engineering Decisions & Trade-off Rationale */}
              {activeItem.projectData?.rationale &&
              activeItem.projectData.rationale.length > 0 ? (
                <div className="rec-card" style={{ gap: "10px" }}>
                  <span className="label">
                    {isId
                      ? "KEPUTUSAN TEKNIS & PERTIMBANGAN ARSITEKTUR"
                      : "ENGINEERING DECISIONS & TRADE-OFFS"}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {activeItem.projectData.rationale.map((rat) => (
                      <div
                        key={rat.technology}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "11px",
                          background: "rgba(242, 242, 242, 0.03)",
                          border: "1px solid rgba(242, 242, 242, 0.08)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#ffffff",
                          }}
                        >
                          {rat.technology}
                        </div>
                        <div
                          style={{
                            fontSize: "12.5px",
                            color: "rgba(242, 242, 242, 0.85)",
                            lineHeight: 1.48,
                          }}
                        >
                          <strong style={{ color: "#ffffff" }}>
                            {isId ? "Alasan: " : "Why: "}
                          </strong>
                          {rat.reason[lang]}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--mute)",
                            lineHeight: 1.45,
                          }}
                        >
                          <strong>Trade-off: </strong>
                          {rat.tradeoff[lang]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* In-Portfolio Source Code Explorer (No External GitHub Redirect Needed) */}
              {activeItem.kind === "project" ? (
                <SourceCodeExplorer projectSlug={activeItem.id} lang={lang} />
              ) : null}

              {/* High-Resolution Stage & Gallery with Captions and Descriptions */}
              <div className="stage" id="p-stage">
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--mute)",
                    marginBottom: "6px",
                  }}
                >
                  {isId
                    ? `DOKUMENTASI VISUAL & TANGKAPAN LAYAR (${orderedMedia.length})`
                    : `VISUAL DOCUMENTATION & SCREENSHOTS (${orderedMedia.length})`}
                </div>
                <div className="gallery" id="p-gallery">
                  {orderedMedia.map((m, idx) => (
                    <figure key={`${m.src}-${idx}`}>
                      <div
                        style={{
                          padding: "10px 14px",
                          borderBottom: "1px solid rgba(242, 242, 242, 0.08)",
                          background: "rgba(0,0,0,0.35)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#ffffff",
                          }}
                        >
                          0{idx + 1}. {m.caption[lang]}
                        </div>
                        {m.description?.[lang] ? (
                          <div
                            style={{
                              fontSize: "12px",
                              color: "rgba(242, 242, 242, 0.75)",
                              marginTop: "2px",
                              lineHeight: 1.45,
                            }}
                          >
                            {m.description[lang]}
                          </div>
                        ) : null}
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.src}
                        alt={m.caption[lang]}
                        loading={idx === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="in"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            </>
          ) : null}

        </div>
      </section>
  );
}
