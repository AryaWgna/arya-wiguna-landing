/**
 * Presence store untuk counter "orang online" di website.
 *
 * - Default: in-memory (cocok untuk dev lokal & hosting single-instance).
 * - Jika variabel lingkungan UPSTASH_REDIS_REST_URL dan
 *   UPSTASH_REDIS_REST_TOKEN tersedia, otomatis memakai Upstash Redis
 *   (direkomendasikan untuk deployment serverless seperti Vercel), sehingga
 *   jumlah online konsisten di semua instance.
 *
 * Tidak ada dependency ekstra: Upstash dipanggil lewat REST API-nya
 * menggunakan `fetch` native Node 18+.
 */

export const DEFAULT_ONLINE_WINDOW_MS = 3 * 60 * 1000; // 3 menit
const HEARTBEAT_TTL_SECONDS = 15 * 60; // 15 menit (refresh TTL kunci)

export interface PresenceStore {
  /** Catat denyut nadi pengunjung (visitorId) pada waktu sekarang. */
  heartbeat(visitorId: string): Promise<void>;
  /** Hitung pengunjung unik yang aktif dalam jendela waktu terakhir. */
  countActive(windowMs?: number): Promise<number>;
}

/* ── In-memory (fallback default) ─────────────────── */

class MemoryPresenceStore implements PresenceStore {
  private lastSeen = new Map<string, number>();

  async heartbeat(visitorId: string): Promise<void> {
    this.lastSeen.set(visitorId, Date.now());
    this.prune();
  }

  async countActive(windowMs = DEFAULT_ONLINE_WINDOW_MS): Promise<number> {
    this.prune();
    const cutoff = Date.now() - windowMs;
    let count = 0;
    for (const ts of this.lastSeen.values()) {
      if (ts >= cutoff) count += 1;
    }
    return count;
  }

  private prune(): void {
    const cutoff = Date.now() - DEFAULT_ONLINE_WINDOW_MS;
    for (const [id, ts] of this.lastSeen) {
      if (ts < cutoff) this.lastSeen.delete(id);
    }
  }
}

/* ── Upstash Redis (REST API) ─────────────────────── */

class UpstashPresenceStore implements PresenceStore {
  private readonly key = "presence:online";

  constructor(
    private readonly url: string,
    private readonly token: string
  ) {}

  private async command(command: unknown[]): Promise<unknown> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Upstash error ${res.status}: ${text}`);
    }
    // Upstash REST membungkus hasil dalam { "result": ... }.
    const data = JSON.parse(text) as { result?: unknown };
    return data?.result;
  }

  async heartbeat(visitorId: string): Promise<void> {
    const now = Date.now();
    // ZSET: member = visitorId, score = timestamp terakhir aktif.
    await this.command(["ZADD", this.key, now, visitorId]);
    // Refresh TTL agar kunci tidak tumbuh tanpa batas.
    await this.command(["EXPIRE", this.key, HEARTBEAT_TTL_SECONDS]);
  }

  async countActive(windowMs = DEFAULT_ONLINE_WINDOW_MS): Promise<number> {
    const cutoff = Date.now() - windowMs;
    // Bersihkan entri kedaluwarsa, lalu hitung yang aktif.
    await this.command(["ZREMRANGEBYSCORE", this.key, 0, cutoff]);
    const result = await this.command(["ZCOUNT", this.key, cutoff, "+inf"]);
    return typeof result === "number" ? result : 0;
  }
}

/* ── Singleton ─────────────────────────────────────── */

let cachedStore: PresenceStore | null = null;

export function getPresenceStore(): PresenceStore {
  if (cachedStore) return cachedStore;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  cachedStore =
    url && token
      ? new UpstashPresenceStore(url, token)
      : new MemoryPresenceStore();

  return cachedStore;
}
