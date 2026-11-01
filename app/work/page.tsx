import type { Metadata } from "next";
import { WorkGrid } from "@/components/work-grid";

export const metadata: Metadata = {
  title: "Karya",
  description:
    "Proyek pilihan Arya Wiguna — studi kasus dengan bukti & tautan sumber.",
};

export default function WorkPage() {
  return (
    <main className="pt-16">
      <div className="container-x py-16 pb-24 md:py-20 md:pb-28">
        <p className="eyebrow mb-3">Work</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Selected <span className="text-navy">work</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Proyek pilihan beserta studi kasus. Semua klaim berbasis bukti dari repository
          GitHub — tautan sumber tersedia di setiap proyek.
        </p>
        <WorkGrid />
      </div>
    </main>
  );
}
