"use client";

import Link from "next/link";
import { useLang } from "@/components/providers";
import { GsapReveal } from "@/components/gsap-reveal";
import { projects, type Project } from "@/lib/data/projects";

function ArrowIcon() {
  return (
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
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

/** Kartu utama (proyek pertama) — horizontal lebar. */
function FeaturedProject({ project, index }: { project: Project; index: number }) {
  const { t, lang } = useLang();
  const id = lang === "id";

  return (
    <Link
      href={`/work/${project.slug}`}
      data-reveal-item
      className="group grid overflow-hidden rounded-2xl border border-border-line bg-background transition-colors hover:border-navy/60 md:grid-cols-12"
    >
      <div className="overflow-hidden bg-surface md:col-span-6 md:min-h-[380px]">
        <img
          src={`/${project.thumb}`}
          alt={t(project.titleKey)}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] md:aspect-[4/3] md:h-full"
        />
      </div>

      <div className="flex flex-col justify-center p-7 md:col-span-6 md:p-10">
        <span className="font-mono text-xs tracking-[0.3em] text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border-line px-3 py-0.5 font-mono text-[11px] text-muted"
            >
              {chip}
            </span>
          ))}
        </div>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {t(project.titleKey)}
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-muted">{t(project.summaryKey)}</p>
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <span className="inline-flex items-center gap-2 font-mono text-sm font-medium text-blue transition-colors group-hover:text-navy-light">
            {id ? "Studi kasus" : "Case study"} <ArrowIcon />
          </span>
          <span className="font-mono text-sm text-muted">
            {t("view-src")} ↗
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Kartu standar (proyek selanjutnya) — vertikal. */
function StandardProject({ project, index }: { project: Project; index: number }) {
  const { t, lang } = useLang();
  const id = lang === "id";

  return (
    <Link
      href={`/work/${project.slug}`}
      data-reveal-item
      className="group flex flex-col overflow-hidden rounded-2xl border border-border-line bg-background transition-colors hover:border-navy/60"
    >
      <div className="relative overflow-hidden bg-surface">
        <img
          src={`/${project.thumb}`}
          alt={t(project.titleKey)}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 rounded-full border border-border-line bg-background/90 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-muted backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2">
          {project.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border-line px-3 py-0.5 font-mono text-[11px] text-muted"
            >
              {chip}
            </span>
          ))}
          {project.year ? (
            <span className="rounded-full border border-blue px-3 py-0.5 font-mono text-[11px] text-blue">
              {project.year}
            </span>
          ) : null}
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          {t(project.titleKey)}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-3">
          {t(project.summaryKey)}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-5 pt-6">
          <span className="inline-flex items-center gap-2 font-mono text-sm font-medium text-blue transition-colors group-hover:text-navy-light">
            {id ? "Studi kasus" : "Case study"} <ArrowIcon />
          </span>
          <span className="font-mono text-sm text-muted">{t("view-src")} ↗</span>
        </div>
      </div>
    </Link>
  );
}

export function WorkGrid() {
  const [featured, ...rest] = projects;

  return (
    <div className="mt-16 flex flex-col gap-8">
      <GsapReveal y={24} once>
        <FeaturedProject project={featured} index={0} />
      </GsapReveal>

      <GsapReveal
        className="grid gap-6 md:grid-cols-2"
        stagger={0.1}
        y={24}
      >
        {rest.map((project, i) => (
          <StandardProject key={project.slug} project={project} index={i + 1} />
        ))}
      </GsapReveal>
    </div>
  );
}
