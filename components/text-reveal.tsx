"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, splitTextIntoSpans, isReducedMotion } from "@/lib/gsap";

type TextRevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  /** Split mode: "words" splits by word, "chars" splits by character. */
  mode?: "words" | "chars";
  /** ScrollTrigger start position. */
  start?: string;
  duration?: number;
  stagger?: number;
  /** Play once or replay on re-enter. */
  once?: boolean;
  /** Delay before starting. */
  delay?: number;
  /** Use ScrollTrigger (true) or play immediately (false). */
  useScroll?: boolean;
};

/**
 * Premium text reveal — each word/character slides up from behind a
 * masked overflow, creating a cinematic "unmasking" entrance effect.
 */
export function TextReveal({
  children,
  className,
  as: Tag = "div",
  mode = "words",
  start = "top 85%",
  duration = 0.9,
  stagger = 0.04,
  once = true,
  delay = 0,
  useScroll = true,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || isReducedMotion()) return;

    const targets = Array.from(
      el.querySelectorAll<HTMLElement>("[data-text-reveal]")
    );

    const allSpans: HTMLSpanElement[] = [];
    targets.forEach((target) => {
      const spans = splitTextIntoSpans(target, mode);
      allSpans.push(...spans);
    });

    if (allSpans.length === 0) return;

    // Set initial hidden state
    gsap.set(allSpans, { yPercent: 110 });

    const tween = gsap.to(allSpans, {
      yPercent: 0,
      duration,
      stagger,
      ease: "power4.out",
      delay,
      paused: useScroll,
    });

    let trigger: ScrollTrigger | undefined;
    if (useScroll) {
      trigger = ScrollTrigger.create({
        trigger: el,
        start,
        once,
        onEnter: () => tween.play(),
        onLeaveBack: () => {
          if (!once) tween.pause(0);
        },
      });

      if (ScrollTrigger.isInViewport(el)) {
        requestAnimationFrame(() => tween.play());
      }
    }

    return () => {
      trigger?.kill();
      tween.kill();
    };
  }, [mode, start, duration, stagger, once, delay, useScroll]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
