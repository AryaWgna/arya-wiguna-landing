"use client";

import { useLayoutEffect, useRef } from "react";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { expertiseGroups } from "@/lib/data/expertise";
import { TechIcon } from "@/components/tech-icon";
import { gsap, isReducedMotion } from "@/lib/gsap";

const allTechItems = expertiseGroups.flatMap((g) => g.items);

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
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
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
    <section id="skills" className="py-16 md:py-24">
      <div className="container-x">
        <SectionHeading
          index="03"
          eyebrow={isId ? "Arsenal Teknis" : "Technical Arsenal"}
          meta={
            isId
              ? `${allTechItems.length} Teknologi Teruji`
              : `${allTechItems.length} Verified Technologies`
          }
          title={
            isId ? (
              <>
                Perangkat kerja di balik{" "}
                <span className="font-editorial font-normal italic text-navy">
                  setiap repositori.
                </span>
              </>
            ) : (
              <>
                Production stack powering{" "}
                <span className="font-editorial font-normal italic text-navy">
                  shipped repositories.
                </span>
              </>
            )
          }
          intro={
            isId
              ? "Seluruh bahasa, framework, dan infrastruktur di bawah ini dipakai langsung di dalam kode proyek dan didukung sertifikasi teknis."
              : "Every language, framework, and infrastructure tool listed below is backed directly by shipped project repositories and verified credentials."
          }
        />

        {/* Infinite Tech Marquee Ribbon */}
        <div className="bento-card mb-6 overflow-hidden py-4">
          <div className="animate-marquee flex items-center gap-3 px-3">
            {[...allTechItems, ...allTechItems].map((item, idx) => (
              <span
                key={`${item}-${idx}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border-line bg-surface px-4 py-1.5 font-mono text-xs font-semibold text-foreground"
              >
                <TechIcon name={item} />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 6-Card Bento Grid */}
        <div
          ref={gridRef}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        >
          {expertiseGroups.map((group, idx) => (
            <div
              key={group.key}
              data-skill-group
              className="bento-card flex flex-col justify-between p-6 sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-navy/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-navy">
                    0{idx + 1}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {group.items.length} {isId ? "item" : "tools"}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">
                  {t(group.key)}
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border-line bg-surface/75 px-3 py-1.5 text-xs font-medium text-foreground/90 transition-colors hover:border-navy hover:text-navy"
                    >
                      <TechIcon name={item} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
