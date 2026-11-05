"use client";

import Link from "next/link";
import { useLang } from "@/components/providers";

export default function NotFound() {
  const { lang } = useLang();
  const isId = lang === "id";

  return (
    <main className="flex min-h-[70vh] items-center justify-center pt-16">
      <div className="container-x py-24 text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          {isId ? "Halaman tidak ditemukan" : "Page not found"}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          {isId
            ? "Halaman yang Anda tuju sudah dipindahkan atau tidak tersedia."
            : "The page you requested may have moved or no longer exists."}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            {isId ? "← Kembali ke beranda" : "← Back to home"}
          </Link>
          <Link href="/#projects" className="btn">
            {isId ? "Lihat proyek" : "View projects"}
          </Link>
        </div>
      </div>
    </main>
  );
}
