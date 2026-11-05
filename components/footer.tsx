"use client";

import Link from "next/link";
import { useLang } from "@/components/providers";
import { OnlineVisitors } from "@/components/online-visitors";
import { profile } from "@/lib/data/profile";

export function Footer() {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-line">
      <div className="container-x py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="font-mono text-xl font-bold tracking-tight text-foreground">
              AW<span className="text-blue">.</span>
            </Link>
            <p className="mt-2 text-sm text-muted">{profile.role[lang]}</p>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-mono text-xs text-muted">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub ↗
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              LinkedIn ↗
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="transition-colors hover:text-foreground"
            >
              {profile.email}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border-line/70 pt-6 font-mono text-xs text-muted">
          <span>© {year} {profile.name} · Next.js 15 &amp; TypeScript</span>
          <OnlineVisitors variant="footer" />
        </div>
      </div>
    </footer>
  );
}
