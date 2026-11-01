"use client";

import { useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useLang } from "@/components/providers";
import { OnlineVisitors } from "@/components/online-visitors";
import { CvDropdown } from "@/components/cv-dropdown";
import { MagneticWrap } from "@/components/magnetic-wrap";
import { profile } from "@/lib/data/profile";
import { gsap, isReducedMotion, splitTextIntoSpans } from "@/lib/gsap";

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
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Eyebrow fade in
      tl.fromTo(
        "[data-hero-eyebrow]",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        0
      );

      // Premium text reveal — split name into chars for dramatic effect
      const heroLines = sec.querySelectorAll<HTMLElement>("[data-hero-line]");
      heroLines.forEach((line) => {
        const chars = splitTextIntoSpans(line, "chars");
        tl.fromTo(
          chars,
          { yPercent: 120, rotateZ: 5 },
          {
            yPercent: 0,
            rotateZ: 0,
            duration: 1,
            stagger: 0.025,
            ease: "power4.out",
          },
          0.1
        );
      });

      // Description text — word split reveal
      const heroCopy = sec.querySelectorAll<HTMLElement>("[data-hero-copy]");
      heroCopy.forEach((el, i) => {
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          0.5 + i * 0.12
        );
      });

      // CTAs — stagger up with slight scale bounce
      tl.fromTo(
        "[data-hero-cta]",
        { autoAlpha: 0, y: 16, scale: 0.95 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
        0.7
      );

      // 3D visual — scale up with slight rotation
      tl.fromTo(
        "[data-hero-visual]",
        { autoAlpha: 0, scale: 0.9, rotateY: -5 },
        { autoAlpha: 1, scale: 1, rotateY: 0, duration: 0.9, ease: "power2.out" },
        0.5
      );

      // Scroll parallax halus pada kolom 3D
      gsap.to("[data-hero-visual]", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Parallax on text column — moves slower
      gsap.to("[data-hero-text]", {
        yPercent: -4,
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
      {/* Ambient scrim halus */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-12%] h-[480px] w-[480px] rounded-full bg-blue-soft/70 blur-3xl dark:bg-blue-soft/30" />
        <div className="absolute bottom-[-18%] left-[-10%] h-[420px] w-[420px] rounded-full bg-surface/70 blur-3xl" />
      </div>

      <div className="relative z-10 container-x flex min-h-[92svh] items-center py-28 md:py-32">
        <div className="grid w-full items-center gap-14 lg:grid-cols-12">
          <div data-hero-text className="lg:col-span-7">
            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p data-hero-eyebrow className="eyebrow">
                {profile.role[lang]}
              </p>
              <OnlineVisitors variant="hero" />
            </div>
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
              <MagneticWrap strength={0.25}>
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
              </MagneticWrap>
              <span data-hero-cta>
                <CvDropdown />
              </span>
              <MagneticWrap strength={0.25}>
                <Link data-hero-cta href="/#contact" className="btn">
                  {getInTouch}
                </Link>
              </MagneticWrap>
            </div>
          </div>

          <div data-hero-visual className="lg:col-span-5" style={{ perspective: "800px" }}>
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
