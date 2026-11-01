import type { SVGProps } from "react";

type TechName =
  | "flutter"
  | "dart"
  | "mobile"
  | "ts"
  | "php"
  | "ui"
  | "docker"
  | "svelte"
  | "bun"
  | "firebase"
  | "rest"
  | "laravel"
  | "mysql"
  | "nginx"
  | "nextjs"
  | "sweetalert"
  | "elysia"
  | "tvmaze"
  | "cloudflare"
  | "pm2"
  | "react"
  | "vue"
  | "node"
  | "go"
  | "default";

export function normalizeTech(label: string): TechName {
  const s = label.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
  if (s.includes("flutter")) return "flutter";
  if (s.includes("dart")) return "dart";
  if (s.includes("typescript") || /(^| )ts( |$)/.test(s)) return "ts";
  if (s.includes("php")) return "php";
  if (s.includes("docker")) return "docker";
  if (s.includes("svelte")) return "svelte";
  if (s.includes("bun")) return "bun";
  if (s.includes("firebase") || s.includes("fcm")) return "firebase";
  if (s.includes("rest")) return "rest";
  if (s.includes("laravel")) return "laravel";
  if (s.includes("mysql")) return "mysql";
  if (s.includes("nginx")) return "nginx";
  if (s.includes("next")) return "nextjs";
  if (s.includes("sweetalert")) return "sweetalert";
  if (s.includes("elysia")) return "elysia";
  if (s.includes("tvmaze") || s.includes("omdb") || s.includes("tv")) return "tvmaze";
  if (s.includes("cloudflare") || s.includes("cloud")) return "cloudflare";
  if (s.includes("pm2")) return "pm2";
  if (s.includes("react")) return "react";
  if (s.includes("vue")) return "vue";
  if (s.includes("node")) return "node";
  if (s.includes("go")) return "go";
  if (s.includes("mobile")) return "mobile";
  if (s.includes("ui") || s.includes("layout")) return "ui";
  return "default";
}

const paths: Record<TechName, React.ReactNode> = {
  flutter: (
    <>
      <path d="M3 3l9 9-4.5 4.5L3 12V3z" />
      <path d="M12 12l6 6-3 3h-1.5L12 12z" />
      <path d="M15 15l3 3-4.5 4.5H12l3-3z" />
    </>
  ),
  dart: (
    <>
      <path d="M4 9l8-6 8 6-8 6-8-6z" />
      <path d="M12 3v12" />
      <path d="M4 9v3l8 6 8-6V9" />
    </>
  ),
  mobile: (
    <>
      <rect x="6.5" y="3" width="11" height="18" rx="2.2" />
      <path d="M10 17.5h4" />
    </>
  ),
  ts: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M9 17V12.5M9 12.5v-3a1.5 1.5 0 011.5-1.5H11" />
      <path d="M13 17v-3M13 12.5h3.5" />
    </>
  ),
  php: (
    <>
      <path d="M3 9c2.5 0 3.5 1.5 3.2 3.6-.2 1.7-1.2 2.9-3.2 2.9h1.3l-.5 2H3.2" />
      <path d="M12 9c2.5 0 3.5 1.5 3.2 3.6-.2 1.7-1.2 2.9-3.2 2.9h1.3l-.5 2h-1.3" />
    </>
  ),
  ui: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9h17M8 4.5v4.5" />
    </>
  ),
  docker: (
    <>
      <path d="M3 15.5c0-1.5 1-2.5 2.5-2.5.5-2.5 2-4 4.5-4.5.5 1.5 0 3-1.5 4 1.5 1.5 2.5 1.5 4.5 1.5h7c.3 1.5-.2 3-2 4-1 .5-3 .5-6 .5-3.5 0-7-.1-9-3z" />
      <path d="M6.5 9.5h.01M8.5 8h.01M10 9.5h.01" />
    </>
  ),
  svelte: (
    <>
      <path d="M12 3.5l8 4.6v7.8l-8 4.6-8-4.6V8.1l8-4.6z" />
      <path d="M12 8l5 2.9v5.8L12 19.6l-5-2.9v-5.8l5-2.9z" />
    </>
  ),
  bun: (
    <>
      <path d="M13 2.8l6.5 6.5c2.7 2.7 2.7 7 0 9.7s-7 2.7-9.7 0L3.3 12.5 13 2.8z" />
      <path d="M13 8.5c1.7 1.7 1.7 4.3 0 6-1.7-1.7-1.7-4.3 0-6z" />
    </>
  ),
  firebase: (
    <>
      <path d="M13.5 3.5L12 5.6 8 2.5 5 11.5l2.5-1.5L10 13l2.5-5.5 2 3.5 3-5-4-2.5z" />
      <path d="M5.5 14l6 6.5 7-6.5-2.5-1.5L12 20.5 6 14.5 5.5 14z" />
    </>
  ),
  rest: (
    <>
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />
    </>
  ),
  laravel: (
    <>
      <path d="M4 4h6c4 0 6 2 6 5.5C16 13 14 15 10 15H7.5" />
      <path d="M7.5 15V9.5h2.2" />
      <path d="M7.5 20l6.5-7.5" />
    </>
  ),
  mysql: (
    <>
      <ellipse cx="12" cy="6.5" rx="8" ry="3" />
      <path d="M4 6.5v11c0 1.7 3.6 3 8 3s8-1.3 8-3v-11" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  nginx: (
    <>
      <path d="M12 3l8 4.6v7.8L12 20l-8-4.6V7.6L12 3z" />
      <path d="M8.5 15.5v-7l7 7v-7" />
    </>
  ),
  nextjs: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 16.5v-9l8 9" />
    </>
  ),
  sweetalert: (
    <>
      <path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12 12 3.5z" />
      <path d="M12 8.5v4.5M12 15.2h.01" />
    </>
  ),
  elysia: (
    <>
      <path d="M12 4c4 3 6 6.5 6 10 0 3.5-2.5 6-6 6s-6-2.5-6-6c0-3.5 2-7 6-10z" />
      <path d="M12 4v16M9 7.5c2 1.5 4 1.5 6 0" />
    </>
  ),
  tvmaze: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M8.5 6v12M15.5 6v12" />
      <path d="M3.5 10h17" />
    </>
  ),
  cloudflare: (
    <>
      <path d="M17 18.5H8.5c-2.5 0-4.5-1.8-4.5-4.2 0-2.2 1.7-4 3.8-4.2C8.6 7.4 10.8 5.5 13.5 5.5c2.9 0 5.2 2.1 5.5 4.8 1.7.2 3 1.6 3 3.4 0 1.9-1.5 3.4-3.3 3.4h-1.7z" />
      <path d="M10.5 12h6M13 9.5l-2.5 2.5 2.5 2.5" />
    </>
  ),
  pm2: (
    <>
      <rect x="4" y="4.5" width="6.5" height="6.5" rx="1.2" />
      <rect x="13.5" y="4.5" width="6.5" height="6.5" rx="1.2" />
      <rect x="8.75" y="13" width="6.5" height="6.5" rx="1.2" />
    </>
  ),
  react: (
    <>
      <ellipse cx="12" cy="12" rx="8.5" ry="3.8" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="8.5" ry="3.8" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.4" />
    </>
  ),
  vue: (
    <>
      <path d="M3.5 5l8.5 14.5L20.5 5h-4.2L12 11.5 7.7 5H3.5z" />
    </>
  ),
  node: (
    <>
      <path d="M12 3l8 4.6v7.8L12 20l-8-4.6V7.6L12 3z" />
      <path d="M12 14.5v-5" />
    </>
  ),
  go: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12h7M15.5 12l-2-2m2 2l-2 2M8.5 9.5h4" />
    </>
  ),
  default: (
    <>
      <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />
      <path d="M12 4.5v15" />
    </>
  ),
};

export function TechIcon({
  name,
  ...props
}: { name: string } & SVGProps<SVGSVGElement>) {
  const tech = normalizeTech(name);
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[tech]}
    </svg>
  );
}
