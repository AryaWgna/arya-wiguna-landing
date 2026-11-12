"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, isReducedMotion, scrollToHash } from "@/lib/gsap";

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || isReducedMotion()) return;

    // The home page has its own boot reveal (.boot-ui); applying another GSAP
    // fade on top causes a double-fade "jerk" on refresh. Other pages keep it.
    if (pathname !== "/") {
      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
      scrollToHash(window.location.hash);
      return () => {
        tween.kill();
      };
    }

    scrollToHash(window.location.hash);
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
