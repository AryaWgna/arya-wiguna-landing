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
  layout?: "phones" | "desktop";
  left?: FanOutDevice;
  center: FanOutDevice;
  right?: FanOutDevice;
  secondary?: FanOutDevice;
};

export type RationaleItem = {
  technology: string;
  reason: { en: string; id: string };
  tradeoff: { en: string; id: string };
};

export type TelemetryMetric = {
  id: string;
  value: string;
  label: { en: string; id: string };
  detail: { en: string; id: string };
};

export type ArchitectureStep = {
  step: number;
  node: string;
  role: { en: string; id: string };
  protocol: string;
  description: { en: string; id: string };
  codeLabel?: string;
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
  year?: string;
  contextBadge: { en: string; id: string };
  chips: string[];
  stack: string[];
  highlights: { en: string; id: string }[];
  roleNote?: { en: string; id: string };
  evidenceNote?: { en: string; id: string };
  fanout?: FanOutDevices;
  rationale?: RationaleItem[];
  telemetry?: TelemetryMetric[];
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
    year: "2025",
    contextBadge: {
      en: "Hospital Internship · RS UMMI Bogor",
      id: "Magang Rumah Sakit · RS UMMI Bogor",
    },
    chips: ["Flutter", "Dart", "Firebase", "REST API"],
    stack: [
      "Flutter",
      "Dart",
      "Provider",
      "mobile_scanner",
      "Firebase Cloud Messaging (FCM)",
      "flutter_secure_storage",
      "REST API",
    ],
    highlights: [
      {
        en: "Camera QR scanning for room-by-room medical asset stock opname",
        id: "Pemindaian QR kamera untuk stock opname aset medis per gedung dan ruangan",
      },
      {
        en: "Asset lifecycle modules: check-in/out, mutation, repair status, and depreciation view",
        id: "Modul siklus hidup aset: check-in/out, mutasi, status perbaikan, dan nilai penyusutan",
      },
      {
        en: "FCM push notifications with foreground/background handlers and token sync",
        id: "Notifikasi push FCM dengan handler foreground/background serta sinkronisasi token ke server",
      },
      {
        en: "Field complaint submission & tracking directly tied to asset records",
        id: "Pelaporan dan pelacakan keluhan kerusakan alat langsung dari lapangan",
      },
    ],
    roleNote: {
      en: "Built during my Mobile Developer internship at RS UMMI Bogor (Feb–Jul 2025), documented across 71 public commits on the dev branch.",
      id: "Dikembangkan selama magang Mobile Developer di RS UMMI Bogor (Feb–Jul 2025), tercatat di 71 commit publik pada branch dev.",
    },
    evidenceNote: {
      en: "Full Flutter source code is public on GitHub, covering StockOpnameController, FcmTokenManager, FlutterSecureStorage session handling, and REST integration.",
      id: "Seluruh kode sumber Flutter tersedia publik di GitHub, mencakup StockOpnameController, FcmTokenManager, manajemen sesi FlutterSecureStorage, dan integrasi REST.",
    },
    fanout: {
      layout: "phones",
      left: { src: "assets/projects/simaru-login.jpg", frame: "phone", alt: "SIMARU login screen" },
      center: { src: "assets/projects/simaru-home.jpg", frame: "phone", alt: "SIMARU main dashboard" },
      right: { src: "assets/projects/simaru-stock.jpg", frame: "phone", alt: "SIMARU stock opname" },
    },
    rationale: [
      {
        technology: "Flutter + Provider",
        reason: {
          en: "Single Dart codebase builds for Android & iOS while Provider keeps controller state explicit across scan, asset, and complaint screens.",
          id: "Satu codebase Dart membangun Android & iOS, sementara Provider menjaga state antar layar scan, aset, dan komplain tetap lugas.",
        },
        tradeoff: {
          en: "Larger binary size than a web wrapper, acceptable for an internal hospital tool.",
          id: "Ukuran aplikasi lebih besar dibanding web view, namun wajar untuk aplikasi operasional internal rumah sakit.",
        },
      },
      {
        technology: "Firebase Cloud Messaging (FCM)",
        reason: {
          en: "Delivers inspection and complaint notifications reliably even when staff lock their phones on hospital rounds.",
          id: "Mengirimkan pemberitahuan inspeksi dan komplain secara andal meski ponsel petugas terkunci saat bertugas keliling.",
        },
        tradeoff: {
          en: "Requires Google Play Services and server-side token synchronization whenever device tokens rotate.",
          id: "Bergantung pada Google Play Services dan membutuhkan sinkronisasi ulang saat token perangkat berubah.",
        },
      },
      {
        technology: "REST API + Secure Storage",
        reason: {
          en: "Decouples the Flutter app from the hospital web backend while storing Bearer & FCM tokens encrypted on device.",
          id: "Memisahkan aplikasi Flutter dari backend web rumah sakit sekaligus menyimpan token Bearer & FCM terenkripsi di perangkat.",
        },
        tradeoff: {
          en: "Requires active Wi-Fi/cellular coverage inside wards; offline mutation queue is not yet implemented.",
          id: "Memerlukan koneksi jaringan aktif di area ruangan; antrean mutasi offline belum diimplementasikan.",
        },
      },
    ],
    telemetry: [
      {
        id: "commits",
        value: "71",
        label: { en: "Public Commits", id: "Commit Publik" },
        detail: { en: "Verified on GitHub dev branch", id: "Tercatat di branch dev GitHub" },
      },
      {
        id: "modules",
        value: "4",
        label: { en: "Core Workflows", id: "Alur Utama" },
        detail: { en: "QR Opname, Assets, Complaints, FCM", id: "Opname QR, Aset, Komplain, FCM" },
      },
      {
        id: "platforms",
        value: "Android & iOS",
        label: { en: "Target Client", id: "Target Klien" },
        detail: { en: "Single Dart 3.4+ Flutter codebase", id: "Satu codebase Flutter Dart 3.4+" },
      },
    ],
    architecture: {
      title: {
        en: "QR Asset Opname & FCM Token Sync Flow",
        id: "Alur Stock Opname QR & Sinkronisasi Token FCM",
      },
      subtitle: {
        en: "Actual controller, storage, and API boundaries from Aryawgna/SIMARU-Mobile-App",
        id: "Batas modul controller, penyimpanan lokal, dan endpoint API asli dari repo SIMARU-Mobile-App",
      },
      steps: [
        {
          step: 1,
          node: "StockOpnameController",
          role: { en: "Camera QR Scanner", id: "Pemindai QR Kamera" },
          protocol: "mobile_scanner ^6.0.10",
          description: {
            en: "Staff selects a hospital building and room, then scans physical asset QR labels with debounced duplicate filtering.",
            id: "Petugas memilih gedung dan ruangan rumah sakit, lalu memindai label QR aset dengan proteksi duplikasi bacaan.",
          },
          codeLabel: "lib/controllers/scan/stockopname_controller.dart",
          payloadExample: `// Building & Room scoped opname session
Building? _selectedBuilding;
List<Room> _filteredRooms = [];
List<StockOpnameItem> _scannedItems = [];
Map<int, int> _localScannedCounts = {}; // opnameId -> count`,
        },
        {
          step: 2,
          node: "FcmTokenManager",
          role: { en: "Encrypted Session & Token", id: "Sesi & Token Terenkripsi" },
          protocol: "flutter_secure_storage",
          description: {
            en: "Compares current Firebase device token against secure local storage and posts updates only when the token rotates.",
            id: "Membandingkan token perangkat Firebase dengan penyimpanan terenkripsi lokal dan hanya mengirim pembaruan jika token berubah.",
          },
          codeLabel: "lib/services/firebase/fcm_token_manager.dart",
          payloadExample: `POST /api/notifications/fcm-token
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "fcm_token": "<firebase_messaging_device_token>"
}`,
        },
        {
          step: 3,
          node: "Hospital REST API",
          role: { en: "Asset & Complaint Endpoints", id: "Endpoint Aset & Komplain" },
          protocol: "HTTPS JSON",
          description: {
            en: "Handles authentication, asset inventory records, depreciation summaries, activity history, and field complaints.",
            id: "Menangani autentikasi, inventaris aset, ringkasan penyusutan nilai, riwayat aktivitas, dan pelaporan komplain.",
          },
          codeLabel: "lib/core/config/api_config.dart",
          payloadExample: `POST /api/auth/login
POST /api/auth/refresh-token
GET  /api/dashboard/summary
GET  /api/assets
GET  /api/depreciations/total-value?year=2025
POST /api/complaints`,
        },
        {
          step: 4,
          node: "NotificationService",
          role: { en: "Push & Badge Handler", id: "Penanganan Push & Badge" },
          protocol: "firebase_messaging",
          description: {
            en: "Processes incoming foreground/background FCM alerts, updates unread badge state, and routes users to notification details.",
            id: "Memproses notifikasi FCM saat aplikasi aktif maupun di latar belakang, memperbarui badge, dan membuka detail laporan.",
          },
          codeLabel: "lib/controllers/notification/",
          payloadExample: `// Notification controllers & settings
NotificationController
NotificationBadgeController
NotificationSettingsController // per-user toggle preferences`,
        },
      ],
    },
    screenshots: [
      {
        src: "assets/projects/simaru-home.jpg",
        caption: { en: "Main dashboard", id: "Dashboard utama" },
        description: {
          en: "Summary of total medical assets, repair counts, net asset value, and daily activity feed.",
          id: "Ringkasan total aset medis, jumlah alat dalam perbaikan, nilai buku aset, dan aktivitas harian.",
        },
      },
      {
        src: "assets/projects/simaru-stock.jpg",
        caption: { en: "Stock opname", id: "Stock opname" },
        description: {
          en: "Building and room stock opname workflow where staff verify physical equipment via QR scan.",
          id: "Alur stock opname per gedung dan ruangan tempat petugas memverifikasi fisik alat medis lewat scan QR.",
        },
      },
      {
        src: "assets/projects/simaru-complain.jpg",
        caption: { en: "Complaint reporting", id: "Pelaporan keluhan" },
        description: {
          en: "Field complaint submission form for reporting damaged or malfunctioning hospital equipment.",
          id: "Formulir pelaporan keluhan lapangan untuk melaporkan alat medis yang rusak atau bermasalah.",
        },
      },
      {
        src: "assets/projects/simaru-notif.jpg",
        caption: { en: "Push notifications", id: "Notifikasi push" },
        description: {
          en: "Notification inbox and in-app alert preferences backed by Firebase Cloud Messaging.",
          id: "Kotak masuk pemberitahuan dan pengaturan preferensi notifikasi berbasis Firebase Cloud Messaging.",
        },
      },
      {
        src: "assets/projects/simaru-login.jpg",
        caption: { en: "Login screen", id: "Halaman masuk" },
        description: {
          en: "Staff authentication screen issuing JWT credentials stored in FlutterSecureStorage.",
          id: "Halaman autentikasi petugas yang menyimpan sesi JWT ke dalam FlutterSecureStorage.",
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
    contextBadge: {
      en: "Final Coursework (UAS) · Multi-Container System",
      id: "Proyek UAS · Sistem Multi-Kontainer",
    },
    chips: ["Next.js 15", "Laravel 11", "Docker", "Nginx"],
    stack: [
      "Next.js 15",
      "TypeScript",
      "Laravel 11 (PHP)",
      "Laravel Sanctum",
      "MySQL 8.0",
      "Nginx (Reverse Proxy & Static)",
      "Docker Compose",
      "SweetAlert2",
    ],
    highlights: [
      {
        en: "5-service Docker Compose topology isolated on a dedicated bridge network (skyboard-net)",
        id: "Topologi 5 kontainer Docker Compose terisolasi di jaringan bridge khusus (skyboard-net)",
      },
      {
        en: "Public flight display board auto-refreshing schedules every 30 seconds with boarding audio chimes",
        id: "Papan jadwal penerbangan publik dengan auto-refresh tiap 30 detik dan pengumuman audio boarding",
      },
      {
        en: "Sanctum-protected admin dashboard for flights, airlines, running text, and promo banners",
        id: "Dashboard admin terproteksi Sanctum untuk CRUD penerbangan, maskapai, running text, dan banner promo",
      },
      {
        en: "Nginx TLS gateway routing traffic across Next.js UI, Laravel API, and static media containers",
        id: "Gateway TLS Nginx yang mengarahkan trafik ke kontainer UI Next.js, API Laravel, dan server aset statis",
      },
    ],
    roleNote: {
      en: "Developed as final coursework (UAS) for the Web Software Tools course, with documented v1.0.0 and v2.0.0 releases.",
      id: "Dikembangkan sebagai proyek ujian akhir semester (UAS) mata kuliah Web Software Tools, lengkap dengan rilis v1.0.0 dan v2.0.0.",
    },
    evidenceNote: {
      en: "Repository includes the complete docker-compose.yml, gateway Nginx TLS config, Laravel 11 Sanctum API routes, SQL seeders, and Next.js 15 app.",
      id: "Repository memuat docker-compose.yml lengkap, konfigurasi TLS Nginx gateway, route API Laravel 11 Sanctum, seeder SQL, dan aplikasi Next.js 15.",
    },
    fanout: {
      layout: "desktop",
      secondary: {
        src: "assets/projects/skyboard-admin.jpg",
        frame: "laptop",
        alt: "Skyboard Admin Dashboard",
      },
      center: {
        src: "assets/projects/skyboard-main.jpg",
        frame: "laptop",
        alt: "Skyboard Public Flight Board",
      },
    },
    rationale: [
      {
        technology: "Docker Compose + Nginx Gateway",
        reason: {
          en: "Splits UI, API, static media, and MySQL into 5 reproducible containers behind a single HTTPS reverse proxy (skyboard.local).",
          id: "Memisahkan UI, API, media statis, dan MySQL ke dalam 5 kontainer yang mudah direproduksi di balik satu reverse proxy HTTPS (skyboard.local).",
        },
        tradeoff: {
          en: "Higher local memory footprint than running a monolith, traded for clean service isolation.",
          id: "Konsumsi memori lokal lebih besar dibanding monolit tunggal, ditukar dengan isolasi antar layanan yang rapi.",
        },
      },
      {
        technology: "Laravel 11 + Sanctum",
        reason: {
          en: "Provides structured REST controllers, validation, and token-authenticated admin mutations for flight statuses and promos.",
          id: "Menyediakan controller REST terstruktur, validasi request, dan autentikasi token Sanctum untuk pengelolaan jadwal serta promo.",
        },
        tradeoff: {
          en: "Uses 30-second client polling instead of persistent WebSockets, keeping PHP-FPM deployment straightforward.",
          id: "Menggunakan polling 30 detik alih-alih WebSocket persisten agar deployment PHP-FPM tetap sederhana.",
        },
      },
      {
        technology: "Next.js 15 + MySQL 8.0",
        reason: {
          en: "Next.js renders the kiosk display and admin views cleanly while MySQL enforces relational integrity between airlines and flights.",
          id: "Next.js merender layar display dan panel admin dengan responsif, sementara MySQL menjaga relasi data maskapai dan penerbangan.",
        },
        tradeoff: {
          en: "Running Node.js alongside PHP adds a second runtime in development.",
          id: "Menjalankan runtime Node.js berdampingan dengan PHP menambah layanan yang perlu dikelola.",
        },
      },
    ],
    telemetry: [
      {
        id: "containers",
        value: "5",
        label: { en: "Docker Containers", id: "Kontainer Docker" },
        detail: { en: "Gateway, UI, API, Assets, MySQL 8", id: "Gateway, UI, API, Assets, MySQL 8" },
      },
      {
        id: "refresh",
        value: "30s",
        label: { en: "Board Polling", id: "Siklus Polling" },
        detail: { en: "Automatic schedule & status sync", id: "Sinkronisasi jadwal & status otomatis" },
      },
      {
        id: "promo",
        value: "10",
        label: { en: "Promo Banners", id: "Slot Banner" },
        detail: { en: "Admin-managed rotating display media", id: "Media rotasi yang dikelola dari admin" },
      },
    ],
    architecture: {
      title: {
        en: "5-Container Docker Compose & Nginx Reverse Proxy Topology",
        id: "Topologi 5 Kontainer Docker Compose & Reverse Proxy Nginx",
      },
      subtitle: {
        en: "Verified service routing from Digital-Skyboard-Announcement/docker-compose.yml & gateway-skyboard/nginx.conf",
        id: "Routing antar kontainer asli dari docker-compose.yml dan gateway-skyboard/nginx.conf",
      },
      steps: [
        {
          step: 1,
          node: "gateway-skyboard",
          role: { en: "Nginx TLS Reverse Proxy", id: "Reverse Proxy TLS Nginx" },
          protocol: "HTTPS :443 / HTTP :80",
          description: {
            en: "Terminates TLS for skyboard.local and splits incoming requests between the Next.js UI, Laravel API, and static assets container.",
            id: "Menangani terminasi TLS untuk skyboard.local dan membagi trafik ke kontainer UI Next.js, API Laravel, serta server aset statis.",
          },
          codeLabel: "gateway-skyboard/nginx.conf",
          payloadExample: `upstream nextjs_app   { server ui-skyboard:3000; }
upstream laravel_api  { server api-skyboard:80; }
upstream assets_server { server assets-skyboard:80; }

location /    { proxy_pass http://nextjs_app; }
location /api { proxy_pass http://laravel_api/api; }`,
        },
        {
          step: 2,
          node: "ui-skyboard",
          role: { en: "Public FIDS & Admin UI", id: "Layar FIDS Publik & UI Admin" },
          protocol: "Next.js 15 (:3000)",
          description: {
            en: "Polls public flight schedules, airport info, running text, and promo banners every 30s, triggering audio chimes on boarding.",
            id: "Mem-polling jadwal penerbangan, info bandara, running text, dan banner promo tiap 30 detik serta memutar audio saat boarding.",
          },
          codeLabel: "routes/api.php (Public Display)",
          payloadExample: `GET /api/flights
GET /api/flights/stats
GET /api/airlines
GET /api/settings/running-text
GET /api/promos`,
        },
        {
          step: 3,
          node: "api-skyboard",
          role: { en: "Sanctum REST Backend", id: "Backend REST Sanctum" },
          protocol: "Laravel 11 + PHP-FPM",
          description: {
            en: "Authenticates admin operators via Laravel Sanctum and processes CRUD mutations for flights, status transitions, airlines, and assets.",
            id: "Mengautentikasi operator admin lewat Laravel Sanctum dan memproses CRUD jadwal, perubahan status penerbangan, maskapai, serta aset.",
          },
          codeLabel: "api-skyboard/skyboard-api/routes/api.php",
          payloadExample: `Route::middleware('auth:sanctum')->group(function () {
    Route::post('/flights', [FlightController::class, 'store']);
    Route::put('/flights/{flight}', [FlightController::class, 'update']);
    Route::patch('/flights/{flight}/status', [FlightController::class, 'updateStatus']);
    Route::delete('/flights/{flight}', [FlightController::class, 'destroy']);
});`,
        },
        {
          step: 4,
          node: "database & assets",
          role: { en: "MySQL 8.0 & Static Media", id: "MySQL 8.0 & Media Statis" },
          protocol: "skyboard-net (Bridge)",
          description: {
            en: "MySQL 8.0 persists flight/airline schemas with healthcheck gating, while assets-skyboard serves uploaded airline logos and promo banners.",
            id: "MySQL 8.0 menyimpan tabel penerbangan dan maskapai dengan healthcheck otomatis, sementara assets-skyboard menyajikan logo dan banner.",
          },
          codeLabel: "docker-compose.yml",
          payloadExample: `database-skyboard:
  image: mysql:8.0
  healthcheck: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
assets-skyboard:
  image: nginx:alpine
  volumes: ["./assets-skyboard:/usr/share/nginx/html"]`,
        },
      ],
    },
    screenshots: [
      {
        src: "assets/projects/skyboard-main.jpg",
        caption: { en: "Public flight board", id: "Papan penerbangan publik" },
        description: {
          en: "Main FIDS terminal display showing departures, airline logos, gate assignments, and live status badges.",
          id: "Layar utama FIDS terminal yang menampilkan keberangkatan, logo maskapai, nomor gate, dan status penerbangan.",
        },
      },
      {
        src: "assets/projects/skyboard-boarding.jpg",
        caption: { en: "Boarding status filter", id: "Filter status boarding" },
        description: {
          en: "Filtered view highlighting active boarding calls paired with terminal audio announcements.",
          id: "Tampilan tersaring untuk menyorot penerbangan yang sedang boarding beserta pengumuman suara.",
        },
      },
      {
        src: "assets/projects/skyboard-promo.jpg",
        caption: { en: "Promo banner carousel", id: "Carousel banner promo" },
        description: {
          en: "Rotating promotional banner slot served from the static assets container and managed via the admin panel.",
          id: "Area banner promosi bergilir yang disajikan dari kontainer aset statis dan dikelola melalui panel admin.",
        },
      },
      {
        src: "assets/projects/skyboard-admin.jpg",
        caption: { en: "Admin dashboard", id: "Dashboard admin" },
        description: {
          en: "Authenticated operator dashboard for managing flight schedules, airlines, running text, and media.",
          id: "Dashboard operator terautentikasi untuk mengelola jadwal penerbangan, maskapai, teks berjalan, dan media.",
        },
      },
      {
        src: "assets/projects/skyboard-addflight.jpg",
        caption: { en: "Flight editor modal", id: "Modal editor penerbangan" },
        description: {
          en: "Modal form for creating and updating flight records, scheduled times, gates, and statuses.",
          id: "Formulir modal untuk menambah dan memperbarui jadwal, nomor gate, serta status penerbangan.",
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
    contextBadge: {
      en: "Personal Project · Live Demo Available",
      id: "Proyek Pribadi · Demo Live Tersedia",
    },
    chips: ["Bun", "Elysia.js", "Svelte", "TypeScript"],
    stack: [
      "Bun (Reverse Proxy & Runtime)",
      "Elysia.js (API)",
      "Svelte + Vite (Client)",
      "TypeScript",
      "TVmaze & OMDB API",
      "Cloudflare Tunnel",
      "PM2",
    ],
    highlights: [
      {
        en: "Preloads 15,000+ movie, series, and anime records into in-memory structures at Bun startup",
        id: "Memuat 15.000+ metadata film, serial, dan anime ke dalam memori saat server Bun dinyalakan",
      },
      {
        en: "Custom Bun reverse proxy stripping duplicate compression headers for Cloudflare Tunnel compatibility",
        id: "Reverse proxy Bun khusus yang membersihkan duplikasi header kompresi agar stabil di balik Cloudflare Tunnel",
      },
      {
        en: "Client-side pagination, genre filtering, and Jaccard-index similarity recommendations in Svelte",
        id: "Paginasi, penyaringan genre, dan rekomendasi kemiripan indeks Jaccard dihitung langsung di klien Svelte",
      },
      {
        en: "Multi-server embed player switching between VidSrc, MultiEmbed, and 2Embed with localStorage history",
        id: "Pemutar multi-server (VidSrc, MultiEmbed, 2Embed) dilengkapi riwayat tontonan dan bookmark di localStorage",
      },
    ],
    roleNote: {
      en: "Personal self-hosted engineering project exploring Bun's native HTTP server, Elysia schema validation, and Svelte.",
      id: "Proyek eksplorasi pribadi self-hosted yang memanfaatkan HTTP server bawaan Bun, validasi skema Elysia, dan Svelte.",
    },
    evidenceNote: {
      en: "Source code (proxy.ts, backend/src/index.ts, frontend/src/App.svelte, PM2 ecosystem config) is on GitHub alongside a live Vercel deployment.",
      id: "Kode sumber (proxy.ts, backend/src/index.ts, frontend/src/App.svelte, konfigurasi PM2) tersedia di GitHub beserta demo live di Vercel.",
    },
    fanout: {
      layout: "desktop",
      secondary: {
        src: "assets/projects/streamely-player.jpg",
        frame: "laptop",
        alt: "StreamEly Multi-Server Video Player",
      },
      center: {
        src: "assets/projects/streamely-home.jpg",
        frame: "laptop",
        alt: "StreamEly VOD Catalog",
      },
    },
    rationale: [
      {
        technology: "Bun + Custom Reverse Proxy",
        reason: {
          en: "Runs both the API runtime and a lightweight port-8000 reverse proxy that strips conflicting content-encoding headers over Cloudflare Tunnel.",
          id: "Menjalankan runtime API sekaligus reverse proxy port 8000 yang menghapus konflik header content-encoding saat melalui Cloudflare Tunnel.",
        },
        tradeoff: {
          en: "In-memory Map/Array storage resets on process restart — acceptable for read-only public catalog metadata.",
          id: "Penyimpanan Map/Array di RAM dimuat ulang saat proses restart — wajar untuk katalog metadata publik read-only.",
        },
      },
      {
        technology: "Elysia.js + TVmaze / OMDB",
        reason: {
          en: "Typed routes aggregate TVmaze show schedules and fall back to OMDB by IMDb ID when cast or movie fields are missing.",
          id: "Route bertipe menggabungkan data serial TVmaze dan melakukan fallback ke OMDB via IMDb ID ketika data kru atau film belum lengkap.",
        },
        tradeoff: {
          en: "Depends on third-party API rate limits during initial startup ingestion.",
          id: "Bergantung pada batas rate limit API pihak ketiga saat proses pemuatan awal.",
        },
      },
      {
        technology: "Svelte + Vite",
        reason: {
          en: "Compiles reactive catalog browsing, search, and Jaccard similarity scoring into a small client bundle.",
          id: "Mengompilasi penjelajahan katalog, pencarian instan, dan perhitungan kemiripan Jaccard ke dalam bundle klien yang ringan.",
        },
        tradeoff: {
          en: "Smaller component ecosystem than React, though sufficient for a focused media interface.",
          id: "Ekosistem pustaka komponen lebih kecil dibanding React, namun sangat mencukupi untuk antarmuka media yang fokus.",
        },
      },
    ],
    telemetry: [
      {
        id: "cache",
        value: "15,000+",
        label: { en: "Preloaded Titles", id: "Judul di Memori" },
        detail: { en: "Cached in showsDB & moviesDB at startup", id: "Di-cache pada showsDB & moviesDB saat boot" },
      },
      {
        id: "gateways",
        value: "3",
        label: { en: "Embed Servers", id: "Server Pemutar" },
        detail: { en: "VidSrc, MultiEmbed, 2Embed switcher", id: "Pilihan server VidSrc, MultiEmbed, 2Embed" },
      },
      {
        id: "sources",
        value: "2 APIs",
        label: { en: "Metadata Sources", id: "Sumber Metadata" },
        detail: { en: "TVmaze primary + OMDB fallback", id: "TVmaze utama + fallback OMDB" },
      },
    ],
    architecture: {
      title: {
        en: "Bun Reverse Proxy, In-Memory Catalog & Svelte Client",
        id: "Reverse Proxy Bun, Katalog In-Memory & Klien Svelte",
      },
      subtitle: {
        en: "Actual request routing and data structures from AryaWgna/streamely",
        id: "Alur request dan struktur data asli dari repositori AryaWgna/streamely",
      },
      steps: [
        {
          step: 1,
          node: "Bun Reverse Proxy",
          role: { en: "Gateway & Header Sanitizer", id: "Gateway & Pembersih Header" },
          protocol: "Bun.serve (0.0.0.0:8000)",
          description: {
            en: "Routes /api/* to Elysia (:3000) and / to Vite (:5173), stripping content-encoding headers to avoid ERR_CONTENT_DECODING_FAILED over Cloudflare Tunnel.",
            id: "Mengarahkan /api/* ke Elysia (:3000) dan / ke Vite (:5173), serta menghapus header content-encoding ganda agar aman diakses lewat Cloudflare Tunnel.",
          },
          codeLabel: "proxy.ts",
          payloadExample: `Bun.serve({
  port: 8000,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/")) {
      return forwardRequest(req, "http://localhost:3000", true);
    }
    return forwardRequest(req, "http://localhost:5173", false);
  },
});`,
        },
        {
          step: 2,
          node: "Elysia.js Backend",
          role: { en: "In-Memory Metadata API", id: "API Metadata In-Memory" },
          protocol: "Bun + Elysia (:3000)",
          description: {
            en: "Bootstraps 15,000+ entries from TVmaze and curated IMDb IDs via OMDB into showsDB[] and moviesDB Map for fast lookups.",
            id: "Memuat 15.000+ entri dari TVmaze dan daftar IMDb melalui OMDB ke dalam showsDB[] serta Map moviesDB saat startup.",
          },
          codeLabel: "backend/src/index.ts",
          payloadExample: `const showsDB: Show[] = [];
const moviesDB = new Map<string, Show>();

// Fallback lookup via OMDB when TVmaze cast/movie metadata is missing
const res = await fetch(\`http://www.omdbapi.com/?apikey=\${OMDB_API_KEY}&i=\${id}\`);`,
        },
        {
          step: 3,
          node: "Svelte + Vite Client",
          role: { en: "Catalog & Jaccard Scorer", id: "Katalog & Rekomendasi Jaccard" },
          protocol: "Client-Side State + localStorage",
          description: {
            en: "Handles local pagination, genre filtering, Jaccard genre-overlap recommendations, and persistent watch history/bookmarks.",
            id: "Menjalankan paginasi lokal, filter genre, perhitungan rekomendasi kemiripan genre Jaccard, serta riwayat tontonan di localStorage.",
          },
          codeLabel: "frontend/src/App.svelte",
          payloadExample: `// Jaccard similarity between two title genre sets:
// J(A, B) = |A ∩ B| / |A ∪ B|
// Watch history & bookmarks persisted in window.localStorage`,
        },
        {
          step: 4,
          node: "Embed Player Switcher",
          role: { en: "Multi-Source Video Iframe", id: "Pemutar Iframe Multi-Server" },
          protocol: "VidSrc · MultiEmbed · 2Embed",
          description: {
            en: "Lets viewers switch seamlessly across three external embed servers by IMDb ID, season, and episode number when a mirror is unavailable.",
            id: "Memungkinkan pengguna berpindah antar tiga server embed berdasarkan IMDb ID, season, dan nomor episode apabila salah satu server gangguan.",
          },
          codeLabel: "Multi-server stream selector",
          payloadExample: `servers = ["VidSrc", "MultiEmbed", "2Embed"]
// Resolves embed URL by imdbId + season/episode for TV series`,
        },
      ],
    },
    screenshots: [
      {
        src: "assets/projects/streamely-home.jpg",
        caption: { en: "Home & trending", id: "Beranda & trending" },
        description: {
          en: "Landing catalog featuring hero highlights, genre rows, and Jaccard-based recommendations.",
          id: "Beranda katalog menampilkan sorotan utama, daftar per genre, dan rekomendasi berbasis Jaccard.",
        },
      },
      {
        src: "assets/projects/streamely-explore.jpg",
        caption: { en: "Explore catalog", id: "Jelajahi katalog" },
        description: {
          en: "Dense poster grid with client-side genre filtering and pagination.",
          id: "Grid poster lengkap dengan penyaringan genre dan paginasi di sisi klien.",
        },
      },
      {
        src: "assets/projects/streamely-search.jpg",
        caption: { en: "Instant search", id: "Pencarian instan" },
        description: {
          en: "Keyword filtering across the preloaded 15,000+ movie, TV, and anime catalog.",
          id: "Pencarian kata kunci langsung di atas 15.000+ katalog film, serial TV, dan anime.",
        },
      },
      {
        src: "assets/projects/streamely-detail.jpg",
        caption: { en: "Title details", id: "Detail tontonan" },
        description: {
          en: "Synopsis, cast/crew metadata resolved from TVmaze/OMDB, season/episode picker, and related titles.",
          id: "Sinopsis, informasi pemeran dari TVmaze/OMDB, pemilih season/episode, serta judul serupa.",
        },
      },
      {
        src: "assets/projects/streamely-player.jpg",
        caption: { en: "Multi-server player", id: "Pemutar multi-server" },
        description: {
          en: "Embedded playback screen with one-click switching between VidSrc, MultiEmbed, and 2Embed.",
          id: "Layar pemutar terintegrasi dengan tombol perpindahan server VidSrc, MultiEmbed, dan 2Embed.",
        },
      },
    ],
  },
];
