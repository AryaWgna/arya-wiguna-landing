"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { projects, type Project } from "@/lib/data/projects";
import { TechIcon } from "@/components/tech-icon";
import { TiltCard } from "@/components/tilt-card";
import { DeviceFanOutMockup } from "@/components/device-fanout";
import { useWebAudioGlitch } from "@/lib/use-web-audio-glitch";
import { profile } from "@/lib/data/profile";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";
import { ProjectTelemetry } from "@/components/project-telemetry";
import { ArchitectureFlow } from "@/components/architecture-flow";

export function SelectedWork() {
  const { t, lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedArchProject, setSelectedArchProject] = useState<Project | null>(null);
  const { playGlitch } = useWebAudioGlitch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedArchProject(null);
    };
    if (selectedArchProject) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedArchProject]);

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    const track = trackRef.current;
    if (!sec || !track || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Reveal + stagger kartu saat section masuk viewport (sekali main).
      const cards = track.querySelectorAll<HTMLElement>("[data-project-card]");
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 24, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="horizontal-section border-t border-border-line"
    >
      <div>
        <div className="container-x pt-24 pb-10 md:pt-32">
          <SectionHeading
            eyebrow={t("proj-tag")}
            title={
              <>
                {t("proj-h1")}
                <em className="not-italic text-navy">{t("proj-h2")}</em>
              </>
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

        {/* Grid maksimal 2 kolom; proyek berikutnya di bawah */}
        <div
          ref={trackRef}
          className="container-x grid gap-6 pb-24 md:gap-8 md:pb-32 sm:grid-cols-2"
        >
          {projects.map((project) => (
            <TiltCard key={project.slug} className="group">
              <article
                data-project-card
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-border-line bg-background transition-shadow hover:shadow-lg"
              >
              <div className="parallax-img-wrap rounded-none border-0 border-b border-border-line">
                {project.fanout ? (
                  <DeviceFanOutMockup devices={project.fanout} />
                ) : (
                  <img
                    src={`/${project.thumb}`}
                    alt={t(project.titleKey)}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
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
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                  {t(project.titleKey)}
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted line-clamp-3">
                  {t(project.summaryKey)}
                </p>
                {project.telemetry ? (
                  <div className="mt-4">
                    <ProjectTelemetry metrics={project.telemetry} />
                  </div>
                ) : null}
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
                  <Link
                    href={`/work/${project.slug}`}
                    onClick={() => playGlitch("click")}
                    className="font-mono text-sm font-medium text-blue transition-colors hover:text-navy-light"
                  >
                    {lang === "id" ? "Studi kasus →" : "Case study →"}
                  </Link>
                  {project.architecture ? (
                    <button
                      type="button"
                      onClick={() => {
                        playGlitch("click");
                        setSelectedArchProject(project);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-navy/20 bg-navy/5 px-2.5 py-1 font-mono text-xs font-semibold text-navy transition-all hover:border-navy hover:bg-navy hover:text-white"
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue opacity-75"></span>
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue"></span>
                      </span>
                      <span>{lang === "id" ? "Alur Arsitektur" : "Architecture Flow"}</span>
                    </button>
                  ) : null}
                  {project.repo ? (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {t("view-src")} ↗
                    </a>
                  ) : null}
                </div>
              </div>
              </article>
            </TiltCard>
          ))}
        </div>
      </div>

      {/* Interactive Architecture Flow Modal */}
      {selectedArchProject && selectedArchProject.architecture && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setSelectedArchProject(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border-line bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border-line px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-blue/40 bg-blue/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-blue">
                  {selectedArchProject.chips[0]}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-foreground">
                  {t(selectedArchProject.titleKey)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArchProject(null)}
                aria-label="Close architecture modal"
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              <ArchitectureFlow flow={selectedArchProject.architecture} />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-line bg-surface/50 px-6 py-4">
              <span className="font-mono text-xs text-muted">
                {lang === "id"
                  ? "Klik setiap tahapan node untuk inspeksi payload & protokol."
                  : "Click each pipeline node to inspect payload & protocol."}
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href={`/work/${selectedArchProject.slug}`}
                  onClick={() => setSelectedArchProject(null)}
                  className="font-mono text-xs font-semibold text-blue hover:underline"
                >
                  {lang === "id" ? "Buka Studi Kasus Lengkap →" : "View Full Case Study →"}
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedArchProject(null)}
                  className="btn text-xs py-1.5 px-3"
                >
                  {lang === "id" ? "Tutup" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
