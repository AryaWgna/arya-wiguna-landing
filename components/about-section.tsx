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
      I&apos;m <strong className="font-semibold">Arya Wiguna</strong>, a computer science graduate
      (S1 Informatika) and software engineer from Bogor, Indonesia. Certified by{" "}
      <strong className="font-semibold">BNSP as a Junior Coder</strong>, I specialize in building
      production-grade mobile apps with <strong className="font-semibold">Flutter</strong> and
      modular web backends using <strong className="font-semibold">Next.js 15</strong>,{" "}
      <strong className="font-semibold">Laravel 11</strong>, and{" "}
      <strong className="font-semibold">Bun</strong>.
    </>,
    <>
      I prioritize pragmatic software design over industry hype: clean relational schemas,
      predictable state management, and containerized microservices orchestrated with{" "}
      <strong className="font-semibold">Docker Compose</strong>. From hospital medical asset tracking
      at RS UMMI to real-time airport flight displays (Skyboard), I build systems built to stay
      dependable under real-world operational constraints.
    </>,
  ],
  id: [
    <>
      Saya <strong className="font-semibold">Arya Wiguna</strong>, lulusan S1 Teknik Informatika dan
      software engineer asal Bogor. Memiliki sertifikasi resmi{" "}
      <strong className="font-semibold">BNSP (Junior Coder)</strong>, saya berfokus pada pengembangan
      aplikasi mobile <strong className="font-semibold">Flutter</strong> siap rilis serta arsitektur
      web modular berbasis <strong className="font-semibold">Next.js 15</strong>,{" "}
      <strong className="font-semibold">Laravel 11</strong>, dan{" "}
      <strong className="font-semibold">Bun</strong>.
    </>,
    <>
      Pendekatan saya mengutamakan rekayasa pragmatis: skema database relasional yang rapi, state
      management terprediksi, dan orkestrasi container dengan{" "}
      <strong className="font-semibold">Docker Compose</strong> tanpa abstraksi berlebihan. Mulai dari
      sistem pelacakan alat medis di RS UMMI hingga display FIDS bandara real-time, prioritas saya
      adalah keandalan nyata di lingkungan kerja.
    </>,
  ],
};

type StatItem = {
  value?: number;
  suffix?: string;
  staticText?: string;
  label: string;
};

const stats: Record<"en" | "id", StatItem[]> = {
  en: [
    { staticText: "S1", label: "Informatika Degree" },
    { staticText: "BNSP", label: "Junior Coder Cert" },
    { value: 71, suffix: "+", label: "Verified Commits" },
    { value: 3, label: "Core Architectures" },
  ],
  id: [
    { staticText: "S1", label: "Teknik Informatika" },
    { staticText: "BNSP", label: "Sertifikasi Profesi" },
    { value: 71, suffix: "+", label: "Commit Terverifikasi" },
    { value: 3, label: "Arsitektur Utama" },
  ],
};

export function AboutSection() {
  const { lang } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = statsRef.current;
    const sec = sectionRef.current;
    if (!el || !sec || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Count-up angka statistik
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((num) => {
        const target = Number(num.dataset.count || "0");
        if (target <= 0) return;
        const suffix = num.dataset.suffix || "";
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: num, start: "top 90%", once: true },
          onUpdate: () => {
            num.textContent = Math.round(obj.val) + suffix;
          },
        });
      });

      // Parallax pada portrait image
      const imgWrap = imgRef.current;
      if (imgWrap) {
        const img = imgWrap.querySelector("img");
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8, scale: 1.15 },
            {
              yPercent: 8,
              scale: 1.15,
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
      }

      // Section heading slide in from left
      const heading = sec.querySelector("[data-about-heading]");
      if (heading) {
        gsap.fromTo(
          heading,
          { autoAlpha: 0, x: -40 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 85%", once: true },
          }
        );
      }
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="border-t border-border-line">
      <div className="container-x py-16 md:py-24">
        <div className="grid gap-12 md:gap-14 lg:grid-cols-12 lg:gap-8">
          <div data-about-heading className="lg:col-span-4">
            <p className="eyebrow mb-3">About</p>
            <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              I build things for the{" "}
              <em className="not-italic text-navy">web &amp; mobile</em>
            </h2>
          </div>

          <div className="max-md:max-w-[280px] lg:col-span-3">
            <div ref={imgRef} className="parallax-img-wrap relative aspect-[3/4] w-full">
              <Image
                src={profile.portrait}
                alt="Arya Wiguna"
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 40vw, 80vw"
                className="object-cover"
              />
              <div className="absolute bottom-4 left-4 z-10 rounded-full border border-border-line bg-background/95 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-blue backdrop-blur-sm">
                {lang === "id" ? "Tersedia untuk proyek" : "Available for hire"}
              </div>
            </div>
          </div>

          <GsapReveal
            className="flex flex-col gap-5 lg:col-span-5"
            stagger={0.08}
            y={18}
          >
            {bios[lang].map((p, i) => (
              <p key={i} data-reveal-item className="leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
            <div
              ref={statsRef}
              data-reveal-item
              className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-2"
            >
              {stats[lang].map((s) => (
                <div key={s.label} className="border-l border-border-line pl-4">
                  <div
                    {...(s.value ? { "data-count": s.value, "data-suffix": s.suffix ?? "" } : {})}
                    className="font-mono text-3xl font-semibold leading-none text-navy"
                  >
                    {s.staticText ?? `${s.value}${s.suffix ?? ""}`}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-wide text-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </GsapReveal>
        </div>
      </div>
    </section>
  );
}
