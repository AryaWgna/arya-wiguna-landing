"use client";

import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { expertiseGroups } from "@/lib/data/expertise";

export function ExpertiseSection() {
  const { t, lang } = useLang();

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
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border-line bg-border-line sm:grid-cols-2 lg:grid-cols-3">
          {expertiseGroups.map((group) => (
            <div key={group.key} className="bg-background p-7">
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
                    className="rounded-full border border-border-line px-3 py-1 text-[13px] text-foreground/85"
                  >
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
