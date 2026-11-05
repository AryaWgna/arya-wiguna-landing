"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/components/providers";
import { CvDropdown } from "@/components/cv-dropdown";
import { HeroBlueprint } from "@/components/hero-blueprint";
import { OnlineVisitors } from "@/components/online-visitors";
import { profile } from "@/lib/data/profile";
import { gsap, isReducedMotion, scrollToHash } from "@/lib/gsap";

export function HeroSection() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const viewWork = lang === "id" ? "Lihat Proyek" : "View Projects";
  const getInTouch = lang === "id" ? "Hubungi Saya" : "Get in Touch";

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    if (!sec || isReducedMotion()) return;

    const waitIntro = document.documentElement.classList.contains("intro-pending");
    let fallbackTimer = 0;
    let onReveal: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: waitIntro });

      tl.fromTo(
        "[data-hero-item]",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "power2.out",
        },
        0
      );

      tl.fromTo(
        "[data-hero-visual]",
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
        },
        0.12
      );

      if (waitIntro) {
        onReveal = () => tl.play();
        window.addEventListener("aw-intro-reveal", onReveal, { once: true });
        fallbackTimer = window.setTimeout(() => tl.play(), 2200);
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
    <section id="hero" ref={sectionRef} className="relative z-20">
      <div className="container-x flex min-h-[88svh] items-center py-28 md:py-32">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <div data-hero-item className="mb-4 flex flex-wrap items-center gap-3">
              <p className="eyebrow">{profile.role[lang]}</p>
              <OnlineVisitors variant="hero" />
            </div>

            <h1
              data-hero-item
              className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-[64px] lg:leading-[1.05]"
            >
              Arya <span className="text-navy">Wiguna</span>
            </h1>

            <p data-hero-item className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {profile.heroLine[lang]}
            </p>

            <p
              data-hero-item
              className="mt-5 max-w-xl border-l-2 border-blue pl-4 text-[15px] leading-relaxed text-foreground/90"
            >
              {profile.motto[lang]}
            </p>

            <div data-hero-item className="mt-9 flex flex-wrap items-center gap-3">
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <CvDropdown />

              <Link
                href="/#contact"
                onClick={(e) => handleHashJump(e, "#contact")}
                className="btn"
              >
                {getInTouch}
              </Link>
            </div>
          </div>

          <div data-hero-visual className="lg:col-span-6">
            <HeroBlueprint />
          </div>
        </div>
      </div>
    </section>
  );
}
