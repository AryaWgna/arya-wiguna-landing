"use client";

import Image from "next/image";
import { useLang } from "@/components/providers";
import { GsapReveal } from "@/components/gsap-reveal";
import { profile } from "@/lib/data/profile";

const bios = {
  en: [
    <>
      I&apos;m <strong className="font-semibold text-foreground">Arya Wiguna</strong>, an
      Informatics Engineering graduate (
      <strong className="font-semibold text-foreground">S1 Teknik Informatika</strong>, Universitas
      Binaniaga Indonesia) based in Bogor. Certified by{" "}
      <strong className="font-semibold text-foreground">BNSP as a Junior Coder</strong>, I build
      field-tested mobile applications in{" "}
      <strong className="font-semibold text-foreground">Flutter</strong> alongside modular web
      backends with <strong className="font-semibold text-foreground">Next.js 15</strong>,{" "}
      <strong className="font-semibold text-foreground">Laravel 11</strong>, and{" "}
      <strong className="font-semibold text-foreground">Bun</strong>.
    </>,
    <>
      My focus is practical software engineering: clear relational schemas, explicit state
      management, and reproducible multi-container setups with{" "}
      <strong className="font-semibold text-foreground">Docker Compose</strong> and{" "}
      <strong className="font-semibold text-foreground">Nginx</strong>. From hospital medical
      equipment tracking at RS UMMI Bogor to airport flight display boards, I care most about
      systems that stay maintainable in daily operation.
    </>,
  ],
  id: [
    <>
      Saya <strong className="font-semibold text-foreground">Arya Wiguna</strong>, lulusan{" "}
      <strong className="font-semibold text-foreground">S1 Teknik Informatika</strong> Universitas
      Binaniaga Indonesia asal Bogor. Memiliki sertifikasi kompetensi nasional{" "}
      <strong className="font-semibold text-foreground">BNSP (Pemrogram Junior)</strong>, saya
      mengembangkan aplikasi mobile{" "}
      <strong className="font-semibold text-foreground">Flutter</strong> untuk kebutuhan lapangan
      serta sistem backend web berbasis{" "}
      <strong className="font-semibold text-foreground">Next.js 15</strong>,{" "}
      <strong className="font-semibold text-foreground">Laravel 11</strong>, dan{" "}
      <strong className="font-semibold text-foreground">Bun</strong>.
    </>,
    <>
      Pendekatan kerja saya berfokus pada hal fundamental: skema database relasional yang rapi,
      state management yang mudah dilacak, serta isolasi layanan dengan{" "}
      <strong className="font-semibold text-foreground">Docker Compose</strong> dan{" "}
      <strong className="font-semibold text-foreground">Nginx</strong>. Mulai dari sistem inventaris
      alat medis di RS UMMI Bogor hingga papan jadwal penerbangan bandara, prioritas saya adalah
      sistem yang andal saat dipakai bekerja.
    </>,
  ],
};

const stats = {
  en: [
    { value: "S1", label: "Informatika (UNBIN)" },
    { value: "3.77", label: "Cumulative GPA" },
    { value: "BNSP", label: "Junior Coder Cert" },
    { value: "71", label: "SIMARU Commits" },
  ],
  id: [
    { value: "S1", label: "Informatika (UNBIN)" },
    { value: "3,77", label: "IPK Kelulusan" },
    { value: "BNSP", label: "Pemrogram Junior" },
    { value: "71", label: "Commit SIMARU" },
  ],
};

export function AboutSection() {
  const { lang } = useLang();
  const isId = lang === "id";

  return (
    <section id="about" className="border-t border-border-line">
      <div className="container-x py-20 md:py-28">
        <div className="grid items-start gap-12 md:gap-14 lg:grid-cols-12 lg:gap-10">
          <GsapReveal className="lg:col-span-4" y={14} once>
            <p className="eyebrow mb-3">{isId ? "Tentang" : "About"}</p>
            <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {isId
                ? "Aplikasi mobile & sistem backend dengan pendekatan pragmatis"
                : "Mobile apps & backend systems, built pragmatically"}
            </h2>
          </GsapReveal>

          <GsapReveal className="max-w-[260px] lg:col-span-3 lg:max-w-none" y={14} once>
            <figure className="overflow-hidden rounded-2xl border border-border-line bg-surface/40">
              <div className="aspect-square w-full overflow-hidden bg-surface">
                <Image
                  src={profile.portrait}
                  alt={profile.name}
                  width={460}
                  height={460}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-2 border-t border-border-line bg-background px-3.5 py-2.5 font-mono text-[11px] text-muted">
                <span className="font-medium text-foreground">Bogor, ID</span>
                <span className="text-blue">
                  {isId ? "Terbuka bekerja" : "Open to roles"}
                </span>
              </figcaption>
            </figure>
          </GsapReveal>

          <GsapReveal className="flex flex-col gap-5 lg:col-span-5" stagger={0.08} y={14}>
            {bios[lang].map((p, i) => (
              <p key={i} data-reveal-item className="leading-relaxed text-muted">
                {p}
              </p>
            ))}

            <dl
              data-reveal-item
              className="mt-4 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border-line pt-6 sm:grid-cols-4 lg:grid-cols-2"
            >
              {stats[lang].map((s) => (
                <div key={s.label} className="border-l-2 border-blue/70 pl-3.5">
                  <dd className="font-mono text-2xl font-semibold leading-none text-foreground sm:text-3xl">
                    {s.value}
                  </dd>
                  <dt className="mt-2 font-mono text-[11px] uppercase tracking-wide text-muted">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </GsapReveal>
        </div>
      </div>
    </section>
  );
}
