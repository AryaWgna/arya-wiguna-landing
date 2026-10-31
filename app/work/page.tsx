import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Karya",
  description:
    "Proyek pilihan Arya Wiguna — studi kasus dengan bukti & tautan sumber.",
};

export default function WorkPage() {
  return (
    <main className="pt-16">
      <div className="container-x py-24 md:py-32">
        <p className="eyebrow mb-3">Work</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Selected <span className="text-navy">work</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Proyek pilihan beserta studi kasus. Detail lebih lanjut (peran, tanggal,
          kontribusi individu) sedang dilengkapi; tautan sumber tersedia di setiap proyek.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-border-line bg-background transition-colors hover:border-navy/60"
            >
              <div className="overflow-hidden bg-surface">
                <img
                  src={`/${project.thumb}`}
                  alt={project.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {project.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted">{project.desc}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-3">
                  {project.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-border-line px-3 py-0.5 font-mono text-[11px] text-muted"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
