"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/providers";
import type { Project } from "@/lib/data/projects";
import { TechIcon } from "@/components/tech-icon";
import { ProjectRationaleBox } from "@/components/project-rationale-box";
import { ProjectTelemetry } from "@/components/project-telemetry";
import { ArchitectureFlow } from "@/components/architecture-flow";

export function CaseStudyContent({ project }: { project: Project }) {
  const { t, lang } = useLang();
  const isId = lang === "id";

  return (
    <div className="container-x py-20 md:py-28">
      <Link
        href="/#projects"
        className="font-mono text-sm text-muted transition-colors hover:text-foreground"
      >
        ← {isId ? "Kembali ke proyek" : "Back to projects"}
      </Link>

      <div className="mt-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-medium text-blue">
            {project.contextBadge[lang]}
          </span>
          {project.year ? (
            <span className="font-mono text-xs text-muted">· {project.year}</span>
          ) : null}
        </div>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          {t(project.titleKey)}
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-muted">{t(project.summaryKey)}</p>

        {project.telemetry ? (
          <div className="mt-7">
            <ProjectTelemetry metrics={project.telemetry} />
          </div>
        ) : null}

        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            {isId ? "Lihat kode sumber ↗" : "View source code ↗"}
          </a>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              {isId ? "Buka demo live ↗" : "Open live demo ↗"}
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight text-foreground">
            {isId ? "Cakupan fitur di repository" : "Implemented features"}
          </h2>
          <ul className="flex flex-col gap-3">
            {project.highlights.map((h, i) => (
              <li
                key={i}
                className="border-l-2 border-blue pl-4 text-[15px] leading-relaxed text-foreground/90"
              >
                {h[lang]}
              </li>
            ))}
          </ul>

          <h2 className="mb-4 mt-10 text-2xl font-semibold tracking-tight text-foreground">
            {isId ? "Teknologi yang digunakan" : "Stack & dependencies"}
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 rounded-md border border-border-line px-3 py-1 text-[13px] text-muted"
              >
                <TechIcon name={s} />
                {s}
              </span>
            ))}
          </div>

          {project.rationale && project.rationale.length > 0 ? (
            <div className="mt-10">
              <ProjectRationaleBox rationale={project.rationale} />
            </div>
          ) : null}

          {project.roleNote ? (
            <div className="mt-10 rounded-xl border border-border-line p-5">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-navy">
                {isId ? "Peran & Konteks" : "Role & Context"}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {project.roleNote[lang]}
              </p>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl border border-border-line bg-surface">
            <Image
              src={`/${project.thumb}`}
              alt={t(project.titleKey)}
              width={900}
              height={600}
              className="h-auto w-full"
            />
          </div>
          {project.evidenceNote ? (
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {project.evidenceNote[lang]}
            </p>
          ) : null}
        </div>
      </div>

      {project.architecture ? (
        <section id="architecture" className="mt-16 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
            {isId ? "Arsitektur Sistem & Alur Data" : "System Architecture & Data Flow"}
          </h2>
          <ArchitectureFlow flow={project.architecture} />
        </section>
      ) : null}

      {project.screenshots.length > 0 ? (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
            {isId ? "Tangkapan layar antarmuka" : "Interface screenshots"}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {project.screenshots.map((shot) => (
              <figure
                key={shot.src}
                className="group overflow-hidden rounded-xl border border-border-line bg-surface"
              >
                <Image
                  src={`/${shot.src}`}
                  alt={shot.caption[lang]}
                  width={800}
                  height={520}
                  className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.015]"
                />
                <figcaption className="px-4 py-3.5">
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
