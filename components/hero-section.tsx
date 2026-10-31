"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLang } from "@/components/providers";
import { CvDropdown } from "@/components/cv-dropdown";
import { profile } from "@/lib/data/profile";

const Hero3D = dynamic(() => import("@/components/hero-3d"), { ssr: false });

export function HeroSection() {
  const { lang } = useLang();
  const viewWork = lang === "id" ? "Lihat Karya" : "View Work";
  const getInTouch = lang === "id" ? "Hubungi Saya" : "Get in Touch";

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="container-x flex min-h-[92svh] items-center py-28 md:py-32">
        <div className="grid w-full items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-5">{profile.role[lang]}</p>
            <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Arya
              <br />
              <span className="text-navy">Wiguna</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {profile.heroLine[lang]}
            </p>
            <blockquote className="mt-6 border-l-2 border-blue pl-4 text-[15px] italic text-foreground">
              {profile.motto[lang]}
            </blockquote>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/work" className="btn btn-primary">
                {viewWork}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <CvDropdown />
              <a href={`mailto:${profile.email}`} className="btn">
                {getInTouch}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Hero3D />
            <p className="mt-4 text-center font-mono text-[11px] tracking-wide text-muted">
              procedural 3D hero accent — WebGL optional
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
