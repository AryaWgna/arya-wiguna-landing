import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center pt-16">
      <div className="container-x py-24 text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Sepertinya halaman yang kamu cari sudah pindah atau tidak pernah ada.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            ← Kembali ke beranda
          </Link>
          <Link href="/#projects" className="btn">
            Lihat karya
          </Link>
        </div>
      </div>
    </main>
  );
}
