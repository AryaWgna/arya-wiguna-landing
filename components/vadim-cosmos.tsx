"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useLang } from "@/components/providers";
import { profile } from "@/lib/data/profile";
import {
  buildCosmosDataset,
  PORTRAIT_CONFIG,
} from "@/lib/cosmos-items";
import { VadimSignature } from "@/components/vadim-signature";
import { VadimGlassBox, type BoxView } from "@/components/vadim-glass-box";
import { useVisitorPresence } from "@/components/online-visitors";
import {
  applyStageFraming,
  computeHeadMask,
  computeSignatureProgress,
  easeInOutCubic,
  fitTextToWidth,
  SIG_DRAW_DURATION,
  smoothstep01,
} from "@/lib/cosmos-render";
import {
  FLY_START_TARGET,
  FLY_STEP,
  LANE,
} from "@/lib/config/portfolio";
import {
  autoContinueAfterLoop,
  beginLoopWrap,
  maxPieceDist as maxPieceDistFor,
} from "@/lib/cosmos-sim";
import { useCosmosSimulation } from "@/hooks/useCosmosSimulation";
import { useBootSequence } from "@/hooks/useBootSequence";
import { useInputHandlers } from "@/hooks/useInputHandlers";
import { useAmbientMusic } from "@/hooks/useAmbientMusic";
import { FlyGameModal } from "@/components/game/FlyGameModal";
import { SocialLinks } from "@/components/vadim-cosmos-parts/SocialLinks";
import {
  buildRenderTiles,
  lanePos,
  type RenderTile,
} from "@/lib/cosmos-render";

export function VadimCosmos() {
  const { lang, setLang } = useLang();
  const isId = lang === "id";
  const visitorStats = useVisitorPresence();

  const { items, pieces } = useMemo(() => buildCosmosDataset(), []);

  // UI state
  const [activeView, setActiveView] = useState<BoxView>("closed");
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clock, setClock] = useState("12:00");
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [nowDisplay, setNowDisplay] = useState({
    num: "001",
    title: items[0]?.title.en ?? "SIMARU",
    sub: items[0]?.subtitle.en ?? "",
    pieceIndex: 0,
  });
  const [seenCount, setSeenCount] = useState(1);

  // Boot-sequence UI gate: keep the topbar/hero hidden for a short moment on
  // load, then fade them in. The animated boot sequence has been removed, but
  // this brief "UI hidden first" behaviour is intentionally preserved.
  const [uiReady, setUiReady] = useState(false);
  const uiReadyRef = useRef(false);
  const revealUi = useCallback(() => {
    if (uiReadyRef.current) return;
    uiReadyRef.current = true;
    setUiReady(true);
  }, []);



  // Refs for DOM & animation loop
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boxRef = useRef<HTMLElement | null>(null);
  const topbarRef = useRef<HTMLElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const hudLabelRef = useRef<HTMLSpanElement | null>(null);

  // Signature refs
  const sigSvgRef = useRef<SVGSVGElement | null>(null);
  const sigStrokeRef = useRef<SVGPathElement | null>(null);
  const sigSoftRef = useRef<SVGPathElement | null>(null);
  const sigTipRef = useRef<SVGPathElement | null>(null);
  const sigGlowRef = useRef<SVGCircleElement | null>(null);

  // Mutable simulation state accessed inside requestAnimationFrame
  const { simRef } = useCosmosSimulation();
  const { enabled: musicOn, toggle: toggleMusic } = useAmbientMusic();
  const [gameOpen, setGameOpen] = useState(false);

  useEffect(() => {
    simRef.current.activeView = activeView;
    simRef.current.layout.dirty = true;
    simRef.current.lastInputAt = performance.now();
    const isBoxed = activeView !== "closed";
    const isSide =
      activeView === "about" ||
      activeView === "contact" ||
      activeView === "credentials" ||
      activeView === "experience";
    document.body.classList.toggle("boxed", isBoxed);
    document.body.classList.toggle("side", isSide);
    // Re-measure box bounds after drawer open/close transition
    const t = window.setTimeout(() => {
      simRef.current.layout.dirty = true;
    }, 350);
    return () => window.clearTimeout(t);
  }, [activeView, simRef]);

  useEffect(() => {
    simRef.current.lang = lang;
    // Update current flybar text when language changes
    const k = Math.max(0, simRef.current.nowK);
    const piece = pieces[k % pieces.length];
    if (piece) {
      const parent = items[piece.itemIndex];
      setNowDisplay({
        num: String((k % pieces.length) + 1).padStart(3, "0"),
        title: parent ? parent.title[lang] : piece.title[lang],
        sub: piece.kind[lang],
        pieceIndex: k % pieces.length,
      });
    }
  }, [lang, items, pieces, simRef]);

  // Live Jakarta/Bogor clock
  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        }).format(new Date());
        setClock(formatted);
      } catch {
        // ignore
      }
    };
    updateClock();
    const timer = window.setInterval(updateClock, 15000);
    return () => window.clearInterval(timer);
  }, []);

  // Lock body scroll on home page (Vadim Carazan 100vh cosmos stage) & force-sync tab favicon
  useEffect(() => {
    document.body.classList.add("vadim-lock");
    try {
      const iconLinks = document.querySelectorAll<HTMLLinkElement>(
        "link[rel*='icon']"
      );
      iconLinks.forEach((lnk) => {
        lnk.href = "/aw-favicon.svg";
        lnk.type = "image/svg+xml";
      });
    } catch {
      // ignore
    }
    return () => {
      document.body.classList.remove("vadim-lock", "away", "far", "boxed", "side");
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(""), 1900);
  }, []);

  const handleOpenItem = useCallback(
    (itemIdx: number, mediaIdx = 0) => {
      const item = items[itemIdx];
      if (!item) return;
      setActiveItemIndex(itemIdx);
      setActiveMediaIndex(mediaIdx);
      setActiveView("project");
      try {
        const u = new URL(window.location.href);
        u.searchParams.set("work", item.id);
        window.history.replaceState(null, "", u);
      } catch {
        // ignore
      }
    },
    [items]
  );

  const handleCloseBox = useCallback(() => {
    setActiveView("closed");
    simRef.current.aimOn = false;
    try {
      const u = new URL(window.location.href);
      u.searchParams.delete("work");
      u.searchParams.delete("open");
      window.history.replaceState(null, "", u);
    } catch {
      // ignore
    }
  }, [simRef]);

  const handleFlyToItem = useCallback(
    (itemIdx: number, mediaIdxOverride?: number) => {
      const pIdx = pieces.findIndex((p) => p.itemIndex === itemIdx);
      if (pIdx < 0) return;
      setMobileMenuOpen(false);
      const q = lanePos(pIdx);
      const depth = Math.min(54, Math.max(38, q.h * 5.0));
      const at = Math.max(0, -q.z - depth);
      const s = simRef.current;
      s.aimTx = q.x;
      s.aimTy = q.y;
      s.aimOn = true;
      s.aimAt = at;
      s.target = at;
      s.pendingOpen = null;
      // Immediately open the full detail drawer so the user sees the content right away
      handleOpenItem(itemIdx, mediaIdxOverride ?? pieces[pIdx].mediaIndex);
    },
    [handleOpenItem, pieces, simRef]
  );

  const handleBackToPortrait = useCallback(() => {
    setMobileMenuOpen(false);
    handleCloseBox();
    const now = performance.now();
    const s = simRef.current;
    s.aimOn = false;
    s.aimTx = 0;
    s.aimTy = 0;
    s.pendingOpen = null;
    s.seenSet = new Set([0]);
    s.nowK = -1;
    s.autoFlyAt = 0;
    setSeenCount(1);
    if (s.dist < 1) {
      s.dist = 0;
      s.target = 0;
      s.rewind = null;
      s.rewindLockUntil = now + 750;
      // Replay 3D halftone convergence & calligraphic signature animation
      s.introStart = now;
      s.sigStart = now + 260;
      return;
    }
    const dur = Math.min(1550, Math.max(850, 650 + Math.sqrt(s.dist) * 20));
    s.rewind = { from: s.dist, t0: now, dur };
    s.rewindLockUntil = now + dur + 650;
    s.target = 0;
  }, [handleCloseBox, simRef]);

  const handleFlyAll = useCallback(() => {
    setMobileMenuOpen(false);
    handleCloseBox();
    const s = simRef.current;
    const maxPieceDist = maxPieceDistFor(pieces.length);
    if (s.dist >= maxPieceDist - 12) {
      // Loop: wrap back to the Home Portrait (signature screen) and hold there
      // until the signature has (re)drawn, then continue flying automatically.
      beginLoopWrap(s, performance.now());
      setSeenCount(1);
      return;
    }
    if (s.dist < FLY_STEP) {
      s.target = FLY_START_TARGET;
    } else {
      s.target = Math.min(maxPieceDist, s.target + FLY_STEP);
    }
  }, [handleCloseBox, pieces.length, simRef]);

  const handleCopyLink = useCallback(() => {
    const item = items[activeItemIndex];
    if (!item) return;
    const url = `${window.location.origin}${window.location.pathname}?work=${item.id}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied(true);
    showToast(isId ? "Tautan disalin" : "Link copied");
    window.setTimeout(() => setCopied(false), 2000);
  }, [activeItemIndex, isId, items, showToast]);

  useBootSequence({
    simRef,
    pieces,
    items,
    onReveal: revealUi,
    setActiveView,
    onFlyToItem: handleFlyToItem,
  });

    useInputHandlers({
    simRef,
    boxRef,
    pieceCount: pieces.length,
    onReveal: revealUi,
    onCloseBox: handleCloseBox,
    setMobileMenuOpen,
    setSeenCount,
  });

    // Main 3D Canvas & Asset Initialization
  useEffect(() => {
    let rafId = 0;
    let disposed = false;
    const s = simRef.current;

    // Measure signature path length and hide it until the hand-signing animation
    // draws it (the boot preloader itself has been removed).
    if (sigStrokeRef.current) {
      try {
        const len = sigStrokeRef.current.getTotalLength();
        s.sigTotalLen = len || 3600;
        sigStrokeRef.current.style.strokeDasharray = `${len} ${len}`;
        sigStrokeRef.current.style.strokeDashoffset = `${len}`;
        if (sigSoftRef.current) {
          sigSoftRef.current.style.strokeDasharray = `${len} ${len}`;
          sigSoftRef.current.style.strokeDashoffset = `${len}`;
        }
        if (sigTipRef.current) {
          sigTipRef.current.style.opacity = "0";
        }
        if (sigGlowRef.current) {
          sigGlowRef.current.style.opacity = "0";
        }
      } catch {
        // ignore
      }
    }

    // Detect device capability for adaptive quality & DPR scaling
    const detectLowPower = () => {
      if (typeof window === "undefined") return false;
      const smallScreen = window.innerWidth <= 860;
      const cores = navigator.hardwareConcurrency || 8;
      const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 8;
      return smallScreen || cores <= 4 || mem <= 4;
    };

    const updateLayoutMetrics = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const lowPower = detectLowPower();
      const maxDpr = lowPower ? 1.25 : 1.75;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

      const topbarBottom = topbarRef.current
        ? topbarRef.current.getBoundingClientRect().bottom + 10
        : H * 0.085;

      let boxRight = Math.min(W * 0.52, 560);
      let boxHeight = H * 0.78;
      if (s.activeView !== "closed" && boxRef.current) {
        const r = boxRef.current.getBoundingClientRect();
        if (r.width > 0) boxRight = r.right;
        if (r.height > 0) boxHeight = r.height;
      }

      let sigLeft = -W * 0.02;
      let sigTop = H * 0.12;
      if (sigSvgRef.current) {
        const sr = sigSvgRef.current.getBoundingClientRect();
        sigLeft = sr.left;
        sigTop = sr.top;
      }

      s.layout = {
        W,
        H,
        dpr,
        lowPower,
        topbarBottom,
        boxRight,
        boxHeight,
        sigLeft,
        sigTop,
        dirty: false,
      };
    };

    updateLayoutMetrics();

    const onResize = () => {
      s.layout.dirty = true;
      s.lastInputAt = performance.now();
    };
    window.addEventListener("resize", onResize, { passive: true });



    let lastTime = performance.now();

    const tick = (now: number) => {
      if (disposed) return;

      // Pause rendering completely when browser tab is hidden
      if (document.hidden) {
        lastTime = now;
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (s.layout.dirty) {
        updateLayoutMetrics();
      }

      const introElapsed = s.introStart >= 0 ? now - s.introStart : 99999;
      const isIntroRunning = introElapsed < 2500;
      const isSigRunning =
        s.sigStart > 0 && now - s.sigStart < 3000 && s.dist <= 8;
      const isCameraMoving =
        Math.abs(s.target - s.dist) > 0.04 ||
        Boolean(s.rewind) ||
        Math.abs(s.mx - s.smx) > 0.003 ||
        Math.abs(s.my - s.smy) > 0.003 ||
        (s.aimOn &&
          (Math.abs(s.aimTx - s.aimX) > 0.05 ||
            Math.abs(s.aimTy - s.aimY) > 0.05));
      const isRecentlyInteractive = now - s.lastInputAt < 1600;

      // Smart Frame Pacing:
      // - When Glass Box is open and camera has settled, throttle background canvas to ~12fps so scrolling inside .box is 100% butter-smooth
      // - When idle at rest on home screen for > 1.6s, step down background halo floaters to ~30fps (or ~24fps on lowPower)
      const frameBudgetMs =
        s.activeView !== "closed" && !isCameraMoving
          ? 80
          : !isIntroRunning &&
              !isSigRunning &&
              !isCameraMoving &&
              !isRecentlyInteractive
            ? s.layout.lowPower
              ? 42
              : 32
            : 0;

      if (frameBudgetMs > 0 && now - s.lastRenderAt < frameBudgetMs) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      s.lastRenderAt = now;

      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const canvas = canvasRef.current;
      if (!canvas) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const { W, H, dpr, lowPower, sigLeft, sigTop } = s.layout;
      const targetCw = Math.round(W * dpr);
      const targetCh = Math.round(H * dpr);
      if (canvas.width !== targetCw || canvas.height !== targetCh) {
        canvas.width = targetCw;
        canvas.height = targetCh;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // 1. Update flight distance & rewind
      const maxPieceDist = maxPieceDistFor(pieces.length);

      if (s.rewind) {
        const t = Math.min(1, (now - s.rewind.t0) / s.rewind.dur);
        const e = easeInOutCubic(t);
        s.dist = s.target = s.rewind.from * (1 - e);
        if (t >= 1) {
          s.rewind = null;
          s.dist = s.target = 0;
          s.aimOn = false;
          s.aimX = 0;
          s.aimY = 0;
          s.aimTx = 0;
          s.aimTy = 0;
        }
      } else {
        s.dist += (s.target - s.dist) * (1 - Math.exp(-dt * 3.4));
        if (Math.abs(s.target - s.dist) < 0.01) s.dist = s.target;
      }

      // Continue the loop after the signature has had time to appear at Home
      autoContinueAfterLoop(s, now);

      s.smx += (s.mx - s.smx) * (1 - Math.exp(-dt * 1.8));
      s.smy += (s.my - s.smy) * (1 - Math.exp(-dt * 1.8));

      const away = Math.min(1, s.dist / 90);
      const ease = smoothstep01(away); // 0 at portrait, 1 in flight

      const isAway = s.dist > 22;
      const isFar = s.dist > 22 && !s.rewind;
      if (isAway !== s.lastAwayClass) {
        s.lastAwayClass = isAway;
        document.body.classList.toggle("away", isAway);
      }
      if (isFar !== s.lastFarClass) {
        s.lastFarClass = isFar;
        document.body.classList.toggle("far", isFar);
      }

      // Check pending open from Selected / About flight
      if (
        s.pendingOpen &&
        (Math.abs(s.dist - s.pendingOpen.at) < 4 ||
          now - s.pendingOpen.t0 > 7000)
      ) {
        const po = s.pendingOpen;
        s.pendingOpen = null;
        handleOpenItem(po.itemIdx, po.mediaIdx);
      }

      // Camera aim & parallax drift
      const drift = 0.55 + ease * 2.4;
      if (
        s.aimOn &&
        !s.pendingOpen &&
        (s.activeView !== "project" || Math.abs(s.dist - s.aimAt) > 14)
      ) {
        s.aimOn = false;
      }
      const ak = 1 - Math.exp(-dt * (s.aimOn ? 3.2 : 2.0));
      s.aimX += ((s.aimOn ? s.aimTx : 0) - s.aimX) * ak;
      s.aimY += ((s.aimOn ? s.aimTy : 0) - s.aimY) * ak;

      const camX = s.smx * drift + s.aimX;
      const camY = -s.smy * drift + s.aimY;
      const camZ = -s.dist;

      // 2. Stage framing (uses cached layout metrics — zero getBoundingClientRect() in RAF!)
      const { focal, portraitWorldW, portraitWorldH, D0 } = applyStageFraming(
        s,
        s.layout,
        dt
      );
      const { cols, rows, cellW, cellH } = PORTRAIT_CONFIG;

      // 3. Signature hand-signing animation & head mask (dirty-checked CSS vars).
      // The boot preloader is removed, but this signing animation is retained.
      if (sigStrokeRef.current && sigSvgRef.current) {
        const L = s.sigTotalLen;
        if (s.dist > 8) {
          // User flew away during boot — reveal the UI immediately
          revealUi();
          if (!s.sigWasAway) {
            s.sigWasAway = true;
            sigStrokeRef.current.style.strokeDashoffset = `${L}`;
            if (sigSoftRef.current) {
              sigSoftRef.current.style.strokeDashoffset = `${L}`;
            }
            if (sigTipRef.current) sigTipRef.current.style.opacity = "0";
            if (sigGlowRef.current) sigGlowRef.current.style.opacity = "0";
          }
        } else {
          if (s.sigWasAway) {
            s.sigWasAway = false;
            s.sigStart = now + 320;
          }
          if (s.sigStart > 0) {
            const { rawP, drawn, offset: off, live } = computeSignatureProgress(
              now,
              s.sigStart,
              L
            );
            if (rawP <= 1 && now - s.sigStart <= SIG_DRAW_DURATION + 120) {
              sigStrokeRef.current.style.strokeDashoffset = off;
              if (sigSoftRef.current) {
                sigSoftRef.current.style.strokeDashoffset = off;
              }
              // Signature finished drawing — reveal the UI (idempotent)
              if (rawP >= 1) revealUi();
              if (sigTipRef.current && sigGlowRef.current) {
                sigTipRef.current.style.opacity = live ? "0.6" : "0";
                sigGlowRef.current.style.opacity = live ? "1" : "0";
                if (live && drawn > 1) {
                  const TIP = 64;
                  sigTipRef.current.style.strokeDasharray = `${Math.min(
                    TIP,
                    drawn
                  )} ${L * 2}`;
                  sigTipRef.current.style.strokeDashoffset = (-Math.max(
                    0,
                    drawn - TIP
                  )).toFixed(1);
                  try {
                    const pt = sigStrokeRef.current.getPointAtLength(drawn);
                    sigGlowRef.current.setAttribute("cx", pt.x.toFixed(1));
                    sigGlowRef.current.setAttribute("cy", pt.y.toFixed(1));
                  } catch {
                    // ignore
                  }
                }
              }
            }
          }
          // Soft radial hole in signature around the portrait head (only updated when frame moves)
          const { headX, headY, hrx, hry } = computeHeadMask(
            s.fr,
            focal,
            portraitWorldW,
            portraitWorldH,
            D0,
            sigLeft,
            sigTop
          );
          if (
            Math.abs(headX - s.lastHx) > 0.6 ||
            Math.abs(headY - s.lastHy) > 0.6 ||
            Math.abs(hrx - s.lastHrx) > 0.6
          ) {
            s.lastHx = headX;
            s.lastHy = headY;
            s.lastHrx = hrx;
            s.lastHry = hry;
            sigSvgRef.current.style.setProperty("--hx", `${headX.toFixed(1)}px`);
            sigSvgRef.current.style.setProperty("--hy", `${headY.toFixed(1)}px`);
            sigSvgRef.current.style.setProperty("--hrx", `${hrx.toFixed(1)}px`);
            sigSvgRef.current.style.setProperty("--hry", `${hry.toFixed(1)}px`);
          }
        }
      }

      // 4. Update Flybar "now" piece in the lane
      const nextK = Math.min(
        Math.max(0, pieces.length - 1),
        Math.max(0, Math.ceil((s.dist + 26 - LANE.z0) / LANE.step))
      );
      if (nextK !== s.nowK && pieces.length > 0) {
        s.nowK = nextK;
        const pIdx = nextK % pieces.length;
        const piece = pieces[pIdx];
        const parent = items[piece.itemIndex];
        s.seenSet.add(pIdx);
        setSeenCount(s.seenSet.size);
        setNowDisplay({
          num: String(pIdx + 1).padStart(3, "0"),
          title: parent ? parent.title[s.lang] : piece.title[s.lang],
          sub: piece.kind[s.lang],
          pieceIndex: pIdx,
        });
      }

      // 5. Build visible 3D draw list (Portrait / Stream tiles + Center Lane tiles)
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      // 5. Build visible 3D draw list (Portrait / Stream tiles + Center Lane tiles)
      const renderList = buildRenderTiles({
        s,
        W,
        H,
        lowPower,
        ease,
        introElapsed,
        camX,
        camY,
        camZ,
        focal,
        D0,
        cols,
        rows,
        cellW,
        cellH,
        maxPieceDist,
        pieces,
        now,
      });


      // 6. Fast Batch-Friendly Tile Drawing & Interactive Picking
      const interactiveRects: typeof s.drawnRects = [];
      let newHoverIdx = -1;
      let newHoverWorld: { x: number; y: number; z: number } | null = null;
      let hoveredTile: RenderTile | null = null;

      for (let i = 0; i < renderList.length; i++) {
        const t = renderList[i];
        ctx.globalAlpha = t.alpha;

        const thumb = s.thumbs[t.pieceIdx];
        const hiImg = s.hiImgs[t.pieceIdx];

        if (t.sh < 22) {
          // Fast path for small portrait & stream cells (eliminates 2,200+ roundRect/stroke calls per frame)
          const gap = t.shift > 0.1 ? 0.85 : 0;
          const dw = Math.max(1, t.sw - gap);
          const dh = Math.max(1, t.sh - gap);

          if (t.sh >= 11 && thumb && (!lowPower || t.shift < 0.6)) {
            ctx.drawImage(thumb, t.sx, t.sy, dw, dh);
            if (t.shift > 0.02) {
              ctx.globalAlpha = t.alpha * t.shift;
              ctx.fillStyle = t.rgbStr;
              ctx.fillRect(t.sx, t.sy, dw, dh);
            }
          } else {
            ctx.fillStyle = t.rgbStr;
            ctx.fillRect(t.sx, t.sy, dw, dh);
          }
        } else {
          // Medium & Large 3D cards in flight
          if (t.isLane && t.isCase && t.sh > 48 && t.depth < 240 && !lowPower) {
            const grad = ctx.createRadialGradient(
              t.sx + t.sw / 2,
              t.sy + t.sh / 2,
              t.sh * 0.15,
              t.sx + t.sw / 2,
              t.sy + t.sh / 2,
              t.sh * 1.15
            );
            grad.addColorStop(0, "rgba(255, 248, 238, 0.16)");
            grad.addColorStop(1, "rgba(255, 248, 238, 0)");
            ctx.fillStyle = grad;
            ctx.fillRect(
              t.sx - t.sw * 0.4,
              t.sy - t.sh * 0.4,
              t.sw * 1.8,
              t.sh * 1.8
            );
          }

          if (t.sh > 95 && hiImg) {
            const rad = Math.max(4, t.sh * 0.06);
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(t.sx, t.sy, t.sw, t.sh, rad);
            ctx.clip();
            ctx.drawImage(hiImg, t.sx, t.sy, t.sw, t.sh);
            ctx.restore();
          } else if (thumb) {
            ctx.drawImage(thumb, t.sx, t.sy, t.sw, t.sh);
          } else {
            ctx.fillStyle = t.rgbStr;
            ctx.fillRect(t.sx, t.sy, t.sw, t.sh);
          }

          if (t.shift > 0.02) {
            ctx.globalAlpha = t.alpha * t.shift;
            ctx.fillStyle = t.rgbStr;
            const rad = Math.max(1.5, t.sh * 0.06);
            ctx.beginPath();
            ctx.roundRect(t.sx, t.sy, t.sw, t.sh, rad);
            ctx.fill();
          }
        }

        // Rich Editorial Card Label Overlay directly on close-up 3D cards in flight
        const showCardLabel =
          (t.isLane && t.sh >= 38) || (!t.isLane && ease > 0.42 && t.sh >= 54);
        if (showCardLabel) {
          const piece = pieces[t.pieceIdx];
          const parent = piece ? items[piece.itemIndex] : null;
          if (piece && parent) {
            const rad = Math.max(4, t.sh * 0.06);
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(t.sx, t.sy, t.sw, t.sh, rad);
            ctx.clip();

            // Dark readability gradient at bottom of the 3D card
            const gradH = Math.max(24, t.sh * 0.48);
            const gBot = ctx.createLinearGradient(
              0,
              t.sy + t.sh - gradH,
              0,
              t.sy + t.sh
            );
            gBot.addColorStop(0, "rgba(10, 10, 12, 0)");
            gBot.addColorStop(0.42, "rgba(10, 10, 12, 0.78)");
            gBot.addColorStop(1, "rgba(10, 10, 12, 0.95)");
            ctx.fillStyle = gBot;
            ctx.fillRect(t.sx, t.sy + t.sh - gradH, t.sw, gradH);

            // Top-left category badge pill when card is medium/large
            const padX = Math.max(6, t.sw * 0.055);
            if (t.sh >= 62) {
              const badgeH = Math.min(20, Math.max(13, t.sh * 0.13));
              const badgeFont = Math.min(11, Math.max(8, badgeH * 0.56));
              const isProj = parent.kind === "project";
              const badgeTxt = isProj
                ? s.lang === "id"
                  ? `PROYEK #0${piece.itemIndex + 1}`
                  : `PROJECT #0${piece.itemIndex + 1}`
                : s.lang === "id"
                  ? `SERTIFIKAT #${String(piece.itemIndex - 2).padStart(2, "0")}`
                  : `CERT #${String(piece.itemIndex - 2).padStart(2, "0")}`;

              ctx.font = `600 ${badgeFont.toFixed(1)}px Inter, system-ui, sans-serif`;
              const tw = ctx.measureText(badgeTxt).width;
              const pillW = tw + badgeH * 0.9;
              const bx = t.sx + padX;
              const by = t.sy + padX * 0.85;

              ctx.fillStyle = "rgba(10, 10, 12, 0.84)";
              ctx.beginPath();
              ctx.roundRect(bx, by, pillW, badgeH, badgeH / 2);
              ctx.fill();
              ctx.strokeStyle = "rgba(255,255,255,0.24)";
              ctx.lineWidth = 0.8;
              ctx.stroke();

              ctx.fillStyle = "#ffffff";
              ctx.textBaseline = "middle";
              ctx.fillText(badgeTxt, bx + badgeH * 0.45, by + badgeH / 2 + 0.5);
            }

            // Bottom Title & Subtitle inside the 3D card
            const titleSize = Math.min(15, Math.max(9.5, t.sh * 0.088));
            const subSize = Math.min(11.5, Math.max(8, t.sh * 0.064));
            const maxTextW = Math.max(30, t.sw - padX * 2);

            const measure = (str: string) => ctx.measureText(str).width;

            ctx.textBaseline = "alphabetic";
            const rawTitle = parent.title[s.lang];
            const bottomY = t.sy + t.sh - Math.max(6, t.sh * 0.06);

            if (t.sh >= 68) {
              ctx.font = `500 ${subSize.toFixed(1)}px Inter, system-ui, sans-serif`;
              ctx.fillStyle = "rgba(255,255,255,0.78)";
              const subRaw = `${piece.kind[s.lang]} · ${
                s.lang === "id" ? "Klik untuk detail →" : "Click for details →"
              }`;
              ctx.fillText(
                fitTextToWidth(subRaw, maxTextW, measure),
                t.sx + padX,
                bottomY
              );

              ctx.font = `600 ${titleSize.toFixed(1)}px Inter, system-ui, sans-serif`;
              ctx.fillStyle = "#ffffff";
              ctx.fillText(
                fitTextToWidth(rawTitle, maxTextW, measure),
                t.sx + padX,
                bottomY - subSize * 1.32
              );
            } else {
              ctx.font = `600 ${titleSize.toFixed(1)}px Inter, system-ui, sans-serif`;
              ctx.fillStyle = "#ffffff";
              ctx.fillText(
                fitTextToWidth(rawTitle, maxTextW, measure),
                t.sx + padX,
                bottomY
              );
            }

            ctx.restore();
          }
        }

        // Interactive picking for ALL visible tiles (t.sh >= 7) so portrait & 3D stream tiles are 100% clickable
        if (t.sh >= 7) {
          interactiveRects.push({
            x: t.sx,
            y: t.sy,
            w: t.sw,
            h: t.sh,
            pieceIdx: t.pieceIdx,
            wx: t.wx,
            wy: t.wy,
            wz: t.wz,
          });
          const isHovered =
            s.pointerX >= t.sx &&
            s.pointerX <= t.sx + t.sw &&
            s.pointerY >= t.sy &&
            s.pointerY <= t.sy + t.sh;
          if (isHovered) {
            newHoverIdx = t.pieceIdx;
            newHoverWorld = { x: t.wx, y: t.wy, z: t.wz };
            hoveredTile = t;
          }
          if (isHovered || (t.isLane && t.sh > 38)) {
            ctx.globalAlpha = t.alpha * (isHovered ? 0.98 : 0.32);
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = isHovered ? 1.8 : 1;
            const rad = Math.max(2, t.sh * 0.06);
            ctx.beginPath();
            ctx.roundRect(t.sx, t.sy, t.sw, t.sh, rad);
            ctx.stroke();
          }
        }
      }

      // 6B. High-Definition Micro-Halftone Studio Portrait Clarity Layer (at rest, dissolves smoothly on flight)
      const introP =
        s.introStart >= 0
          ? Math.min(1, Math.max(0, (introElapsed - 220) / 950))
          : 0;
      if (ease < 0.88 && s.portraitCanvas && introP > 0.01) {
        const scale0 = focal / Math.max(20, D0 - camZ);
        const bustW = portraitWorldW * scale0;
        const bustH = portraitWorldH * scale0;
        const bustX = s.fr.cx - camX * scale0 - bustW / 2;
        const bustY = s.fr.cy + camY * scale0 - bustH / 2;
        ctx.save();
        ctx.globalAlpha = Math.pow(1 - ease, 1.45) * introP * 0.86;
        ctx.drawImage(s.portraitCanvas, bustX, bustY, bustW, bustH);
        ctx.restore();
      }

      if (hoveredTile) {
        ctx.save();
        ctx.globalAlpha = 0.95;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.8;
        const rad = Math.max(2, hoveredTile.sh * 0.06);
        ctx.beginPath();
        ctx.roundRect(
          hoveredTile.sx,
          hoveredTile.sy,
          hoveredTile.sw,
          hoveredTile.sh,
          rad
        );
        ctx.stroke();
        ctx.restore();
      }

      s.drawnRects = interactiveRects;
      s.hoverPieceIdx = newHoverIdx;
      s.hoverWorldPos = newHoverWorld;

      // Update cursor & floating HUD pill (dirty-checked)
      const isHot = newHoverIdx >= 0;
      if (isHot !== s.lastHotClass) {
        s.lastHotClass = isHot;
        canvas.classList.toggle("hot", isHot);
      }
      if (hudRef.current && hudLabelRef.current) {
        if (isHot) {
          if (newHoverIdx !== s.lastHudPieceIdx) {
            s.lastHudPieceIdx = newHoverIdx;
            const piece = pieces[newHoverIdx];
            const parent = items[piece.itemIndex];
            const actionHint =
              s.lang === "id"
                ? "Klik untuk lihat isi →"
                : "Click to view content →";
            hudLabelRef.current.textContent = `${
              parent ? parent.title[s.lang] : piece.title[s.lang]
            }  ·  ${piece.kind[s.lang]}  (${actionHint})`;
          }
          hudRef.current.hidden = false;
          hudRef.current.style.left = `${s.pointerX}px`;
          hudRef.current.style.top = `${s.pointerY}px`;
        } else if (s.lastHudPieceIdx !== -1) {
          s.lastHudPieceIdx = -1;
          hudRef.current.hidden = true;
        }
      }

      ctx.restore();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
    };
  }, [handleFlyToItem, handleOpenItem, items, pieces, revealUi, simRef]);


  const handleCanvasClick = () => {
    revealUi();
    const s = simRef.current;
    if (s.hoverPieceIdx >= 0) {
      const piece = pieces[s.hoverPieceIdx];
      if (!piece) return;
      if (s.hoverWorldPos) {
        const depth = Math.max(42, -s.hoverWorldPos.z - s.dist);
        const at = Math.max(0, -s.hoverWorldPos.z - Math.min(60, depth));
        s.aimTx = s.hoverWorldPos.x;
        s.aimTy = s.hoverWorldPos.y;
        s.aimOn = true;
        s.aimAt = at;
        s.target = at;
      }
      handleOpenItem(piece.itemIndex, piece.mediaIndex);
    } else if (s.activeView !== "closed") {
      handleCloseBox();
    }
  };

  const toggleSideView = (view: BoxView) => {
    setMobileMenuOpen(false);
    if (activeView === view) {
      handleCloseBox();
    } else {
      setActiveView(view);
    }
  };

  return (
    <>
      {/* 1. Handwritten Liquid-Ink Signature Behind the Portrait */}
      <VadimSignature
        svgRef={sigSvgRef}
        strokeRef={sigStrokeRef}
        softRef={sigSoftRef}
        tipRef={sigTipRef}
        glowRef={sigGlowRef}
      />

      {/* 2. 3D Halftone Portrait Mosaic & Infinite Work Lane Canvas */}
      <canvas
        ref={canvasRef}
        id="c"
        aria-hidden="true"
        onClick={handleCanvasClick}
      />

      {/* 3. Top Row: Symbol + Labelled Facts (.topbar) */}
      <header ref={topbarRef} className={`topbar boot-ui${uiReady ? " on" : ""}`}>
        <a
          className="mark"
          href="#home"
          id="home"
          aria-label="Arya Wiguna, home"
          onClick={(e) => {
            e.preventDefault();
            handleBackToPortrait();
          }}
        >
          <svg
            className="logo"
            viewBox="0 0 88 74"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 66L31 10L47 48L62 12L80 66"
              stroke="#ffffff"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 47H42"
              stroke="#ffffff"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </svg>
        </a>

        <div
          className="col col-go"
          title="About"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) return;
            toggleSideView("about");
          }}
        >
          <span className="k">{isId ? "Saat ini:" : "Currently:"}</span>
          <span className="v">
            Full-Stack &amp; Flutter Engineer,{" "}
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              S.Kom (3.77 GPA)
            </a>
          </span>
        </div>

        <div
          className="col col-place col-go"
          title={
            visitorStats
              ? isId
                ? `${visitorStats.online} pengunjung aktif saat ini · ${visitorStats.total} total kunjungan`
                : `${visitorStats.online} active visitor(s) now · ${visitorStats.total} total visits`
              : "About"
          }
          onClick={() => toggleSideView("about")}
        >
          <span className="k">
            {isId ? "Domisili & Pengunjung:" : "Based in & Visitors:"}
          </span>
          <span className="v">
            Bogor, ID (<time className="clock">{clock}</time>)
            {visitorStats ? (
              <>
                {" · "}
                <span style={{ color: "rgba(242, 242, 242, 0.85)" }}>
                  {visitorStats.online} {isId ? "aktif" : "live"} /{" "}
                  {visitorStats.total} {isId ? "kunjungan" : "visits"}
                </span>
              </>
            ) : null}
          </span>
        </div>

        <div className="col col-nav">
          <span className="k">{isId ? "Navigasi:" : "Navigation:"}</span>
          <span className="v">
            <button
              type="button"
              id="selected-open"
              aria-current={activeView === "selected" ? "true" : undefined}
              onClick={() => toggleSideView("selected")}
            >
              {isId ? "Proyek" : "Selected"}
            </button>
            ,{" "}
            <button type="button" id="work-open" onClick={handleFlyAll}>
              {isId ? "Karya 3D" : "Work"}
            </button>
            ,{" "}
            <button
              type="button"
              id="exp-open"
              aria-current={activeView === "experience" ? "true" : undefined}
              onClick={() => toggleSideView("experience")}
            >
              {isId ? "Pengalaman" : "Experience"}
            </button>
            ,{" "}
            <button
              type="button"
              id="certs-open"
              aria-current={activeView === "credentials" ? "true" : undefined}
              onClick={() => toggleSideView("credentials")}
            >
              {isId ? "Sertifikasi (21)" : "Credentials"}
            </button>
            ,{" "}
            <button
              type="button"
              id="about-open"
              aria-current={activeView === "about" ? "true" : undefined}
              onClick={() => toggleSideView("about")}
            >
              {isId ? "Tentang" : "About"}
            </button>
            ,{" "}
            <button
              type="button"
              id="contact-open"
              aria-current={activeView === "contact" ? "true" : undefined}
              onClick={() => toggleSideView("contact")}
            >
              {isId ? "Kontak" : "Contact"}
            </button>{" "}
            ·{" "}
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "id" : "en")}
              aria-label="Toggle language"
            >
              {lang === "en" ? "ID" : "EN"}
            </button>
          </span>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            onClick={toggleMusic}
            title={musicOn ? "Mute music" : "Play ambient music"}
            aria-label={musicOn ? "Mute ambient music" : "Play ambient music"}
            aria-pressed={musicOn}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              {musicOn ? (
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              ) : (
                <path d="M16 9l6 6M22 9l-6 6" />
              )}
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setGameOpen(true)}
            title="Play demo game"
            aria-label="Play demo game"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 9h12M6 15h12M4 7l2 10M20 7l-2 10" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="menu-btn"
          id="menu-btn"
          aria-expanded={mobileMenuOpen}
          aria-controls="mnav"
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          <span>
            {mobileMenuOpen
              ? isId
                ? "Tutup"
                : "Close"
              : "Menu"}
          </span>
          <i aria-hidden="true" />
        </button>
      </header>

      {/* Mobile Navigation Sheet (.mnav) */}
      <div className={`mnav${mobileMenuOpen ? " open" : ""}`} id="mnav">
        <nav className="mnav-links">
          <button type="button" onClick={() => toggleSideView("selected")}>
            {isId ? "Karya pilihan" : "Selected work"}
          </button>
          <button type="button" onClick={handleFlyAll}>
            {isId ? "Jelajahi 3D" : "Work"}
          </button>
          <button type="button" onClick={() => toggleSideView("experience")}>
            {isId ? "Pengalaman & Studi" : "Experience"}
          </button>
          <button type="button" onClick={() => toggleSideView("credentials")}>
            {isId ? "Sertifikasi (21)" : "Credentials (21)"}
          </button>
          <button type="button" onClick={() => toggleSideView("about")}>
            {isId ? "Tentang & CV" : "About & CV"}
          </button>
          <button type="button" onClick={() => toggleSideView("contact")}>
            {isId ? "Kontak" : "Contact"}
          </button>
        </nav>
        <button
          type="button"
          onClick={toggleMusic}
          style={{
            alignSelf: "flex-start",
            fontSize: 12,
            color: "var(--mute)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            marginBottom: 8,
          }}
        >
          {musicOn
            ? isId
              ? "Matikan musik"
              : "Mute music"
            : isId
              ? "Putar musik ambient"
              : "Play ambient music"}
        </button>
        <button
          type="button"
          onClick={() => setGameOpen(true)}
          style={{
            alignSelf: "flex-start",
            fontSize: 12,
            color: "var(--mute)",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            marginBottom: 8,
          }}
        >
          {isId ? "Mainkan demo game" : "Play demo game"}
        </button>
        <p className="mnav-lead">
          {isId
            ? "Aplikasi mobile Flutter produksi, sistem multi-kontainer Next.js & Laravel, serta 21 sertifikasi kompetensi resmi. Gulir untuk terbang menjelajahi karya."
            : "Production Flutter mobile apps, multi-container Next.js & Laravel architectures, and 21 verified engineering credentials. Scroll to fly through the work."}
        </p>
        <div className="mnav-facts">
          <div>
            <span className="k">{isId ? "Saat ini:" : "Currently:"}</span>
            <span className="v">Full-Stack &amp; Flutter Engineer</span>
          </div>
          <div>
            <span className="k">{isId ? "Domisili:" : "Based in:"}</span>
            <span className="v">
              Bogor, ID (<time className="clock">{clock}</time>)
            </span>
          </div>
          {visitorStats ? (
            <div style={{ gridColumn: "1 / -1" }}>
              <span className="k">{isId ? "Pengunjung:" : "Visitors:"}</span>
              <span className="v">
                {visitorStats.online} {isId ? "sedang aktif" : "live now"} ·{" "}
                {visitorStats.total} {isId ? "total kunjungan" : "total visits"}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* 4. Bottom Right Social Links while About/Contact/Credentials is Open (.social) */}
      <SocialLinks isId={isId} />

      {/* 6. Bottom HUD While Flying (.flybar) */}
      <div className="flybar">
        <button
          className="now"
          id="now"
          type="button"
          aria-live="polite"
          onClick={() => {
            const p = pieces[nowDisplay.pieceIndex];
            if (p) handleOpenItem(p.itemIndex, p.mediaIndex);
          }}
        >
          <span className="now-i" id="now-i">
            {nowDisplay.num}
          </span>
          <span className="now-txt">
            <span className="now-t" id="now-t">
              {nowDisplay.title}
            </span>
            <span className="now-s" id="now-s">
              {nowDisplay.sub} ·{" "}
              <strong style={{ color: "#ffffff", fontWeight: 500 }}>
                {nowDisplay.pieceIndex >= pieces.length - 1
                  ? isId
                    ? "Akhir tur 3D — gulir lagi untuk kembali ke beranda ↺"
                    : "End of 3D tour — scroll once more to return home ↺"
                  : isId
                    ? "Klik untuk buka isi lengkap →"
                    : "Click to open full content →"}
              </strong>
            </span>
          </span>
        </button>

        <div className="flyright">
          <button
            type="button"
            className="back-link"
            onClick={() => {
              const p = pieces[nowDisplay.pieceIndex];
              if (p) handleOpenItem(p.itemIndex, p.mediaIndex);
            }}
            style={{ background: "rgba(242, 242, 242, 0.08)", borderColor: "rgba(242, 242, 242, 0.28)", color: "#ffffff" }}
          >
            <span>{isId ? "Buka Detail Item Ini ↗" : "Open Item Details ↗"}</span>
          </button>
          <button
            type="button"
            className="back-link"
            onClick={() => toggleSideView("selected")}
          >
            <span>{isId ? "Daftar Proyek (3)" : "All Projects (3)"}</span>
          </button>
          <span id="seen">
            {seenCount} {isId ? "dari" : "of"} {pieces.length}{" "}
            {isId ? "dilihat" : "seen"}
          </span>
          <button id="back" type="button" onClick={handleBackToPortrait}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M3.5 6.5A5 5 0 1 1 3 9.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M3.2 2.8v3.9h3.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isId ? "Kembali ke beranda" : "Back to home"}
          </button>
        </div>
      </div>

      {/* 7. Left Frosted Glass Box (.box) */}
      <FlyGameModal open={gameOpen} onClose={() => setGameOpen(false)} />

      <VadimGlassBox
        boxRef={boxRef}
        activeView={activeView}
        lang={lang}
        activeItem={items[activeItemIndex] ?? null}
        activeMediaIndex={activeMediaIndex}
        items={items}
        totalPieces={pieces.length}
        visitorStats={visitorStats}
        onClose={handleCloseBox}
        onChangeView={setActiveView}
        onFlyToItem={handleFlyToItem}
        onFlyAll={handleFlyAll}
        onCopyLink={handleCopyLink}
        copied={copied}
      />

      {/* 8. Floating Pointer HUD & Copy Toast */}
      <div ref={hudRef} className="hud" id="hud" hidden>
        <span ref={hudLabelRef} id="hud-label" />
      </div>

      <div className={`copy-toast${toastMsg ? " on" : ""}`}>{toastMsg}</div>
    </>
  );
}
