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
  const pctRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
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

    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
        0.05
      );
    }

    if (barRef.current) {
      tl.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: "power3.inOut" },
        0.15
      );
    }

    tl.to(
      counter,
      {
        val: 100,
        duration: 1.4,
        ease: "power3.inOut",
        onUpdate: () => {
          if (pctRef.current) {
            pctRef.current.textContent = String(Math.round(counter.val)).padStart(2, "0");
          }
        },
      },
      0.15
    );

    tl.call(triggerHero, undefined, 1.7);

    tl.to(
      root,
      {
        yPercent: -100,
        duration: 0.7,
        ease: "expo.inOut",
      },
      1.65
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
      className="fixed inset-0 z-[120] flex flex-col justify-between bg-[#000] p-6 text-[#f4f3ef] select-none sm:p-12"
    >
      <div className="flex items-center justify-between font-mono text-xs tracking-widest uppercase text-zinc-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff5926]" />
          Arya Wiguna — Portfolio
        </span>
        <span>Bogor, ID</span>
      </div>

      <div ref={titleRef} className="invisible my-auto max-w-3xl">
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#ff5926]">
          Full-Stack &amp; Flutter Engineer
        </p>
        <h2 className="mt-3 text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl md:text-7xl">
          Engineering{" "}
          <span className="font-editorial italic font-normal text-[#ff5926]">
            pragmatic
          </span>{" "}
          digital systems.
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            Loading Experience
          </span>
          <div className="flex items-baseline font-mono text-6xl leading-none font-bold tracking-tighter text-white sm:text-8xl">
            <span ref={pctRef}>00</span>
            <span className="text-2xl text-[#ff5926] sm:text-4xl">%</span>
          </div>
        </div>
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            ref={barRef}
            className="absolute inset-0 origin-left scale-x-0 bg-[#ff5926]"
          />
        </div>
      </div>
    </div>
  );
}
