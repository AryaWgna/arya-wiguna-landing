"use client";

import { useEffect, useRef } from "react";
import { createMagneticEffect } from "@/lib/gsap";

type MagneticWrapProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: React.ElementType;
};

/**
 * Wraps any child in a magnetic hover effect — the element gently
 * follows the cursor while hovered, snapping back with elastic ease.
 */
export function MagneticWrap({
  children,
  className,
  strength = 0.35,
  as: Tag = "div",
}: MagneticWrapProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return createMagneticEffect(el, strength);
  }, [strength]);

  return (
    <Tag ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </Tag>
  );
}
