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
  const count = String(online).padStart(2, "0");
  const label = isId ? "Pengunjung aktif" : "Viewing now";
  const tooltip = isId
    ? `${online} pengunjung sedang mengakses halaman ini`
    : online === 1
      ? "1 visitor currently viewing this site"
      : `${online} visitors currently viewing this site`;

  if (variant === "footer") {
    return (
      <span
        role="status"
        aria-label={tooltip}
        title={tooltip}
        className="inline-flex items-center gap-2 font-mono text-xs tabular-nums text-muted"
      >
        <span aria-hidden="true" className="h-[5px] w-[5px] bg-blue" />
        <span>{label}</span>
        <span aria-hidden="true" className="text-muted/50">/</span>
        <span className="font-semibold text-foreground">{count}</span>
      </span>
    );
  }

  return (
    <span
      role="status"
      aria-label={tooltip}
      title={tooltip}
      className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase tabular-nums text-muted"
    >
      <span
        aria-hidden="true"
        className="hidden h-3 w-px bg-border-line sm:mr-1 sm:inline-block"
      />
      <span aria-hidden="true" className="h-[5px] w-[5px] bg-blue" />
      <span>{label}</span>
      <span aria-hidden="true" className="text-muted/50">/</span>
      <span className="font-semibold text-navy">{count}</span>
    </span>
  );
}

