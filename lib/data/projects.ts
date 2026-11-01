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
  description: { en: string; id: string };
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
  highlights: { en: string; id: string }[];
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
      {
        en: "QR scanning to inspect medical assets",
        id: "Pemindaian QR untuk inspeksi aset medis",
      },
      {
        en: "FCM push notifications — custom background & in-app handling",
        id: "Notifikasi push FCM — penanganan background & foreground custom",
      },
      {
        en: "Automatic FCM token management (refresh & server sync)",
        id: "Manajemen token FCM otomatis (refresh & sinkronisasi server)",
      },
      {
        en: "In-app notification settings page",
        id: "Halaman pengaturan notifikasi di dalam aplikasi",
      },
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
        description: {
          en: "Home dashboard showing the latest asset inspection status and quick actions for daily medical equipment checks.",
          id: "Dashboard utama yang menampilkan status inspeksi aset terbaru dan aksi cepat untuk pemeriksaan alat medis harian.",
        },
      },
      {
        src: "assets/projects/simaru-stock.jpg",
        caption: { en: "Stock opname", id: "Stock opname" },
        description: {
          en: "Stock opname flow where officers record the physical condition of medical assets via QR scan.",
          id: "Alur stock opname tempat petugas mencatat kondisi fisik aset medis melalui pemindaian QR.",
        },
      },
      {
        src: "assets/projects/simaru-complain.jpg",
        caption: { en: "Complaint reporting", id: "Pelaporan keluhan" },
        description: {
          en: "Complaint screen for reporting damaged or problematic equipment directly from the field.",
          id: "Layar keluhan untuk melaporkan peralatan rusak atau bermasalah langsung dari lapangan.",
        },
      },
      {
        src: "assets/projects/simaru-notif.jpg",
        caption: { en: "Push notifications", id: "Notifikasi push" },
        description: {
          en: "Push notification list and in-app settings for controlling which alerts arrive.",
          id: "Daftar notifikasi push dan pengaturan dalam aplikasi untuk mengontrol pemberitahuan yang masuk.",
        },
      },
      {
        src: "assets/projects/simaru-login.jpg",
        caption: { en: "Login screen", id: "Halaman masuk" },
        description: {
          en: "Login screen (phone demo) — the entry point to the system.",
          id: "Halaman masuk (demo HP) — pintu masuk ke sistem.",
        },
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
      {
        en: "Real-time flight board with auto-refresh every 30 seconds",
        id: "Flight board real-time dengan auto-refresh setiap 30 detik",
      },
      {
        en: "Flight statuses: On Time, Delayed, Boarding, Gate Closed, Departed",
        id: "Status penerbangan: On Time, Delayed, Boarding, Gate Closed, Departed",
      },
      {
        en: "Full admin dashboard: CRUD flights, airlines, assets/promos",
        id: "Admin dashboard lengkap: CRUD penerbangan, maskapai, aset/promo",
      },
      {
        en: "Promo slider (10 banners) + audio announcement for boarding",
        id: "Promo slider 10 banner + audio announcement untuk boarding",
      },
      {
        en: "Microservices architecture + Nginx reverse proxy via Docker",
        id: "Arsitektur microservices + reverse proxy Nginx via Docker",
      },
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
        description: {
          en: "Public flight board displaying live flight statuses with auto-refresh every 30 seconds.",
          id: "Papan penerbangan publik menampilkan status penerbangan langsung dengan auto-refresh tiap 30 detik.",
        },
      },
      {
        src: "assets/projects/skyboard-boarding.jpg",
        caption: { en: "Boarding filter", id: "Filter boarding" },
        description: {
          en: "Filter by boarding status — highlights flights that are currently boarding.",
          id: "Filter status boarding — menyorot penerbangan yang sedang naik pesawat.",
        },
      },
      {
        src: "assets/projects/skyboard-promo.jpg",
        caption: { en: "Promo slider", id: "Slider promo" },
        description: {
          en: "Promo slider banner area surfaced on the board and admin-manageable.",
          id: "Area banner slider promo yang tampil di papan dan dapat dikelola admin.",
        },
      },
      {
        src: "assets/projects/skyboard-admin.jpg",
        caption: { en: "Admin dashboard", id: "Dashboard admin" },
        description: {
          en: "Admin dashboard with CRUD controls for flights, airlines, assets and promos.",
          id: "Dashboard admin dengan kontrol CRUD untuk penerbangan, maskapai, aset, dan promo.",
        },
      },
      {
        src: "assets/projects/skyboard-addflight.jpg",
        caption: { en: "Add flight modal", id: "Modal tambah penerbangan" },
        description: {
          en: "Modal for adding/editing a flight record with schedule and status fields.",
          id: "Modal untuk menambah/mengedit data penerbangan beserta jadwal dan status.",
        },
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
      {
        en: "Bootstraps 15,000+ metadata entries at startup (in-memory cache)",
        id: "Bootstraps 15.000+ entri metadata saat startup (in-memory cache)",
      },
      {
        en: "Heuristic fallback: TVmaze cast/crew metadata proxied to OMDB",
        id: "Fallback heuristik: metadata cast/crew TVmaze diproxy ke OMDB",
      },
      {
        en: "Jaccard-index recommendations computed client-side",
        id: "Rekomendasi berbasis indeks Jaccard di sisi klien",
      },
      {
        en: "Multi-server player: VidSrc, MultiEmbed, 2Embed",
        id: "Multi-server player: VidSrc, MultiEmbed, 2Embed",
      },
      {
        en: "Watch history & bookmarks synced via localStorage",
        id: "Watch history & bookmarks sinkron via localStorage",
      },
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
        description: {
          en: "Home page featuring trending titles and genre rows, personalized by the Jaccard recommendation index.",
          id: "Beranda menampilkan judul trending dan baris genre, dipersonalisasi indeks rekomendasi Jaccard.",
        },
      },
      {
        src: "assets/projects/streamely-explore.jpg",
        caption: { en: "Explore grid", id: "Jelajahi grid" },
        description: {
          en: "Explore page: dense grid browsing with sorting/filtering controls.",
          id: "Halaman jelajahi: grid rapat dengan kontrol urutkan/saring.",
        },
      },
      {
        src: "assets/projects/streamely-search.jpg",
        caption: { en: "Search results", id: "Hasil pencarian" },
        description: {
          en: "Search with smart suggestions and instant result updates.",
          id: "Pencarian dengan saran cerdas dan hasil yang diperbarui instan.",
        },
      },
      {
        src: "assets/projects/streamely-detail.jpg",
        caption: { en: "Watch detail", id: "Detail tontonan" },
        description: {
          en: "Detail page with overview, metadata from TVmaze/OMDB, and similar titles.",
          id: "Halaman detail berisi ikhtisar, metadata dari TVmaze/OMDB, dan judul serupa.",
        },
      },
      {
        src: "assets/projects/streamely-player.jpg",
        caption: { en: "Video player", id: "Pemutar video" },
        description: {
          en: "Multi-server video player in action with server fallback support.",
          id: "Pemutar video multi-server sedang memutar dengan dukungan fallback server.",
        },
      },
    ],
  },
];
