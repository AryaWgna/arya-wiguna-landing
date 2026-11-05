export const DEFAULT_ONLINE_WINDOW_MS = 60 * 1000;
const HEARTBEAT_TTL_SECONDS = 10 * 60;

export interface PresenceStore {
  heartbeat(visitorId: string): Promise<void>;
  countActive(windowMs?: number): Promise<number>;
}

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

class UpstashPresenceStore implements PresenceStore {
  private readonly key = "presence:online";

  constructor(
    private readonly url: string,
    private readonly token: string
  ) {}

  private async command(cmd: unknown[]): Promise<unknown> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cmd),
      cache: "no-store",
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Upstash error ${res.status}: ${text}`);
    }
    const data = JSON.parse(text) as { result?: unknown };
    return data?.result;
  }

  async heartbeat(visitorId: string): Promise<void> {
    const now = Date.now();
    await this.command(["ZADD", this.key, now, visitorId]);
    await this.command(["EXPIRE", this.key, HEARTBEAT_TTL_SECONDS]);
  }

  async countActive(windowMs = DEFAULT_ONLINE_WINDOW_MS): Promise<number> {
    const cutoff = Date.now() - windowMs;
    await this.command(["ZREMRANGEBYSCORE", this.key, 0, cutoff]);
    const result = await this.command(["ZCOUNT", this.key, cutoff, "+inf"]);
    return typeof result === "number" ? result : 0;
  }
}

let cachedStore: PresenceStore | null = null;

export function getPresenceStore(): PresenceStore {
  if (cachedStore) return cachedStore;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  cachedStore =
    url && token ? new UpstashPresenceStore(url, token) : new MemoryPresenceStore();

  return cachedStore;
}

