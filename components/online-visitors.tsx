"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/providers";

/**
 * Counter "orang online" — mengirim heartbeat ke /api/presence secara
 * berkala dan menampilkan jumlah pengunjung unik yang aktif.
 */

const HEARTBEAT_INTERVAL_MS = 30_000;
const POLL_INTERVAL_MS = 15_000;
const STORAGE_KEY = "aw_visitor_id";
const VISITOR_ID_RE = /^[a-zA-Z0-9_-]{8,64}$/;

function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing && VISITOR_ID_RE.test(existing)) return existing;

    const fresh =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

    localStorage.setItem(STORAGE_KEY, fresh);
    return fresh;
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

async function sendHeartbeat(visitorId: string): Promise<number | null> {
  try {
    const res = await fetch("/api/presence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.online === "number" ? data.online : null;
  } catch {
    return null;
  }
}

async function fetchOnline(): Promise<number | null> {
  try {
    const res = await fetch("/api/presence", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.online === "number" ? data.online : null;
  } catch {
    return null;
  }
}

export function OnlineVisitors() {
  const { lang } = useLang();
  const [online, setOnline] = useState<number | null>(null);
  const visitorIdRef = useRef<string | null>(null);

  useEffect(() => {
    const visitorId = getVisitorId();
    visitorIdRef.current = visitorId;

    let alive = true;

    const heartbeat = async () => {
      const n = await sendHeartbeat(visitorId);
      if (alive && n !== null) setOnline(n);
    };
    const poll = async () => {
      const n = await fetchOnline();
      if (alive && n !== null) setOnline(n);
    };

    heartbeat();
    const hbTimer = setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);
    const pollTimer = setInterval(poll, POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") heartbeat();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      alive = false;
      clearInterval(hbTimer);
      clearInterval(pollTimer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  if (online === null || online <= 0) return null;

  const label =
    lang === "id"
      ? online === 1
        ? "1 orang sedang online"
        : `${online} orang sedang online`
      : online === 1
        ? "1 person online right now"
        : `${online} people online right now`;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      {label}
    </span>
  );
}
