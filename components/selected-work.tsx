"use client";

import Link from "next/link";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { GsapReveal } from "@/components/gsap-reveal";
import { projects } from "@/lib/data/projects";

export function SelectedWork() {
  const { t, lang } = useLang();

  return (
    <section id="projects" className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
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

        <GsapReveal className="flex flex-col" stagger={0.1} y={22}>
          {projects.map((project) => (
            <article
              key={project.slug}
              data-reveal-item
              className="grid gap-6 border-t border-border-line py-10 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-10"
            >
              <div className="md:col-span-5">
                <div className="overflow-hidden rounded-xl border border-border-line bg-surface">
                  <img
                    src={`/${project.thumb}`}
                    alt={t(project.titleKey)}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col md:col-span-7">
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
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {t(project.summaryKey)}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-5">
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
        </GsapReveal>
      </div>
    </section>
  );
}
