"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "@/components/providers";
import { GsapReveal } from "@/components/gsap-reveal";
import { profile } from "@/lib/data/profile";
import { gsap, isReducedMotion } from "@/lib/gsap";

const bios = {
  en: [
    <>
      I&apos;m <strong className="font-semibold text-foreground">Arya Wiguna</strong>, an
      Informatics Engineering graduate (<strong className="font-semibold text-foreground">S1 Teknik Informatika</strong>,
      Universitas Binaniaga Indonesia) based in Bogor. Certified by{" "}
      <strong className="font-semibold text-foreground">BNSP as a Junior Coder</strong>, I build
      field-tested mobile applications in <strong className="font-semibold text-foreground">Flutter</strong>{" "}
      alongside modular web backends with <strong className="font-semibold text-foreground">Next.js 15</strong>,{" "}
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
      mengembangkan aplikasi mobile <strong className="font-semibold text-foreground">Flutter</strong>{" "}
      untuk kebutuhan lapangan serta sistem backend web berbasis{" "}
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
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    const imgWrap = imgRef.current;
    if (!sec || !imgWrap || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const img = imgWrap.querySelector("img");
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.1 },
          {
            yPercent: 6,
            scale: 1.1,
            ease: "none",
            scrollTrigger: {
              trigger: imgWrap,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      }
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="border-t border-border-line">
      <div className="container-x py-20 md:py-28">
        <div className="grid gap-12 md:gap-14 lg:grid-cols-12 lg:gap-8">
          <GsapReveal className="lg:col-span-4" y={14} once>
            <p className="eyebrow mb-3">{isId ? "Tentang" : "About"}</p>
            <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              {isId
                ? "Aplikasi mobile & sistem backend dengan pendekatan pragmatis"
                : "Mobile apps & backend systems, built pragmatically"}
            </h2>
          </GsapReveal>

          <div className="max-md:max-w-[280px] lg:col-span-3">
            <div ref={imgRef} className="parallax-img-wrap relative aspect-[3/4] w-full">
              <Image
                src={profile.portrait}
                alt="Arya Wiguna"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 40vw, 80vw"
                className="object-cover"
              />
              <div className="absolute bottom-3.5 left-3.5 z-10 rounded-md border border-border-line bg-background/95 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-navy backdrop-blur-sm">
                {isId ? "Bogor · Terbuka bekerja" : "Bogor · Open to roles"}
              </div>
            </div>
          </div>

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
