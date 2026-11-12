"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HS_KEY = "aw-fly-highscore";
const W = 760;
const H = 400;
const PLAYER_R = 12;
const PLAYER_X = 70;

type Obstacle = { x: number; y: number; w: number; h: number; passed: boolean };

/**
 * Minimal 3D-flavoured canvas game: dodge obstacles while flying. Pure
 * client-side demo — no external dependencies.
 */
export function useFlyGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef(0);
  const stateRef = useRef({
    y: H / 2,
    targetY: H / 2,
    running: false,
    over: false,
    score: 0,
  });
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(0);

  useEffect(() => {
    try {
      const h = Number(localStorage.getItem(HS_KEY) || 0);
      if (h > 0) setHigh(h);
    } catch {
      // ignore
    }
  }, []);

  const start = useCallback(() => {
    const st = stateRef.current;
    st.running = true;
    st.over = false;
    st.score = 0;
    st.y = H / 2;
    st.targetY = H / 2;
    setOver(false);
    setScore(0);
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    stateRef.current.running = false;
    setRunning(false);
  }, []);

  const setPointerY = useCallback((clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const rel = clientY - rect.top;
    const y = (rel / rect.height) * H;
    stateRef.current.targetY = Math.max(PLAYER_R, Math.min(H - PLAYER_R, y));
  }, []);

  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    let obstacles: Obstacle[] = [];
    let spawnTimer = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const st = stateRef.current;

      st.y += (st.targetY - st.y) * Math.min(1, dt * 9);
      st.score += dt * 60;
      setScore(Math.floor(st.score));

      spawnTimer -= dt;
      const speed = 220 + Math.min(280, st.score * 0.6);
      if (spawnTimer <= 0) {
        spawnTimer = 0.9 + Math.random() * 0.9;
        const gap = 90 + Math.random() * 70;
        const gapY = 60 + Math.random() * (H - gap - 120);
        obstacles.push({ x: W + 20, y: gapY, w: 18, h: gap, passed: false });
      }

      // Move obstacles
      for (const o of obstacles) {
        o.x -= speed * dt;
        if (!o.passed && o.x + o.w < PLAYER_X) {
          o.passed = true;
        }
      }
      obstacles = obstacles.filter((o) => o.x + o.w > -20);

      // Collision (two rect/rect checks: top & bottom blocks)
      const pTop = st.y - PLAYER_R;
      const pBottom = st.y + PLAYER_R;
      let hit = false;
      for (const o of obstacles) {
        const insideX = PLAYER_X + PLAYER_R > o.x && PLAYER_X - PLAYER_R < o.x + o.w;
        const insideGap = pTop > o.y && pBottom < o.y + o.h;
        if (insideX && !insideGap) {
          hit = true;
          break;
        }
      }
      if (hit || st.y <= PLAYER_R || st.y >= H - PLAYER_R) {
        st.over = true;
        st.running = false;
        setOver(true);
        setRunning(false);
        const finalScore = Math.floor(st.score);
        setScore(finalScore);
        setHigh((prev) => {
          const next = Math.max(prev, finalScore);
          try {
            localStorage.setItem(HS_KEY, String(next));
          } catch {
            // ignore
          }
          return next;
        });
        return;
      }

      // Draw
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#0a0a0b";
      ctx.fillRect(0, 0, W, H);

      // player
      ctx.beginPath();
      ctx.arc(PLAYER_X, st.y, PLAYER_R, 0, Math.PI * 2);
      ctx.fillStyle = "#ff5926";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // obstacles
      for (const o of obstacles) {
        ctx.fillStyle = "rgba(242,242,242,0.9)";
        ctx.fillRect(o.x, 0, o.w, o.y);
        ctx.fillRect(o.x, o.y + o.h, o.w, H - (o.y + o.h));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running]);

  return { canvasRef, running, over, score, high, start, stop, setPointerY };
}
