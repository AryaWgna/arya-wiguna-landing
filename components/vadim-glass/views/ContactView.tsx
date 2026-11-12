"use client";

import React, { useState } from "react";
import type { BoxView } from "../../vadim-glass-box";
import { profile } from "@/lib/data/profile";
import { useContactForm } from "@/hooks/useContactForm";
import { ViewHead } from "../ViewHead";
import { BoxNav } from "../BoxNav";

export function ContactView({
  isId,
  onChangeView,
  onClose,
  totalPieces,
}: {
  isId: boolean;
  onChangeView: (v: BoxView) => void;
  onClose: () => void;
  totalPieces: number;
}) {
  const [emailCopied, setEmailCopied] = useState(false);
  const { tried, sending, sentName, formErr, handleBriefSubmit, reset } =
    useContactForm(isId);

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
    <section className="view v-contact" aria-labelledby="c-title">
      <ViewHead
        onClose={onClose}
        isId={isId}
        label={isId ? "Kontak & Diskusi" : "Direct Contact & Brief"}
      />

      <BoxNav current="contact" isId={isId} onChangeView={onChangeView} />

      <div className="p-scroll c-scroll">
        {/* Direct Recruiter Reach Strip */}
        <div className="rec-card" style={{ padding: "13px 15px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "var(--mute)" }}>
                {isId ? "KONTAK LANGSUNG REKRUTER" : "DIRECT RECRUITER REACH"}
              </div>
              <div
                style={{ fontSize: "14px", fontWeight: 600, marginTop: "2px" }}
              >
                {profile.email}
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <button
                type="button"
                className={`back-link copy-link${emailCopied ? " done" : ""}`}
                onClick={copyDirectEmail}
              >
                <span>
                  {emailCopied
                    ? isId
                      ? "Tersalin ✓"
                      : "Copied ✓"
                    : isId
                      ? "Salin Email"
                      : "Copy Email"}
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
              <a
                href={profile.cv.atsId}
                target="_blank"
                rel="noopener noreferrer"
                className="back-link"
              >
                <span>CV ATS (ID) ↗</span>
              </a>
              <a
                href={profile.cv.ats}
                target="_blank"
                rel="noopener noreferrer"
                className="back-link"
              >
                <span>CV ATS (EN) ↗</span>
              </a>
            </div>
          </div>
        </div>

        {sentName === null ? (
          <form
            className={`cform${tried ? " tried" : ""}`}
            id="cform"
            noValidate
            onSubmit={handleBriefSubmit}
          >
            <h2 id="c-title">
              {isId
                ? "Undang wawancara atau diskusikan proyek."
                : "Invite for an interview or start a project."}
            </h2>
            <p className="c-sub">
              {isId
                ? "Kirim pesan langsung melalui formulir di bawah. Saya membaca setiap pesan secara pribadi dan membalas dalam 24 jam."
                : "Send a direct message below. I read every inquiry personally and reply within 24 hours."}
            </p>

            <div className="c-row">
              <label className="field">
                <span>{isId ? "Nama Anda" : "Your Name"}</span>
                <input name="name" autoComplete="name" required />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </label>
            </div>

            <label className="field">
              <span>
                {isId ? "Perusahaan / Organisasi" : "Company / Organization"}
              </span>
              <input name="company" autoComplete="organization" />
            </label>

            <fieldset className="field">
              <legend>
                {isId ? "Kebutuhan / Posisi" : "Role or project type"}
              </legend>
              <div className="chips">
                {[
                  isId ? "Rekrutmen Full-Time" : "Full-time Engineering Role",
                  isId ? "Aplikasi Flutter" : "Flutter Mobile App",
                  isId ? "Web Full-Stack" : "Full-Stack Web System",
                  isId ? "Backend API & Docker" : "Backend API & Docker",
                  isId ? "Kontrak / Freelance" : "Contract / Freelance",
                ].map((opt) => (
                  <label key={opt} className="chip">
                    <input type="checkbox" name="need" value={opt} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="field">
              <legend>
                {isId ? "Mode Kerja / Jadwal" : "Work Arrangement / Timeline"}
              </legend>
              <div className="chips">
                {[
                  isId ? "Segera / Siap Gabung" : "Immediate Start",
                  isId ? "On-site / Hybrid" : "On-site / Hybrid",
                  isId ? "Remote" : "Remote",
                  isId ? "Diskusi Awal" : "Initial Chat",
                ].map((opt) => (
                  <label key={opt} className="chip">
                    <input type="radio" name="budget" value={opt} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="field">
              <span>
                {isId ? "Pesan / Detail Posisi" : "Message / Role Details"}
              </span>
              <textarea
                name="message"
                rows={3}
                required
                placeholder={
                  isId
                    ? "Ceritakan posisi yang sedang dibuka atau sistem yang ingin Anda bangun..."
                    : "Share details about the engineering role or system you are building..."
                }
              />
            </label>

            <div className="c-foot">
              <button
                type="submit"
                className="p-cta-btn c-send"
                disabled={sending}
              >
                {sending
                  ? isId
                    ? "Mengirim..."
                    : "Sending..."
                  : isId
                    ? "Kirim Pesan"
                    : "Send Message"}
              </button>
              <p className="c-note">
                {totalPieces}{" "}
                {isId
                  ? "karya & sertifikat tersedia di portofolio ini."
                  : "verified pieces in this portfolio."}
              </p>
            </div>
            <p className="c-err" role="alert">
              {formErr}
            </p>
          </form>
        ) : (
          <div className="c-done" id="c-done">
            <h2>
              {isId ? "Terima kasih" : "Thank you"}
              {sentName ? `, ${sentName}` : ""}.
            </h2>
            <p className="c-sub">
              {isId
                ? "Pesan Anda sudah terkirim. Saya akan membacanya hari ini dan segera membalas ke email Anda."
                : "Your message is on its way. I’ll read it today and reply to your email shortly."}
            </p>
            <button
              type="button"
              className="p-cta-alt"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              {isId ? "Kembali ke beranda" : "Back to home"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
