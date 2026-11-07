"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { certifications, type Certification } from "@/lib/data/certifications";
import { gsap, isReducedMotion, scheduleScrollTriggerRefresh } from "@/lib/gsap";

function ArchiveRow({
  cert,
  title,
  lang,
  isId,
}: {
  cert: Certification;
  title: string;
  lang: "en" | "id";
  isId: boolean;
}) {
  return (
    <article className="flex items-start gap-3.5 rounded-xl border border-border-line bg-background p-3.5 transition-colors hover:border-navy/45">
      <div className="relative aspect-[16/11] w-20 shrink-0 overflow-hidden rounded-md border border-border-line bg-surface sm:w-24">
        <Image
          src={`/${cert.img}`}
          alt={cert.alt}
          width={240}
          height={165}
          className="h-full w-full object-cover object-top"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold leading-snug text-foreground">{title}</h4>
        <p className="mt-0.5 font-mono text-[11px] text-muted">
          {cert.issuer} · {cert.date[lang]}
        </p>
        {cert.note ? (
          <p className="mt-0.5 text-xs text-muted/85">{cert.note[lang]}</p>
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
          {cert.pdf ? (
            <a
              href={`/${cert.pdf}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue transition-colors hover:text-navy"
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
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "power2.out",
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
    <section id="certs" ref={sectionRef} className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
        <SectionHeading
          eyebrow={isId ? "Kredensial" : "Credentials"}
          title={
            isId
              ? "Sertifikasi kompetensi & dokumen akademik"
              : "Professional certifications & academic records"
          }
          intro={
            isId
              ? "Menampilkan sertifikasi utama (BNSP, SKL S1, magang rumah sakit, Cisco, dan Dicoding) beserta tautan dokumen asli."
              : "Highlighting core credentials (BNSP national certification, S1 graduation letter, hospital internship, Cisco, and Dicoding) with direct proof."
          }
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {primary.map((cert) => (
            <article
              key={cert.slug}
              data-cert-card
              className="group flex flex-col overflow-hidden rounded-xl border border-border-line bg-background transition-colors hover:border-navy/50"
            >
              <div className="aspect-[16/10] overflow-hidden border-b border-border-line bg-surface">
                <Image
                  src={`/${cert.img}`}
                  alt={cert.alt}
                  width={640}
                  height={400}
                  className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[11px] text-blue">
                  {cert.issuer} · {cert.date[lang]}
                </p>

                <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-foreground">
                  {t(cert.titleKey)}
                </h3>

                {cert.descKey ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {t(cert.descKey)}
                  </p>
                ) : null}

                {cert.note ? (
                  <p className="mt-2 font-mono text-[11px] text-muted/90">
                    {cert.note[lang]}
                  </p>
                ) : null}

                <div className="mt-auto flex items-center gap-4 pt-4 font-mono text-xs">
                  {cert.pdf ? (
                    <a
                      href={`/${cert.pdf}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-navy transition-colors hover:text-blue"
                    >
                      {isId ? "Lihat dokumen →" : "View document →"}
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
          ))}
        </div>

        {archive.length > 0 ? (
          <div className="mt-10 rounded-2xl border border-border-line bg-surface/30 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {isId
                    ? `Arsip Kursus, Seminar & Webinar (${archive.length})`
                    : `Additional Courses, Seminars & Webinars (${archive.length})`}
                </h3>
                <p className="mt-0.5 text-xs text-muted">
                  {isId
                    ? "Dicoding (Python, Cloud AWS/Azure, C), Cisco English for IT, Kemnaker RI, RevoU, OJK, DJP, dan IDwebTalks."
                    : "Dicoding (Python, AWS/Azure Cloud, C), Cisco English for IT, Kemnaker RI, RevoU, OJK, DJP, and IDwebTalks."}
                </p>
              </div>

              <button
                type="button"
                aria-expanded={showArchive}
                onClick={toggleArchive}
                className="btn shrink-0 self-start py-2 px-3.5 font-mono text-xs sm:self-auto"
              >
                <span>
                  {showArchive
                    ? isId
                      ? "Sembunyikan arsip"
                      : "Hide archive"
                    : isId
                      ? `Tampilkan ${archive.length} sertifikat lainnya`
                      : `Show all ${archive.length} additional certificates`}
                </span>
                <span aria-hidden="true">{showArchive ? "↑" : "↓"}</span>
              </button>
            </div>

            {showArchive ? (
              <div className="mt-5 grid gap-3 border-t border-border-line pt-5 md:grid-cols-2">
                {archive.map((cert) => (
                  <ArchiveRow
                    key={cert.slug}
                    cert={cert}
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
