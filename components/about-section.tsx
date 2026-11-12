"use client";

import { useLang } from "@/components/providers";
import { GsapReveal } from "@/components/gsap-reveal";
import { SectionHeading } from "@/components/section-heading";
import { HeroBlueprint } from "@/components/hero-blueprint";
import { profile } from "@/lib/data/profile";

const bios = {
  en: [
    <>
      I&apos;m <strong className="font-semibold text-foreground">Arya Wiguna</strong>, an
      Informatics Engineering graduate (
      <strong className="font-semibold text-foreground">S1 Teknik Informatika</strong>, Universitas
      Binaniaga Indonesia) based in Bogor. Certified by{" "}
      <strong className="font-semibold text-foreground">BNSP as a Junior Coder</strong>, I build
      field-tested mobile applications in{" "}
      <strong className="font-semibold text-foreground">Flutter</strong> alongside modular web
      backends with <strong className="font-semibold text-foreground">Next.js 15</strong>,{" "}
      <strong className="font-semibold text-foreground">Laravel 11</strong>, and{" "}
      <strong className="font-semibold text-foreground">Bun</strong>.
    </>,
    <>
      My focus is practical software engineering: clear relational schemas, explicit state
      management, and reproducible multi-container setups with{" "}
      <strong className="font-semibold text-foreground">Docker Compose</strong> and{" "}
      <strong className="font-semibold text-foreground">Nginx</strong>. From hospital medical
      equipment tracking at RS UMMI Bogor to airport flight display boards, I care most about
      systems that stay maintainable in daily operation.
    </>,
  ],
  id: [
    <>
      Saya <strong className="font-semibold text-foreground">Arya Wiguna</strong>, lulusan{" "}
      <strong className="font-semibold text-foreground">S1 Teknik Informatika</strong> Universitas
      Binaniaga Indonesia asal Bogor. Memiliki sertifikasi kompetensi nasional{" "}
      <strong className="font-semibold text-foreground">BNSP (Pemrogram Junior)</strong>, saya
      mengembangkan aplikasi mobile{" "}
      <strong className="font-semibold text-foreground">Flutter</strong> untuk kebutuhan lapangan
      serta sistem backend web berbasis{" "}
      <strong className="font-semibold text-foreground">Next.js 15</strong>,{" "}
      <strong className="font-semibold text-foreground">Laravel 11</strong>, dan{" "}
      <strong className="font-semibold text-foreground">Bun</strong>.
    </>,
    <>
      Pendekatan kerja saya berfokus pada hal fundamental: skema database relasional yang rapi,
      state management yang mudah dilacak, serta isolasi layanan dengan{" "}
      <strong className="font-semibold text-foreground">Docker Compose</strong> dan{" "}
      <strong className="font-semibold text-foreground">Nginx</strong>. Mulai dari sistem inventaris
      alat medis di RS UMMI Bogor hingga papan jadwal penerbangan bandara, prioritas saya adalah
      sistem yang andal saat dipakai bekerja.
    </>,
  ],
};

const pillars = {
  en: [
    {
      num: "01",
      title: "Field-Ready Flutter Apps",
      desc: "Camera QR scanning, encrypted Android Keystore/Keychain sessions, and real-time FCM push sync built for hospital staff.",
    },
    {
      num: "02",
      title: "Containerized Web Backends",
      desc: "Multi-container topologies orchestrated with Docker Compose, Nginx TLS reverse-proxy routing, Laravel Sanctum, and MySQL 8.",
    },
    {
      num: "03",
      title: "Low-Latency Edge & Bun Services",
      desc: "In-memory Map indexing (15k+ items) with Elysia.js and custom Bun HTTP proxy streams exposed safely via Cloudflare Tunnels.",
    },
  ],
  id: [
    {
      num: "01",
      title: "Aplikasi Mobile Flutter Lapangan",
      desc: "Pemindaian QR kamera, penyimpanan sesi terenkripsi Keystore/Keychain, dan sinkronisasi push notifikasi FCM untuk staf rumah sakit.",
    },
    {
      num: "02",
      title: "Backend Web Ter-kontainerisasi",
      desc: "Topologi multi-kontainer dengan Docker Compose, reverse-proxy Nginx TLS, Laravel Sanctum, dan skema relasional MySQL 8.",
    },
    {
      num: "03",
      title: "Layanan Bun & In-Memory Cepat",
      desc: "Indeks RAM 15.000+ entitas dengan Elysia.js serta proxy kustom Bun yang diekspos aman melalui Cloudflare Tunnel.",
    },
  ],
};

export function AboutSection() {
  const { lang } = useLang();
  const isId = lang === "id";

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container-x">
        <SectionHeading
          index="02"
          eyebrow={isId ? "Profil & Pendekatan" : "About & Philosophy"}
          meta="BOGOR, ID · S1 INFORMATIKA"
          title={
            isId ? (
              <>
                Rekayasa perangkat lunak yang{" "}
                <span className="font-editorial font-normal italic text-navy">
                  pragmatis &amp; terukur.
                </span>
              </>
            ) : (
              <>
                Software engineering grounded in{" "}
                <span className="font-editorial font-normal italic text-navy">
                  real system boundaries.
                </span>
              </>
            )
          }
        />

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Narrative Bento Card (7 cols) */}
          <GsapReveal
            className="bento-card flex flex-col justify-between p-6 sm:p-9 lg:col-span-7"
            stagger={0.08}
            y={16}
          >
            <div className="space-y-5">
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-navy" />
                {isId ? "Cerita Singkat" : "Engineering Story"}
              </span>

              {bios[lang].map((p, i) => (
                <p
                  key={i}
                  data-reveal-item
                  className="text-base leading-[1.75] text-muted sm:text-[17px]"
                >
                  {p}
                </p>
              ))}
            </div>

            <div
              data-reveal-item
              className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border-line bg-surface/65 p-5"
            >
              <div>
                <div className="font-mono text-xs font-bold uppercase text-foreground">
                  Universitas Binaniaga Indonesia
                </div>
                <div className="mt-0.5 text-xs text-muted">
                  {isId
                    ? "Sarjana Komputer (S.Kom) — Teknik Informatika"
                    : "Bachelor of Computer Science (S1 Informatika)"}
                </div>
              </div>
              <span className="rounded-full bg-navy px-3.5 py-1 font-mono text-xs font-bold text-background">
                GPA 3.77 / 4.00
              </span>
            </div>

            <div
              data-reveal-item
              className="mt-5 flex flex-wrap items-center gap-3"
            >
              <a
                href={profile.cv.creative}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {isId ? "Unduh CV Creative (PDF)" : "Download Creative CV (PDF)"} ↗
              </a>
              <a
                href={profile.cv.ats}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                {isId ? "Unduh CV ATS (PDF)" : "Download ATS CV (PDF)"} ↗
              </a>
            </div>
          </GsapReveal>

          {/* 3 Engineering Pillars Stack (5 cols) */}
          <GsapReveal
            className="flex flex-col gap-4 lg:col-span-5"
            stagger={0.08}
            y={16}
          >
            {pillars[lang].map((item) => (
              <div
                key={item.num}
                data-reveal-item
                className="bento-card flex flex-1 flex-col justify-between p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-border-line bg-surface px-3 py-0.5 font-mono text-xs font-bold text-navy">
                    {item.num}
                  </span>
                  <span className="font-editorial text-2xl italic text-muted/40">
                    Pillar
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </GsapReveal>
        </div>

        {/* Interactive System Architecture Blueprint Console */}
        <div className="mt-6">
          <HeroBlueprint />
        </div>
      </div>
    </section>
  );
}
