"use client";

import { useLang } from "@/components/providers";
import { GsapReveal } from "@/components/gsap-reveal";

export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  meta,
}: {
  index?: string;
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  const { lang } = useLang();
  return (
    <GsapReveal className="mb-10 md:mb-14" y={16} once>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border-line bg-surface px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase">
          <span className="h-2 w-2 rounded-full bg-navy" aria-hidden="true" />
          {index ? <span className="text-muted">{index}</span> : null}
          {index && eyebrow ? <span className="text-border-line">/</span> : null}
          {eyebrow ? <span className="text-foreground">{eyebrow}</span> : null}
        </div>

        {meta ? (
          <span className="rounded-full border border-border-line bg-surface/60 px-3 py-1 font-mono text-[11px] text-muted">
            {meta}
          </span>
        ) : null}
      </div>

      <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-10">
        <h2 className="text-3xl leading-[1.08] font-bold tracking-[-0.03em] text-foreground sm:text-5xl lg:col-span-7">
          {title}
        </h2>
        {intro ? (
          <p
            className="max-w-xl text-sm leading-relaxed text-muted sm:text-[15px] lg:col-span-5 lg:justify-self-end"
            lang={lang}
          >
            {intro}
          </p>
        ) : null}
      </div>
    </GsapReveal>
  );
}
