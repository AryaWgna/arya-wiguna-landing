"use client";

import React from "react";
import type { BoxView } from "../../vadim-glass-box";
import { careerMilestones } from "@/lib/data/git-milestones";
import { useLang } from "@/components/providers";
import { ViewHead } from "../ViewHead";
import { BoxNav } from "../BoxNav";
import { KpiStrip } from "../KpiStrip";

export function ExperienceView({
  lang,
  onChangeView,
  onClose,
}: {
  lang: "en" | "id";
  onChangeView: (v: BoxView) => void;
  onClose: () => void;
}) {
  const { t } = useLang();
  const isId = lang === "id";

  return (
    <section className="view v-experience" aria-labelledby="experience-title">
      <ViewHead
        onClose={onClose}
        isId={isId}
        label={isId ? "Rekam Jejak Karier & Akademik" : "Verified Career & Education"}
      />

      <BoxNav current="experience" isId={isId} onChangeView={onChangeView} />

      <div className="p-scroll">
        <KpiStrip isId={isId} />

        <h2 id="experience-title" style={{ marginTop: "4px" }}>
          {isId
            ? "Pengalaman rumah sakit, rekayasa sistem & pendidikan S1."
            : "Hospital engineering, systems work & academic foundation."}
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {careerMilestones.map((m, idx) => (
            <article key={m.id} className="rec-card">
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
                  <strong>0{idx + 1}</strong> · {m.period[lang]}
                </span>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: "999px",
                    border: "1px solid var(--line)",
                    fontSize: "11px",
                    color: "#ffffff",
                    background: "rgba(242, 242, 242, 0.06)",
                  }}
                >
                  {m.kind === "work"
                    ? isId
                      ? "Pengalaman Kerja / Magang"
                      : "Work / Internship"
                    : isId
                      ? "Pendidikan Tinggi (IPK 3.77)"
                      : "Higher Education (3.77 GPA)"}
                </span>
              </div>

              <div>
                <h3
                  style={{
                    fontFamily: "var(--serif)",
                    fontStyle: "italic",
                    fontWeight: 400,
                    fontSize: "24px",
                    lineHeight: 1.12,
                  }}
                >
                  {t(m.titleKey)}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "rgba(242, 242, 242, 0.9)",
                    fontWeight: 500,
                    marginTop: "3px",
                  }}
                >
                  {t(m.roleKey)} — {t(m.organizationKey)}
                  {m.locationKey ? ` · ${t(m.locationKey)}` : ""}
                </p>
              </div>

              {/* Highlighted Architectural / Scope Summary Box */}
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "11px",
                  background: "rgba(242, 242, 242, 0.03)",
                  borderLeft: "2px solid rgba(242, 242, 242, 0.45)",
                  fontSize: "13px",
                  lineHeight: 1.52,
                  color: "rgba(242, 242, 242, 0.86)",
                }}
              >
                {t(m.contextKey)}
              </div>

              {/* Key Responsibilities */}
              <ul
                style={{
                  paddingLeft: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  fontSize: "13px",
                  lineHeight: 1.5,
                  color: "rgba(242, 242, 242, 0.76)",
                }}
              >
                {m.responsibilitiesKeys.map((rk) => (
                  <li key={rk}>{t(rk)}</li>
                ))}
              </ul>

              {m.deliverables.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    paddingTop: "6px",
                    borderTop: "1px solid rgba(242, 242, 242, 0.08)",
                  }}
                >
                  {m.deliverables.map((d) => (
                    <a
                      key={`${d.labelKey}-${d.url}`}
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="back-link"
                      style={{ fontSize: "12px" }}
                    >
                      <span>{t(d.labelKey)} ↗</span>
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
