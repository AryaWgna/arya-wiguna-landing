import fs from "node:fs";
import path from "node:path";

export const DEFAULT_ONLINE_WINDOW_MS = 60 * 1000;
const HEARTBEAT_TTL_SECONDS = 10 * 60;

export interface PresenceStats {
  online: number;
  total: number;
}

export interface PresenceStore {
  heartbeat(visitorId: string, isNewSession?: boolean): Promise<void>;
  countActive(windowMs?: number): Promise<number>;
  getStats(windowMs?: number): Promise<PresenceStats>;
}

type PersistedVisitorData = {
  totalVisits: number;
  uniqueIds: string[];
};

const STATS_FILE = path.join(process.cwd(), ".next", "cache", "visitor-stats.json");

function loadPersistedData(): PersistedVisitorData {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, "utf8");
      const parsed = JSON.parse(raw) as Partial<PersistedVisitorData>;
      return {
        totalVisits:
          typeof parsed.totalVisits === "number" && parsed.totalVisits > 0
            ? parsed.totalVisits
            : 1,
        uniqueIds: Array.isArray(parsed.uniqueIds) ? parsed.uniqueIds : [],
      };
    }
  } catch {
    // ignore read errors on read-only filesystems
  }
  return { totalVisits: 1, uniqueIds: [] };
}

function savePersistedData(data: PersistedVisitorData): void {
  try {
    const dir = path.dirname(STATS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      STATS_FILE,
      JSON.stringify({
        totalVisits: data.totalVisits,
        uniqueIds: data.uniqueIds.slice(-2000),
      }),
      "utf8"
    );
  } catch {
    // ignore write errors on read-only filesystems
  }
}

class MemoryPresenceStore implements PresenceStore {
  private lastSeen = new Map<string, number>();
  private uniqueVisitors = new Set<string>();
  private totalVisits = 1;

  constructor() {
    const persisted = loadPersistedData();
    this.totalVisits = persisted.totalVisits;
    for (const id of persisted.uniqueIds) {
      this.uniqueVisitors.add(id);
    }
  }

  async heartbeat(visitorId: string, isNewSession = false): Promise<void> {
    const now = Date.now();
    const prevTs = this.lastSeen.get(visitorId);
    const isFirstEver = !this.uniqueVisitors.has(visitorId);
    const isExpiredSession =
      prevTs !== undefined && now - prevTs > 30 * 60 * 1000;

    this.lastSeen.set(visitorId, now);
    this.uniqueVisitors.add(visitorId);

    if (isFirstEver || isNewSession || isExpiredSession) {
      this.totalVisits = Math.max(
        this.totalVisits + 1,
        this.uniqueVisitors.size
      );
      savePersistedData({
        totalVisits: this.totalVisits,
        uniqueIds: Array.from(this.uniqueVisitors),
      });
    }
    this.prune();
  }

  async countActive(windowMs = DEFAULT_ONLINE_WINDOW_MS): Promise<number> {
    this.prune();
    const cutoff = Date.now() - windowMs;
    let count = 0;
    for (const ts of this.lastSeen.values()) {
      if (ts >= cutoff) count += 1;
    }
    return Math.max(1, count);
  }

  async getStats(windowMs = DEFAULT_ONLINE_WINDOW_MS): Promise<PresenceStats> {
    const online = await this.countActive(windowMs);
    const total = Math.max(online, this.totalVisits, this.uniqueVisitors.size);
    return { online, total };
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
  private readonly totalKey = "presence:total_visits";
  private readonly setKey = "presence:unique_visitors";

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

  async heartbeat(visitorId: string, isNewSession = false): Promise<void> {
    const now = Date.now();
    await this.command(["ZADD", this.key, now, visitorId]);
    await this.command(["EXPIRE", this.key, HEARTBEAT_TTL_SECONDS]);
    const added = await this.command(["SADD", this.setKey, visitorId]);
    if (added === 1 || isNewSession) {
      await this.command(["INCR", this.totalKey]);
    }
  }

  async countActive(windowMs = DEFAULT_ONLINE_WINDOW_MS): Promise<number> {
    const cutoff = Date.now() - windowMs;
    await this.command(["ZREMRANGEBYSCORE", this.key, 0, cutoff]);
    const result = await this.command(["ZCOUNT", this.key, cutoff, "+inf"]);
    return typeof result === "number" ? Math.max(1, result) : 1;
  }

  async getStats(windowMs = DEFAULT_ONLINE_WINDOW_MS): Promise<PresenceStats> {
    const online = await this.countActive(windowMs);
    const totalRaw = await this.command(["GET", this.totalKey]);
    const uniqueRaw = await this.command(["SCARD", this.setKey]);
    const totalNum = Number(totalRaw) || 0;
    const uniqueNum = Number(uniqueRaw) || 0;
    return {
      online,
      total: Math.max(online, totalNum, uniqueNum, 1),
    };
  }
}

const globalForPresence = globalThis as unknown as {
  __awPresenceStore?: PresenceStore;
};

export function getPresenceStore(): PresenceStore {
  if (globalForPresence.__awPresenceStore) {
    return globalForPresence.__awPresenceStore;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  globalForPresence.__awPresenceStore =
    url && token
      ? new UpstashPresenceStore(url, token)
      : new MemoryPresenceStore();

  return globalForPresence.__awPresenceStore;
}
