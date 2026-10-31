"use client";

import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { certifications } from "@/lib/data/certifications";

export function CredentialsSection() {
  const { t, lang } = useLang();

  return (
    <section id="certs" className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
        <SectionHeading
          eyebrow={lang === "id" ? "Kredensial" : "Credentials"}
          title={
            <>
              {lang === "id" ? "Sertifikat & " : "Credentials & "}
              <em className="not-italic text-navy">
                {lang === "id" ? "kredensial" : "certifications"}
              </em>
            </>
          }
          intro={
            lang === "id"
              ? "Sertifikat & kredensial yang terverifikasi — tanpa klaim berlebihan."
              : "Verified certifications & credentials — no overclaiming."
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <article
              key={cert.slug}
              className="group flex flex-col overflow-hidden rounded-xl border border-border-line bg-background transition-colors hover:border-navy/60"
            >
              <div className="aspect-[16/10] overflow-hidden bg-surface">
                <img
                  src={`/${cert.img}`}
                  alt={cert.alt}
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="text-[15px] font-semibold leading-snug text-foreground">
                  {t(cert.titleKey as never)}
                </h3>
                {cert.descKey ? (
                  <p className="text-sm text-muted">{t(cert.descKey as never)}</p>
                ) : null}
                {cert.pdf ? (
                  <a
                    href={`/${cert.pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto pt-3 font-mono text-xs font-medium text-blue transition-colors hover:text-navy-light"
                  >
                    {lang === "id" ? "Lihat sertifikat →" : "View certificate →"}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
