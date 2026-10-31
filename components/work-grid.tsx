"use client";

import Link from "next/link";
import { useLang } from "@/components/providers";
import { GsapReveal } from "@/components/gsap-reveal";
import { projects } from "@/lib/data/projects";

export function WorkGrid() {
  const { t } = useLang();

  return (
    <GsapReveal
      className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      stagger={0.09}
      y={24}
    >
      {projects.map((project) => (
        <Link
          key={project.slug}
          data-reveal-item
          href={`/work/${project.slug}`}
          className="group flex flex-col overflow-hidden rounded-xl border border-border-line bg-background transition-colors hover:border-navy/60"
        >
          <div className="overflow-hidden bg-surface">
            <img
              src={`/${project.thumb}`}
              alt={t(project.titleKey)}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 p-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {t(project.titleKey)}
            </h2>
            <p className="text-sm leading-relaxed text-muted">{t(project.summaryKey)}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-3">
              {project.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-border-line px-3 py-0.5 font-mono text-[11px] text-muted"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </GsapReveal>
  );
}
