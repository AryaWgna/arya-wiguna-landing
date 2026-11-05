import type { SVGProps } from "react";
import {
  SiBun,
  SiC,
  SiCloudflare,
  SiDart,
  SiDocker,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiJavascript,
  SiLaravel,
  SiMysql,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPhp,
  SiPm2,
  SiPython,
  SiReact,
  SiSqlite,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

export function normalizeTech(label: string): string {
  const s = label.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
  if (s.includes("flutter")) return "flutter";
  if (s.includes("dart")) return "dart";
  if (s.includes("typescript") || /(^| )ts( |$)/.test(s)) return "ts";
  if (s.includes("javascript")) return "javascript";
  if (s.includes("python")) return "python";
  if (s.trim() === "c") return "c";
  if (s.includes("php")) return "php";
  if (s.includes("tailwind")) return "tailwind";
  if (s.includes("docker")) return "docker";
  if (s.includes("svelte")) return "svelte";
  if (s.includes("bun")) return "bun";
  if (s.includes("firebase") || s.includes("fcm")) return "firebase";
  if (s.includes("sqlite")) return "sqlite";
  if (s.includes("git")) return "git";
  if (s.includes("secure") || s.includes("storage")) return "storage";
  if (s.includes("rest")) return "rest";
  if (s.includes("laravel")) return "laravel";
  if (s.includes("mysql")) return "mysql";
  if (s.includes("nginx")) return "nginx";
  if (s.includes("next")) return "nextjs";
  if (s.includes("sweetalert")) return "sweetalert";
  if (s.includes("elysia")) return "elysia";
  if (s.includes("tvmaze") || s.includes("omdb") || s.includes("tv")) return "tvmaze";
  if (s.includes("cloudflare")) return "cloudflare";
  if (s.includes("pm2")) return "pm2";
  if (s.includes("react")) return "react";
  if (s.includes("node")) return "node";
  if (s.includes("mobile") || s.includes("scanner")) return "mobile";
  if (s.includes("ui") || s.includes("layout")) return "ui";
  return "default";
}

const brand: Record<string, React.ElementType> = {
  flutter: SiFlutter,
  dart: SiDart,
  ts: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  c: SiC,
  php: SiPhp,
  tailwind: SiTailwindcss,
  react: SiReact,
  nextjs: SiNextdotjs,
  svelte: SiSvelte,
  node: SiNodedotjs,
  laravel: SiLaravel,
  sqlite: SiSqlite,
  git: SiGit,
  firebase: SiFirebase,
  docker: SiDocker,
  bun: SiBun,
  mysql: SiMysql,
  nginx: SiNginx,
  cloudflare: SiCloudflare,
  pm2: SiPm2,
};

const fallback: Record<string, React.ElementType> = {
  mobile: ({ size = 13, ...p }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <rect x="6.5" y="3" width="11" height="18" rx="2.2" />
      <path d="M10 17.5h4" />
    </svg>
  ),
  storage: ({ size = 13, ...p }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ),
  ui: ({ size = 13, ...p }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9h17M8 4.5v4.5" />
    </svg>
  ),
  rest: ({ size = 13, ...p }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />
    </svg>
  ),
  tvmaze: ({ size = 13, ...p }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <rect x="3.5" y="6" width="17" height="12" rx="2" />
      <path d="M8.5 6v12M15.5 6v12M3.5 10h17" />
    </svg>
  ),
  sweetalert: ({ size = 13, ...p }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12 12 3.5z" />
      <path d="M12 8.5v4.5M12 15.2h.01" />
    </svg>
  ),
  elysia: ({ size = 13, ...p }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M12 4.5c4 3 6 6.4 6 9.8 0 3.4-2.4 5.2-6 5.2s-6-1.8-6-5.2c0-3.4 2-6.8 6-9.8z" />
      <path d="M12 4.5v15.2M9.2 7.8c1.9 1.4 3.7 1.4 5.6 0M9.2 16.2c1.9-1.4 3.7-1.4 5.6 0" />
    </svg>
  ),
  default: ({ size = 13, ...p }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <rect x="4.5" y="4.5" width="15" height="15" rx="2.5" />
      <path d="M12 4.5v15" />
    </svg>
  ),
};

export function TechIcon({ name, size = 13, style, ...props }: { name: string } & IconProps) {
  const tech = normalizeTech(name);
  const Cmp = brand[tech] ?? fallback[tech] ?? fallback.default;
  return <Cmp size={size} style={{ color: "currentColor", ...style }} {...props} />;
}
