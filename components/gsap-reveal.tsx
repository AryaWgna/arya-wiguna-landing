"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

type GsapRevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  start?: string;
  y?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
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
    if (!el || isReducedMotion()) return;

    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-item]"));
    const targets = items.length ? items : [el];

    const tween = gsap.fromTo(
      targets,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger,
        paused: true,
        overwrite: "auto",
      }
    );

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      tween.play();
    };

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

    // Fallback in case layout shift prevents ScrollTrigger from firing
    const fallback = window.setTimeout(play, 1500);

    return () => {
      window.clearTimeout(fallback);
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
