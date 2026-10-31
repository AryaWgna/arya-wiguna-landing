"use client";

import Image from "next/image";
import { useLang } from "@/components/providers";
import { profile } from "@/lib/data/profile";

const bios = {
  en: [
    <>
      I&apos;m <strong className="font-semibold">Arya Wiguna</strong>, a full-stack developer
      from Indonesia. I love turning complex problems into simple, beautiful, and intuitive
      solutions. My toolkit spans from <strong className="font-semibold">React</strong> and{" "}
      <strong className="font-semibold">Vue</strong> on the frontend to{" "}
      <strong className="font-semibold">Node.js</strong>,{" "}
      <strong className="font-semibold">Laravel</strong>, and{" "}
      <strong className="font-semibold">Go</strong> on the backend.
    </>,
    <>
      Currently exploring <strong className="font-semibold">cloud architecture</strong> and
      contributing to open-source projects. When I&apos;m not coding, I&apos;m probably
      learning something new or refining my craft.
    </>,
  ],
  id: [
    <>
      Saya <strong className="font-semibold">Arya Wiguna</strong>, developer full stack dari
      Indonesia. Saya suka mengubah masalah rumit menjadi solusi sederhana, indah, dan
      intuitif. Perangkat saya mencakup <strong className="font-semibold">React</strong> dan{" "}
      <strong className="font-semibold">Vue</strong> di frontend, serta{" "}
      <strong className="font-semibold">Node.js</strong>,{" "}
      <strong className="font-semibold">Laravel</strong>, dan{" "}
      <strong className="font-semibold">Go</strong> di backend.
    </>,
    <>
      Saat ini sedang mendalami <strong className="font-semibold">arsitektur cloud</strong> dan
      berkontribusi pada proyek open-source. Saat tidak menulis kode, saya biasanya belajar hal
      baru atau mengasah kemampuan.
    </>,
  ],
};

const stats = {
  en: [
    { value: "6", label: "Languages" },
    { value: "5", label: "Frontend" },
    { value: "5", label: "Backend" },
    { value: "3", label: "DevOps" },
  ],
  id: [
    { value: "6", label: "Bahasa" },
    { value: "5", label: "Frontend" },
    { value: "5", label: "Backend" },
    { value: "3", label: "DevOps" },
  ],
};

export function AboutSection() {
  const { lang } = useLang();

  return (
    <section id="about" className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-3">About</p>
            <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              I build things for the{" "}
              <em className="not-italic text-navy">web &amp; mobile</em>
            </h2>
          </div>

          <div className="lg:col-span-8">
            <div className="grid gap-10 md:grid-cols-[200px_1fr]">
              <div className="relative">
                <Image
                  src={profile.portrait}
                  alt="Arya Wiguna"
                  width={200}
                  height={200}
                  className="rounded-xl border border-border-line object-cover"
                />
                <div className="absolute -bottom-3 left-4 rounded-full border border-border-line bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-blue">
                  {lang === "id" ? "Tersedia untuk proyek" : "Available for hire"}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                {bios[lang].map((p, i) => (
                  <p key={i} className="leading-relaxed text-foreground/90">
                    {p}
                  </p>
                ))}
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {stats[lang].map((s) => (
                    <div key={s.label} className="border-l border-border-line pl-3">
                      <div className="font-mono text-2xl font-semibold text-navy">{s.value}</div>
                      <div className="mt-1 text-xs text-muted">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
