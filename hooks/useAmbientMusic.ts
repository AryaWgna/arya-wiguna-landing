"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "aw-music";
const AUDIO_SRC = "/audio/ambient.wav";

/**
 * Optional ambient background music. Never autoplays (browser policy); the
 * toggle is always user-initiated. Preference is persisted locally.
 */
export function useAmbientMusic() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setEnabled(true);
    } catch {
      // ignore
    }

    const audio = new Audio(AUDIO_SRC);
    audio.loop = true;
    audio.volume = 0.15;
    audio.preload = "none";
    audio.addEventListener("canplaythrough", () => setReady(true));
    audio.addEventListener("error", () => setReady(false));
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (enabled && ready) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
    } catch {
      // ignore
    }
  }, [enabled, ready]);

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  return { enabled, ready, toggle };
}
