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

/** Kartu proyek — struktur tunggal & konsisten (rasio, padding, alignment). */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t, lang } = useLang();
  const id = lang === "id";

  return (
    <Link
      href={`/work/${project.slug}`}
      data-reveal-item
      className="group flex flex-col overflow-hidden rounded-2xl border border-border-line bg-background transition-colors hover:border-navy/60"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <img
          src={`/${project.thumb}`}
          alt={t(project.titleKey)}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <span className="absolute left-4 top-4 rounded-full border border-border-line bg-background/90 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-muted backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
        {project.year ? (
          <span className="absolute right-4 top-4 rounded-full border border-blue bg-background/90 px-3 py-1 font-mono text-[11px] tracking-[0.2em] text-blue backdrop-blur-sm">
            {project.year}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex flex-wrap gap-2">
          {project.chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-border-line px-3 py-0.5 font-mono text-[11px] text-muted"
            >
              {chip}
            </span>
          ))}
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
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
  return (
    <GsapReveal
      className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8"
      stagger={0.08}
      y={24}
    >
      {projects.map((project, index) => (
        <ProjectCard key={project.slug} project={project} index={index} />
      ))}
    </GsapReveal>
  );
}
