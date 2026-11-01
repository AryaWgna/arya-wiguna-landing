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
      <path d="M3.5 3.5h2.6l9.1 9.1-2.6 2.6L3.5 6.1v-2.6z" />
      <path d="M6.1 3.5h2.6l9.1 9.1-2.6 2.6L6.1 6.1V3.5z" />
      <path d="M8.7 3.5h2.6l8.2 8.2-2.6 2.6-8.2-8.2v-2.6z" />
      <path d="M11.3 3.5h2.6l6.6 6.6-2.6 2.6-6.6-6.6v-2.6z" />
      <path d="M12.2 12.2l2.6-2.6 6.3 6.3-2.6 2.6-6.3-6.3z" />
      <path d="M9.6 14.8l2.6-2.6 6.3 6.3-2.6 2.6-6.3-6.3z" />
      <path d="M7 17.4l2.6-2.6 6.3 6.3-2.6 2.6L7 17.4z" />
    </>
  ),
  dart: (
    <>
      <path d="M4.5 9l7.5-5.5 7.5 5.5-7.5 5.5-7.5-5.5z" />
      <path d="M12 3.5v11" />
      <path d="M4.5 9v4" />
      <path d="M19.5 9v4" />
      <path d="M12 14.5l7.5 5.5v-4l-7.5-1.5z" />
      <path d="M4.5 13v4l7.5 3v-5.5" />
      <path d="M4.5 17L3 18.5" />
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
      <path d="M6 12h4.6" />
      <path d="M8.3 12v5.5" />
      <path d="M13 13.6c0-1 .7-1.6 1.8-1.6 1 0 1.7.5 1.7 1.4 0 .8-.6 1.2-1.7 1.5-1.1.3-1.8.7-1.8 1.6 0 1 .7 1.5 1.8 1.5 1.1 0 1.8-.6 1.8-1.6" />
      <path d="M11.3 17.5h4.4" />
    </>
  ),
  php: (
    <>
      <ellipse cx="12" cy="12" rx="9.2" ry="6.6" />
      <path d="M6.8 15.5v-7h1.6c1.4 0 2.2.9 2.2 2.1s-.8 2.1-2.2 2.1H6.8" />
      <path d="M9.8 15.5v-7" />
      <path d="M12.4 15.5v-7h1.6c1.4 0 2.2.9 2.2 2.1s-.8 2.1-2.2 2.1h-1.6" />
      <path d="M16.2 15.5v-7" />
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
      <path d="M3.5 14.5c0-1.5 1-2.4 2.5-2.4.4-2.6 1.9-4.2 4.5-4.8.5 1.6-.2 3.1-1.7 4.1 1.5 1.4 2.7 1.6 4.6 1.6h6.6c.3 1.5-.3 3-2 4-1 .6-3.2.9-6.5.9-3.4 0-7-.3-8-3.4z" />
      <path d="M6.3 9.5h.01M7.9 8.3h.01M9.4 9.3h.01M10.8 8.5h.01" />
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
      <path d="M13.5 2.8l6 6c2.6 2.6 2.6 6.8 0 9.4s-6.8 2.6-9.4 0l-5-5L13.5 2.8z" />
      <path d="M13.5 9c1.6 1.6 1.6 4.2 0 5.8-1.6-1.6-1.6-4.2 0-5.8z" />
      <path d="M9.5 13.5h.01M16.5 13.5h.01" />
    </>
  ),
  firebase: (
    <>
      <path d="M13.5 3.5L12 5.8 8.5 2.5 5.5 11.5l2.5-1.5L10 13l2.5-5.5 2 3.5 3-5-4-2.5z" />
      <path d="M5.5 14l6 6.5 7-6.5-2.5-1.5L12 20.5 6 14.5l-.5-.5z" />
      <path d="M12 8.5l-3.5 6.5 3.5 3.5 3.5-3.5L12 8.5z" />
    </>
  ),
  rest: (
    <>
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />
    </>
  ),
  laravel: (
    <>
      <path d="M4 20V4h5c3.2 0 5 2 5 5s-1.8 5-5 5H8" />
      <path d="M8 14v6" />
      <path d="M20 20l-8-8" />
      <path d="M12 12l8-8" />
    </>
  ),
  mysql: (
    <>
      <path d="M15.5 4.5C10 4.8 7 7.8 7 11.5s3.2 6.3 7 6.3c3 0 5.5-1.3 5.5-3.2 0-2.8 1.7-4.2 2.8-4.6-1.8-.5-2.8-1.8-2.8-3.4 0-2-2-2.3-3.5-2.1z" />
      <path d="M7.2 12l-3.4 2.4M7.2 12l-3.4 1" />
      <path d="M15.5 16.5c-1.6-.4-2.6-1.3-2.6-2.5" />
      <path d="M11.2 10h.01M14.2 8.8h.01" />
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
      <path d="M12 4.5c4 3 6 6.4 6 9.8 0 3.4-2.4 5.2-6 5.2s-6-1.8-6-5.2c0-3.4 2-6.8 6-9.8z" />
      <path d="M12 4.5v15.2" />
      <path d="M9.2 7.8c1.9 1.4 3.7 1.4 5.6 0" />
      <path d="M9.2 16.2c1.9-1.4 3.7-1.4 5.6 0" />
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
      <circle cx="12" cy="13.5" r="6" />
      <path d="M8.5 13.5h7" />
      <path d="M12 13.5v3.2" />
      <path d="M9.2 9.8c.4-.9 1.3-1.4 2.3-1.4" />
      <path d="M8.8 17.8l-.9 2.2M15.2 17.8l.9 2.2" />
      <path d="M12 16.7c0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6" />
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
