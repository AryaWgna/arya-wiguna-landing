"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/providers";

type BlueprintNode = {
  id: string;
  x: number;
  y: number;
  title: string;
  sub: string;
  refLabel: string;
  note: { en: string; id: string };
};

type BlueprintEdge = {
  from: string;
  to: string;
  d: string;
};

type BlueprintSystem = {
  id: string;
  code: string;
  tab: string;
  slug: string;
  context: { en: string; id: string };
  stack: string[];
  defaultNode: string;
  nodes: BlueprintNode[];
  edges: BlueprintEdge[];
};

const NODE_W = 114;
const NODE_H = 46;

const SYSTEMS: BlueprintSystem[] = [
  {
    id: "simaru",
    code: "01",
    tab: "SIMARU",
    slug: "simaru-mobile-app",
    context: {
      en: "RS UMMI Bogor · Medical Asset Mobile App",
      id: "RS UMMI Bogor · Aplikasi Aset Medis",
    },
    stack: ["Flutter", "Dart", "FCM", "REST API"],
    defaultNode: "hub",
    nodes: [
      {
        id: "scanner",
        x: 6,
        y: 40,
        title: "QR Scanner",
        sub: "mobile_scanner",
        refLabel: "lib/controllers/scan/stockopname_controller.dart",
        note: {
          en: "Reads equipment QR labels via camera and scopes audits by hospital building and room.",
          id: "Memindai label QR alat medis via kamera dengan cakupan audit per gedung dan ruangan.",
        },
      },
      {
        id: "keystore",
        x: 6,
        y: 130,
        title: "Secure Store",
        sub: "flutter_secure",
        refLabel: "flutter_secure_storage ^9.0.0",
        note: {
          en: "Persists encrypted Bearer session tokens in Android Keystore / iOS Keychain.",
          id: "Menyimpan token sesi Bearer terenkripsi di Android Keystore / iOS Keychain.",
        },
      },
      {
        id: "hub",
        x: 141,
        y: 85,
        title: "Flutter State",
        sub: "Provider · State",
        refLabel: "lib/core/config/api_config.dart",
        note: {
          en: "Coordinates asset lookup, stock opname state, damage reports, and depreciation summaries.",
          id: "Mengatur state pencarian aset, stock opname, laporan kerusakan, dan ringkasan penyusutan.",
        },
      },
      {
        id: "api",
        x: 276,
        y: 40,
        title: "SIMARU API",
        sub: "REST · Bearer",
        refLabel: "/api/assets · /api/complaints",
        note: {
          en: "Hospital backend endpoints handling asset records, room stock audits, and photo uploads.",
          id: "Endpoint backend rumah sakit untuk data inventaris, audit ruangan, dan unggah foto keluhan.",
        },
      },
      {
        id: "fcm",
        x: 276,
        y: 130,
        title: "Firebase FCM",
        sub: "Token Sync",
        refLabel: "lib/services/firebase/fcm_token_manager.dart",
        note: {
          en: "Registers and refreshes device push tokens via POST /api/notifications/fcm-token.",
          id: "Mendaftarkan dan memperbarui token push perangkat lewat POST /api/notifications/fcm-token.",
        },
      },
    ],
    edges: [
      { from: "scanner", to: "hub", d: "M 120 63 H 130.5 V 101 H 141" },
      { from: "keystore", to: "hub", d: "M 120 153 H 130.5 V 115 H 141" },
      { from: "hub", to: "api", d: "M 255 101 H 265.5 V 63 H 276" },
      { from: "hub", to: "fcm", d: "M 255 115 H 265.5 V 153 H 276" },
    ],
  },
  {
    id: "skyboard",
    code: "02",
    tab: "SKYBOARD",
    slug: "digital-skyboard-announcement",
    context: {
      en: "Airport FIDS · 5 Docker Containers",
      id: "FIDS Bandara · 5 Kontainer Docker",
    },
    stack: ["Next.js 15", "Laravel 11", "MySQL 8", "Nginx"],
    defaultNode: "gateway",
    nodes: [
      {
        id: "gateway",
        x: 6,
        y: 85,
        title: "Nginx :443",
        sub: "gateway-skyboard",
        refLabel: "gateway-skyboard/nginx.conf",
        note: {
          en: "Single TLS entry point routing /, /api/*, and /assets/* across the internal skyboard-net bridge.",
          id: "Pintu masuk TLS tunggal yang meneruskan /, /api/*, dan /assets/* di jaringan internal skyboard-net.",
        },
      },
      {
        id: "ui",
        x: 141,
        y: 14,
        title: "Next.js :3000",
        sub: "ui-skyboard",
        refLabel: "30s poll · boarding chime",
        note: {
          en: "Terminal passenger display polling schedules every 30s with boarding audio chime triggers.",
          id: "Layar jadwal terminal dengan polling tiap 30 detik dan pemicu suara chime saat status boarding.",
        },
      },
      {
        id: "api",
        x: 141,
        y: 85,
        title: "Laravel :8000",
        sub: "api-skyboard",
        refLabel: "routes/api.php · Sanctum",
        note: {
          en: "REST API serving public flight schedules and Sanctum-protected admin status/CRUD updates.",
          id: "REST API penyedia jadwal publik serta pembaruan status/CRUD admin yang dilindungi Sanctum.",
        },
      },
      {
        id: "assets",
        x: 141,
        y: 156,
        title: "Static :80",
        sub: "assets-skyboard",
        refLabel: "10 promo slots · airline logos",
        note: {
          en: "Dedicated Nginx container serving rotating promotional banners and airline media assets.",
          id: "Kontainer Nginx khusus untuk menyajikan 10 banner promosi bergilir dan aset logo maskapai.",
        },
      },
      {
        id: "db",
        x: 276,
        y: 85,
        title: "MySQL :3306",
        sub: "db-skyboard",
        refLabel: "docker-compose.yml · MySQL 8.0",
        note: {
          en: "Relational store for airlines, airports, gates, flight statuses, and operator accounts.",
          id: "Penyimpanan relasional untuk data maskapai, bandara, gate, status penerbangan, dan akun admin.",
        },
      },
    ],
    edges: [
      { from: "gateway", to: "ui", d: "M 120 100 H 130.5 V 37 H 141" },
      { from: "gateway", to: "api", d: "M 120 108 H 141" },
      { from: "gateway", to: "assets", d: "M 120 116 H 130.5 V 179 H 141" },
      { from: "api", to: "db", d: "M 255 108 H 276" },
    ],
  },
  {
    id: "streamely",
    code: "03",
    tab: "STREAMELY",
    slug: "streamely",
    context: {
      en: "Self-Hosted VOD · Bun Proxy & RAM Index",
      id: "VOD Self-Hosted · Proxy Bun & Cache RAM",
    },
    stack: ["Bun", "Elysia.js", "Svelte", "TypeScript"],
    defaultNode: "proxy",
    nodes: [
      {
        id: "tunnel",
        x: 6,
        y: 85,
        title: "CF Tunnel",
        sub: "HTTPS Edge",
        refLabel: "Cloudflare Tunnel -> :8000",
        note: {
          en: "Exposes the self-hosted server over HTTPS without opening inbound router ports.",
          id: "Mengekspos server lokal lewat HTTPS tanpa perlu membuka port masuk pada router.",
        },
      },
      {
        id: "proxy",
        x: 141,
        y: 85,
        title: "Bun :8000",
        sub: "proxy.ts",
        refLabel: "proxy.ts · Bun.serve",
        note: {
          en: "Routes /api/* and / while stripping content-encoding headers to prevent tunnel decode errors.",
          id: "Meneruskan /api/* dan / sembari menghapus header content-encoding agar bebas error dekode.",
        },
      },
      {
        id: "svelte",
        x: 276,
        y: 14,
        title: "Svelte :5173",
        sub: "Jaccard UI",
        refLabel: "Jaccard similarity · 3 gateways",
        note: {
          en: "Computes client-side genre/cast similarity scores and provides 3 fallback embed players.",
          id: "Menghitung kemiripan genre/pemeran di sisi klien dan menyediakan 3 opsi gateway pemutar.",
        },
      },
      {
        id: "elysia",
        x: 276,
        y: 85,
        title: "Elysia :3000",
        sub: "15k+ RAM Map",
        refLabel: "backend/src/index.ts",
        note: {
          en: "Preloads 15,000+ show and movie records into showsDB[] and moviesDB Map in memory.",
          id: "Memuat awal 15.000+ metadata film/serial ke struktur showsDB[] dan Map moviesDB di RAM.",
        },
      },
      {
        id: "sources",
        x: 276,
        y: 156,
        title: "TVmaze · OMDB",
        sub: "2 Upstream APIs",
        refLabel: "Catalog preload + fallback",
        note: {
          en: "Primary catalog ingestion from TVmaze paired with on-demand OMDB title enrichment.",
          id: "Sumber katalog utama dari TVmaze dipadukan dengan pencarian tambahan ke API OMDB.",
        },
      },
    ],
    edges: [
      { from: "tunnel", to: "proxy", d: "M 120 108 H 141" },
      { from: "proxy", to: "svelte", d: "M 255 100 H 265.5 V 37 H 276" },
      { from: "proxy", to: "elysia", d: "M 255 108 H 276" },
      { from: "elysia", to: "sources", d: "M 333 131 V 156" },
    ],
  },
];

export function HeroBlueprint() {
  const { lang } = useLang();
  const isId = lang === "id";
  const [sysIdx, setSysIdx] = useState(0);
  const [selectedBySys, setSelectedBySys] = useState<Record<string, string>>({});

  const sys = SYSTEMS[sysIdx];
  const activeNodeId = selectedBySys[sys.id] ?? sys.defaultNode;
  const activeNode = sys.nodes.find((n) => n.id === activeNodeId) ?? sys.nodes[0];

  const selectNode = (id: string) => {
    setSelectedBySys((prev) => ({ ...prev, [sys.id]: id }));
  };

  return (
    <div className="bento-card flex h-full w-full min-w-0 flex-col justify-between overflow-hidden p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-navy" />
          <span className="font-mono text-xs font-bold tracking-wider uppercase text-foreground">
            {isId ? "Konsol Arsitektur Interaktif" : "Interactive System Blueprint"}
          </span>
        </div>

        <div
          role="tablist"
          aria-label={isId ? "Pilih skema sistem" : "Select system schematic"}
          className="inline-flex rounded-full border border-border-line bg-surface p-1"
        >
          {SYSTEMS.map((item, idx) => {
            const active = idx === sysIdx;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSysIdx(idx)}
                className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold transition-all ${
                  active
                    ? "bg-navy text-background shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.tab}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="relative my-4 overflow-hidden rounded-2xl border border-border-line bg-surface/50 px-2 py-3 sm:px-4"
        style={{
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      >
        <div className="mb-2 flex items-center justify-between px-1 font-mono text-[11px] text-muted">
          <span>{sys.context[lang]}</span>
          <span className="text-navy">
            {isId ? "Klik node untuk inspeksi" : "Hover / click node"}
          </span>
        </div>

        <svg
          viewBox="0 0 396 216"
          className="h-auto w-full select-none"
          role="img"
          aria-label={sys.context[lang]}
        >
          {sys.edges.map((edge) => {
            const highlighted = edge.from === activeNode.id || edge.to === activeNode.id;
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={edge.d}
                  fill="none"
                  stroke={highlighted ? "var(--navy)" : "var(--border)"}
                  strokeWidth={highlighted ? 2 : 1.3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {highlighted ? (
                  <path
                    d={edge.d}
                    fill="none"
                    stroke="var(--foreground)"
                    strokeWidth={2}
                    strokeDasharray="4 6"
                    strokeLinecap="round"
                    className="blueprint-flow-line"
                  />
                ) : null}
              </g>
            );
          })}

          {sys.nodes.map((node) => {
            const isSelected = node.id === activeNode.id;
            const isConnected = sys.edges.some(
              (e) =>
                (e.from === activeNode.id && e.to === node.id) ||
                (e.to === activeNode.id && e.from === node.id)
            );

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => selectNode(node.id)}
                onMouseEnter={() => selectNode(node.id)}
                onFocus={() => selectNode(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectNode(node.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isSelected}
                aria-label={`${node.title} — ${node.sub}`}
                className="cursor-pointer outline-none"
              >
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={10}
                  fill={isSelected ? "var(--navy)" : "var(--background)"}
                  stroke={
                    isSelected
                      ? "var(--navy)"
                      : isConnected
                        ? "var(--navy)"
                        : "var(--border)"
                  }
                  strokeWidth={isSelected ? 1.8 : 1.2}
                />
                <text
                  x={10}
                  y={19}
                  fill={isSelected ? "#000" : "var(--foreground)"}
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {node.title}
                </text>
                <text
                  x={10}
                  y={34}
                  fill={isSelected ? "#000" : "var(--muted)"}
                  fillOpacity={isSelected ? 0.82 : 1}
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "9.5px",
                  }}
                >
                  {node.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border-line bg-surface/65 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-navy/15 px-2 py-0.5 font-mono text-xs font-bold text-navy">
              {activeNode.title}
            </span>
            <code className="truncate font-mono text-[11px] text-muted">
              {activeNode.refLabel}
            </code>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted">
            {activeNode.note[lang].trim()}
          </p>
        </div>

        <Link
          href={`/work/${sys.slug}`}
          className="shrink-0 rounded-full border border-border-line bg-background px-4 py-2 font-mono text-xs font-bold text-foreground transition-colors hover:border-navy hover:text-navy"
        >
          {isId ? "Studi Kasus ↗" : "Case Study ↗"}
        </Link>
      </div>
    </div>
  );
}
