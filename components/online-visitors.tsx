"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/providers";

const HEARTBEAT_MS = 12_000;
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

let currentCount: number | null = null;
const listeners = new Set<(n: number | null) => void>();
let timerId: ReturnType<typeof setInterval> | null = null;
let subscriberCount = 0;
let inFlight = false;

async function pingPresence() {
  if (inFlight || typeof document === "undefined" || document.visibilityState === "hidden") {
    return;
  }
  inFlight = true;
  try {
    const res = await fetch(`/api/presence?_ts=${Date.now()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId() }),
      cache: "no-store",
    });
    if (!res.ok) return;
    const data = await res.json();
    if (typeof data?.online === "number") {
      currentCount = data.online;
      listeners.forEach((fn) => fn(currentCount));
    }
  } catch {
  } finally {
    inFlight = false;
  }
}

function onVisibilityOrFocus() {
  if (document.visibilityState === "visible") {
    pingPresence();
  }
}

function subscribe(listener: (n: number | null) => void) {
  listeners.add(listener);
  subscriberCount += 1;

  if (currentCount !== null) {
    listener(currentCount);
  }

  if (subscriberCount === 1 && typeof window !== "undefined") {
    pingPresence();
    timerId = setInterval(pingPresence, HEARTBEAT_MS);
    document.addEventListener("visibilitychange", onVisibilityOrFocus);
    window.addEventListener("focus", onVisibilityOrFocus);
  }

  return () => {
    listeners.delete(listener);
    subscriberCount -= 1;
    if (subscriberCount <= 0) {
      subscriberCount = 0;
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      if (typeof window !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibilityOrFocus);
        window.removeEventListener("focus", onVisibilityOrFocus);
      }
    }
  };
}

export function OnlineVisitors({
  variant = "hero",
}: {
  variant?: "hero" | "footer";
}) {
  const { lang } = useLang();
  const [online, setOnline] = useState<number | null>(currentCount);

  useEffect(() => subscribe(setOnline), []);

  if (online === null || online <= 0) return null;

  const isId = lang === "id";
  const label = isId ? `${online} sedang online` : `${online} online`;
  const tooltip = isId
    ? `${online} pengunjung aktif saat ini`
    : online === 1
      ? "1 active visitor right now"
      : `${online} active visitors right now`;

  const tone =
    variant === "hero"
      ? "border-border-line bg-surface/55 text-foreground/85"
      : "border-border-line/80 bg-transparent text-muted";

  return (
    <span
      role="status"
      aria-label={tooltip}
      title={tooltip}
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 font-mono text-[11px] tabular-nums ${tone}`}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
      />
      <span>{label}</span>
    </span>
  );
}
