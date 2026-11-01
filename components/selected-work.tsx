"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/lib/data/projects";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

export function SelectedWork() {
  const { t, lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    const track = trackRef.current;
    if (!sec || !track || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Reveal + stagger kartu saat section masuk viewport (sekali main).
      const cards = track.querySelectorAll<HTMLElement>("[data-project-card]");
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
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
      <div className="lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <div className="container-x pt-24 pb-10 md:pt-32 lg:pt-0 lg:pb-10">
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
                  href="https://github.com/AryaWgna"
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

        {/* Track horizontal native: swipe/geser di semua ukuran layar */}
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-24 md:gap-6 md:px-8 md:pb-32 lg:gap-8 lg:px-16 lg:pb-28"
        >
          {projects.map((project) => (
            <article
              key={project.slug}
              data-project-card
              className="flex w-[min(430px,78vw)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border-line bg-background transition-shadow hover:shadow-lg"
            >
              <div className="parallax-img-wrap rounded-none border-0 border-b border-border-line">
                <img
                  src={`/${project.thumb}`}
                  alt={t(project.titleKey)}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
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
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                  {t(project.titleKey)}
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted line-clamp-3">
                  {t(project.summaryKey)}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-5 pt-6">
                  <Link
                    href={`/work/${project.slug}`}
                    className="font-mono text-sm font-medium text-blue transition-colors hover:text-navy-light"
                  >
                    {lang === "id" ? "Studi kasus →" : "Case study →"}
                  </Link>
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
          ))}
        </div>
      </div>
    </section>
  );
}
