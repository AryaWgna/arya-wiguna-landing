"use client";

import { useEffect } from "react";
import type { CosmosSimState } from "@/lib/cosmos-sim";
import {
  beginLoopWrap,
  computeFlightTarget,
  maxPieceDist,
  shouldWrapAtEnd,
} from "@/lib/cosmos-sim";
import {
  FLY_END_ZONE,
  FLY_MAX_STEP,
  FLY_SLOW_STEP,
} from "@/lib/config/portfolio";

/**
 * Global input handlers for the 3D fly-through: wheel, mouse move, touch and
 * keyboard. Forwards wheel scrolling to the open glass-box .p-scroll when a
 * side view is active.
 */
export function useInputHandlers({
  simRef,
  boxRef,
  pieceCount,
  onReveal,
  onCloseBox,
  setMobileMenuOpen,
  setSeenCount,
}: {
  simRef: React.RefObject<CosmosSimState>;
  boxRef: React.RefObject<HTMLElement | null>;
  pieceCount: number;
  onReveal: () => void;
  onCloseBox: () => void;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSeenCount: React.Dispatch<React.SetStateAction<number>>;
}) {
  useEffect(() => {
    const s = simRef.current;

    const maxPieceDistValue = maxPieceDist(pieceCount);
    const endReturnDist = maxPieceDistValue + 18;

    const pushFlight = (delta: number) => {
      const now = performance.now();
      s.lastInputAt = now;
      if (s.rewind) {
        // Never abort an active rewind back to the Home Portrait
        return;
      }
      if (now < s.rewindLockUntil) {
        // Hold steady at the Home Portrait while wheel/trackpad momentum settles
        if (delta > 0) {
          s.rewindLockUntil = Math.max(s.rewindLockUntil, now + 260);
        }
        return;
      }
      // User input overrides any scheduled auto-loop continuation
      s.autoFlyAt = 0;

      // Effective speed cap per wheel event (gentler feel)
      let maxStep = FLY_MAX_STEP;
      // Slow down automatically when approaching the end of the lane
      if (delta > 0 && s.dist > maxPieceDistValue - FLY_END_ZONE) {
        maxStep = FLY_SLOW_STEP;
      }

      let nextTarget = computeFlightTarget(s, delta, endReturnDist, maxStep);
      if (shouldWrapAtEnd(delta, nextTarget, endReturnDist, s.dist)) {
        // Loop: wrap back to the Home Portrait (signature screen) and hold
        // until the signature has (re)drawn, then continue flying.
        beginLoopWrap(s, now);
        nextTarget = s.target;
        setSeenCount(1);
      }
      s.target = nextTarget;
    };

    const onWheel = (e: WheelEvent) => {
      // When the CV preview modal is open, let it handle its own scrolling
      if (document.getElementById("cv-preview")) return;
      onReveal();
      s.lastInputAt = performance.now();
      const targetEl = e.target as HTMLElement | null;
      // When the Glass Box is open, NEVER auto-close it on scroll!
      if (s.activeView !== "closed") {
        // Native browser scroll inside .p-scroll
        if (targetEl?.closest(".p-scroll")) {
          return;
        }
        // If cursor is outside .p-scroll (e.g. over .topbar, .v-head, or the right side of the screen),
        // forward wheel scrolling to the active .p-scroll container so content is always easy to read!
        const activeScroll = boxRef.current?.querySelector<HTMLElement>(
          `.v-${s.activeView} .p-scroll`
        );
        if (activeScroll) {
          e.preventDefault();
          activeScroll.scrollBy({ top: e.deltaY, behavior: "auto" });
          return;
        }
        return;
      }
      e.preventDefault();
      pushFlight(e.deltaY * 0.14);
    };

    const onMouseMove = (e: MouseEvent) => {
      s.lastInputAt = performance.now();
      s.mx = (e.clientX / window.innerWidth - 0.5) * 2;
      s.my = (e.clientY / window.innerHeight - 0.5) * 2;
      s.pointerX = e.clientX;
      s.pointerY = e.clientY;
    };

    let touchY: number | null = null;

    const onTouchStart = (e: TouchEvent) => {
      // When the CV preview modal is open, let it handle touches
      if (document.getElementById("cv-preview")) return;
      onReveal();
      s.lastInputAt = performance.now();
      if (
        (e.target as HTMLElement | null)?.closest(
          ".box, .topbar, .mnav, .flybar, .start"
        )
      ) {
        return;
      }
      touchY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      s.lastInputAt = performance.now();
      if (touchY === null) return;
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      if (s.activeView !== "closed") {
        return;
      }
      pushFlight(dy * 0.28);
    };

    const onTouchEnd = () => {
      touchY = null;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // The CV preview modal handles its own Escape key
      if (document.getElementById("cv-preview")) return;
      onReveal();
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        onCloseBox();
      } else if (s.activeView === "closed") {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
          pushFlight(45);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
          pushFlight(-45);
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    simRef,
    boxRef,
    pieceCount,
    onReveal,
    onCloseBox,
    setMobileMenuOpen,
    setSeenCount,
  ]);
}
