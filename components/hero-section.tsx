"use client";

import { useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useLang } from "@/components/providers";
import { CvDropdown } from "@/components/cv-dropdown";
import { profile } from "@/lib/data/profile";
import { gsap, isReducedMotion } from "@/lib/gsap";

const Hero3D = dynamic(() => import("@/components/hero-3d"), { ssr: false });

export function HeroSection() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const viewWork = lang === "id" ? "Lihat Karya" : "View Work";
  const getInTouch = lang === "id" ? "Hubungi Saya" : "Get in Touch";

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    if (!sec || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Intro teatrikal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-eyebrow]",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        0
      )
        .fromTo(
          "[data-hero-line]",
          { yPercent: 115 },
          { yPercent: 0, duration: 0.9, stagger: 0.12 },
          0.08
        )
        .fromTo(
          "[data-hero-copy]",
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 },
          0.35
        )
        .fromTo(
          "[data-hero-cta]",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 },
          0.55
        )
        .fromTo(
          "[data-hero-visual]",
          { autoAlpha: 0, scale: 0.96 },
          { autoAlpha: 1, scale: 1, duration: 0.7 },
          0.5
        );

      // Scroll parallax halus pada kolom 3D
      gsap.to("[data-hero-visual]", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative overflow-hidden">
      {/* Ambient scrim halus (bukan blob ungu) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-12%] h-[480px] w-[480px] rounded-full bg-blue-soft/70 blur-3xl dark:bg-blue-soft/30" />
        <div className="absolute bottom-[-18%] left-[-10%] h-[420px] w-[420px] rounded-full bg-surface/70 blur-3xl" />
      </div>

      <div className="relative z-10 container-x flex min-h-[92svh] items-center py-28 md:py-32">
        <div className="grid w-full items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p data-hero-eyebrow className="eyebrow mb-5">
              {profile.role[lang]}
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              <span className="block overflow-hidden pb-1">
                <span data-hero-line className="block will-change-transform">
                  Arya
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span data-hero-line className="block will-change-transform text-navy">
                  Wiguna
                </span>
              </span>
            </h1>
            <p data-hero-copy className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {profile.heroLine[lang]}
            </p>
            <blockquote
              data-hero-copy
              className="mt-6 border-l-2 border-blue pl-4 text-[15px] italic text-foreground"
            >
              {profile.motto[lang]}
            </blockquote>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link data-hero-cta href="/work" className="btn btn-primary">
                {viewWork}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <span data-hero-cta>
                <CvDropdown />
              </span>
              <a data-hero-cta href={`mailto:${profile.email}`} className="btn">
                {getInTouch}
              </a>
            </div>
          </div>

          <div data-hero-visual className="lg:col-span-5">
            <Hero3D />
            <p className="mt-4 text-center font-mono text-[11px] tracking-wide text-muted">
              procedural 3D hero accent — WebGL optional
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
