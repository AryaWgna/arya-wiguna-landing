"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/providers";

const HEARTBEAT_MS = 15_000;
const STORAGE_KEY = "aw_visitor_id";
const SESSION_KEY = "aw_session_counted";
const VISITOR_ID_RE = /^[a-zA-Z0-9_-]{8,64}$/;

export type VisitorStats = {
  online: number;
  total: number;
};

function getVisitorSession(): { visitorId: string; isNewSession: boolean } {
  try {
    let visitorId = localStorage.getItem(STORAGE_KEY) || "";
    if (!VISITOR_ID_RE.test(visitorId)) {
      visitorId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
      localStorage.setItem(STORAGE_KEY, visitorId);
    }

    const counted = sessionStorage.getItem(SESSION_KEY);
    const isNewSession = !counted;
    if (isNewSession) {
      sessionStorage.setItem(SESSION_KEY, "1");
    }

    return { visitorId, isNewSession };
  } catch {
    return {
      visitorId: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`,
      isNewSession: false,
    };
  }
}

let currentStats: VisitorStats | null = null;
const listeners = new Set<(s: VisitorStats | null) => void>();
let timerId: ReturnType<typeof setInterval> | null = null;
let subscriberCount = 0;
let inFlight = false;

async function pingPresence() {
  if (
    inFlight ||
    typeof document === "undefined" ||
    document.visibilityState === "hidden"
  ) {
    return;
  }
  inFlight = true;
  try {
    const { visitorId, isNewSession } = getVisitorSession();
    const res = await fetch(`/api/presence?_ts=${Date.now()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId, isNewSession }),
      cache: "no-store",
    });
    if (!res.ok) return;
    const data = await res.json();
    if (typeof data?.online === "number") {
      currentStats = {
        online: Math.max(1, data.online),
        total:
          typeof data?.total === "number"
            ? Math.max(data.online, data.total)
            : Math.max(1, data.online),
      };
      listeners.forEach((fn) => fn(currentStats));
    }
  } catch {
    // ignore network error
  } finally {
    inFlight = false;
  }
}

function onVisibilityOrFocus() {
  if (document.visibilityState === "visible") {
    pingPresence();
  }
}

function subscribe(listener: (s: VisitorStats | null) => void) {
  listeners.add(listener);
  subscriberCount += 1;

  if (currentStats !== null) {
    listener(currentStats);
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

export function useVisitorPresence(): VisitorStats | null {
  const [stats, setStats] = useState<VisitorStats | null>(currentStats);

  useEffect(() => subscribe(setStats), []);

  return stats;
}

export function OnlineVisitors({
  variant = "hero",
}: {
  variant?: "hero" | "footer";
}) {
  const { lang } = useLang();
  const stats = useVisitorPresence();

  if (!stats || stats.online <= 0) return null;

  const isId = lang === "id";
  const count = String(stats.online).padStart(2, "0");
  const totalCount = String(stats.total).padStart(2, "0");
  const label = isId ? "Pengunjung" : "Visitors";
  const tooltip = isId
    ? `${stats.online} pengunjung aktif saat ini · ${stats.total} total kunjungan`
    : `${stats.online} active now · ${stats.total} total visits`;

  if (variant === "footer") {
    return (
      <span
        role="status"
        aria-label={tooltip}
        title={tooltip}
        className="inline-flex items-center gap-2 font-mono text-xs tabular-nums text-muted"
      >
        <span>{label}</span>
        <span aria-hidden="true" className="text-muted/50">
          ·
        </span>
        <span className="font-semibold text-foreground">
          {count} {isId ? "aktif" : "live"} / {totalCount} {isId ? "kunjungan" : "visits"}
        </span>
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
      <span>{label}</span>
      <span aria-hidden="true" className="text-muted/50">
        /
      </span>
      <span className="font-semibold text-navy">
        {count} {isId ? "AKTIF" : "LIVE"} · {totalCount} {isId ? "TOTAL" : "VISITS"}
      </span>
    </span>
  );
}
