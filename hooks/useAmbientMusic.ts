"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CHORDS = [
  [110, 164.81, 220],
  [98, 146.83, 196],
  [130.81, 196, 261.63],
  [87.31, 130.81, 174.61],
];

/**
 * Optional ambient background music synthesised with the Web Audio API. Never
 * autoplays (browser policy); the toggle is always user-initiated. Preference
 * is persisted locally.
 */
export function useAmbientMusic() {
  // Music is always ON by default (per user request): every visit/refresh
  // starts in an enabled state. The user can mute temporarily, but a refresh
  // returns to ON.
  const [enabled, setEnabled] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const voicesRef = useRef<OscillatorNode[]>([]);
  const intervalRef = useRef<number>(0);
  const unlockedRef = useRef(false);

  const stopEngine = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = 0;
    }
    for (const v of voicesRef.current) {
      try {
        v.stop();
      } catch {
        // ignore
      }
    }
    voicesRef.current = [];
    if (masterRef.current) {
      try {
        masterRef.current.disconnect();
      } catch {
        // ignore
      }
      masterRef.current = null;
    }
  }, []);

  const startEngine = useCallback(() => {
    if (typeof window === "undefined") return;
    let ctx = ctxRef.current;
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      ctxRef.current = ctx;
    }
    if (ctx.state === "suspended") void ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0.12;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    master.connect(filter);
    filter.connect(ctx.destination);
    masterRef.current = master;

    let chordIdx = 0;
    const playChord = () => {
      for (const v of voicesRef.current) {
        try {
          v.stop();
        } catch {
          // ignore
        }
      }
      voicesRef.current = [];
      const freqs = CHORDS[chordIdx % CHORDS.length];
      chordIdx += 1;
      for (const f of freqs) {
        // Every chord voice pairs a soft triangle with a sine one octave up,
        // giving the pad a clearer, more audible character.
        const types: OscillatorType[] = ["triangle", "sine"];
        for (const type of types) {
          const osc = ctx.createOscillator();
          osc.type = type;
          osc.frequency.value = type === "sine" ? f * 2 : f;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, ctx.currentTime);
          g.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.6);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + 4.2);
          osc.connect(g);
          g.connect(master);
          osc.start();
          voicesRef.current.push(osc);
        }
      }
    };
    playChord();
    intervalRef.current = window.setInterval(playChord, 4200);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    return stopEngine;
  }, [stopEngine]);

  useEffect(() => {
    if (!enabled) {
      stopEngine();
      unlockedRef.current = false;
      return;
    }

    // Try to start immediately. In browsers with a high "Media Engagement"
    // index (e.g. returning visitors on Chrome) this succeeds on load. If the
    // AudioContext stays suspended, fall back to starting on the first gesture.
    const attemptStart = () => {
      unlockedRef.current = true;
      startEngine();
    };
    attemptStart();

    const ctx = ctxRef.current;
    if (!ctx || ctx.state === "running") return;

    const unlock = () => {
      const c = ctxRef.current;
      if (c && c.state === "suspended") void c.resume();
      attemptStart();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("mousedown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("mousedown", unlock);
    window.addEventListener("touchstart", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("mousedown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [enabled, startEngine, stopEngine]);

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  return { enabled, toggle };
}
