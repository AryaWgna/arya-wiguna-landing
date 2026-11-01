import type { Metadata } from "next";
import { WorkGrid } from "@/components/work-grid";
import { WorkPageIntro } from "@/components/work-page-intro";

export const metadata: Metadata = {
  title: "Karya",
  description:
    "Proyek pilihan Arya Wiguna — studi kasus dengan bukti & tautan sumber.",
};

export default function WorkPage() {
  return (
    <main className="pt-16">
      <div className="container-x py-16 pb-24 md:py-20 md:pb-28">
        <WorkPageIntro />
        <WorkGrid />
      </div>
    </main>
  );
}
