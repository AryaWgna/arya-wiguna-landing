# Arya Wiguna — Portfolio Landing Page

**Also available in [Bahasa Indonesia](#versi-bahasa-indonesia).**

A personal portfolio / landing page for **Arya Wiguna**, a Full Stack Developer based in Indonesia. The page showcases his profile, skills, selected projects, certifications, and contact information — with support for dark mode and a full English/Indonesian (EN/ID) translation toggle.

## Features

- **Single-file app** — all markup, styles, and JavaScript are inline in `index.html` (no build step).
- **Dark / light mode** — follows the system preference by default, toggleable and remembered in `localStorage`.
- **Bilingual UI** — complete English/Indonesian translation toggle via a client-side dictionary.
- **Tailwind CSS** (via CDN) + custom design tokens (`Space Grotesk` & `JetBrains Mono` fonts).
- **Dynamic accents** — typewriter effect for roles, scroll-reveal animations, and a smooth-scroll navigation.
- **Accessible & responsive** — mobile-first layout, keyboard focus styles, `prefers-reduced-motion` support, and semantic HTML.
- **Contact form** — wired to Web3Forms for submissions without a backend.

## Tech Stack

| Layer      | Technology |
| ---------- | ---------- |
| Markup     | HTML5 |
| Styling    | CSS3 + Tailwind CSS (CDN) |
| Logic      | Vanilla JavaScript (ES6+) |
| Fonts      | Google Fonts — Space Grotesk, JetBrains Mono |
| Hosting    | Vercel (auto-deploy via GitHub Actions) |

## Project Structure

```
.
├── index.html                    # The entire landing page (markup + CSS + JS)
├── assets/
│   ├── projects/                 # Project logos / previews (SVG)
│   └── sertifikat/               # Certification PDFs + preview images
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD: deploy to Vercel on push to main
├── .vercel/                      # Vercel project configuration
├── .vercelignore                 # Files excluded from Vercel deployments
└── .gitignore
```

## Getting Started

This is a pure static site — no dependencies to install and no build step required.

### Prerequisites

- Any modern web browser (Chrome, Edge, Firefox, Safari).

### Run locally

**Option A — open the file directly:**

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

**Option B — serve with a local static server (recommended for a real preview):**

```bash
# Using npx (requires Node.js)
npx serve .

# Or with Python
python -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

The site is deployed on **Vercel** (project: `arya-wiguna`).

- **Production** — every push to `main` triggers the GitHub Actions workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which runs `npx vercel --prod`.
- **Secret** — the workflow requires a `VERCEL_TOKEN` repository secret; add it in **Settings > Secrets > Actions**.
- **Env / config** — the Vercel project ID and org ID live in `.vercel/project.json`; `.vercelignore` keeps local logs and backup files out of deployments.

## License

No license is specified for this repository; all rights are reserved by the owner. Contact Arya for reuse or collaboration.

---

# Versi Bahasa Indonesia

Dokumen ini juga tersedia dalam Bahasa Indonesia.

Sebuah halaman portofolio / landing page untuk **Arya Wiguna**, Full Stack Developer yang berbasis di Indonesia. Halaman ini menampilkan profil, keahlian, proyek pilihan, sertifikasi, dan informasi kontak — dengan dukungan mode gelap dan toggle terjemahan lengkap Inggris/Indonesia (EN/ID).

## Fitur

- **Aplikasi satu file** — semua markup, gaya, dan JavaScript ada langsung di dalam `index.html` (tanpa langkah build).
- **Mode gelap / terang** — mengikuti preferensi sistem secara default, dapat diganti dan diingat di `localStorage`.
- **UI dwibahasa** — toggle terjemahan lengkap Inggris/Indonesia melalui kamus sisi klien.
- **Tailwind CSS** (via CDN) + token desain kustom (font `Space Grotesk` & `JetBrains Mono`).
- **Aksen dinamis** — efek typewriter untuk peran, animasi scroll-reveal, dan navigasi smooth-scroll.
- **Aksesibel & responsif** — tata letak mobile-first, gaya fokus keyboard, dukungan `prefers-reduced-motion`, dan HTML semantik.
- **Formulir kontak** — terhubung ke Web3Forms untuk pengiriman tanpa backend.

## Teknologi

| Lapisan | Teknologi |
| ------- | --------- |
| Markup | HTML5 |
| Styling | CSS3 + Tailwind CSS (CDN) |
| Logika | Vanilla JavaScript (ES6+) |
| Font | Google Fonts — Space Grotesk, JetBrains Mono |
| Hosting | Vercel (auto-deploy via GitHub Actions) |

## Struktur Proyek

```
.
├── index.html                    # Seluruh halaman landing (markup + CSS + JS)
├── assets/
│   ├── projects/                 # Logo / pratinjau proyek (SVG)
│   └── sertifikat/               # PDF sertifikasi + gambar pratinjau
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD: deploy ke Vercel saat push ke main
├── .vercel/                      # Konfigurasi proyek Vercel
├── .vercelignore                 # File yang dikecualikan dari deployment Vercel
└── .gitignore
```

## Memulai

Ini adalah situs statis murni — tanpa dependensi yang perlu diinstal dan tanpa langkah build.

### Prasyarat

- Peramban web modern apa pun (Chrome, Edge, Firefox, Safari).

### Menjalankan secara lokal

**Opsi A — buka file langsung:**

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

**Opsi B — jalankan dengan server statis lokal (disarankan untuk pratinjau sungguhan):**

```bash
# Menggunakan npx (membutuhkan Node.js)
npx serve .

# Atau dengan Python
python -m http.server 8000
# lalu kunjungi http://localhost:8000
```

## Deployment

Situs ini di-deploy di **Vercel** (proyek: `arya-wiguna`).

- **Produksi** — setiap push ke `main` memicu workflow GitHub Actions [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), yang menjalankan `npx vercel --prod`.
- **Secret** — workflow membutuhkan secret repositori `VERCEL_TOKEN`; tambahkan di **Settings > Secrets > Actions**.
- **Env / konfigurasi** — ID proyek dan org Vercel ada di `.vercel/project.json`; `.vercelignore` memastikan log lokal dan file cadangan tidak ikut ter-deploy.

## Lisensi

Tidak ada lisensi yang dinyatakan untuk repositori ini; semua hak dilindungi oleh pemilik. Hubungi Arya untuk penggunaan ulang atau kolaborasi.
