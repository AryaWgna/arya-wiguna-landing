"use client";

import Link from "next/link";
import { useLang } from "@/components/providers";
import type { Project } from "@/lib/data/projects";
import { TechIcon } from "@/components/tech-icon";

export function CaseStudyContent({ project }: { project: Project }) {
  const { t, lang } = useLang();
  const id = lang === "id";

  return (
    <div className="container-x py-20 md:py-28">
      <Link
        href="/work"
        className="font-mono text-sm text-muted transition-colors hover:text-foreground"
      >
        ← {id ? "Kembali ke karya" : "Back to work"}
      </Link>

      <div className="mt-10 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          {project.chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-line px-3 py-0.5 font-mono text-[11px] text-muted"
            >
              <TechIcon name={chip} />
              {chip}
            </span>
          ))}
          {project.year ? (
            <span className="rounded-full border border-blue px-3 py-0.5 font-mono text-[11px] text-blue">
              {project.year}
            </span>
          ) : null}
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          {t(project.titleKey)}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">{t(project.summaryKey)}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            {id ? "Lihat sumber ↗" : "View source ↗"}
          </a>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              {id ? "Demo live ↗" : "Live demo ↗"}
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight text-foreground">
            {id ? "Fitur & bukti dari repo" : "Features & evidence from repo"}
          </h2>
          <ul className="flex flex-col gap-3">
            {project.highlights.map((h) => (
              <li key={h.id} className="flex gap-3 border-l border-blue pl-4 text-[15px] leading-relaxed text-foreground/90">
                {h[lang]}
              </li>
            ))}
          </ul>

          <h2 className="mb-4 mt-10 text-2xl font-semibold tracking-tight text-foreground">
            {id ? "Stack" : "Stack"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-line px-3 py-1 text-[13px] text-muted"
              >
                <TechIcon name={s} />
                {s}
              </span>
            ))}
          </div>

          {project.roleNote ? (
            <div className="mt-10 rounded-xl border border-border-line p-5">
              <h3 className="font-mono text-sm font-semibold text-navy">
                {id ? "Peran & konteks" : "Role & context"}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {project.roleNote[lang]}
              </p>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl border border-border-line bg-surface">
            <img
              src={`/${project.thumb}`}
              alt={t(project.titleKey)}
              className="w-full h-auto"
            />
          </div>
          {project.evidenceNote ? (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {project.evidenceNote[lang]}
            </p>
          ) : null}
        </div>
      </div>

      {project.screenshots.length > 0 ? (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
            {id ? "Tangkapan layar" : "Screenshots"}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {project.screenshots.map((shot) => (
              <figure
                key={shot.src}
                className="group overflow-hidden rounded-xl border border-border-line bg-surface"
              >
                <img
                  src={`/${shot.src}`}
                  alt={shot.caption[lang]}
                  loading="lazy"
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <figcaption className="px-4 py-3">
                  <p className="text-sm font-medium text-foreground">
                    {shot.caption[lang]}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">
                    {shot.description[lang]}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
