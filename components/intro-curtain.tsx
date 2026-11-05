"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, getLenis, isReducedMotion } from "@/lib/gsap";

const STORAGE_KEY = "aw_intro_seen";

export function IntroCurtain() {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const html = document.documentElement;

    const finish = () => {
      html.classList.remove("intro-pending");
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      getLenis()?.start();
      setDone(true);
    };

    if (!root || isReducedMotion() || !html.classList.contains("intro-pending")) {
      finish();
      return;
    }

    getLenis()?.stop();

    const tl = gsap.timeline({ onComplete: finish });

    if (contentRef.current) {
      tl.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 6 },
        { autoAlpha: 1, y: 0, duration: 0.26, ease: "power2.out" },
        0
      );
    }

    if (ruleRef.current) {
      tl.fromTo(
        ruleRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.52, ease: "power3.inOut" },
        0.06
      );
    }

    if (contentRef.current) {
      tl.to(
        contentRef.current,
        { autoAlpha: 0, y: -8, duration: 0.22, ease: "power2.in" },
        0.62
      );
    }

    tl.to(
      root,
      { yPercent: -100, duration: 0.46, ease: "expo.inOut" },
      0.66
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
        document.documentElement.classList.remove("intro-pending");
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {}
        getLenis()?.start();
        setDone(true);
      }}
      className="fixed inset-0 z-[120] flex-col items-center justify-center border-b border-border-line bg-background px-6 text-foreground select-none"
    >
      <div ref={contentRef} className="w-full max-w-sm">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-muted">
          <span>Arya Wiguna</span>
          <span>Bogor · 06°35′S 106°48′E</span>
        </div>

        <div className="my-5 flex items-baseline justify-between">
          <span className="font-mono text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            AW<span className="text-blue">.</span>
          </span>
          <span className="font-mono text-[11px] text-muted">2026</span>
        </div>

        <div className="relative flex items-center">
          <span className="h-1.5 w-px bg-border-line" />
          <div className="relative h-px flex-1 bg-border-line">
            <div
              ref={ruleRef}
              className="absolute inset-0 origin-left scale-x-0 bg-navy"
            />
          </div>
          <span className="h-1.5 w-px bg-border-line" />
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-muted">
          <span>Full-Stack &amp; Mobile</span>
          <span>S1 · BNSP</span>
        </div>
      </div>
    </div>
  );
}

