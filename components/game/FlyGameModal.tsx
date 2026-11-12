"use client";

import React, { useEffect } from "react";
import { useFlyGame } from "@/hooks/useFlyGame";

export function FlyGameModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { canvasRef, running, over, score, high, start, stop, setPointerY } =
    useFlyGame();

  useEffect(() => {
    if (!open) {
      stop();
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, stop]);

  if (!open) return null;

  return (
    <div
      className="game-overlay"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="game-panel">
        <div className="game-head">
          <strong>FLY DODGE</strong>
          <button type="button" onClick={onClose} aria-label="Close game">
            ✕
          </button>
        </div>

        <canvas
          ref={canvasRef}
          className="game-canvas"
          onPointerMove={(e) => {
            if (running) setPointerY(e.clientY);
          }}
          onPointerDown={(e) => {
            if (!running) start();
            else setPointerY(e.clientY);
          }}
        />

        <div className="game-hud">
          <span>Score: {score}</span>
          <span>High: {high}</span>
          <span>{running ? "Playing…" : over ? "Game Over" : "Ready"}</span>
        </div>

        <div className="game-actions">
          {running ? (
            <button type="button" onClick={stop}>
              Pause
            </button>
          ) : (
            <button type="button" onClick={start}>
              {over ? "Restart" : "Start"}
            </button>
          )}
        </div>

        {over ? (
          <p className="game-note">
            You dodged for {score} points. Try again!
          </p>
        ) : (
          <p className="game-note">
            Move with mouse / touch / drag. Dodge the bars.
          </p>
        )}
      </div>
    </div>
  );
}
