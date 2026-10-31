"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

type GsapRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Tag yang dirender (default div). */
  as?: React.ElementType;
  /** Mulai saat elemen memasuki viewport (format ScrollTrigger). */
  start?: string;
  /** Jarak awal translateY (px). */
  y?: number;
  duration?: number;
  ease?: string;
  /** Stagger antar [data-reveal-item]. */
  stagger?: number;
  /** Hanya mainkan sekali (default true). */
  once?: boolean;
};

export function GsapReveal({
  children,
  className,
  as: Tag = "div",
  start = "top 85%",
  y = 14,
  duration = 0.8,
  ease = "power3.out",
  stagger = 0,
  once = true,
}: GsapRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isReducedMotion()) return; // konten tetap terlihat tanpa animasi

    const items = Array.from(
      el.querySelectorAll<HTMLElement>("[data-reveal-item]")
    );
    const targets = items.length ? items : [el];

    const tween = gsap.fromTo(
      targets,
      { autoAlpha: 0, y },
      {
        autoAlpha: 1,
        y: 0,
        duration,
        ease,
        stagger,
        paused: true,
        overwrite: "auto",
      }
    );

    const play = () => tween.play();

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once,
      onEnter: play,
      onLeaveBack: () => {
        if (!once) tween.pause();
      },
    });

    if (ScrollTrigger.isInViewport(el)) {
      requestAnimationFrame(play);
    }

    return () => {
      trigger.kill();
      tween.kill();
    };
  }, [start, y, duration, ease, stagger, once]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
