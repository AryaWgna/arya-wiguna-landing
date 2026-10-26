# Arya Wiguna — Halaman Landing Portofolio

**Baca versi Inggris: [English](README.md)**

Sebuah halaman portofolio / landing page untuk **Arya Wiguna**, Full Stack Developer yang berbasis di Indonesia. Halaman ini menampilkan profil, keahlian, proyek pilihan, sertifikasi, dan informasi kontak — dengan dukungan mode gelap dan toggle terjemahan lengkap Inggris/Indonesia (EN/ID).

## Fitur

- **Aplikasi satu file** — semua markup, gaya, dan JavaScript ada langsung di dalam `index.html` (tanpa langkah build).
- **Mode gelap / terang** — mengikuti preferensi sistem secara default, dapat diganti dan diingat di `localStorage`.
- **UI dwibahasa** — toggle terjemahan lengkap Inggris/Indonesia melalui kamus sisi klien.
- **Tailwind CSS** (via CDN) + token desain kustom (font `Space Grotesk` & `JetBrains Mono`).
- **Aksen dinamis** — efek typewriter untuk peran, animasi scroll-reveal, dan navigasi smooth-scroll.
- **Background aurora animasi** — gumpalan gradien lembut yang melayang, menyesuaikan mode terang/gelap dan menghormati `prefers-reduced-motion`.
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
