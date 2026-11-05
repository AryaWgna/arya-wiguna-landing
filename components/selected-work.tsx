"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { projects, type Project } from "@/lib/data/projects";
import { TechIcon } from "@/components/tech-icon";
import { DeviceFanOutMockup } from "@/components/device-fanout";
import { profile } from "@/lib/data/profile";
import { gsap, getLenis, isReducedMotion } from "@/lib/gsap";
import { ProjectTelemetry } from "@/components/project-telemetry";
import { ArchitectureFlow } from "@/components/architecture-flow";

function ProjectActions({
  project,
  isId,
  viewSrcLabel,
  onOpenArch,
}: {
  project: Project;
  isId: boolean;
  viewSrcLabel: string;
  onOpenArch: (p: Project) => void;
}) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
      <Link
        href={`/work/${project.slug}`}
        className="font-mono text-sm font-semibold text-navy transition-colors hover:text-blue"
      >
        {isId ? "Baca studi kasus →" : "Read case study →"}
      </Link>

      {project.architecture ? (
        <button
          type="button"
          onClick={() => onOpenArch(project)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border-line bg-surface/50 px-2.5 py-1 font-mono text-xs text-foreground transition-colors hover:border-navy hover:text-navy"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <path d="M10 6.5h4a2 2 0 0 1 2 2V14" />
          </svg>
          <span>{isId ? "Arsitektur" : "Architecture"}</span>
        </button>
      ) : null}

      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-blue transition-colors hover:text-navy"
        >
          {isId ? "Demo live ↗" : "Live demo ↗"}
        </a>
      ) : null}

      {project.repo ? (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-muted transition-colors hover:text-foreground"
        >
          {viewSrcLabel} ↗
        </a>
      ) : null}
    </div>
  );
}

export function SelectedWork() {
  const { t, lang } = useLang();
  const isId = lang === "id";
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedArchProject, setSelectedArchProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedArchProject(null);
    };
    if (selectedArchProject) {
      document.body.style.overflow = "hidden";
      getLenis()?.stop();
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "";
      getLenis()?.start();
    }
    return () => {
      document.body.style.overflow = "";
      getLenis()?.start();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedArchProject]);

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    const list = listRef.current;
    if (!sec || !list || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = list.querySelectorAll<HTMLElement>("[data-project-card]");
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 82%",
            once: true,
          },
        }
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  const [featured, ...rest] = projects;

  return (
    <section id="projects" ref={sectionRef} className="border-t border-border-line">
      <div className="container-x pt-24 pb-10 md:pt-32">
        <SectionHeading
          eyebrow={isId ? "Karya Pilihan" : "Selected Work"}
          title={
            isId
              ? "Sistem yang dibangun untuk kebutuhan nyata"
              : "Systems built for real workflows"
          }
          intro={
            <>
              {t("proj-more")}
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue underline-offset-4 hover:underline"
              >
                GitHub
              </a>
              .
            </>
          }
        />
      </div>

      <div ref={listRef} className="container-x flex flex-col gap-8 pb-24 md:pb-32">
        {featured ? (
          <article
            data-project-card
            className="grid overflow-hidden rounded-2xl border border-border-line bg-background transition-colors hover:border-navy/45 lg:grid-cols-12"
          >
            <div className="border-b border-border-line lg:col-span-6 lg:border-r lg:border-b-0">
              {featured.fanout ? (
                <DeviceFanOutMockup devices={featured.fanout} featured />
              ) : (
                <Image
                  src={`/${featured.thumb}`}
                  alt={t(featured.titleKey)}
                  width={900}
                  height={600}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="flex flex-col p-6 sm:p-8 lg:col-span-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-medium text-blue">
                  {featured.contextBadge[lang]}
                </span>
                {featured.year ? (
                  <span className="font-mono text-xs text-muted">{featured.year}</span>
                ) : null}
              </div>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                <Link
                  href={`/work/${featured.slug}`}
                  className="transition-colors hover:text-navy"
                >
                  {t(featured.titleKey)}
                </Link>
              </h3>

              <p className="mt-3 leading-relaxed text-muted">{t(featured.summaryKey)}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {featured.chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border-line px-2.5 py-0.5 font-mono text-[11px] text-muted"
                  >
                    <TechIcon name={chip} />
                    {chip}
                  </span>
                ))}
              </div>

              {featured.telemetry ? (
                <div className="mt-5">
                  <ProjectTelemetry metrics={featured.telemetry} />
                </div>
              ) : null}

              <ProjectActions
                project={featured}
                isId={isId}
                viewSrcLabel={t("view-src")}
                onOpenArch={setSelectedArchProject}
              />
            </div>
          </article>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {rest.map((project) => (
            <article
              key={project.slug}
              data-project-card
              className="flex flex-col overflow-hidden rounded-2xl border border-border-line bg-background transition-colors hover:border-navy/45"
            >
              <div className="border-b border-border-line">
                {project.fanout ? (
                  <DeviceFanOutMockup devices={project.fanout} />
                ) : (
                  <Image
                    src={`/${project.thumb}`}
                    alt={t(project.titleKey)}
                    width={900}
                    height={560}
                    className="aspect-[16/10] w-full object-cover"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-medium text-blue">
                    {project.contextBadge[lang]}
                  </span>
                  {project.year ? (
                    <span className="font-mono text-xs text-muted">{project.year}</span>
                  ) : null}
                </div>

                <h3 className="mt-2.5 text-2xl font-semibold tracking-tight text-foreground">
                  <Link
                    href={`/work/${project.slug}`}
                    className="transition-colors hover:text-navy"
                  >
                    {t(project.titleKey)}
                  </Link>
                </h3>

                <p className="mt-2.5 leading-relaxed text-muted">{t(project.summaryKey)}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.chips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border-line px-2.5 py-0.5 font-mono text-[11px] text-muted"
                    >
                      <TechIcon name={chip} />
                      {chip}
                    </span>
                  ))}
                </div>

                {project.telemetry ? (
                  <div className="mt-5">
                    <ProjectTelemetry metrics={project.telemetry} />
                  </div>
                ) : null}

                <ProjectActions
                  project={project}
                  isId={isId}
                  viewSrcLabel={t("view-src")}
                  onOpenArch={setSelectedArchProject}
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      {mounted &&
        selectedArchProject &&
        selectedArchProject.architecture &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-6"
            onClick={() => setSelectedArchProject(null)}
          >
            <div
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border-line bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border-line bg-surface/50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="rounded border border-border-line bg-background px-2 py-0.5 font-mono text-[11px] font-medium text-blue">
                    {selectedArchProject.chips[0]}
                  </span>
                  <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    {t(selectedArchProject.titleKey)}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedArchProject(null)}
                  aria-label={isId ? "Tutup modal arsitektur" : "Close architecture modal"}
                  className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 sm:p-6">
                <ArchitectureFlow flow={selectedArchProject.architecture} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-line bg-surface/50 px-6 py-3.5">
                <span className="font-mono text-xs text-muted">
                  {isId
                    ? "Pilih tiap modul untuk melihat route & batas sistem asli."
                    : "Select any module to inspect actual routes & system boundaries."}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/work/${selectedArchProject.slug}`}
                    onClick={() => setSelectedArchProject(null)}
                    className="font-mono text-xs font-semibold text-blue hover:underline"
                  >
                    {isId ? "Buka Studi Kasus Lengkap →" : "Full Case Study →"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedArchProject(null)}
                    className="btn py-1.5 px-3 text-xs"
                  >
                    {isId ? "Tutup" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
