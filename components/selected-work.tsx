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
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: "power3.out",
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

  return (
    <section id="projects" ref={sectionRef} className="py-16 md:py-24">
      <div className="container-x">
        <SectionHeading
          index="01"
          eyebrow={isId ? "Karya Pilihan" : "Selected Works"}
          meta={
            isId
              ? `0${projects.length} Sistem Produksi`
              : `0${projects.length} Production Systems`
          }
          title={
            isId ? (
              <>
                Sistem nyata yang dirancang untuk{" "}
                <span className="font-editorial font-normal italic text-navy">
                  operasional harian.
                </span>
              </>
            ) : (
              <>
                Real-world systems built for{" "}
                <span className="font-editorial font-normal italic text-navy">
                  daily operation.
                </span>
              </>
            )
          }
          intro={
            <>
              {t("proj-more")}
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-navy underline-offset-4 hover:underline"
              >
                GitHub ↗
              </a>
            </>
          }
        />

        <div ref={listRef} className="flex flex-col gap-6 md:gap-8">
          {projects.map((project, idx) => {
            const num = String(idx + 1).padStart(2, "0");
            const isEven = idx % 2 === 1;

            return (
              <article
                key={project.slug}
                data-project-card
                className="bento-card group relative overflow-hidden p-5 sm:p-7 lg:p-9"
              >
                <div className="grid items-center gap-7 lg:grid-cols-12 lg:gap-10">
                  {/* Visual Stage Column */}
                  <div
                    className={`relative overflow-hidden rounded-2xl border border-border-line bg-surface/80 lg:col-span-6 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-border-line bg-background/60 px-4 py-2.5 backdrop-blur-md">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-navy" />
                        <span className="font-mono text-[11px] font-bold text-foreground">
                          {num} — {project.contextBadge[lang]}
                        </span>
                      </div>
                      {project.year ? (
                        <span className="rounded-full border border-border-line bg-surface px-2.5 py-0.5 font-mono text-[10px] text-muted">
                          {project.year}
                        </span>
                      ) : null}
                    </div>

                    <div className="relative overflow-hidden">
                      {project.fanout ? (
                        <DeviceFanOutMockup devices={project.fanout} featured={idx === 0} />
                      ) : (
                        <Image
                          src={`/${project.thumb}`}
                          alt={t(project.titleKey)}
                          width={900}
                          height={560}
                          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Narrative & Spec Column */}
                  <div
                    className={`flex flex-col justify-between lg:col-span-6 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs font-bold uppercase tracking-widest text-navy">
                          Case Study #{num}
                        </span>
                        <span className="font-editorial text-4xl italic text-muted/35 sm:text-5xl">
                          {num}
                        </span>
                      </div>

                      <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                        <Link
                          href={`/work/${project.slug}`}
                          className="transition-colors hover:text-navy"
                        >
                          {t(project.titleKey)}
                        </Link>
                      </h3>

                      <p className="mt-3.5 text-sm leading-relaxed text-muted sm:text-base">
                        {t(project.summaryKey)}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.chips.map((chip) => (
                          <span
                            key={chip}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border-line bg-surface px-3 py-1 font-mono text-xs font-medium text-foreground/90"
                          >
                            <TechIcon name={chip} />
                            {chip}
                          </span>
                        ))}
                      </div>

                      {project.telemetry ? (
                        <div className="mt-6">
                          <ProjectTelemetry metrics={project.telemetry} />
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-2.5 border-t border-border-line/80 pt-5">
                      <Link
                        href={`/work/${project.slug}`}
                        className="btn btn-primary !py-2.5 !px-5 !text-xs"
                      >
                        {isId ? "Baca Studi Kasus" : "Read Case Study"}
                        <span aria-hidden="true">→</span>
                      </Link>

                      {project.architecture ? (
                        <button
                          type="button"
                          onClick={() => setSelectedArchProject(project)}
                          className="btn !py-2.5 !px-4 !text-xs"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-navy"
                            aria-hidden="true"
                          >
                            <rect x="3" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="14" width="7" height="7" rx="1.5" />
                            <path d="M10 6.5h4a2 2 0 0 1 2 2V14" />
                          </svg>
                          <span>{isId ? "Skema Arsitektur" : "Architecture"}</span>
                        </button>
                      ) : null}

                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn !py-2.5 !px-4 font-mono !text-xs"
                        >
                          {isId ? "Demo Live ↗" : "Live Demo ↗"}
                        </a>
                      ) : null}

                      {project.repo ? (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 font-mono text-xs font-semibold text-muted transition-colors hover:text-foreground"
                        >
                          {t("view-src")} ↗
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {mounted &&
        selectedArchProject &&
        selectedArchProject.architecture &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md sm:p-6"
            onClick={() => setSelectedArchProject(null)}
          >
            <div
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border-line bg-background shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 border-b border-border-line bg-surface/60 px-5 py-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="shrink-0 rounded-full bg-navy px-3 py-0.5 font-mono text-[11px] font-bold text-white">
                    {selectedArchProject.chips[0]}
                  </span>
                  <h3 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
                    {t(selectedArchProject.titleKey)}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedArchProject(null)}
                  aria-label={isId ? "Tutup modal arsitektur" : "Close architecture modal"}
                  className="shrink-0 rounded-full border border-border-line bg-background px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 sm:p-6">
                <ArchitectureFlow flow={selectedArchProject.architecture} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-line bg-surface/60 px-5 py-3.5 sm:px-6">
                <span className="font-mono text-xs text-muted">
                  {isId
                    ? "Pilih tiap modul untuk melihat route & batas sistem asli."
                    : "Select any module to inspect actual routes & system boundaries."}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/work/${selectedArchProject.slug}`}
                    onClick={() => setSelectedArchProject(null)}
                    className="font-mono text-xs font-bold text-navy hover:underline"
                  >
                    {isId ? "Buka Studi Kasus Lengkap →" : "Full Case Study →"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedArchProject(null)}
                    className="btn !py-1.5 !px-4 !text-xs"
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
