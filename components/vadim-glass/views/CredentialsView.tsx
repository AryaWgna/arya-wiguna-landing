"use client";

import React, { useMemo, useState } from "react";
import type { BoxView } from "../../vadim-glass-box";
import type { CosmosWorkItem } from "@/lib/cosmos-items";
import { expertiseGroups } from "@/lib/data/expertise";
import { TechIcon } from "@/components/tech-icon";
import { useLang } from "@/components/providers";
import { ViewHead } from "../ViewHead";
import { BoxNav } from "../BoxNav";

export function CredentialsView({
  lang,
  onChangeView,
  onClose,
  onFlyToItem,
  items,
}: {
  lang: "en" | "id";
  onChangeView: (v: BoxView) => void;
  onClose: () => void;
  onFlyToItem: (itemIdx: number) => void;
  items: CosmosWorkItem[];
}) {
  const { t } = useLang();
  const isId = lang === "id";
  const [certFilter, setCertFilter] = useState<string>("all");

  const certItems = useMemo(() => {
    return items
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => {
        if (item.kind !== "cert") return false;
        if (certFilter === "all") return true;
        return item.certData?.category === certFilter;
      });
  }, [items, certFilter]);

  return (
    <section className="view v-credentials" aria-labelledby="credentials-title">
      <ViewHead
        onClose={onClose}
        isId={isId}
        label={isId ? "6 Kategori Stack & 21 Sertifikat" : "6 Stack Groups & 21 Certs"}
      />

      <BoxNav current="credentials" isId={isId} onChangeView={onChangeView} />

      <div className="p-scroll">
        <h2 id="credentials-title">
          {isId
            ? "Keahlian teknis & 21 sertifikasi resmi."
            : "Technical arsenal & 21 official credentials."}
        </h2>

        {/* Categorized Technical Stack Grid with Icons */}
        <div className="rec-stack-grid">
          {expertiseGroups.map((cat, idx) => (
            <div
              key={cat.key}
              className="rec-card"
              style={{ padding: "13px 14px", gap: "8px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                }}
              >
                <strong style={{ color: "#ffffff" }}>
                  0{idx + 1}. {t(cat.key)}
                </strong>
                <span style={{ color: "var(--mute)", fontSize: "11px" }}>
                  {cat.items.length}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {cat.items.map((tech) => (
                  <span key={tech} className="rec-pill-icon">
                    <TechIcon name={tech} />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Vault Header & Filter Chips */}
        <div
          style={{
            paddingTop: "12px",
            borderTop: "1px solid var(--line)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: "8px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "24px",
              }}
            >
              {isId
                ? `Brankas Dokumen & Sertifikasi (${certItems.length})`
                : `Verified Certificate Vault (${certItems.length})`}
            </h3>
            <span style={{ fontSize: "12px", color: "var(--mute)" }}>
              {isId ? "Klik untuk PDF / 3D" : "Click for PDF / 3D"}
            </span>
          </div>

          <div className="chips">
            {[
              { id: "all", label: isId ? "Semua (21)" : "All (21)" },
              { id: "bnsp", label: "BNSP RI" },
              {
                id: "akademik",
                label: isId ? "Akademik & Magang" : "Academic & Intern",
              },
              { id: "cisco", label: "Cisco CCNA" },
              { id: "dicoding", label: "Dicoding" },
              { id: "lainnya", label: isId ? "Lainnya" : "Other" },
            ].map((f) => {
              const checked = certFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCertFilter(f.id)}
                  className={`box-tab${checked ? " active" : ""}`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Visual Certificate Cards */}
        <div className="rec-cert-grid">
          {certItems.map(({ item, idx }, n) => (
            <article key={item.id} className="rec-cert-card">
              <div
                className="rec-cert-thumb"
                onClick={() => onFlyToItem(idx)}
                title={isId ? "Terbang ke sertifikat ini" : "Fly to this certificate"}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumb}
                  alt={item.title[lang]}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--mute)",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{item.subtitle[lang]}</span>
                  <span>#{String(n + 1).padStart(2, "0")}</span>
                </div>
                <div
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: "#ffffff",
                  }}
                >
                  {item.title[lang]}
                </div>
                <div
                  style={{
                    fontSize: "11.5px",
                    lineHeight: 1.4,
                    color: "rgba(242, 242, 242, 0.72)",
                  }}
                >
                  {item.description[lang]}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  paddingTop: "6px",
                  borderTop: "1px solid rgba(242, 242, 242, 0.07)",
                  fontSize: "12px",
                }}
              >
                {item.externalUrl ? (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontWeight: 600,
                      color: "#ffffff",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    }}
                  >
                    {isId ? "Buka PDF ↗" : "Open PDF ↗"}
                  </a>
                ) : null}

                <button
                  type="button"
                  onClick={() => onFlyToItem(idx)}
                  style={{ color: "#ffffff", fontSize: "11.5px", fontWeight: 500 }}
                >
                  {isId ? "Buka Detail →" : "Open Details →"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
