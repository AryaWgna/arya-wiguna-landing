"use client";

import { useLayoutEffect, useRef } from "react";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { expertiseGroups } from "@/lib/data/expertise";
import { TechIcon } from "@/components/tech-icon";
import { gsap, isReducedMotion } from "@/lib/gsap";

export function ExpertiseSection() {
  const { t, lang } = useLang();
  const isId = lang === "id";
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll<HTMLElement>("[data-skill-group]");
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 84%",
            once: true,
          },
        }
      );
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
        <SectionHeading
          eyebrow={isId ? "Stack Teknis" : "Technical Stack"}
          title={
            isId
              ? "Perangkat kerja di proyek nyata"
              : "Tools used across shipped projects"
          }
        />

        <div
          ref={gridRef}
          className="grid gap-px overflow-hidden rounded-2xl border border-border-line bg-border-line sm:grid-cols-2 lg:grid-cols-3"
        >
          {expertiseGroups.map((group) => (
            <div key={group.key} data-skill-group className="bg-background p-7">
              <div className="flex items-baseline justify-between">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-navy">
                  {t(group.key)}
                </h3>
                <span className="font-mono text-xs text-muted">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border-line px-3 py-1 text-[13px] text-foreground/85 transition-colors hover:border-navy/50 hover:text-navy"
                  >
                    <TechIcon name={item} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-2xl text-sm text-muted" lang={lang}>
          {isId
            ? "Mencantumkan bahasa, framework, dan infrastruktur yang benar-benar dipakai pada repositori proyek serta sertifikasi teknis terverifikasi."
            : "Lists languages, frameworks, and infrastructure directly backed by project repositories and verified technical credentials."}
        </p>
      </div>
    </section>
  );
}
