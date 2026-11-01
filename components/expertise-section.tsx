"use client";

import { useLayoutEffect, useRef } from "react";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { expertiseGroups } from "@/lib/data/expertise";
import { TechIcon } from "@/components/tech-icon";
import { gsap, isReducedMotion } from "@/lib/gsap";

export function ExpertiseSection() {
  const { t, lang } = useLang();
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const cards = grid.querySelectorAll<HTMLElement>(".stagger-card");

      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 40, scale: 0.92, rotateX: 8 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.7,
          stagger: {
            each: 0.1,
            from: "start",
          },
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 82%",
            once: true,
          },
        }
      );

      // Animate skill chips inside each card with a slight delay
      cards.forEach((card, i) => {
        const chips = card.querySelectorAll<HTMLElement>("[data-skill-chip]");
        gsap.fromTo(
          chips,
          { autoAlpha: 0, scale: 0.8 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.03,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
            delay: 0.3 + i * 0.08,
          }
        );
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
        <SectionHeading
          eyebrow={t("skills-tag")}
          title={
            <>
              {t("skills-h1")}
              <em className="not-italic text-navy">{t("skills-h2")}</em>
            </>
          }
        />
        <div
          ref={gridRef}
          className="grid gap-px overflow-hidden rounded-2xl border border-border-line bg-border-line sm:grid-cols-2 lg:grid-cols-3"
          style={{ perspective: "600px" }}
        >
          {expertiseGroups.map((group) => (
            <div key={group.key} className="stagger-card bg-background p-7">
              <div className="flex items-baseline justify-between">
                <h3 className="font-mono text-sm font-semibold text-navy">{t(group.key)}</h3>
                <span className="font-mono text-xs text-muted">
                  {String(group.items.length).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    data-skill-chip
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-line px-3 py-1 text-[13px] text-foreground/85 transition-colors hover:border-navy/60 hover:text-navy"
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
          {lang === "id"
            ? "Dikelompokkan per disiplin. Tidak ada persentase/bintang — keahlian ditunjukkan lewat proyek nyata."
            : "Grouped by discipline. No percentages or star ratings — skills are demonstrated through real projects."}
        </p>
      </div>
    </section>
  );
}
