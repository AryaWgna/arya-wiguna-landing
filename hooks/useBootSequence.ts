"use client";

import { useEffect, useRef } from "react";
import type { CosmosSimState } from "@/lib/cosmos-sim";
import {
  BOOT_SAFETY_REVEAL_MS,
  FLY_START_TARGET,
  UI_REVEAL_DELAY_MS,
} from "@/lib/config/portfolio";
import { loadImg, makeThumbCanvas } from "@/lib/asset";
import { scheduleIdle } from "@/lib/idle";
import { buildPortraitCells, buildStudioPortraitCanvas } from "@/lib/cosmos-items";
import type { BoxView } from "@/components/vadim-glass-box";

/**
 * Boot sequence: preloads the avatar + flagship pieces, builds the portrait
 * canvas off the hot path, reveals the UI, responds to URL deep-links, and
 * streams the remaining pieces in the background.
 */
export function useBootSequence({
  simRef,
  pieces,
  items,
  onReveal,
  setActiveView,
  onFlyToItem,
}: {
  simRef: React.RefObject<CosmosSimState>;
  pieces: { src: string }[];
  items: { id: string }[];
  onReveal: () => void;
  setActiveView: (v: BoxView) => void;
  onFlyToItem: (itemIdx: number) => void;
}) {
  const disposedRef = useRef(false);

  useEffect(() => {
    disposedRef.current = false;
    const s = simRef.current;
    const disposed = () => disposedRef.current;

    // Safety net: never leave the UI veil up indefinitely, even if loads stall
    const revealTimer = window.setTimeout(onReveal, BOOT_SAFETY_REVEAL_MS);

    // Stage 1: Load avatar + 6 flagship project pieces immediately;
    // Stage 2: Stream remaining 32 pieces in non-blocking idle batches of 4
    s.hiImgs = new Array(pieces.length).fill(null);
    s.thumbs = new Array(pieces.length).fill(null);

    const PRIORITY_COUNT = Math.min(6, pieces.length);

    (async () => {
      const trackBootImg = (src: string, high = false) => loadImg(src, high);

      const avatarPromise = trackBootImg("/assets/avatar.jpg", true);
      const priorityPromises = pieces
        .slice(0, PRIORITY_COUNT)
        .map((p) => trackBootImg(p.src, true));

      const [avatarImg, ...priorityImgs] = await Promise.all([
        avatarPromise,
        ...priorityPromises,
      ]);
      if (disposed()) return;

      priorityImgs.forEach((img, idx) => {
        if (img) {
          s.hiImgs[idx] = img;
          s.thumbs[idx] = makeThumbCanvas(img, s.layout.lowPower);
        }
      });

      if (avatarImg) {
        const img = avatarImg;
        // Build portrait cells & studio canvas off the hot path so the first
        // painted frame isn't delayed by the heavy per-pixel work.
        scheduleIdle(() => {
          if (disposed()) return;
          s.cells = buildPortraitCells(img, pieces.length, s.layout.lowPower);
          s.portraitCanvas = buildStudioPortraitCanvas(img, s.layout.lowPower);
        });
      }
      s.introStart = performance.now();
      s.sigStart = performance.now() + 120;

      // Lift the UI veil a short moment after the home portrait is ready; the
      // signature hand-signing animation continues to draw behind the UI.
      window.setTimeout(onReveal, UI_REVEAL_DELAY_MS);

      // Check URL query params (?open=selected|about|contact|credentials|experience, ?fly=1, ?work=<id>)
      try {
        const params = new URLSearchParams(window.location.search);
        const openParam = params.get("open") as BoxView | null;
        if (
          openParam === "about" ||
          openParam === "contact" ||
          openParam === "selected" ||
          openParam === "credentials" ||
          openParam === "experience"
        ) {
          onReveal();
          window.setTimeout(() => setActiveView(openParam), 250);
        } else if (params.get("fly")) {
          onReveal();
          window.setTimeout(() => {
            s.target = FLY_START_TARGET;
          }, 250);
        } else if (params.get("work")) {
          onReveal();
          const workId = params.get("work");
          const foundIdx = items.findIndex((it) => it.id === workId);
          if (foundIdx >= 0) {
            window.setTimeout(() => onFlyToItem(foundIdx), 250);
          }
        }
      } catch {
        // ignore
      }

      // Stage 2: Stream remaining pieces in background batches without blocking UI
      const BATCH_SIZE = 4;
      for (let i = PRIORITY_COUNT; i < pieces.length; i += BATCH_SIZE) {
        if (disposed()) return;
        await new Promise((r) => window.setTimeout(r, 28));
        if (disposed()) return;
        const batch = pieces.slice(i, i + BATCH_SIZE);
        const loadedBatch = await Promise.all(
          batch.map((p) => loadImg(p.src, false))
        );
        if (disposed()) return;
        loadedBatch.forEach((img, bIdx) => {
          const targetIdx = i + bIdx;
          if (img) {
            s.hiImgs[targetIdx] = img;
            s.thumbs[targetIdx] = makeThumbCanvas(img, s.layout.lowPower);
          }
        });
      }
    })();

    return () => {
      disposedRef.current = true;
      window.clearTimeout(revealTimer);
    };
  }, [simRef, pieces, items, onReveal, setActiveView, onFlyToItem]);
}
