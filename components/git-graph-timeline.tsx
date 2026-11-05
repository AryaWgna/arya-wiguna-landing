"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { careerMilestones, type CareerMilestone } from "@/lib/data/git-milestones";
import { gsap, isReducedMotion } from "@/lib/gsap";

export function GitGraphTimeline() {
  const { t, lang } = useLang();
  const isId = lang === "id";
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const active = careerMilestones[activeIdx];

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    if (!sec || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const items = sec.querySelectorAll<HTMLElement>("[data-timeline-item]");
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: sec, start: "top 80%", once: true },
        }
      );

      const panel = sec.querySelector<HTMLElement>("[data-timeline-detail]");
      if (panel) {
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: { trigger: panel, start: "top 84%", once: true },
          }
        );
      }
    }, sec);

    return () => ctx.revert();
  }, []);

  const kindLabel = (kind: CareerMilestone["kind"]) =>
    kind === "work"
      ? isId
        ? "Pengalaman"
        : "Experience"
      : isId
        ? "Pendidikan"
        : "Education";

  return (
    <section id="experience" ref={sectionRef} className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
        <SectionHeading eyebrow={t("ggt-eyebrow")} title={t("ggt-h1")} />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-2.5 lg:col-span-5">
            {careerMilestones.map((item, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-timeline-item
                  aria-pressed={isSelected}
                  onClick={() => setActiveIdx(idx)}
                  className={`flex items-start gap-3.5 rounded-xl border p-4 text-left transition-colors ${
                    isSelected
                      ? "border-navy bg-navy text-background shadow-sm"
                      : "border-border-line bg-background text-foreground hover:border-navy/45"
                  }`}
                >
                  <div className="flex flex-col items-center pt-1.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isSelected ? "bg-background" : "bg-blue"
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <span className={isSelected ? "text-background/80" : "text-muted"}>
                        {item.period[lang]}
                      </span>
                      <span
                        className={`rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider ${
                          isSelected
                            ? "border-background/30 text-background/90"
                            : "border-border-line text-blue"
                        }`}
                      >
                        {kindLabel(item.kind)}
                      </span>
                    </div>

                    <div className="mt-1 text-sm font-semibold leading-snug">
                      {t(item.titleKey)}
                    </div>
                    <div
                      className={`mt-0.5 text-xs ${
                        isSelected ? "text-background/80" : "text-muted"
                      }`}
                    >
                      {t(item.organizationKey)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            data-timeline-detail
            className="rounded-2xl border border-border-line bg-background p-6 sm:p-8 lg:col-span-7 lg:sticky lg:top-24"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-line pb-4 font-mono text-xs text-muted">
              <span>{active.period[lang]}</span>
              <span className="rounded border border-border-line bg-surface/60 px-2 py-0.5 text-[11px] uppercase tracking-wider text-navy">
                {kindLabel(active.kind)}
              </span>
            </div>

            <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {t(active.titleKey)}
            </h3>
            <p className="mt-1 text-sm font-medium text-navy">
              {t(active.roleKey)} · {t(active.organizationKey)}
            </p>
            {active.locationKey ? (
              <p className="mt-1 text-xs text-muted">{t(active.locationKey)}</p>
            ) : null}

            <div className="mt-6 space-y-5">
              <div>
                <h4 className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {t("ggt-arch")}
                </h4>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {t(active.contextKey)}
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {t("ggt-resp")}
                </h4>
                <ul className="space-y-1.5 text-sm text-foreground/90">
                  {active.responsibilitiesKeys.map((key) => (
                    <li key={key} className="flex gap-2.5">
                      <span className="text-blue">–</span>
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {active.deliverables.length > 0 ? (
                <div className="border-t border-border-line pt-4">
                  <h4 className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {t("ggt-deliv")}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {active.deliverables.map((d) => (
                      <a
                        key={`${d.labelKey}-${d.url}`}
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-border-line bg-surface/40 px-3 py-1.5 font-mono text-xs font-medium text-blue transition-colors hover:border-navy hover:text-navy"
                      >
                        {t(d.labelKey)} ↗
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
