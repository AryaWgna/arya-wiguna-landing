# Arya Wiguna — Portfolio

**Tersedia juga dalam [Bahasa Inggris](README.md).**

Portfolio software engineering pribadi **Arya Wiguna**, didesain ulang dengan arah **Modern Editorial + Subtle 3D** dari `arya-portfolio-agent-kit`.

## Stack

| Lapisan | Teknologi |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Bahasa | TypeScript (strict) |
| Styling | Tailwind CSS v4 (design tokens editorial) |
| Font | Geist / Geist Mono (next/font, self-hosted) |
| 3D | Three.js — aksen hero opsional, dimuat dinamis, ada fallback + reduced-motion |
| Hosting | Vercel (auto-deploy via GitHub Actions) |

## Struktur

```
app/                  # layout, homepage, /work, /work/[slug], sitemap, robots
components/           # Header, Hero (+3D), sections, ContactForm, Footer, providers
lib/
  data/               # konten typed: profile, projects, certifications, experience, education, expertise
  i18n/messages.ts    # kamus EN/ID (hasil ekstraksi dari situs lama)
public/assets/        # cv/, projects/, sertifikat/
docs/                 # audit, content-inventory, product brief, implementation plan
scripts/              # extract-content.mjs (regenerasi data dari sumber lama)
AGENTS.md             # instruksi agent (dari agent kit)
```

## Perintah

```bash
npm run dev          # development
npm run build        # production build
npm start            # jalankan hasil build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run extract:content  # regenerasi lib/data + messages dari index.html lama
```

## Fitur

- **Bilingual EN/ID** — toggle di header, kamus terpusat (`lib/i18n/messages.ts`).
- **Dark/light mode** — mengikuti sistem, bisa di-toggle, tersimpan di `localStorage`.
- **Design system editorial** — off-white `#F5F4EF`, navy `#172A45`, aksen `#4778A9`, Geist, whitespace, borders tipis.
- **Subtle 3D hero** — skulptur geometris procedural; fallback CSS statis; berhenti saat tab/elemen tak terlihat; menghormati `prefers-reduced-motion`; DPR dibatasi 1.5.
- **Case studies** — `/work/[slug]` per proyek; bagian yang belum terverifikasi ditandai TODO (tidak dikarang).
- **Contact form** — Web3Forms.
- **SEO** — metadata, OG, canonical, sitemap, robots.

## Deploy

Sama seperti sebelumnya: push ke `main` memicu GitHub Actions → `vercel --prod` (project `arya-wiguna`, domain `aryawiguna.my.id`). Tidak ada perubahan konfigurasi deployment.
