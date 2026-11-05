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
  const pctRef = useRef<HTMLSpanElement>(null);
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

    const finish = () => {
      triggerHero();
      getLenis()?.start();
      setDone(true);
    };

    if (!root || isReducedMotion()) {
      finish();
      return;
    }

    getLenis()?.stop();

    const counter = { val: 0 };
    const tl = gsap.timeline({ onComplete: finish });

    if (topRef.current) {
      tl.fromTo(
        topRef.current,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
        0.08
      );
    }

    if (markRef.current) {
      tl.fromTo(
        markRef.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" },
        0.18
      );
    }

    if (ruleRef.current) {
      tl.fromTo(
        ruleRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.65, ease: "power2.inOut" },
        0.32
      );
    }

    tl.to(
      counter,
      {
        val: 100,
        duration: 1.65,
        ease: "power2.inOut",
        onUpdate: () => {
          if (pctRef.current) {
            pctRef.current.textContent = String(Math.round(counter.val)).padStart(3, "0");
          }
        },
      },
      0.32
    );

    if (botRef.current) {
      tl.fromTo(
        botRef.current,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
        0.65
      );
    }

    if (contentRef.current) {
      tl.to(
        contentRef.current,
        { autoAlpha: 0, y: -12, duration: 0.36, ease: "power2.in" },
        2.45
      );
    }

    tl.call(triggerHero, undefined, 2.58);

    tl.to(
      root,
      { yPercent: -100, duration: 0.75, ease: "expo.inOut" },
      2.52
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
        getLenis()?.start();
        setDone(true);
      }}
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center border-b border-border-line bg-background px-6 text-foreground select-none"
    >
      <div ref={contentRef} className="w-full max-w-sm">
        <div
          ref={topRef}
          className="invisible flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-muted"
        >
          <span>Arya Wiguna</span>
          <span>Bogor · 06°35′S 106°48′E</span>
        </div>

        <div
          ref={markRef}
          className="invisible my-5 flex items-baseline justify-between"
        >
          <span className="font-mono text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            AW<span className="text-blue">.</span>
          </span>
          <span
            ref={pctRef}
            className="font-mono text-xs tabular-nums text-muted"
          >
            000
          </span>
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
          className="invisible mt-3.5 flex items-center justify-between font-mono text-[10px] tracking-wider uppercase text-muted"
        >
          <span>Full-Stack &amp; Mobile</span>
          <span>S1 Informatika · BNSP</span>
        </div>
      </div>
    </div>
  );
}
