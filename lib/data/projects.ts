/**
 * Proyek pilihan — ditulis tangan berdasarkan bukti terverifikasi:
 * - README & isi repo GitHub (SIMARU-Mobile-App, Digital-Skyboard-Announcement, streamely)
 * - Teks deskripsi situs lama (key kamus p1/p2/p3)
 *
 * Hanya data yang terbukti dari repo yang dicantumkan. Tidak ada metrik
 * dibuat-buat (jumlah user, dampak, dll).
 */
export type Screenshot = {
  src: string;
  caption: { en: string; id: string };
};

export type Project = {
  slug: string;
  titleKey: string;
  summaryKey: string;
  thumb: string;
  repo: string;
  liveUrl?: string;
  /** Tahun hanya jika terverifikasi dari repo (mis. changelog). */
  year?: string;
  chips: string[];
  stack: string[];
  highlights: string[];
  roleNote?: { en: string; id: string };
  evidenceNote?: { en: string; id: string };
  screenshots: Screenshot[];
};

export const projects: Project[] = [
  {
    slug: "simaru-mobile-app",
    titleKey: "p1-title",
    summaryKey: "p1-desc",
    thumb: "assets/projects/simaru-home.jpg",
    repo: "https://github.com/AryaWgna/SIMARU-Mobile-App",
    chips: ["Flutter", "Dart", "Mobile"],
    stack: ["Flutter", "Dart", "Firebase Cloud Messaging (FCM)", "REST API"],
    highlights: [
      "Pemindaian QR untuk inspeksi aset medis",
      "Notifikasi push FCM — penanganan background & foreground custom",
      "Manajemen token FCM otomatis (refresh & sinkronisasi server)",
      "Halaman pengaturan notifikasi di dalam aplikasi",
    ],
    roleNote: {
      en: "Personal project — the implementation is visible across Arya's public commit history (71 commits).",
      id: "Proyek pribadi — implementasinya dapat dilihat di riwayat commit publik Arya (71 commit).",
    },
    evidenceNote: {
      en: "This project is fully open-source: the complete Flutter codebase (Android/iOS/web scaffolding) is available on GitHub, showing consistent progress on QR inspection, FCM push handling, and token management.",
      id: "Proyek ini sepenuhnya open-source: codebase Flutter lengkap (scaffolding Android/iOS/web) tersedia di GitHub, menunjukkan progres konsisten pada inspeksi QR, penanganan notifikasi push FCM, dan manajemen token.",
    },
    screenshots: [
      {
        src: "assets/projects/simaru-home.jpg",
        caption: { en: "Main dashboard", id: "Dashboard utama" },
      },
      {
        src: "assets/projects/simaru-stock.jpg",
        caption: { en: "Medical asset stock opname", id: "Stock opname aset medis" },
      },
      {
        src: "assets/projects/simaru-complain.jpg",
        caption: { en: "Complaint reporting", id: "Pelaporan keluhan" },
      },
      {
        src: "assets/projects/simaru-notif.jpg",
        caption: { en: "Push notifications & settings", id: "Notifikasi push & pengaturan" },
      },
      {
        src: "assets/projects/simaru-login.jpg",
        caption: { en: "Login screen", id: "Halaman masuk" },
      },
    ],
  },
  {
    slug: "digital-skyboard-announcement",
    titleKey: "p2-title",
    summaryKey: "p2-desc",
    thumb: "assets/projects/skyboard-main.jpg",
    repo: "https://github.com/AryaWgna/Digital-Skyboard-Announcement",
    year: "2026",
    chips: ["TypeScript", "PHP", "UI", "Docker"],
    stack: [
      "Laravel (PHP)",
      "MySQL",
      "Nginx (gateway)",
      "Docker Compose",
      "Next.js 15 (UI)",
      "SweetAlert2",
    ],
    highlights: [
      "Flight board real-time dengan auto-refresh setiap 30 detik",
      "Status penerbangan: On Time, Delayed, Boarding, Gate Closed, Departed",
      "Admin dashboard lengkap: CRUD penerbangan, maskapai, aset/promo",
      "Promo slider 10 banner + audio announcement untuk boarding",
      "Arsitektur microservices + reverse proxy Nginx via Docker",
    ],
    roleNote: {
      en: "Built as final coursework (UAS) for the Web Software Tools subject, per the repository README.",
      id: "Dibuat sebagai tugas akhir (UAS) mata kuliah Web Software Tools, sesuai README repository.",
    },
    evidenceNote: {
      en: "The repository includes a changelog documenting the release history (v1.0.0 in 2026; v2.0.0 on 2026-01-12), with feature milestones recorded across commits.",
      id: "Repository mencakup changelog yang mendokumentasikan riwayat rilis (v1.0.0 tahun 2026; v2.0.0 pada 2026-01-12), dengan tonggak fitur tercatat di seluruh commit.",
    },
    screenshots: [
      {
        src: "assets/projects/skyboard-main.jpg",
        caption: { en: "Public flight board", id: "Papan penerbangan publik" },
      },
      {
        src: "assets/projects/skyboard-boarding.jpg",
        caption: { en: "Boarding status filter", id: "Filter status boarding" },
      },
      {
        src: "assets/projects/skyboard-promo.jpg",
        caption: { en: "Promo slider", id: "Slider promo" },
      },
      {
        src: "assets/projects/skyboard-admin.jpg",
        caption: { en: "Admin dashboard", id: "Dashboard admin" },
      },
      {
        src: "assets/projects/skyboard-addflight.jpg",
        caption: { en: "Add flight modal", id: "Modal tambah penerbangan" },
      },
    ],
  },
  {
    slug: "streamely",
    titleKey: "p3-title",
    summaryKey: "p3-desc",
    thumb: "assets/projects/streamely-home.jpg",
    repo: "https://github.com/AryaWgna/streamely",
    liveUrl: "https://streamely.vercel.app",
    chips: ["Svelte", "Bun", "TS"],
    stack: [
      "Bun (gateway + reverse proxy)",
      "Elysia.js (API)",
      "Svelte + Vite (client)",
      "TVmaze & OMDB API",
      "Cloudflare Tunnel",
      "PM2",
    ],
    highlights: [
      "Bootstraps 15.000+ entri metadata saat startup (in-memory cache)",
      "Fallback heuristik: metadata cast/crew TVmaze diproxy ke OMDB",
      "Rekomendasi berbasis indeks Jaccard di sisi klien",
      "Multi-server player: VidSrc, MultiEmbed, 2Embed",
      "Watch history & bookmarks sinkron via localStorage",
    ],
    roleNote: {
      en: "Personal, self-hosted project — licensed for personal and educational use.",
      id: "Proyek pribadi self-hosted — dilisensikan untuk penggunaan pribadi dan edukasi.",
    },
    evidenceNote: {
      en: "A live demo is deployed on Vercel, and the repository README documents the full architecture — Bun gateway, Elysia API, Svelte client, and the proxying strategy.",
      id: "Demo live ter-deploy di Vercel, dan README repository mendokumentasikan arsitektur lengkap — gateway Bun, API Elysia, klien Svelte, serta strategi proxy.",
    },
    screenshots: [
      {
        src: "assets/projects/streamely-home.jpg",
        caption: { en: "Home & trending", id: "Beranda & trending" },
      },
      {
        src: "assets/projects/streamely-explore.jpg",
        caption: { en: "Explore grid", id: "Jelajahi grid" },
      },
      {
        src: "assets/projects/streamely-search.jpg",
        caption: { en: "Search results", id: "Hasil pencarian" },
      },
      {
        src: "assets/projects/streamely-detail.jpg",
        caption: { en: "Watch detail", id: "Detail tontonan" },
      },
      {
        src: "assets/projects/streamely-player.jpg",
        caption: { en: "Video player", id: "Pemutar video" },
      },
    ],
  },
];
