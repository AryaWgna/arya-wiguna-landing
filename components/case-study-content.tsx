"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/providers";
import type { Project } from "@/lib/data/projects";
import { TechIcon } from "@/components/tech-icon";
import { ProjectRationaleBox } from "@/components/project-rationale-box";
import { ProjectTelemetry } from "@/components/project-telemetry";
import { ArchitectureFlow } from "@/components/architecture-flow";
import { SourceCodeExplorer } from "@/components/source-code-explorer";

export function CaseStudyContent({ project }: { project: Project }) {
  const { t, lang } = useLang();
  const isId = lang === "id";

  return (
    <div className="container-x pt-24 pb-20 md:pt-28 md:pb-28">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/?work=${project.slug}`}
          className="back-link"
        >
          ← {isId ? "Kembali ke 3D Cosmos" : "Back to 3D Cosmos"}
        </Link>

        <div className="inline-flex items-center gap-2 rounded-full border border-border-line bg-surface px-4 py-1.5 text-xs text-muted">
          <span className="font-medium text-foreground">
            {project.contextBadge[lang]}
          </span>
          {project.year ? <span>· {project.year}</span> : null}
        </div>
      </div>

      {/* Hero Case Study Bento Card */}
      <div className="bento-card p-6 sm:p-10 lg:p-12">
        <h1 className="font-editorial max-w-4xl text-4xl leading-[1.04] font-normal tracking-tight text-foreground sm:text-6xl">
          {t(project.titleKey)}
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
          {t(project.summaryKey)}
        </p>

        {project.telemetry ? (
          <div className="mt-8 max-w-3xl">
            <ProjectTelemetry metrics={project.telemetry} />
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`#source-explorer-${project.slug}`}
            className="btn btn-primary"
          >
            {isId ? "Lihat Kode Sumber ↓" : "View Source Code ↓"}
          </a>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              {isId ? "Buka Demo Live ↗" : "Open Live Demo ↗"}
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="bento-card p-6 sm:p-8">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-navy" />
              {isId ? "01 · Cakupan Fitur" : "01 · Implemented Scope"}
            </span>
            <h2 className="mt-2 mb-5 text-2xl font-bold tracking-tight text-foreground">
              {isId ? "Cakupan fitur di repository" : "Implemented features"}
            </h2>
            <ul className="space-y-3">
              {project.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex gap-3.5 rounded-2xl border border-border-line bg-surface/50 p-4 text-sm leading-relaxed text-foreground/90 sm:text-[15px]"
                >
                  <span className="font-mono text-xs font-bold text-navy">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{h[lang]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bento-card p-6 sm:p-8">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-navy" />
              {isId ? "02 · Spesifikasi Teknis" : "02 · Technical Stack"}
            </span>
            <h2 className="mt-2 mb-4 text-2xl font-bold tracking-tight text-foreground">
              {isId ? "Teknologi yang digunakan" : "Stack & dependencies"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border-line bg-surface px-3.5 py-1.5 font-mono text-xs font-medium text-foreground"
                >
                  <TechIcon name={s} />
                  {s}
                </span>
              ))}
            </div>

            {project.rationale && project.rationale.length > 0 ? (
              <div className="mt-8">
                <ProjectRationaleBox rationale={project.rationale} />
              </div>
            ) : null}

            {project.roleNote ? (
              <div className="mt-6 rounded-2xl border border-border-line bg-surface/50 p-5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-navy">
                  {isId ? "Peran & Konteks" : "Role & Context"}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {project.roleNote[lang]}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <div className="bento-card overflow-hidden p-4">
            <div className="overflow-hidden rounded-2xl border border-border-line bg-surface">
              <Image
                src={`/${project.thumb}`}
                alt={t(project.titleKey)}
                width={900}
                height={600}
                className="h-auto w-full"
              />
            </div>
            {project.evidenceNote ? (
              <p className="mt-4 px-2 text-sm leading-relaxed text-muted">
                {project.evidenceNote[lang]}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {project.architecture ? (
        <section id="architecture" className="mt-6 scroll-mt-24">
          <ArchitectureFlow flow={project.architecture} />
        </section>
      ) : null}

      <section className="mt-8 scroll-mt-24">
        <SourceCodeExplorer projectSlug={project.slug} lang={lang} />
      </section>

      {project.screenshots.length > 0 ? (
        <div className="mt-12">
          <div className="mb-6">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-navy" />
              {isId ? "04 · Galeri Antarmuka" : "04 · Interface Gallery"}
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {isId ? "Tangkapan layar antarmuka" : "Interface screenshots"}
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {project.screenshots.map((shot) => (
              <figure
                key={shot.src}
                className="bento-card group overflow-hidden p-3.5"
              >
                <div className="overflow-hidden rounded-2xl border border-border-line bg-surface">
                  <Image
                    src={`/${shot.src}`}
                    alt={shot.caption[lang]}
                    width={800}
                    height={520}
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="p-3 pt-4">
                  <p className="text-sm font-bold text-foreground">
                    {shot.caption[lang]}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
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
