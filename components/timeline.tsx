"use client";

import { useLayoutEffect, useRef } from "react";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { education, experience, type TimelineEntry } from "@/lib/data/experience";
import { gsap, isReducedMotion } from "@/lib/gsap";

export function TimelineSection({
  kind,
}: {
  kind: "experience" | "education";
}) {
  const { t } = useLang();
  const items: TimelineEntry[] = kind === "experience" ? experience : education;
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const heading =
    kind === "experience"
      ? {
          eyebrow: t("exp-tag"),
          title: (
            <>
              {t("exp-h1")}
              <em className="not-italic text-navy">{t("exp-h2")}</em>
            </>
          ),
        }
      : {
          eyebrow: t("edu-tag"),
          title: (
            <>
              {t("edu-h1")}
              <em className="not-italic text-navy">{t("edu-h2")}</em>
            </>
          ),
        };

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    const line = lineRef.current;
    if (!sec || !line || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Animate the timeline line drawing
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "bottom 30%",
            scrub: 0.5,
          },
        }
      );

      // Stagger each timeline entry
      const entries = sec.querySelectorAll<HTMLElement>("[data-timeline-item]");
      gsap.fromTo(
        entries,
        { autoAlpha: 0, x: -30 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 75%",
            once: true,
          },
        }
      );

      // Animate dots
      const dots = sec.querySelectorAll<HTMLElement>("[data-timeline-dot]");
      gsap.fromTo(
        dots,
        { scale: 0, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.4,
          stagger: 0.15,
          ease: "back.out(3)",
          scrollTrigger: {
            trigger: sec,
            start: "top 75%",
            once: true,
          },
          delay: 0.2,
        }
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id={kind} ref={sectionRef} className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
        <SectionHeading eyebrow={heading.eyebrow} title={heading.title} />
        <ol className="relative pl-8">
          {/* Animated line */}
          <div
            ref={lineRef}
            className="absolute left-0 top-0 bottom-0 w-px bg-border-line origin-top"
            aria-hidden="true"
          />
          {items.map((item) => (
            <li key={item.id} data-timeline-item className="relative pb-12 last:pb-0">
              <span
                data-timeline-dot
                className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full border-2 border-blue bg-background"
                aria-hidden="true"
              />
              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs tracking-wide text-muted">{item.date}</p>
                <h3 className="text-xl font-semibold text-foreground">{t(item.roleKey)}</h3>
                <div className="text-sm text-muted">
                  {t(item.companyKey)} · {t(item.locationKey)}
                </div>
                <p className="mt-2 max-w-2xl leading-relaxed text-foreground/85">
                  {t(item.descKey)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
