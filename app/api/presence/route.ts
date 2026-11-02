import { NextResponse } from "next/server";
import { getPresenceStore } from "@/lib/presence/store";

/**
 * API presence untuk counter "orang online".
 *
 * - GET  → { online: number } — jumlah pengunjung unik aktif (3 menit terakhir).
 * - POST → { online: number } — menerima heartbeat dari browser (visitorId),
 *          lalu mengembalikan jumlah terkini.
 */

export const dynamic = "force-dynamic"; // jangan di-cache (Vercel/ISR)

const VISITOR_ID_RE = /^[a-zA-Z0-9_-]{8,64}$/;

async function currentOnline(): Promise<number> {
  return getPresenceStore().countActive();
}

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  try {
    const online = await currentOnline();
    return NextResponse.json({ online }, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json({ online: 0 }, { status: 503, headers: NO_STORE_HEADERS });
  }
}

export async function POST(request: Request) {
  try {
    let visitorId = "";
    try {
      const body = await request.json();
      visitorId = typeof body?.visitorId === "string" ? body.visitorId : "";
    } catch {
      // Body kosong / bukan JSON — diabaikan.
    }

    if (!VISITOR_ID_RE.test(visitorId)) {
      return NextResponse.json({ error: "invalid visitor id" }, { status: 400 });
    }

    await getPresenceStore().heartbeat(visitorId);
    return NextResponse.json({ online: await currentOnline() }, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json({ online: 0 }, { status: 503, headers: NO_STORE_HEADERS });
  }
}
