import { NextResponse } from "next/server";
import { getPresenceStore } from "@/lib/presence/store";

export const dynamic = "force-dynamic";

const VISITOR_ID_RE = /^[a-zA-Z0-9_-]{8,64}$/;
const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  try {
    const stats = await getPresenceStore().getStats();
    return NextResponse.json(stats, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { online: 1, total: 1 },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  try {
    let visitorId = "";
    let isNewSession = false;
    try {
      const body = await request.json();
      visitorId = typeof body?.visitorId === "string" ? body.visitorId : "";
      isNewSession = Boolean(body?.isNewSession);
    } catch {
      // ignore invalid json
    }

    if (!VISITOR_ID_RE.test(visitorId)) {
      return NextResponse.json(
        { error: "invalid visitor id" },
        { status: 400 }
      );
    }

    const store = getPresenceStore();
    await store.heartbeat(visitorId, isNewSession);
    const stats = await store.getStats();

    return NextResponse.json(stats, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { online: 1, total: 1 },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }
}
