"use client";

import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { GsapReveal } from "@/components/gsap-reveal";
import { certifications, type CertificationCategory } from "@/lib/data/certifications";

const CATEGORY_LABEL: Record<CertificationCategory, { en: string; id: string }> = {
  dicoding: { en: "Dicoding Indonesia", id: "Dicoding Indonesia" },
  cisco: { en: "Cisco Networking Academy", id: "Cisco Networking Academy" },
  webinar: { en: "Webinars — IDwebTalks", id: "Webinar — IDwebTalks" },
  akademik: { en: "Academic", id: "Akademik" },
  lainnya: { en: "Others", id: "Lainnya" },
};

export function CredentialsSection() {
  const { t, lang } = useLang();
  const id = lang === "id";

  const groups = (Object.keys(CATEGORY_LABEL) as CertificationCategory[]).map((category) => ({
    category,
    items: certifications.filter((c) => c.category === category),
  }));

  return (
    <section id="certs" className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
        <SectionHeading
          eyebrow={id ? "Kredensial" : "Credentials"}
          title={
            <>
              {id ? "Sertifikat & " : "Credentials & "}
              <em className="not-italic text-navy">
                {id ? "kredensial" : "certifications"}
              </em>
            </>
          }
          intro={
            id
              ? "Diverifikasi langsung dari isi PDF (penerbit & tanggal) — tautan verifikasi untuk sertifikat Dicoding."
              : "Verified directly from the PDF contents (issuer & date) — verification links for Dicoding certificates."
          }
        />

        <div className="flex flex-col gap-14">
          {groups.map(({ category, items }) =>
            items.length === 0 ? null : (
              <section key={category}>
                <h3 className="mb-6 flex items-baseline gap-3 font-mono text-sm font-semibold uppercase tracking-wider text-navy">
                  {CATEGORY_LABEL[category][lang]}
                  <span className="text-xs font-normal normal-case text-muted">
                    {items.length} · {id ? "diverifikasi" : "verified"}
                  </span>
                </h3>
                <GsapReveal
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  stagger={0.06}
                  y={20}
                >
                  {items.map((cert) => (
                    <article
                      key={cert.slug}
                      data-reveal-item
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
                        <h4 className="text-[15px] font-semibold leading-snug text-foreground">
                          {t(cert.titleKey)}
                        </h4>
                        {cert.descKey ? (
                          <p className="text-sm text-muted">{t(cert.descKey)}</p>
                        ) : null}
                        {cert.issuer || cert.date ? (
                          <p className="font-mono text-[11px] text-muted">
                            {cert.issuer ? `${cert.issuer} · ` : ""}
                            {cert.date ?? ""}
                          </p>
                        ) : null}
                        {cert.note ? (
                          <p className="text-xs italic text-muted">{cert.note}</p>
                        ) : null}
                        <div className="mt-auto flex items-center gap-4 pt-3">
                          {cert.pdf ? (
                            <a
                              href={`/${cert.pdf}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs font-medium text-blue transition-colors hover:text-navy-light"
                            >
                              {id ? "Lihat sertifikat →" : "View certificate →"}
                            </a>
                          ) : null}
                          {cert.verifyUrl ? (
                            <a
                              href={cert.verifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-muted transition-colors hover:text-foreground"
                            >
                              {id ? "Verifikasi ↗" : "Verify ↗"}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </GsapReveal>
              </section>
            )
          )}
        </div>
      </div>
    </section>
  );
}
