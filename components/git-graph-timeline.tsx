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
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: sec, start: "top 80%", once: true },
        }
      );

      const panel = sec.querySelector<HTMLElement>("[data-timeline-detail]");
      if (panel) {
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
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
    <section id="experience" ref={sectionRef} className="py-16 md:py-24">
      <div className="container-x">
        <SectionHeading
          index="04"
          eyebrow={t("ggt-eyebrow")}
          meta={
            isId
              ? `0${careerMilestones.length} Riwayat Terverifikasi`
              : `0${careerMilestones.length} Verified Milestones`
          }
          title={
            isId ? (
              <>
                Jejak karier, magang rumah sakit &amp;{" "}
                <span className="font-editorial font-normal italic text-navy">
                  fondasi akademik.
                </span>
              </>
            ) : (
              <>
                Hospital engineering, internships &amp;{" "}
                <span className="font-editorial font-normal italic text-navy">
                  academic foundation.
                </span>
              </>
            )
          }
        />

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          {/* Left Selector Stack (5 cols) */}
          <div className="flex flex-col gap-3 lg:col-span-5">
            {careerMilestones.map((item, idx) => {
              const isSelected = idx === activeIdx;
              const num = String(idx + 1).padStart(2, "0");
              return (
                <button
                  key={item.id}
                  type="button"
                  data-timeline-item
                  aria-pressed={isSelected}
                  onClick={() => setActiveIdx(idx)}
                  className={`group relative flex items-start gap-4 rounded-3xl border p-5 text-left transition-all ${
                    isSelected
                      ? "border-navy bg-navy text-background shadow-xl"
                      : "border-border-line bg-surface/65 text-foreground hover:border-navy/45 hover:bg-surface"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
                      isSelected
                        ? "bg-black/15 text-background"
                        : "border border-border-line bg-background text-navy"
                    }`}
                  >
                    {num}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <span className={isSelected ? "text-background/80" : "text-muted"}>
                        {item.period[lang]}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isSelected
                            ? "bg-black/15 text-background"
                            : "border border-border-line bg-background text-navy"
                        }`}
                      >
                        {kindLabel(item.kind)}
                      </span>
                    </div>

                    <div className="mt-2 text-base font-bold leading-snug">
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

          {/* Right Dossier Bento Card (7 cols) */}
          <div
            data-timeline-detail
            className="bento-card p-6 sm:p-8 lg:col-span-7 lg:sticky lg:top-24 lg:p-9"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-line pb-4">
              <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-navy">
                <span className="h-2 w-2 rounded-full bg-navy" />
                {active.period[lang]}
              </span>
              <span className="rounded-full border border-border-line bg-surface px-3 py-1 font-mono text-[11px] font-semibold uppercase text-foreground">
                {kindLabel(active.kind)}
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              {t(active.titleKey)}
            </h3>
            <p className="mt-1.5 text-sm font-semibold text-navy">
              {t(active.roleKey)} · {t(active.organizationKey)}
            </p>
            {active.locationKey ? (
              <p className="mt-1 font-mono text-xs text-muted">{t(active.locationKey)}</p>
            ) : null}

            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-border-line bg-surface/50 p-5">
                <h4 className="mb-2 font-mono text-[11px] font-bold uppercase tracking-wider text-navy">
                  {t("ggt-arch")}
                </h4>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {t(active.contextKey)}
                </p>
              </div>

              <div>
                <h4 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
                  {t("ggt-resp")}
                </h4>
                <ul className="space-y-2.5 text-sm text-foreground/90">
                  {active.responsibilitiesKeys.map((key, idx) => (
                    <li
                      key={key}
                      className="flex gap-3 rounded-2xl border border-border-line bg-surface/35 p-3.5"
                    >
                      <span className="font-mono text-xs font-bold text-navy">
                        0{idx + 1}
                      </span>
                      <span className="leading-relaxed">{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {active.deliverables.length > 0 ? (
                <div className="border-t border-border-line pt-5">
                  <h4 className="mb-3 font-mono text-[11px] font-bold uppercase tracking-wider text-muted">
                    {t("ggt-deliv")}
                  </h4>
                  <div className="flex flex-wrap gap-2.5">
                    {active.deliverables.map((d) => (
                      <a
                        key={`${d.labelKey}-${d.url}`}
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn !py-2 !px-4 font-mono !text-xs"
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
