# Arya Wiguna — Portfolio

**Also available in [Bahasa Indonesia](README.id.md).**

Personal software-engineering portfolio for **Arya Wiguna**, redesigned with the **Modern Editorial + Subtle 3D** direction from the `arya-portfolio-agent-kit`.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (design tokens editorial) |
| Fonts | Geist / Geist Mono (next/font, self-hosted) |
| 3D | Three.js — aksen hero opsional, dimuat dinamis, fallback + reduced-motion |
| Hosting | Vercel (auto-deploy via GitHub Actions) |

## Structure

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

## Scripts

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
- **Editorial design system** — off-white `#F5F4EF`, navy `#172A45`, aksen `#4778A9`, Geist, whitespace, borders tipis.
- **Subtle 3D hero** — skulptur geometris procedural; fallback CSS statis; berhenti saat tab/elemen tak terlihat; menghormati `prefers-reduced-motion`; DPR dibatasi 1.5.
- **Case studies** — `/work/[slug]` per proyek; bagian yang belum terverifikasi ditandai TODO (tidak dikarang).
- **Contact form** — Web3Forms.
- **Counter orang online** — `/api/presence` + komponen `OnlineVisitors` (hero & footer); heartbeat browser tiap 10 dtk, polling 5 dtk, jendela aktif 60 dtk. Store default in-memory; untuk Vercel/serverless set `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` (lihat `.env.example`).
- **SEO** — metadata, OG, canonical, sitemap, robots.

## Deploy

Sama seperti sebelumnya: push ke `main` pada repo ini memicu GitHub Actions → `vercel --prod` (project `arya-wiguna`, domain `arya-wiguna.my.id`). Tidak ada perubahan konfigurasi deployment.
