/**
 * Proyek pilihan — ditulis tangan berdasarkan bukti terverifikasi:
 * - README & isi repo GitHub (SIMARU-Mobile-App, Digital-Skyboard-Announcement, streamely)
 * - Teks deskripsi situs lama (key kamus p1/p2/p3)
 *
 * Hanya data yang terbukti dari repo yang dicantumkan. Tidak ada metrik
 * dibuat-buat (jumlah user, dampak, dll).
 */
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
      en: "Personal repository project — implementation is in Arya's public commit history (71 commits).",
      id: "Proyek repo pribadi — implementasi ada di riwayat commit publik Arya (71 commit).",
    },
    evidenceNote: {
      en: "Source code with the full Android/iOS/web scaffolding is public on GitHub. Screenshots of the running app are pending.",
      id: "Kode sumber dengan scaffolding Android/iOS/web lengkap terbuka di GitHub. Screenshot aplikasi berjalan menyusul.",
    },
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
      en: "Built as coursework (UAS) for the Web Software Tools subject — per the repository README.",
      id: "Dibuat untuk tugas UAS mata kuliah Web Software Tools — sesuai README repository.",
    },
    evidenceNote: {
      en: "Changelog in the repo (v1.0.0 2026; v2.0.0 2026-01-12) documents the feature history.",
      id: "Changelog di repo (v1.0.0 2026; v2.0.0 2026-01-12) mendokumentasikan riwayat fitur.",
    },
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
      en: "Personal, self-hosted project — licensed for personal/educational use.",
      id: "Proyek pribadi self-hosted — lisensi untuk penggunaan personal/edukasi.",
    },
    evidenceNote: {
      en: "Public demo is deployed to Vercel; full architecture is documented in the repo README.",
      id: "Demo publik ter-deploy di Vercel; arsitektur lengkap terdokumentasi di README repo.",
    },
  },
];
