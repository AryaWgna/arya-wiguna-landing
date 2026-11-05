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

const NODE_W = 112;
const NODE_H = 44;

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
        x: 14,
        y: 42,
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
        x: 14,
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
        x: 164,
        y: 86,
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
        x: 314,
        y: 42,
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
        x: 314,
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
      { from: "scanner", to: "hub", d: "M 126 64 H 145 V 102 H 164" },
      { from: "keystore", to: "hub", d: "M 126 152 H 145 V 114 H 164" },
      { from: "hub", to: "api", d: "M 276 102 H 295 V 64 H 314" },
      { from: "hub", to: "fcm", d: "M 276 114 H 295 V 152 H 314" },
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
        x: 14,
        y: 86,
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
        x: 164,
        y: 16,
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
        x: 164,
        y: 86,
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
        x: 164,
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
        x: 314,
        y: 86,
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
      { from: "gateway", to: "ui", d: "M 126 100 H 145 V 38 H 164" },
      { from: "gateway", to: "api", d: "M 126 108 H 164" },
      { from: "gateway", to: "assets", d: "M 126 116 H 145 V 178 H 164" },
      { from: "api", to: "db", d: "M 276 108 H 314" },
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
        x: 14,
        y: 86,
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
        x: 164,
        y: 86,
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
        x: 314,
        y: 16,
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
        x: 314,
        y: 86,
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
        x: 314,
        y: 156,
        title: "TVmaze · OMDB",
        sub: "2 Upstream APIs",
        refLabel: "Catalog preload + fallback",
        note: {
          en: "Primary catalog ingestion from TVmaze paired with on-demand OMDB title enrichment.",
          id: " Sumber katalog utama dari TVmaze dipadukan dengan pencarian tambahan ke API OMDB.",
        },
      },
    ],
    edges: [
      { from: "tunnel", to: "proxy", d: "M 126 108 H 164" },
      { from: "proxy", to: "svelte", d: "M 276 100 H 295 V 38 H 314" },
      { from: "proxy", to: "elysia", d: "M 276 108 H 314" },
      { from: "elysia", to: "sources", d: "M 370 130 V 156" },
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
    <div className="w-full overflow-hidden rounded-2xl border border-border-line bg-background shadow-sm">
      <div className="flex items-center justify-between border-b border-border-line bg-surface/45 px-4 py-2.5">
        <span className="font-mono text-[10px] font-semibold tracking-[0.12em] uppercase text-muted">
          {isId ? "Skema Arsitektur Proyek" : "Project Architecture Index"}
        </span>
        <span className="font-mono text-[10px] text-muted">
          {sys.code} / 0{SYSTEMS.length}
        </span>
      </div>

      <div
        role="tablist"
        aria-label={isId ? "Pilih skema sistem" : "Select system schematic"}
        className="grid grid-cols-3 border-b border-border-line bg-surface/20"
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
              className={`border-b-2 px-3 py-2.5 text-left font-mono text-[11px] transition-colors ${
                active
                  ? "border-navy bg-background font-semibold text-foreground"
                  : "border-transparent text-muted hover:bg-background/60 hover:text-foreground"
              }`}
            >
              <span className={active ? "text-blue" : "text-muted/80"}>{item.code}</span>{" "}
              <span>{item.tab}</span>
            </button>
          );
        })}
      </div>

      <div className="px-4 pt-3 pb-1">
        <p className="font-mono text-[11px] text-muted">{sys.context[lang]}</p>
      </div>

      <div
        className="relative mx-3 my-2 overflow-hidden rounded-xl border border-border-line/80 bg-surface/35 px-1.5 py-2"
        style={{
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      >
        <svg
          viewBox="0 0 440 216"
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
                  stroke={highlighted ? "var(--blue)" : "var(--border)"}
                  strokeWidth={highlighted ? 1.8 : 1.25}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {highlighted ? (
                  <path
                    d={edge.d}
                    fill="none"
                    stroke="var(--navy)"
                    strokeWidth={1.8}
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
                  rx={7}
                  fill={isSelected ? "var(--navy)" : "var(--background)"}
                  stroke={
                    isSelected
                      ? "var(--navy)"
                      : isConnected
                        ? "var(--blue)"
                        : "var(--border)"
                  }
                  strokeWidth={isSelected ? 1.6 : 1.2}
                />
                <text
                  x={10}
                  y={18}
                  fill={isSelected ? "var(--background)" : "var(--foreground)"}
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "10.5px",
                    fontWeight: 600,
                  }}
                >
                  {node.title}
                </text>
                <text
                  x={10}
                  y={33}
                  fill={isSelected ? "var(--background)" : "var(--muted)"}
                  fillOpacity={isSelected ? 0.8 : 1}
                  style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: "9.2px",
                  }}
                >
                  {node.sub}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="border-t border-border-line bg-background px-4 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold text-foreground">
            {activeNode.title}
          </span>
          <code className="max-w-full truncate rounded border border-border-line bg-surface/60 px-2 py-0.5 font-mono text-[10px] text-blue">
            {activeNode.refLabel}
          </code>
        </div>
        <p className="mt-1.5 min-h-[2.5rem] text-xs leading-relaxed text-muted">
          {activeNode.note[lang].trim()}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-line bg-surface/35 px-4 py-2.5">
        <div className="flex flex-wrap gap-1.5">
          {sys.stack.map((tech) => (
            <span
              key={tech}
              className="rounded border border-border-line bg-background px-2 py-0.5 font-mono text-[10px] text-muted"
            >
              {tech}
            </span>
          ))}
        </div>

        <Link
          href={`/work/${sys.slug}`}
          className="font-mono text-xs font-semibold text-navy transition-colors hover:text-blue"
        >
          {isId ? "Studi kasus →" : "Case study →"}
        </Link>
      </div>
    </div>
  );
}
