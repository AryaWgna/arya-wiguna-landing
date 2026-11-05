import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/data/projects";
import { messages, type MessageKey } from "@/lib/i18n/messages";
import { CaseStudyContent } from "@/components/case-study-content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };

  const title = messages[project.titleKey as MessageKey]?.[0] ?? project.titleKey;
  const description = messages[project.summaryKey as MessageKey]?.[0] ?? project.summaryKey;
  return { title, description };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="pt-16">
      <CaseStudyContent project={project} />
    </main>
  );
}
