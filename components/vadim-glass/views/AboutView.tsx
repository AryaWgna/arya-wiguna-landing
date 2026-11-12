"use client";

import React, { useState } from "react";
import type { BoxView } from "../../vadim-glass-box";
import { profile } from "@/lib/data/profile";
import { ViewHead } from "../ViewHead";
import { BoxNav } from "../BoxNav";
import { KpiStrip } from "../KpiStrip";

export function AboutView({
  lang,
  onChangeView,
  onClose,
  visitorStats,
}: {
  lang: "en" | "id";
  onChangeView: (v: BoxView) => void;
  onClose: () => void;
  visitorStats?: { online: number; total: number } | null;
}) {
  const isId = lang === "id";
  const [emailCopied, setEmailCopied] = useState(false);

  const copyDirectEmail = () => {
    try {
      navigator.clipboard?.writeText(profile.email);
    } catch {
      // ignore
    }
    setEmailCopied(true);
    window.setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <section className="view v-about" aria-labelledby="about-title">
      <ViewHead
        onClose={onClose}
        isId={isId}
        label={isId ? "Profil & Ringkasan Kualifikasi" : "Profile & Engineering Dossier"}
      />

      <BoxNav current="about" isId={isId} onChangeView={onChangeView} />

      <div className="p-scroll">
        {/* Executive Candidate Card with Photo + Instant CV & Email Actions */}
        <div className="rec-card" style={{ gap: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/avatar.jpg"
              alt="Arya Wiguna"
              style={{
                width: "84px",
                height: "84px",
                borderRadius: "16px",
                objectFit: "cover",
                objectPosition: "center 16%",
                border: "1px solid rgba(242, 242, 242, 0.22)",
                flex: "none",
              }}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--serif)",
                    fontStyle: "italic",
                    fontSize: "28px",
                    lineHeight: 1.05,
                  }}
                >
                  Arya Wiguna, S.Kom
                </span>
              </div>
              <div
                style={{
                  fontSize: "13.5px",
                  color: "rgba(242, 242, 242, 0.88)",
                  marginTop: "4px",
                  fontWeight: 500,
                }}
              >
                Full-Stack Web &amp; Flutter Mobile Engineer · BNSP Junior Coder
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--mute)",
                  marginTop: "2px",
                }}
              >
                Bogor, Jawa Barat · On-site / Hybrid / Remote
              </div>
            </div>
          </div>

          {/* Bilingual Recruiter CV Vault (Bahasa Indonesia & English — ATS + Creative) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              paddingTop: "10px",
              borderTop: "1px solid rgba(242, 242, 242, 0.08)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
                gap: "8px",
              }}
            >
              {/* Bahasa Indonesia CVs */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "rgba(242, 242, 242, 0.03)",
                  border: "1px solid rgba(242, 242, 242, 0.09)",
                }}
              >
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: "var(--mute)",
                    textTransform: "uppercase",
                  }}
                >
                  {isId ? "Versi Bahasa Indonesia (ID)" : "Indonesian Version (ID)"}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  <a
                    href={profile.cv.atsId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                    style={{ fontSize: "12px", padding: "6px 11px" }}
                  >
                    CV ATS (ID) ↗
                  </a>
                  <a
                    href={profile.cv.creativeId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="back-link"
                    style={{ fontSize: "12px", padding: "6px 11px" }}
                  >
                    <span>CV Kreatif (ID) ↗</span>
                  </a>
                </div>
              </div>

              {/* English CVs */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  background: "rgba(242, 242, 242, 0.03)",
                  border: "1px solid rgba(242, 242, 242, 0.09)",
                }}
              >
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: "var(--mute)",
                    textTransform: "uppercase",
                  }}
                >
                  {isId ? "Versi Bahasa Inggris (EN)" : "English Version (EN)"}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  <a
                    href={profile.cv.ats}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                    style={{ fontSize: "12px", padding: "6px 11px" }}
                  >
                    CV ATS (EN) ↗
                  </a>
                  <a
                    href={profile.cv.creative}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="back-link"
                    style={{ fontSize: "12px", padding: "6px 11px" }}
                  >
                    <span>Creative CV (EN) ↗</span>
                  </a>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                className={`back-link copy-link${emailCopied ? " done" : ""}`}
                onClick={copyDirectEmail}
              >
                <span>
                  {emailCopied
                    ? isId
                      ? "Email Tersalin ✓"
                      : "Email Copied ✓"
                    : profile.email}
                </span>
              </button>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="back-link"
              >
                <span>LinkedIn ↗</span>
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="back-link"
              >
                <span>GitHub ↗</span>
              </a>
            </div>
          </div>
        </div>

        <KpiStrip isId={isId} />

        {/* Quick Recruiter Evaluation Matrix */}
        <div className="rec-card">
          <span className="label">
            {isId
              ? "RINGKASAN KUALIFIKASI REKRUTER"
              : "RECRUITER QUALIFICATION SUMMARY"}
          </span>
          <div className="facts" style={{ marginTop: 0, paddingTop: "8px" }}>
            <div>
              <p className="label">{isId ? "Pendidikan" : "Education"}</p>
              <p>
                <strong>S1 Teknik Informatika (S.Kom)</strong>
                <br />
                Universitas Binaniaga Indonesia · IPK 3.77 / 4.00 (2021–2025)
              </p>
            </div>
            <div>
              <p className="label">
                {isId ? "Pengalaman Rumah Sakit" : "Hospital Experience"}
              </p>
              <p>
                <strong>RS UMMI Bogor</strong>
                <br />
                Mobile App Developer (SIMARU) &amp; IT Support Intern
              </p>
            </div>
            <div>
              <p className="label">
                {isId ? "Stack Utama" : "Core Stack"}
              </p>
              <p>
                Flutter, Dart, Next.js 15, React 19, TypeScript, Laravel 11,
                Bun, Elysia.js, MySQL 8, Docker, Nginx
              </p>
            </div>
            <div>
              <p className="label">
                {isId ? "Sertifikasi Utama" : "Key Certifications"}
              </p>
              <p>
                BNSP Pemrogram Junior, TOEFL (520), Cisco CCNA, Dicoding
                Cloud/Backend, Alibaba Cloud
              </p>
            </div>
            {visitorStats ? (
              <div style={{ gridColumn: "1 / -1" }}>
                <p className="label">
                  {isId ? "Telemetri Pengunjung" : "Visitor Telemetry"}
                </p>
                <p>
                  <strong>
                    {visitorStats.online}{" "}
                    {isId ? "pengunjung aktif saat ini" : "active visitors right now"}
                  </strong>{" "}
                  ·{" "}
                  {visitorStats.total.toLocaleString(
                    isId ? "id-ID" : "en-US",
                  )}{" "}
                  {isId ? "total kunjungan tercatat" : "total recorded visits"}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <h2 id="about-title">
          {isId
            ? "Rekayasa perangkat lunak yang pragmatis, rapi, dan siap operasional."
            : "Software engineering grounded in real operational systems."}
        </h2>
        <p className="body">
          {isId
            ? "Saya mengembangkan aplikasi mobile Flutter untuk kebutuhan lapangan serta sistem backend web berbasis Next.js 15, Laravel 11, dan Bun. Pendekatan kerja saya berfokus pada skema database relasional yang rapi, state management yang terukur, serta isolasi layanan dengan Docker Compose dan Nginx."
            : "I build field-tested Flutter mobile applications alongside modular web backends with Next.js 15, Laravel 11, and Bun. My focus is clear relational schemas, explicit state management, and reproducible multi-container setups with Docker Compose and Nginx."}
        </p>

        {/* 3 Engineering Pillars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "8px",
          }}
        >
          {[
            {
              n: "01",
              t: isId
                ? "Aplikasi Mobile Flutter Lapangan"
                : "Field-Ready Flutter Apps",
              d: isId
                ? "Pemindaian QR kamera, penyimpanan sesi terenkripsi Keystore/Keychain, dan sinkronisasi push notifikasi FCM untuk staf rumah sakit."
                : "Camera QR scanning, encrypted Android Keystore/Keychain sessions, and real-time FCM push sync built for hospital staff.",
            },
            {
              n: "02",
              t: isId
                ? "Backend Web Ter-kontainerisasi"
                : "Containerized Web Backends",
              d: isId
                ? "Topologi multi-kontainer dengan Docker Compose, reverse-proxy Nginx TLS, Laravel Sanctum, dan skema relasional MySQL 8."
                : "Multi-container topologies orchestrated with Docker Compose, Nginx TLS reverse-proxy routing, Laravel Sanctum, and MySQL 8.",
            },
            {
              n: "03",
              t: isId
                ? "Layanan Bun & In-Memory Cepat"
                : "Low-Latency Edge & Bun Services",
              d: isId
                ? "Indeks RAM 15.000+ entitas dengan Elysia.js serta proxy kustom Bun yang diekspos aman melalui Cloudflare Tunnel."
                : "In-memory Map indexing (15k+ items) with Elysia.js and custom Bun HTTP proxy streams exposed safely via Cloudflare Tunnels.",
            },
          ].map((p) => (
            <div
              key={p.n}
              className="rec-card"
              style={{ padding: "12px 14px", gap: "4px" }}
            >
              <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#ffffff" }}>
                {p.n} — {p.t}
              </div>
              <div
                style={{
                  fontSize: "12.5px",
                  color: "var(--mute)",
                  lineHeight: 1.5,
                }}
              >
                {p.d}
              </div>
            </div>
          ))}
        </div>

        <aside className="p-cta about-cta" aria-label="Start a project">
          <div className="p-cta-txt">
            <p className="p-cta-k">
              {isId
                ? "Tertarik mengundang wawancara atau diskusi proyek?"
                : "Interested in scheduling an interview or project chat?"}
            </p>
            <h3 className="p-cta-t">
              {isId
                ? "Mari bangun sistem berikutnya bersama."
                : "Let’s make the next system yours."}
            </h3>
          </div>
          <div className="p-cta-row">
            <button
              type="button"
              className="p-cta-btn"
              onClick={() => onChangeView("contact")}
            >
              {isId ? "Hubungi Sekarang" : "Contact Me"}
            </button>
            <button
              type="button"
              className="p-cta-alt"
              onClick={() => onChangeView("selected")}
            >
              {isId ? "Lihat 3 Proyek Utama →" : "See 3 Core Projects →"}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
