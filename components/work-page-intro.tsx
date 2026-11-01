"use client";

import { useLang } from "@/components/providers";

export function WorkPageIntro() {
  const { lang } = useLang();
  const id = lang === "id";

  return (
    <>
      <p className="eyebrow mb-3">{id ? "Karya" : "Work"}</p>
      <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
        {id ? "Karya" : "Selected"} <span className="text-navy">{id ? "pilihan" : "work"}</span>
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        {id
          ? "Proyek pilihan beserta studi kasus. Semua klaim berbasis bukti dari repository GitHub — tautan sumber tersedia di setiap proyek."
          : "Selected projects with case studies. Every claim is evidence-based from the GitHub repository — source links are available on each project."}
      </p>
    </>
  );
}
