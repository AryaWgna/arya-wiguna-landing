"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, getLenis, isReducedMotion } from "@/lib/gsap";

function emitReveal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("aw-intro-reveal"));
  }
}

export function IntroCurtain() {
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const revealedRef = useRef(false);
  const [done, setDone] = useState(false);

  const triggerHero = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    emitReveal();
  };

  useEffect(() => {
    const root = rootRef.current;
    const html = document.documentElement;

    const finish = () => {
      triggerHero();
      html.classList.remove("intro-pending");
      getLenis()?.start();
      setDone(true);
    };

    if (!root || isReducedMotion() || !html.classList.contains("intro-pending")) {
      finish();
      return;
    }

    getLenis()?.stop();

    const tl = gsap.timeline({ onComplete: finish });

    if (topRef.current) {
      tl.fromTo(
        topRef.current,
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.05
      );
    }

    if (markRef.current) {
      tl.fromTo(
        markRef.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
        0.14
      );
    }

    if (ruleRef.current) {
      tl.fromTo(
        ruleRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.15, ease: "power2.inOut" },
        0.25
      );
    }

    if (botRef.current) {
      tl.fromTo(
        botRef.current,
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
        0.55
      );
    }

    if (contentRef.current) {
      tl.to(
        contentRef.current,
        { autoAlpha: 0, y: -10, duration: 0.32, ease: "power2.in" },
        1.78
      );
    }

    tl.call(triggerHero, undefined, 1.88);

    tl.to(
      root,
      { yPercent: -100, duration: 0.68, ease: "expo.inOut" },
      1.86
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        tl.kill();
        finish();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      id="intro-curtain"
      ref={rootRef}
      aria-hidden="true"
      onClick={() => {
        triggerHero();
        document.documentElement.classList.remove("intro-pending");
        getLenis()?.start();
        setDone(true);
      }}
      className="fixed inset-0 z-[120] flex-col items-center justify-center border-b border-border-line bg-background px-6 text-foreground select-none"
    >
      <div ref={contentRef} className="w-full max-w-sm">
        <div
          ref={topRef}
          className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-muted"
        >
          <span>Arya Wiguna</span>
          <span>Bogor · 06°35′S 106°48′E</span>
        </div>

        <div ref={markRef} className="my-5 flex items-baseline justify-between">
          <span className="font-mono text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            AW<span className="text-blue">.</span>
          </span>
          <span className="font-mono text-[11px] text-muted">Portfolio · 2026</span>
        </div>

        <div className="relative flex items-center">
          <span className="h-2 w-px bg-border-line" />
          <div className="relative h-px flex-1 bg-border-line">
            <div
              ref={ruleRef}
              className="absolute inset-0 origin-left scale-x-0 bg-navy"
            />
          </div>
          <span className="h-2 w-px bg-border-line" />
        </div>

        <div
          ref={botRef}
          className="mt-3.5 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-muted"
        >
          <span>Full-Stack &amp; Mobile</span>
          <span>S1 Informatika · BNSP</span>
        </div>
      </div>
    </div>
  );
}
