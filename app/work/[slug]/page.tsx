import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Proyek tidak ditemukan" };
  return {
    title: project.title,
    description: project.desc,
  };
}

function TodoBlock({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border-line p-5">
      <h3 className="font-mono text-sm font-semibold text-navy">{title}</h3>
      <p className="mt-2 text-sm text-muted">{note}</p>
    </div>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="pt-16">
      <div className="container-x py-20 md:py-28">
        <Link
          href="/work"
          className="font-mono text-sm text-muted transition-colors hover:text-foreground"
        >
          ← Back to work
        </Link>

        <div className="mt-10 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            {project.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border-line px-3 py-0.5 font-mono text-[11px] text-muted"
              >
                {chip}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{project.desc}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Lihat sumber ↗
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          <TodoBlock
            title="Context / Problem"
            note="TODO: deskripsi konteks & masalah yang dipecahkan, menunggu konfirmasi pemilik proyek."
          />
          <TodoBlock
            title="Role & Contributions"
            note="TODO: peran individual & kontribusi spesifik (vs kerja tim), menunggu verifikasi."
          />
          <TodoBlock
            title="Approach & Implementation"
            note="TODO: pendekatan teknis, arsitektur, dan implementasi — tautan sumber sudah tersedia di atas."
          />
          <TodoBlock
            title="Outcome & Lessons"
            note="TODO: hasil & pelajaran (hanya kualitatif yang terverifikasi; tanpa metrik karangan)."
          />
        </div>

        {project.thumb ? (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
              Evidence
            </h2>
            <div className="overflow-hidden rounded-xl border border-border-line bg-surface">
              <img
                src={`/${project.thumb}`}
                alt={project.title}
                className="aspect-video w-full object-cover"
              />
            </div>
            <p className="mt-4 text-sm text-muted">
              Preview ilustratif. Screenshot/arsitektur asli menyusul setelah diverifikasi.
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
