"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, useTheme } from "@/components/providers";
import { scrollToHash } from "@/lib/gsap";
import { profile } from "@/lib/data/profile";

function GitHubIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Header() {
  const { t, lang, setLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const pathname = usePathname();
  const isId = lang === "id";
  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (pathname !== "/" || typeof IntersectionObserver === "undefined") return;
    const ids = ["projects", "about", "skills", "experience", "certs", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const links = [
    { href: "/#projects", hash: "projects", label: t("nav-proj") },
    { href: "/#about", hash: "about", label: t("nav-about") },
    { href: "/#experience", hash: "experience", label: t("nav-exp") },
    { href: "/#certs", hash: "certs", label: t("nav-certs") },
    { href: "/#contact", hash: "contact", label: t("nav-contact") },
  ];

  const onNavClick = (e: React.MouseEvent, href: string) => {
    const hashIndex = href.indexOf("#");
    if (pathname !== "/") return;
    e.preventDefault();
    setOpen(false);
    scrollToHash(hashIndex >= 0 ? href.slice(hashIndex) : "");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? "border-border-line bg-background/90 backdrop-blur-md"
          : "border-transparent bg-background"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tight text-foreground"
          aria-label={isId ? "Arya Wiguna — Beranda" : "Arya Wiguna — Home"}
        >
          AW<span className="text-blue">.</span>
        </Link>

        <nav
          className="hidden items-center gap-7 md:flex"
          aria-label={isId ? "Navigasi utama" : "Primary navigation"}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={(e) => onNavClick(e, l.href)}
              aria-current={pathname === "/" && active === l.hash ? "true" : undefined}
              className={`text-sm font-medium transition-colors ${
                pathname === "/" && active === l.hash
                  ? "text-foreground underline decoration-blue decoration-2 underline-offset-8"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded p-2 text-muted transition-colors hover:text-foreground sm:inline-flex"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded p-2 text-muted transition-colors hover:text-foreground sm:inline-flex"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>

          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "id" : "en")}
            className="rounded border border-border-line px-2.5 py-1.5 font-mono text-xs font-semibold text-muted transition-colors hover:border-navy hover:text-foreground"
            aria-label={isId ? "Ganti ke Bahasa Inggris" : "Switch to Bahasa Indonesia"}
          >
            {lang === "en" ? "ID" : "EN"}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded border border-border-line p-2 text-muted transition-colors hover:border-navy hover:text-foreground"
            aria-label={
              isDark
                ? isId
                  ? "Aktifkan mode terang"
                  : "Switch to light mode"
                : isId
                  ? "Aktifkan mode gelap"
                  : "Switch to dark mode"
            }
          >
            {isDark ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="rounded border border-border-line p-2 text-muted md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          className="border-t border-border-line bg-background px-5 pb-5 pt-3.5 md:hidden"
          aria-label={isId ? "Menu seluler" : "Mobile menu"}
        >
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={(e) => onNavClick(e, l.href)}
                className="rounded px-2 py-2.5 text-[15px] font-medium text-foreground hover:bg-surface"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-4 border-t border-border-line pt-3.5 px-2 font-mono text-xs text-muted">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <GitHubIcon />
              <span>GitHub ↗</span>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <LinkedInIcon />
              <span>LinkedIn ↗</span>
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
