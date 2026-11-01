"use client";

import Link from "next/link";
import { useLang } from "@/components/providers";
import { profile } from "@/lib/data/profile";

export function Footer() {
  const { lang } = useLang();
  const year = new Date().getFullYear();
  const role = profile.role[lang];

  return (
    <footer className="border-t border-border-line">
      <div className="container-x py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="font-mono text-xl font-bold tracking-tight text-foreground">
              AW<span className="text-blue">.</span>
            </Link>
            <p className="mt-2 text-sm text-muted">{role}</p>
          </div>
        </div>
        <p className="mt-10 font-mono text-xs text-muted">
          © {year} {profile.name}.{" "}
          {lang === "id" ? "Dibuat dengan penuh perhatian." : "Built with care."}
        </p>
      </div>
    </footer>
  );
}
