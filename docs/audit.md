# Audit — Redesign Portfolio Arya Wiguna

Tanggal: 2026-10-31 · Agent: Cline · Sumber: `index.html` lama (single-file, 1.219 baris) + repo `arya-portfolio-agent-kit`.

## 1. Kondisi sebelumnya (sebelum migrasi)

| Aspek | Temuan |
| --- | --- |
| Stack | HTML + CSS + JS vanilla, Tailwind CDN, font Outfit + JetBrains Mono. Tanpa build step. |
| Struktur | 1 file `index.html` + `assets/` (cv, projects, sertifikat). |
| Deployment | Vercel (project `arya-wiguna`), GH Actions `deploy.yml` (push ke `main` → `vercel --prod`), domain `arya-wiguna.my.id`. |
| Fitur | Dark/light mode (localStorage), toggle EN/ID (kamus 146+ key), splash boot, aurora blobs, meteor canvas, cursor glow, typewriter, contact form Web3Forms, CV dropdown (ATS + Kreatif). |
| Konten | Hero, about (bio + stats), skills (6 grup, 34 chip), experience (3 entri), education (2 entri), projects (SIMARU, Digital Skyboard, StreamEly), 22 sertifikat (PDF+PNG), footer. |

## 2. Konflik dengan design kit

- Aksen ungu `#7C3AED` + gradient aurora + blob/partikel → dilarang (AI-slop).
- Font Outfit → diganti Geist / Geist Mono.
- Splash cinematic boot → dihilangkan (distraksi; tidak diperlukan).
- Marquee logo & bento cards → diganti editorial list/layout.
- Accordion CV dropdown dipertahankan (dipoles).

## 3. Keputusan arsitektur

- **Migrasi penuh** ke Next.js App Router + TypeScript + Tailwind CSS v4 (disetujui user).
- `index.html` lama dihapus (data diekstrak dulu; history git menyimpan versi lama).
- Assets dipindah ke `public/assets/…`.
- Data dipisah dari presentasi: `lib/data/*` (profile, experience, education, expertise, projects, certifications) + `lib/i18n/messages.ts` (kamus hasil ekstraksi).
- Konten bilingual EN/ID dipertahankan lewat kamus + `useLang()`.
- Tema gelap/terang dipertahankan (palet baru: off-white/navy/blue).

## 4. Risiko & catatan

- Detail proyek (peran, tanggal, kontribusi, screenshot asli) belum terverifikasi → ditampilkan sebagai TODO, bukan dikarang.
- Foto profil masih memakai avatar GitHub (menunggu potret resmi).
- Email profesional `wgnarya123@gmail.com` diambil dari situs lama.
- 3D hero: Three.js, dimuat klien, fallback CSS, hormati reduced-motion; jika performa buruk → mudah dimatikan (hapus import `Hero3D`).

## 5. Perintah verifikasi

- `npm run typecheck` ✅ (0 error)
- `npm run build` ✅ (10 halaman statis)
- `npm run lint` ✅ (hanya warning `<img>` yang disengaja)
- Smoke test `next start` → `/` `/work` `/work/[slug]` sitemap robots 200; slug tidak dikenal 404 ✅
