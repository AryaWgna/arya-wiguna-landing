"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { certifications, type Certification } from "@/lib/data/certifications";
import { gsap, isReducedMotion, scheduleScrollTriggerRefresh } from "@/lib/gsap";

function ArchiveRow({
  cert,
  indexNum,
  title,
  lang,
  isId,
}: {
  cert: Certification;
  indexNum: string;
  title: string;
  lang: "en" | "id";
  isId: boolean;
}) {
  return (
    <article className="bento-card flex items-start gap-4 p-4">
      <div className="relative aspect-[16/11] w-24 shrink-0 overflow-hidden rounded-xl border border-border-line bg-surface">
        <Image
          src={`/${cert.img}`}
          alt={cert.alt}
          width={240}
          height={165}
          className="h-full w-full object-cover object-top"
        />
        <span className="absolute top-1.5 left-1.5 rounded-md bg-black/70 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
          #{indexNum}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-bold leading-snug text-foreground">{title}</h4>
        <p className="mt-1 font-mono text-[11px] text-muted">
          {cert.issuer} · {cert.date[lang]}
        </p>
        {cert.note ? (
          <p className="mt-1 text-xs text-muted/85">{cert.note[lang]}</p>
        ) : null}

        <div className="mt-2.5 flex flex-wrap items-center gap-3 font-mono text-xs">
          {cert.pdf ? (
            <a
              href={`/${cert.pdf}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-navy hover:underline"
            >
              {isId ? "Dokumen →" : "Document →"}
            </a>
          ) : null}
          {cert.verifyUrl ? (
            <a
              href={cert.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-foreground"
            >
              {isId ? "Verifikasi ↗" : "Verify ↗"}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function CredentialsSection() {
  const { t, lang } = useLang();
  const isId = lang === "id";
  const sectionRef = useRef<HTMLElement>(null);
  const [showArchive, setShowArchive] = useState(false);

  const primary = certifications.filter((c) => c.featured);
  const archive = certifications.filter((c) => !c.featured);

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    if (!sec || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = sec.querySelectorAll<HTMLElement>("[data-cert-card]");
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 82%",
            once: true,
          },
        }
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  const toggleArchive = () => {
    setShowArchive((prev) => !prev);
    window.setTimeout(() => scheduleScrollTriggerRefresh(), 60);
  };

  return (
    <section id="certs" ref={sectionRef} className="py-16 md:py-24">
      <div className="container-x">
        <SectionHeading
          index="05"
          eyebrow={isId ? "Kredensial & Lisensi" : "Verified Credentials"}
          meta={
            isId
              ? `${certifications.length} Dokumen Resmi`
              : `${certifications.length} Official Documents`
          }
          title={
            isId ? (
              <>
                Sertifikasi nasional, akademik &amp;{" "}
                <span className="font-editorial font-normal italic text-navy">
                  bukti kompetensi.
                </span>
              </>
            ) : (
              <>
                National certifications, academic proof &amp;{" "}
                <span className="font-editorial font-normal italic text-navy">
                  technical records.
                </span>
              </>
            )
          }
          intro={
            isId
              ? "Menampilkan sertifikasi utama (BNSP, SKL S1, magang rumah sakit, Cisco, dan Dicoding) beserta tautan PDF dan verifikasi resmi."
              : "Highlighting core credentials (BNSP national certification, S1 graduation letter, hospital internship, Cisco, and Dicoding) with direct proof."
          }
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {primary.map((cert, idx) => {
            const num = String(idx + 1).padStart(2, "0");
            return (
              <article
                key={cert.slug}
                data-cert-card
                className="bento-card group flex flex-col overflow-hidden p-3.5"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border-line bg-surface">
                  <Image
                    src={`/${cert.img}`}
                    alt={cert.alt}
                    width={640}
                    height={400}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff5926]" />
                    <span>{cert.issuer}</span>
                  </div>
                  <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 font-mono text-[10px] font-bold text-zinc-900">
                    #{num}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-3 pt-4">
                  <p className="font-mono text-[11px] font-semibold text-navy">
                    {cert.date[lang]}
                  </p>

                  <h3 className="mt-1.5 text-base font-bold leading-snug text-foreground">
                    {t(cert.titleKey)}
                  </h3>

                  {cert.descKey ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {t(cert.descKey)}
                    </p>
                  ) : null}

                  {cert.note ? (
                    <p className="mt-2 font-mono text-[11px] text-muted/90">
                      {cert.note[lang]}
                    </p>
                  ) : null}

                  <div className="mt-auto flex items-center justify-between border-t border-border-line/80 pt-4 mt-5 font-mono text-xs">
                    {cert.pdf ? (
                      <a
                        href={`/${cert.pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-navy transition-colors hover:underline"
                      >
                        {isId ? "Buka PDF →" : "Open PDF →"}
                      </a>
                    ) : null}
                    {cert.verifyUrl ? (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border-line bg-surface px-3 py-1 text-[11px] text-muted transition-colors hover:border-foreground hover:text-foreground"
                      >
                        {isId ? "Verifikasi ↗" : "Verify ↗"}
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {archive.length > 0 ? (
          <div className="bento-card mt-8 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="eyebrow">
                  <span className="h-1.5 w-1.5 rounded-full bg-navy" />
                  {isId ? "Brankas Dokumen" : "Credential Vault"}
                </span>
                <h3 className="mt-2 text-lg font-bold text-foreground sm:text-xl">
                  {isId
                    ? `Arsip Kursus, Seminar & Webinar (${archive.length})`
                    : `Additional Courses, Seminars & Webinars (${archive.length})`}
                </h3>
                <p className="mt-1 text-xs text-muted sm:text-sm">
                  {isId
                    ? "Dicoding (Python, Cloud AWS/Azure, C), Cisco English for IT, Kemnaker RI, RevoU, OJK, DJP, dan IDwebTalks."
                    : "Dicoding (Python, AWS/Azure Cloud, C), Cisco English for IT, Kemnaker RI, RevoU, OJK, DJP, and IDwebTalks."}
                </p>
              </div>

              <button
                type="button"
                aria-expanded={showArchive}
                onClick={toggleArchive}
                className="btn shrink-0 self-start font-mono !text-xs sm:self-auto"
              >
                <span>
                  {showArchive
                    ? isId
                      ? "Tutup Arsip"
                      : "Hide Vault"
                    : isId
                      ? `Buka ${archive.length} Sertifikat Lainnya`
                      : `Explore All ${archive.length} Certificates`}
                </span>
                <span aria-hidden="true">{showArchive ? "↑" : "↓"}</span>
              </button>
            </div>

            {showArchive ? (
              <div className="mt-6 grid gap-3.5 border-t border-border-line pt-6 md:grid-cols-2">
                {archive.map((cert, idx) => (
                  <ArchiveRow
                    key={cert.slug}
                    cert={cert}
                    indexNum={String(primary.length + idx + 1).padStart(2, "0")}
                    title={t(cert.titleKey)}
                    lang={lang}
                    isId={isId}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
