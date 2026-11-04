"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { gitMilestones, type GitBranch, type GitCommitMilestone } from "@/lib/data/git-milestones";
import { useWebAudioGlitch } from "@/lib/use-web-audio-glitch";
import { gsap, isReducedMotion } from "@/lib/gsap";

const BRANCH_TAG: Record<GitBranch, string> = {
  main: "border-navy/50 text-navy",
  edu: "border-blue/60 text-blue",
};

/**
 * Pattern 1 — Git-Graph Career Timeline & Telemetry HUD.
 * Kiri: pohon commit (node, hash, branch). Kanan: Telemetry HUD sticky.
 */
export function GitGraphTimeline() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const { playGlitch } = useWebAudioGlitch();

  const active = gitMilestones[activeIdx];

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    if (!sec || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const nodes = sec.querySelectorAll<HTMLElement>("[data-git-node]");
      gsap.fromTo(
        nodes,
        { autoAlpha: 0, x: -24 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.55,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: sec, start: "top 75%", once: true },
        }
      );

      const hud = sec.querySelector<HTMLElement>("[data-git-hud]");
      if (hud) {
        gsap.fromTo(
          hud,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: hud, start: "top 85%", once: true },
          }
        );
      }
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
        <SectionHeading
          eyebrow={t("ggt-eyebrow")}
          title={
            <>
              {t("ggt-h1")}
              <em className="not-italic text-navy">{t("ggt-h2")}</em>
            </>
          }
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {}
          <div className="flex flex-col gap-3 font-mono text-xs lg:col-span-5">
            {gitMilestones.map((item: GitCommitMilestone, idx: number) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-git-node
                  aria-pressed={isSelected}
                  onClick={() => {
                    setActiveIdx(idx);
                    playGlitch("click");
                  }}
                  className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                    isSelected
                      ? "border-navy bg-navy text-white shadow-md"
                      : "border-border-line bg-surface/50 text-foreground hover:border-navy/40"
                  }`}
                >
                  <div className="flex flex-col items-center pt-0.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full border-2 ${
                        isSelected ? "border-white bg-white" : "border-navy bg-blue"
                      }`}
                    />
                    {idx !== gitMilestones.length - 1 && (
                      <span className="my-1 h-8 w-0.5 bg-border-line" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 text-[11px] opacity-75">
                      <span>{item.hash}</span>
                      <span className={`rounded-full border px-1.5 py-px uppercase ${BRANCH_TAG[item.branch]}`}>
                        {item.branch}
                      </span>
                    </div>
                    <div className="mt-0.5 font-semibold text-sm">{t(item.titleKey)}</div>
                    <div className="text-xs opacity-80">
                      {t(item.organizationKey)}
                      {item.locationKey ? ` · ${t(item.locationKey)}` : ""}
                    </div>
                    <div className="mt-0.5 text-[11px] opacity-60">{item.dateLabel} · {item.year}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {}
          <div
            data-git-hud
            className="rounded-xl border border-border-line bg-background p-6 font-mono shadow-sm lg:col-span-7 lg:sticky lg:top-24"
          >
            <div className="mb-4 flex items-center justify-between border-b border-border-line pb-3 text-xs text-muted">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                {t("ggt-telemetry")}
                <span aria-hidden="true">{" // "}</span>
                {active.hash}
              </span>
              <span>
                {t("ggt-branch")}: {active.branch.toUpperCase()}
              </span>
            </div>

            <h3 className="mb-1 font-sans text-lg font-bold text-foreground">{t(active.titleKey)}</h3>
            <p className="mb-1 text-sm font-semibold text-navy">
              {t(active.roleKey)} · {t(active.organizationKey)}
            </p>
            {active.locationKey ? (
              <p className="mb-4 text-xs text-muted">
                {t(active.locationKey)} · {active.dateLabel}
              </p>
            ) : (
              <p className="mb-4 text-xs text-muted">{active.dateLabel}</p>
            )}

            <div className="space-y-4 text-xs text-foreground/85">
              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-muted">
                  {t("ggt-arch")}
                </div>
                <p className="rounded-md border border-border-line/50 bg-surface/40 p-3 font-sans text-sm leading-relaxed">
                  {t(active.contextKey)}
                </p>
              </div>

              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-muted">
                  {t("ggt-resp")}
                </div>
                <ul className="space-y-1 font-sans text-sm">
                  {active.responsibilitiesKeys.map((key) => (
                    <li key={key} className="flex gap-2">
                      <span className="text-blue">▸</span>
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-1 text-[10px] uppercase tracking-wider text-muted">
                  {t("ggt-deliv")}
                </div>
                {active.deliverables.length > 0 ? (
                  <ul className="flex flex-col gap-1.5">
                    {active.deliverables.map((d) => (
                      <li key={`${d.labelKey}-${d.url}`}>
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue transition-colors hover:text-navy-light"
                        >
                          {t(d.labelKey)} ↗
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs italic text-muted">{t("ggt-none")}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
