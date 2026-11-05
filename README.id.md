# arya-wiguna.my.id

Kode sumber website portfolio pribadi saya di **[arya-wiguna.my.id](https://arya-wiguna.my.id)**.

**Read in [English](README.md).**

## Stack

- **Framework:** Next.js 15 (App Router, static generation)
- **Bahasa:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + Geist & Geist Mono (`next/font`)
- **Animasi & UI:** GSAP + Lenis smooth scroll, tirai pembuka editorial, dan skema arsitektur SVG interaktif di bagian hero (mendukung `prefers-reduced-motion`)
- **Formulir Kontak:** Web3Forms

## Struktur Direktori

```text
app/                  # Layout utama, beranda, halaman studi kasus /work/[slug], sitemap, robots
components/           # Komponen section, alur arsitektur interaktif, custom cursor, provider tema/bahasa
lib/
  data/               # Data bertipe untuk profil, proyek, sertifikasi, stack teknis, dan riwayat karier
  i18n/messages.ts    # Kamus dwibahasa (EN / ID)
  gsap.ts             # Utilitas GSAP + Lenis
public/assets/        # File PDF CV, tangkapan layar proyek, dan pindaian sertifikat
scripts/              # Skrip pengecekan kelengkapan aset
```

## Pengembangan Lokal

```bash
npm install
npm run dev           # Menjalankan server pengembangan lokal
npm run check:assets  # Memastikan seluruh gambar & PDF tersedia di public/
npm run typecheck     # Pemeriksaan tipe TypeScript
npm run lint          # Pemeriksaan ESLint
npm run build         # Build produksi statis
```

## Lisensi

Kode sumber berlisensi MIT; dokumen pribadi, CV, dan pindaian sertifikat di dalam `public/assets/` merupakan milik Arya Wiguna.
