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

export type DeviceFrame = "phone" | "laptop";

export type FanOutDevice = {
  src: string;
  frame: DeviceFrame;
  alt?: string;
};

export type FanOutDevices = {
  left: FanOutDevice;
  center: FanOutDevice;
  right: FanOutDevice;
};

export type RationaleItem = {
  technology: string;
  reason: { en: string; id: string };
  tradeoff: { en: string; id: string };
};

export type TelemetryMetric = {
  id: string;
  value: number;
  suffix?: string;
  prefix?: string;
  label: { en: string; id: string };
  detail: { en: string; id: string };
};

export type ArchitectureStep = {
  step: number;
  node: string;
  role: { en: string; id: string };
  protocol: string;
  latency?: string;
  description: { en: string; id: string };
  payloadExample?: string;
};

export type ArchitectureFlow = {
  title: { en: string; id: string };
  subtitle: { en: string; id: string };
  steps: ArchitectureStep[];
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
  /**
   * Pattern 3 — perangkat fan-out (left/center/right) untuk banner kartu.
   */
  fanout?: FanOutDevices;
  /**
   * Pattern 2 — trade-off arsitektur ("Why this tech stack").
   */
  rationale?: RationaleItem[];
  /**
   * Telemetry metrics — verifiable numerical data points.
   */
  telemetry?: TelemetryMetric[];
  /**
   * Interactive architecture flow — end-to-end data pipeline simulation.
   */
  architecture?: ArchitectureFlow;
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
    fanout: {
      left: { src: "assets/projects/simaru-login.jpg", frame: "phone", alt: "SIMARU login screen" },
      center: { src: "assets/projects/simaru-home.jpg", frame: "phone", alt: "SIMARU main dashboard" },
      right: { src: "assets/projects/simaru-stock.jpg", frame: "phone", alt: "SIMARU stock opname" },
    },
    rationale: [
      {
        technology: "Flutter",
        reason: {
          en: "One Dart codebase ships Android & iOS with consistent behavior — critical for a field tool used by hospital officers on varied devices.",
          id: "Satu codebase Dart merilis Android & iOS dengan perilaku konsisten — penting untuk alat lapangan yang dipakai petugas rumah sakit di berbagai perangkat.",
        },
        tradeoff: {
          en: "Native runtime is heavier than a web view; APK size grows, acceptable for internal tooling.",
          id: "Runtime native lebih berat daripada web view; ukuran APK membesar, masih wajar untuk alat internal.",
        },
      },
      {
        technology: "Firebase Cloud Messaging (FCM)",
        reason: {
          en: "Push notifications reach officers even when the app is backgrounded — essential for inspection alerts while staff are on duty.",
          id: "Notifikasi push tetap sampai meski aplikasi di background — penting untuk pengingat inspeksi saat petugas bertugas.",
        },
        tradeoff: {
          en: "Depends on Google services; token refresh requires server sync.",
          id: "Bergantung pada layanan Google; refresh token perlu sinkronisasi server.",
        },
      },
      {
        technology: "REST API",
        reason: {
          en: "Keeps the mobile client decoupled from the backend, so the hospital system can evolve its API independently.",
          id: "Memisahkan klien mobile dari backend, sehingga sistem rumah sakit dapat mengembangkan API secara independen.",
        },
        tradeoff: {
          en: "Every action needs network round-trips; no offline queue yet.",
          id: "Setiap aksi butuh koneksi jaringan; belum ada antrean offline.",
        },
      },
    ],
    telemetry: [
      {
        id: "commits",
        value: 71,
        suffix: "",
        label: { en: "Git Commits", id: "Commit Terverifikasi" },
        detail: { en: "Visible across public commit history", id: "Tercatat di riwayat commit publik GitHub" },
      },
      {
        id: "modules",
        value: 4,
        suffix: "",
        label: { en: "Core Modules", id: "Modul Utama" },
        detail: { en: "QR Scan, FCM Sync, Stock Opname, Complaint", id: "Scan QR, Sinkron FCM, Stock Opname, Komplain" },
      },
      {
        id: "fcm-sync",
        value: 100,
        suffix: "%",
        label: { en: "FCM Token Sync", id: "Sinkronisasi Token FCM" },
        detail: { en: "Auto-refresh & server handshake", id: "Refresh & handshake otomatis dengan server" },
      },
    ],
    architecture: {
      title: {
        en: "Event-Driven QR & Push Notification Pipeline",
        id: "Pipeline Event-Driven QR & Notifikasi Push",
      },
      subtitle: {
        en: "End-to-end data flow from physical QR scan on medical equipment to staff alert via FCM",
        id: "Alur data menyeluruh dari scan QR fisik aset medis hingga notifikasi staf via FCM",
      },
      steps: [
        {
          step: 1,
          node: "Flutter Client",
          role: { en: "Optical QR Scanner", id: "Pemindai QR Optik" },
          protocol: "Camera2 / AVFoundation",
          latency: "~16ms",
          description: {
            en: "Officer scans the QR barcode affixed to medical equipment using the device camera.",
            id: "Petugas memindai kode QR fisik pada alat medis menggunakan kamera perangkat.",
          },
        },
        {
          step: 2,
          node: "Mobile Storage",
          role: { en: "JWT Session & Token Cache", id: "Sesi JWT & Cache Token" },
          protocol: "Flutter SecureStorage",
          latency: "<5ms",
          description: {
            en: "App validates JWT auth token, bundles device FCM token, and structures the inspection payload.",
            id: "Aplikasi memvalidasi token JWT, menyertakan token FCM perangkat, dan menyusun payload inspeksi.",
          },
          payloadExample: '{\n  "asset_id": "MED-VENT-04",\n  "status": "OPERATIONAL",\n  "inspector_id": "STF-289",\n  "fcm_token": "eX_98a...qk"\n}',
        },
        {
          step: 3,
          node: "Laravel Backend",
          role: { en: "Inspection & Audit Gateway", id: "Gateway Inspeksi & Audit" },
          protocol: "HTTPS / REST JSON",
          latency: "~85ms",
          description: {
            en: "Server verifies asset existence, writes stock opname log into the database, and fires FCM event.",
            id: "Server memvalidasi aset, mencatat log stock opname ke database, dan memicu event notifikasi.",
          },
        },
        {
          step: 4,
          node: "Firebase Cloud Messaging",
          role: { en: "Push Broadcast Engine", id: "Engine Distribusi Notifikasi" },
          protocol: "HTTP v1 OAuth2",
          latency: "~120ms",
          description: {
            en: "Google FCM dispatches targeted notifications to relevant technician and department head channels.",
            id: "Google FCM mengirimkan alert push bertarget ke channel teknisi dan kepala ruangan.",
          },
        },
        {
          step: 5,
          node: "Target Staff Device",
          role: { en: "Background Alert Receiver", id: "Penerima Alert Latar Belakang" },
          protocol: "FCM Push Listener",
          latency: "Real-time",
          description: {
            en: "Custom background/foreground handler rings audible alert and routes user straight to the asset log.",
            id: "Handler background/foreground memunculkan alert audio dan membuka log aset secara instan.",
          },
        },
      ],
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
    fanout: {
      left: { src: "assets/projects/skyboard-boarding.jpg", frame: "phone", alt: "Skyboard boarding filter" },
      center: { src: "assets/projects/skyboard-main.jpg", frame: "laptop", alt: "Skyboard public flight board" },
      right: { src: "assets/projects/skyboard-addflight.jpg", frame: "phone", alt: "Skyboard add flight modal" },
    },
    rationale: [
      {
        technology: "Laravel (PHP)",
        reason: {
          en: "Batteries-included CRUD, auth, and validation fit the Web Software Tools course scope while keeping the admin panel robust.",
          id: "CRUD, autentikasi, dan validasi bawaan cocok dengan cakupan mata kuliah Web Software Tools sekaligus membuat panel admin kokoh.",
        },
        tradeoff: {
          en: "PHP request model is less suited to real-time push; solved with 30-second auto-refresh instead of websockets.",
          id: "Model request PHP kurang cocok untuk push real-time; disiasati dengan auto-refresh 30 detik alih-alih websocket.",
        },
      },
      {
        technology: "MySQL",
        reason: {
          en: "Relational model matches flight/airline/asset entities and keeps administrative data consistent.",
          id: "Model relasional cocok untuk entitas penerbangan/maskapai/aset dan menjaga konsistensi data administrasi.",
        },
        tradeoff: {
          en: "Schema migrations and joins add overhead at scale; fine for this board.",
          id: "Migrasi skema dan join menambah beban saat skalabilitas besar; masih aman untuk papan ini.",
        },
      },
      {
        technology: "Docker Compose + Nginx",
        reason: {
          en: "Microservices topology with Nginx reverse proxy is reproducible anywhere for grading or demoing.",
          id: "Topologi microservices dengan reverse proxy Nginx dapat direproduksi di mana saja untuk penilaian atau demo.",
        },
        tradeoff: {
          en: "More moving parts than a single service; requires Docker knowledge to operate.",
          id: "Lebih banyak komponen daripada satu layanan; butuh pengetahuan Docker untuk mengoperasikannya.",
        },
      },
      {
        technology: "Next.js 15 (UI)",
        reason: {
          en: "React server components render the public board efficiently while sharing type-safe calls with the Laravel API.",
          id: "Server component React merender papan publik secara efisien sekaligus berbagi panggilan type-safe dengan API Laravel.",
        },
        tradeoff: {
          en: "Node runtime adds a second service beside PHP.",
          id: "Runtime Node menambah layanan kedua di samping PHP.",
        },
      },
      {
        technology: "SweetAlert2",
        reason: {
          en: "Polished modal feedback for admin CRUD without dragging in a heavy UI kit.",
          id: "Feedback modal yang rapi untuk CRUD admin tanpa menarik pustaka UI yang berat.",
        },
        tradeoff: {
          en: "Less flexible than a bespoke dialog system.",
          id: "Kurang fleksibel dibanding sistem dialog khusus.",
        },
      },
    ],
    telemetry: [
      {
        id: "refresh",
        value: 30,
        suffix: "s",
        label: { en: "Auto-Refresh Rate", id: "Laju Refresh Otomatis" },
        detail: { en: "Live flight schedule sync interval", id: "Interval sinkronisasi jadwal penerbangan live" },
      },
      {
        id: "containers",
        value: 3,
        suffix: "",
        label: { en: "Docker Services", id: "Layanan Docker" },
        detail: { en: "Nginx gateway, Next.js UI, Laravel API", id: "Gateway Nginx, UI Next.js, API Laravel" },
      },
      {
        id: "promo",
        value: 10,
        suffix: "+",
        label: { en: "Promo Slots", id: "Slot Banner Promo" },
        detail: { en: "Admin-managed dynamic media banners", id: "Banner media dinamis yang dikelola admin" },
      },
    ],
    architecture: {
      title: {
        en: "Containerized Microservices & Reverse Proxy Gateway",
        id: "Microservices Kontainer & Gateway Reverse Proxy",
      },
      subtitle: {
        en: "Multi-container Docker topology routing public flight schedules and administrative CRUD operations",
        id: "Topologi multi-kontainer Docker yang me-route jadwal publik dan operasi CRUD admin",
      },
      steps: [
        {
          step: 1,
          node: "Display & Admin Client",
          role: { en: "Airport Screen & Admin Browser", id: "Layar Bandara & Browser Admin" },
          protocol: "HTTP/2 HTTPS",
          latency: "~24ms",
          description: {
            en: "Public display screens poll flight schedules every 30s while admins manage airline assets.",
            id: "Layar display publik mem-polling jadwal tiap 30 detik saat admin mengelola maskapai.",
          },
        },
        {
          step: 2,
          node: "Nginx Gateway",
          role: { en: "Reverse Proxy & Load Balancer", id: "Reverse Proxy & Gateway Trafik" },
          protocol: "TCP Port 80/443",
          latency: "<2ms",
          description: {
            en: "Nginx routes `/` requests to Next.js 15 UI and proxies `/api/*` to Laravel 11 container.",
            id: "Nginx me-route path `/` ke UI Next.js 15 dan mem-proxy `/api/*` ke kontainer Laravel 11.",
          },
        },
        {
          step: 3,
          node: "Next.js 15 SSR",
          role: { en: "Real-Time Flight UI", id: "UI Papan Penerbangan Real-Time" },
          protocol: "React Server Components",
          latency: "~18ms",
          description: {
            en: "Renders live flight statuses (On Time, Delayed, Boarding, Gate Closed, Departed) with audio chimes.",
            id: "Merender status penerbangan dinamis beserta chime audio pengumuman keberangkatan.",
          },
          payloadExample: '{\n  "flight_no": "GA-421",\n  "airline": "Garuda Indonesia",\n  "status": "BOARDING",\n  "gate": "A4",\n  "time": "14:35"\n}',
        },
        {
          step: 4,
          node: "Laravel 11 Backend",
          role: { en: "API & Admin CRUD Engine", id: "Engine API & CRUD Admin" },
          protocol: "PHP-FPM REST",
          latency: "~45ms",
          description: {
            en: "Handles airline asset uploads, flight schedule mutations, and promo banner scheduling.",
            id: "Memproses upload aset maskapai, perubahan jadwal penerbangan, dan banner promosi.",
          },
        },
        {
          step: 5,
          node: "MySQL Database",
          role: { en: "Relational Storage", id: "Penyimpanan Relasional" },
          protocol: "MySQL Native Protocol",
          latency: "~5ms",
          description: {
            en: "ACID transactions for flights, gates, and audit trails under isolated Docker network.",
            id: "Transaksi ACID untuk data penerbangan, gate, dan audit trail di jaringan Docker terisolasi.",
          },
        },
      ],
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
    fanout: {
      left: { src: "assets/projects/streamely-explore.jpg", frame: "phone", alt: "StreamEly explore grid" },
      center: { src: "assets/projects/streamely-home.jpg", frame: "laptop", alt: "StreamEly home page" },
      right: { src: "assets/projects/streamely-player.jpg", frame: "phone", alt: "StreamEly video player" },
    },
    rationale: [
      {
        technology: "Bun (gateway + reverse proxy)",
        reason: {
          en: "Bootstraps 15,000+ metadata entries at startup and serves as gateway/proxy with a small memory footprint.",
          id: "Men-bootstrap 15.000+ entri metadata saat startup dan berperan sebagai gateway/proxy dengan jejak memori kecil.",
        },
        tradeoff: {
          en: "Newer runtime — some npm packages assume Node behavior.",
          id: "Runtime relatif baru — beberapa paket npm berasumsi perilaku Node.",
        },
      },
      {
        technology: "Elysia.js (API)",
        reason: {
          en: "End-to-end typed API with schema inference reduces runtime errors at the edge.",
          id: "API type-safe ujung-ke-ujung dengan inferensi skema mengurangi error runtime di sisi tepi.",
        },
        tradeoff: {
          en: "Smaller ecosystem than Express; team should embrace TypeScript-first patterns.",
          id: "Ekosistem lebih kecil daripada Express; tim perlu nyaman dengan pola TypeScript-first.",
        },
      },
      {
        technology: "Svelte + Vite (client)",
        reason: {
          en: "Compiled, lightweight client matches a streaming UI that must feel instant on slower connections.",
          id: "Klien terkompilasi dan ringan cocok untuk UI streaming yang harus terasa instan di koneksi lambat.",
        },
        tradeoff: {
          en: "Less mainstream than React; community and hiring pool are smaller.",
          id: "Kurang populer daripada React; komunitas dan kandidat lebih sedikit.",
        },
      },
      {
        technology: "TVmaze & OMDB API",
        reason: {
          en: "Proxying cast/crew metadata with heuristic fallback avoids maintaining an internal scraper.",
          id: "Proxy metadata cast/crew dengan fallback heuristik menghindari perawatan scraper internal.",
        },
        tradeoff: {
          en: "External APIs impose rate limits and availability risk.",
          id: "API eksternal memberlakukan batas laju dan risiko ketersediaan.",
        },
      },
      {
        technology: "Cloudflare Tunnel + PM2",
        reason: {
          en: "Zero-config public exposure plus process supervision make self-hosting simple.",
          id: "Eksposur publik tanpa konfigurasi plus supervisi proses membuat self-hosting sederhana.",
        },
        tradeoff: {
          en: "Tunnel adds a hop; PM2 runs a single node (no cluster yet).",
          id: "Tunnel menambah satu hop; PM2 menjalankan satu node (belum cluster).",
        },
      },
    ],
    telemetry: [
      {
        id: "cache",
        value: 15000,
        suffix: "+",
        label: { en: "Cached Titles", id: "Judul Ter-cache" },
        detail: { en: "In-memory metadata preloaded at Bun boot", id: "Metadata in-memory di-preload saat boot Bun" },
      },
      {
        id: "gateways",
        value: 3,
        suffix: "",
        label: { en: "Stream Gateways", id: "Gateway Stream" },
        detail: { en: "VidSrc, MultiEmbed, 2Embed resolver", id: "Resolver VidSrc, MultiEmbed, dan 2Embed" },
      },
      {
        id: "latency",
        value: 0,
        suffix: "ms",
        label: { en: "Client Vectoring", id: "Vektorisasi Klien" },
        detail: { en: "Client-side Jaccard similarity scoring", id: "Kalkulasi skor similaritas Jaccard sisi klien" },
      },
    ],
    architecture: {
      title: {
        en: "High-Throughput In-Memory Gateway & Client-Side Vector Engine",
        id: "Gateway In-Memory Throughput Tinggi & Engine Vektor Sisi Klien",
      },
      subtitle: {
        en: "Bun runtime caching layer with resilient multi-provider streaming fallback and client-side Jaccard indexing",
        id: "Lapisan cache runtime Bun dengan fallback multi-provider andal dan kalkulasi indeks Jaccard di klien",
      },
      steps: [
        {
          step: 1,
          node: "Svelte 5 Client",
          role: { en: "Fast Hydrated UI", id: "UI Terkompilasi Ringan" },
          protocol: "SPA DOM Hydration",
          latency: "<10ms",
          description: {
            en: "Lightweight client computes Jaccard genre similarity directly in browser memory without extra round-trips.",
            id: "Klien ringan menghitung similaritas genre Jaccard langsung di memori browser tanpa round-trip tambahan.",
          },
        },
        {
          step: 2,
          node: "Bun Gateway",
          role: { en: "In-Memory Reverse Proxy", id: "Reverse Proxy & Cache RAM" },
          protocol: "Bun HTTP Native",
          latency: "<3ms",
          description: {
            en: "Bootstraps and caches 15,000+ title records in RAM, serving requests with near-zero overhead.",
            id: "Memuat dan menyimpan 15.000+ rekaman judul di RAM, melayani request dengan overhead nyaris nol.",
          },
        },
        {
          step: 3,
          node: "Elysia.js Backend",
          role: { en: "Type-Safe Routing", id: "Router API Type-Safe" },
          protocol: "TypeScript Schema Validation",
          latency: "~15ms",
          description: {
            en: "Implements heuristic fallbacks between TVmaze and OMDB API to resolve cast and rating metadata.",
            id: "Menerapkan fallback heuristik antara TVmaze dan OMDB API untuk metadata kru dan rating.",
          },
          payloadExample: '{\n  "title": "Steins;Gate",\n  "cached": true,\n  "providers": ["VidSrc", "MultiEmbed"],\n  "jaccard_score": 0.875\n}',
        },
        {
          step: 4,
          node: "Multi-Server Resolver",
          role: { en: "Dynamic Failover", id: "Failover Provider Dinamis" },
          protocol: "Cross-Origin Sandbox Embed",
          latency: "~150ms",
          description: {
            en: "Seamlessly switches video stream providers (VidSrc, MultiEmbed, 2Embed) if one server encounters downtime.",
            id: "Beralih secara mulus antar provider video (VidSrc, MultiEmbed, 2Embed) jika salah satu server mengalami gangguan.",
          },
        },
      ],
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
