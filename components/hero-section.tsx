"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/providers";
import { CvDropdown } from "@/components/cv-dropdown";
import { HeroBlueprint } from "@/components/hero-blueprint";
import { OnlineVisitors } from "@/components/online-visitors";
import { profile } from "@/lib/data/profile";
import { gsap, isReducedMotion, scrollToHash } from "@/lib/gsap";

const heroStats = {
  en: [
    { value: "3.77", label: "Cumulative GPA", sub: "S1 Informatika" },
    { value: "BNSP", label: "National Cert", sub: "Junior Coder" },
    { value: "04", label: "Shipped Systems", sub: "Mobile & Web" },
    { value: "28", label: "Credentials", sub: "Verified Docs" },
  ],
  id: [
    { value: "3,77", label: "IPK Kelulusan", sub: "S1 Informatika" },
    { value: "BNSP", label: "Sertifikasi", sub: "Pemrogram Junior" },
    { value: "04", label: "Sistem Rilis", sub: "Mobile & Web" },
    { value: "28", label: "Sertifikat", sub: "Terverifikasi" },
  ],
};

export function HeroSection() {
  const { lang } = useLang();
  const isId = lang === "id";
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const viewWork = isId ? "Eksplor Proyek" : "Explore Work";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    if (!sec || isReducedMotion()) return;

    const waitIntro = Boolean(document.getElementById("intro-curtain"));
    let fallbackTimer = 0;
    let onReveal: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: waitIntro });

      tl.fromTo(
        "[data-hero-bento]",
        { autoAlpha: 0, y: 20, scale: 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
        },
        0
      );

      if (waitIntro) {
        onReveal = () => tl.play();
        window.addEventListener("aw-intro-reveal", onReveal, { once: true });
        fallbackTimer = window.setTimeout(() => tl.play(), 2400);
      }
    }, sec);

    return () => {
      if (onReveal) window.removeEventListener("aw-intro-reveal", onReveal);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      ctx.revert();
    };
  }, []);

  const handleHashJump = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    scrollToHash(hash);
  };

  return (
    <section id="hero" ref={sectionRef} className="relative z-20 pt-24 pb-12 md:pt-28 md:pb-20">
      <div className="container-x">
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          {/* BENTO 1: Primary Headline & CTA Hub (8 cols) */}
          <div
            data-hero-bento
            className="bento-card flex flex-col justify-between overflow-hidden p-6 sm:p-9 lg:col-span-8 lg:p-11"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 font-mono text-[11px] font-semibold text-emerald-500">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  {isId ? "Terbuka untuk Full-Time & Proyek" : "Open for Full-Time & Projects"}
                </span>

                <OnlineVisitors variant="hero" />
              </div>

              <h1 className="mt-7 text-[36px] leading-[1.06] font-extrabold tracking-[-0.035em] text-foreground sm:text-5xl lg:text-[58px]">
                {isId ? (
                  <>
                    Merancang aplikasi{" "}
                    <span className="font-editorial font-normal italic text-navy">
                      Flutter lapangan
                    </span>{" "}
                    &amp; arsitektur backend web.
                  </>
                ) : (
                  <>
                    Crafting{" "}
                    <span className="font-editorial font-normal italic text-navy">
                      field-tested
                    </span>{" "}
                    Flutter apps &amp; containerized backends.
                  </>
                )}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
                {profile.heroLine[lang]}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border-line/80 pt-6">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <Link
                  href="/#projects"
                  onClick={(e) => handleHashJump(e, "#projects")}
                  className="btn btn-primary"
                >
                  {viewWork}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </Link>

                <CvDropdown />

                <button
                  type="button"
                  onClick={copyEmail}
                  className="btn font-mono text-xs"
                >
                  <span className="h-2 w-2 rounded-full bg-navy" />
                  {copied
                    ? isId
                      ? "Email Tersalin ✓"
                      : "Email Copied ✓"
                    : profile.email}
                </button>
              </div>
            </div>
          </div>

          {/* BENTO 2: Portrait & Identity Card (4 cols) */}
          <div
            data-hero-bento
            className="bento-card group relative flex min-h-[360px] flex-col justify-between overflow-hidden p-4 sm:p-5 lg:col-span-4"
          >
            <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-2xl border border-border-line bg-surface">
              <Image
                src={profile.portrait}
                alt={profile.name}
                width={560}
                height={580}
                priority
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl border border-white/15 bg-black/65 px-3.5 py-2.5 text-white backdrop-blur-md">
                <div>
                  <p className="text-sm font-bold leading-tight">Arya Wiguna</p>
                  <p className="font-mono text-[10px] text-zinc-300">
                    Bogor, ID · S1 Informatika
                  </p>
                </div>
                <span className="rounded-full bg-[#ff5926] px-2.5 py-0.5 font-mono text-[10px] font-bold text-white">
                  BNSP
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 px-1">
              <div className="font-mono text-[11px] text-muted">
                <span className="font-semibold text-foreground">UNBIN</span> · GPA 3.77
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border-line bg-surface px-3 py-1 font-mono text-[11px] font-semibold text-foreground transition-colors hover:border-navy hover:text-navy"
                >
                  GitHub ↗
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border-line bg-surface px-3 py-1 font-mono text-[11px] font-semibold text-foreground transition-colors hover:border-navy hover:text-navy"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>

          {/* BENTO 3: Key Metrics & Engineering Motto (4 cols) */}
          <div
            data-hero-bento
            className="bento-card flex flex-col justify-between p-6 sm:p-7 lg:col-span-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="eyebrow">
                  <span className="h-1.5 w-1.5 rounded-full bg-navy" />
                  {isId ? "Ringkasan Metrik" : "Key Telemetry"}
                </span>
                <span className="font-mono text-[11px] text-muted">2025</span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {heroStats[lang].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border-line bg-surface/65 p-4 transition-colors hover:border-navy/40"
                  >
                    <div className="font-mono text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-foreground/90">
                      {stat.label}
                    </div>
                    <div className="font-mono text-[10px] text-muted">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border-line bg-surface/40 p-4">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-navy">
                {isId ? "Prinsip Rekayasa" : "Engineering Principle"}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {profile.motto[lang]}
              </p>
            </div>
          </div>

          {/* BENTO 4: Interactive System Architecture Console (8 cols) */}
          <div data-hero-bento className="min-w-0 lg:col-span-8">
            <HeroBlueprint />
          </div>
        </div>
      </div>
    </section>
  );
}
