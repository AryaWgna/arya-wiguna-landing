import type { SVGProps } from "react";
import {
  SiAngular,
  SiBun,
  SiCloudflare,
  SiDart,
  SiDocker,
  SiFirebase,
  SiFlask,
  SiFlutter,
  SiGin,
  SiGo,
  SiJavascript,
  SiKubernetes,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPhp,
  SiPm2,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSvelte,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

export function normalizeTech(label: string): string {
  const s = label.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
  if (s.includes("react native")) return "rn";
  if (s.includes("flutter")) return "flutter";
  if (s.includes("dart")) return "dart";
  if (s.includes("typescript") || /(^| )ts( |$)/.test(s)) return "ts";
  if (s.includes("javascript")) return "javascript";
  if (s.includes("python")) return "python";
  if (s.includes("go")) return "go";
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
  if (s.includes("angular")) return "angular";
  if (s.includes("nest")) return "nestjs";
  if (s.includes("flask")) return "flask";
  if (s.includes("gin")) return "gin";
  if (s.includes("postgres")) return "postgresql";
  if (s.includes("mongo")) return "mongodb";
  if (s.includes("redis")) return "redis";
  if (s.includes("k8s") || s.includes("kubernetes")) return "kubernetes";
  if (s.includes("aws")) return "aws";
  if (s.includes("mobile")) return "mobile";
  if (s.includes("ui") || s.includes("layout")) return "ui";
  return "default";
}

const brand: Record<string, (props: IconProps) => React.ReactElement> = {
  flutter: SiFlutter,
  dart: SiDart,
  ts: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  go: SiGo,
  php: SiPhp,
  react: SiReact,
  vue: SiVuedotjs,
  nextjs: SiNextdotjs,
  angular: SiAngular,
  svelte: SiSvelte,
  node: SiNodedotjs,
  laravel: SiLaravel,
  nestjs: SiNestjs,
  flask: SiFlask,
  gin: SiGin,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  redis: SiRedis,
  firebase: SiFirebase,
  docker: SiDocker,
  kubernetes: SiKubernetes,
  bun: SiBun,
  mysql: SiMysql,
  nginx: SiNginx,
  cloudflare: SiCloudflare,
  pm2: SiPm2,
};

const fallback: Record<string, (props: IconProps) => React.ReactElement> = {
  rn: ({ size = 13, ...p }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <rect x="6.5" y="3" width="11" height="18" rx="2.2" />
      <path d="M10 17.5h4" />
    </svg>
  ),
  mobile: ({ size = 13, ...p }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <rect x="6.5" y="3" width="11" height="18" rx="2.2" />
      <path d="M10 17.5h4" />
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
  aws: ({ size = 13, ...p }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
      <path d="M17 18.5H8.5c-2.5 0-4.5-1.8-4.5-4.2 0-2.2 1.7-4 3.8-4.2C8.6 7.4 10.8 5.5 13.5 5.5c2.9 0 5.2 2.1 5.5 4.8 1.7.2 3 1.6 3 3.4 0 1.9-1.5 3.4-3.3 3.4h-1.7z" />
      <path d="M10.5 12h6M13 9.5l-2.5 2.5 2.5 2.5" />
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
