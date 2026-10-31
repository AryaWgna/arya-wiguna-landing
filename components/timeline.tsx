"use client";

import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { GsapReveal } from "@/components/gsap-reveal";
import { education, experience, type TimelineEntry } from "@/lib/data/experience";

export function TimelineSection({
  kind,
}: {
  kind: "experience" | "education";
}) {
  const { t } = useLang();
  const items: TimelineEntry[] = kind === "experience" ? experience : education;

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

  return (
    <section id={kind} className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
        <SectionHeading eyebrow={heading.eyebrow} title={heading.title} />
        <GsapReveal
          as="ol"
          className="relative border-l border-border-line pl-8"
          stagger={0.12}
          y={20}
        >
          {items.map((item) => (
            <li key={item.id} data-reveal-item className="relative pb-12 last:pb-0">
              <span
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
        </GsapReveal>
      </div>
    </section>
  );
}
