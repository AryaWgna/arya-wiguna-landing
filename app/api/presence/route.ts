import { NextResponse } from "next/server";
import { getPresenceStore } from "@/lib/presence/store";

export const dynamic = "force-dynamic";

const VISITOR_ID_RE = /^[a-zA-Z0-9_-]{8,64}$/;
const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  try {
    const online = await getPresenceStore().countActive();
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
    } catch {}

    if (!VISITOR_ID_RE.test(visitorId)) {
      return NextResponse.json({ error: "invalid visitor id" }, { status: 400 });
    }

    const store = getPresenceStore();
    await store.heartbeat(visitorId);
    const online = await store.countActive();

    return NextResponse.json({ online }, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json({ online: 0 }, { status: 503, headers: NO_STORE_HEADERS });
  }
}
