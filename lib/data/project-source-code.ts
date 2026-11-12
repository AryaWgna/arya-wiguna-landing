export type SourceCodeFile = {
  path: string;
  language: string;
  summary: {
    en: string;
    id: string;
  };
  code: string;
};

export type ProjectSourceRepository = {
  slug: string;
  repoName: string;
  branch: string;
  files: SourceCodeFile[];
};

export const PROJECT_SOURCE_REPOS: Record<string, ProjectSourceRepository> = {
  "simaru-mobile-app": {
    slug: "simaru-mobile-app",
    repoName: "SIMARU-Mobile-App",
    branch: "dev",
    files: [
      {
        path: "lib/controllers/scan/stockopname_controller.dart",
        language: "dart",
        summary: {
          en: "Camera QR stock opname controller scoped by hospital building and room, with duplicate scan protection and server synchronization.",
          id: "Controller stock opname QR kamera per gedung dan ruangan rumah sakit, dilengkapi proteksi duplikasi scan serta sinkronisasi ke server.",
        },
        code: `import 'package:flutter/foundation.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../../models/building_model.dart';
import '../../models/room_model.dart';
import '../../models/stockopname_item_model.dart';
import '../../services/api/stockopname_service.dart';

class StockOpnameController extends ChangeNotifier {
  final StockOpnameService _service;

  StockOpnameController({StockOpnameService? service})
      : _service = service ?? StockOpnameService();

  Building? _selectedBuilding;
  Room? _selectedRoom;
  List<Building> _buildings = [];
  List<Room> _filteredRooms = [];
  List<StockOpnameItem> _scannedItems = [];
  final Map<int, int> _localScannedCounts = {};
  final Set<String> _recentQrCodes = {};

  bool _isLoading = false;
  bool _isSubmitting = false;
  String? _errorMessage;

  Building? get selectedBuilding => _selectedBuilding;
  Room? get selectedRoom => _selectedRoom;
  List<Building> get buildings => List.unmodifiable(_buildings);
  List<Room> get filteredRooms => List.unmodifiable(_filteredRooms);
  List<StockOpnameItem> get scannedItems => List.unmodifiable(_scannedItems);
  bool get isLoading => _isLoading;
  bool get isSubmitting => _isSubmitting;
  String? get errorMessage => _errorMessage;

  Future<void> initializeLocations() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _buildings = await _service.fetchBuildings();
      if (_buildings.isNotEmpty) {
        selectBuilding(_buildings.first);
      }
    } catch (e) {
      _errorMessage = 'Gagal memuat daftar gedung & ruangan: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void selectBuilding(Building building) {
    _selectedBuilding = building;
    _filteredRooms = building.rooms;
    _selectedRoom = _filteredRooms.isNotEmpty ? _filteredRooms.first : null;
    notifyListeners();
  }

  void selectRoom(Room room) {
    _selectedRoom = room;
    notifyListeners();
  }

  /// Processes a scanned QR barcode from mobile_scanner with a 2.5s debounce guard
  Future<bool> onBarcodeDetected(BarcodeCapture capture) async {
    if (_selectedRoom == null || _isSubmitting) return false;

    final rawValue = capture.barcodes.firstOrNull?.rawValue?.trim();
    if (rawValue == null || rawValue.isEmpty) return false;

    // Prevent rapid duplicate triggers while camera is pointed at the same label
    if (_recentQrCodes.contains(rawValue)) return false;
    _recentQrCodes.add(rawValue);
    Future.delayed(const Duration(milliseconds: 2500), () {
      _recentQrCodes.remove(rawValue);
    });

    try {
      final item = await _service.verifyAssetByQr(
        qrCode: rawValue,
        buildingId: _selectedBuilding!.id,
        roomId: _selectedRoom!.id,
      );

      final existingIdx = _scannedItems.indexWhere((e) => e.assetCode == item.assetCode);
      if (existingIdx >= 0) {
        _scannedItems[existingIdx] = item;
      } else {
        _scannedItems.insert(0, item);
      }
      _localScannedCounts[_selectedRoom!.id] = _scannedItems.length;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Aset tidak terdaftar pada ruangan ini ($rawValue)';
      notifyListeners();
      return false;
    }
  }

  Future<bool> submitRoomOpnameSession({String? notes}) async {
    if (_selectedRoom == null || _scannedItems.isEmpty) return false;
    _isSubmitting = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _service.submitBatchOpname(
        roomId: _selectedRoom!.id,
        assetIds: _scannedItems.map((e) => e.id).toList(),
        notes: notes,
      );
      _scannedItems = [];
      return true;
    } catch (e) {
      _errorMessage = 'Gagal mengirim hasil stock opname: $e';
      return false;
    } finally {
      _isSubmitting = false;
      notifyListeners();
    }
  }
}`,
      },
      {
        path: "lib/services/firebase/fcm_token_manager.dart",
        language: "dart",
        summary: {
          en: "Manages Firebase Cloud Messaging device tokens, encrypted local persistence in FlutterSecureStorage, and conditional backend sync on token rotation.",
          id: "Mengelola token perangkat Firebase Cloud Messaging, penyimpanan terenkripsi di FlutterSecureStorage, dan sinkronisasi ke server saat token berputar.",
        },
        code: `import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import '../../core/config/api_config.dart';

class FcmTokenManager {
  static const _kStoredFcmTokenKey = 'simaru_cached_fcm_token';
  static const _kAuthTokenKey = 'simaru_jwt_access_token';

  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
  );

  /// Requests notification permissions and syncs token only if rotated
  Future<void> initializeAndSyncToken() async {
    final settings = await _messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );

    if (settings.authorizationStatus != AuthorizationStatus.authorized &&
        settings.authorizationStatus != AuthorizationStatus.provisional) {
      return;
    }

    final currentToken = await _messaging.getToken();
    if (currentToken != null) {
      await _syncTokenIfNeeded(currentToken);
    }

    // Listen for token rotations while app is installed
    _messaging.onTokenRefresh.listen(_syncTokenIfNeeded);
  }

  Future<void> _syncTokenIfNeeded(String newToken) async {
    final cachedToken = await _secureStorage.read(key: _kStoredFcmTokenKey);
    final jwt = await _secureStorage.read(key: _kAuthTokenKey);

    if (jwt == null || jwt.isEmpty) return;
    if (cachedToken == newToken) return;

    final response = await http.post(
      Uri.parse(ApiConfig.fcmTokenEndpoint),
      headers: {
        'Authorization': 'Bearer $jwt',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: jsonEncode({'fcm_token': newToken}),
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      await _secureStorage.write(key: _kStoredFcmTokenKey, value: newToken);
    }
  }

  Future<void> clearSessionTokens() async {
    await _secureStorage.delete(key: _kStoredFcmTokenKey);
    await _secureStorage.delete(key: _kAuthTokenKey);
  }
}`,
      },
      {
        path: "lib/core/config/api_config.dart",
        language: "dart",
        summary: {
          en: "Centralized REST API endpoint definitions for authentication, medical asset inventory, depreciation calculation, and field complaints.",
          id: "Konfigurasi terpusat endpoint REST API untuk autentikasi, inventaris aset medis, perhitungan penyusutan nilai buku, dan pelaporan komplain.",
        },
        code: `class ApiConfig {
  static const String baseUrl = String.fromEnvironment(
    'SIMARU_API_BASE_URL',
    defaultValue: 'https://simaru.rsummi.co.id/api',
  );

  // Authentication & Session
  static const String loginEndpoint = '$baseUrl/auth/login';
  static const String refreshEndpoint = '$baseUrl/auth/refresh-token';
  static const String logoutEndpoint = '$baseUrl/auth/logout';

  // Dashboard & Asset Lifecycle
  static const String dashboardSummary = '$baseUrl/dashboard/summary';
  static const String assetsEndpoint = '$baseUrl/assets';
  static const String buildingsEndpoint = '$baseUrl/buildings';
  static const String stockOpnameVerify = '$baseUrl/stock-opname/verify-qr';
  static const String stockOpnameSubmit = '$baseUrl/stock-opname/submit';

  // Depreciation & Field Complaints
  static String depreciationByYear(int year) =>
      '$baseUrl/depreciations/total-value?year=$year';
  static const String complaintsEndpoint = '$baseUrl/complaints';

  // Push Notification Sync
  static const String fcmTokenEndpoint = '$baseUrl/notifications/fcm-token';
  static const String notificationsInbox = '$baseUrl/notifications';

  static Map<String, String> authHeaders(String jwt) => {
        'Authorization': 'Bearer $jwt',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
}`,
      },
      {
        path: "lib/main.dart",
        language: "dart",
        summary: {
          en: "Flutter application bootstrap registering Firebase background message handlers and MultiProvider state controllers.",
          id: "Bootstrap aplikasi Flutter yang mendaftarkan handler pesan latar belakang Firebase serta state controller MultiProvider.",
        },
        code: `import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:provider/provider.dart';
import 'controllers/auth/auth_controller.dart';
import 'controllers/scan/stockopname_controller.dart';
import 'controllers/notification/notification_controller.dart';
import 'services/firebase/fcm_token_manager.dart';
import 'views/root_shell.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
}

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  final fcmManager = FcmTokenManager();
  await fcmManager.initializeAndSyncToken();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthController()..restoreSession()),
        ChangeNotifierProvider(create: (_) => StockOpnameController()),
        ChangeNotifierProvider(create: (_) => NotificationController()..loadInbox()),
      ],
      child: const SimaruApp(),
    ),
  );
}

class SimaruApp extends StatelessWidget {
  const SimaruApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SIMARU — RS UMMI Bogor',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF0F4C81)),
        useMaterial3: true,
      ),
      home: const RootShell(),
    );
  }
}`,
      },
      {
        path: "pubspec.yaml",
        language: "yaml",
        summary: {
          en: "Dart 3.4+ & Flutter dependencies for QR camera scanning, encrypted storage, state management, and Firebase push messaging.",
          id: "Daftar dependensi Dart 3.4+ & Flutter untuk pemindaian QR kamera, penyimpanan terenkripsi, state management, dan notifikasi Firebase.",
        },
        code: `name: simaru_mobile_app
description: Hospital Asset Management & QR Stock Opname App — RS UMMI Bogor.
publish_to: "none"
version: 1.2.0+71

environment:
  sdk: ">=3.4.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  http: ^1.2.2
  mobile_scanner: ^6.0.10
  firebase_core: ^3.6.0
  firebase_messaging: ^15.1.3
  flutter_local_notifications: ^17.2.3
  flutter_secure_storage: ^9.2.2
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0`,
      },
    ],
  },

  "digital-skyboard-announcement": {
    slug: "digital-skyboard-announcement",
    repoName: "Digital-Skyboard-Announcement",
    branch: "main",
    files: [
      {
        path: "docker-compose.yml",
        language: "yaml",
        summary: {
          en: "5-container orchestration isolating Nginx TLS gateway, Next.js 15 FIDS display, Laravel 11 API, static media server, and MySQL 8.0 on skyboard-net.",
          id: "Orkestrasi 5 kontainer yang mengisolasi gateway TLS Nginx, layar FIDS Next.js 15, API Laravel 11, server media statis, dan MySQL 8.0 di jaringan skyboard-net.",
        },
        code: `services:
  gateway-skyboard:
    image: nginx:alpine
    container_name: gateway-skyboard
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./gateway-skyboard/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./gateway-skyboard/certs:/etc/nginx/certs:ro
    depends_on:
      - ui-skyboard
      - api-skyboard
      - assets-skyboard
    networks:
      - skyboard-net

  ui-skyboard:
    build:
      context: ./ui-skyboard
      dockerfile: Dockerfile
    container_name: ui-skyboard
    environment:
      - NEXT_PUBLIC_API_URL=https://skyboard.local/api
      - NEXT_PUBLIC_ASSETS_URL=https://skyboard.local/assets
    expose:
      - "3000"
    networks:
      - skyboard-net

  api-skyboard:
    build:
      context: ./api-skyboard
      dockerfile: Dockerfile
    container_name: api-skyboard
    environment:
      - APP_ENV=production
      - DB_CONNECTION=mysql
      - DB_HOST=database-skyboard
      - DB_PORT=3306
      - DB_DATABASE=skyboard_db
      - DB_USERNAME=skyboard_user
      - DB_PASSWORD=skyboard_secret
    depends_on:
      database-skyboard:
        condition: service_healthy
    networks:
      - skyboard-net

  assets-skyboard:
    image: nginx:alpine
    container_name: assets-skyboard
    volumes:
      - ./assets-skyboard:/usr/share/nginx/html:ro
    expose:
      - "80"
    networks:
      - skyboard-net

  database-skyboard:
    image: mysql:8.0
    container_name: database-skyboard
    environment:
      MYSQL_DATABASE: skyboard_db
      MYSQL_USER: skyboard_user
      MYSQL_PASSWORD: skyboard_secret
      MYSQL_ROOT_PASSWORD: root_secret
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - skyboard-db-data:/var/lib/mysql
    networks:
      - skyboard-net

volumes:
  skyboard-db-data:

networks:
  skyboard-net:
    driver: bridge`,
      },
      {
        path: "gateway-skyboard/nginx.conf",
        language: "nginx",
        summary: {
          en: "Nginx reverse proxy terminating HTTPS TLS and routing /, /api, and /assets to their dedicated internal containers.",
          id: "Konfigurasi reverse proxy Nginx untuk terminasi TLS HTTPS dan pembagian rute /, /api, serta /assets ke masing-masing kontainer internal.",
        },
        code: `upstream nextjs_app {
    server ui-skyboard:3000;
}

upstream laravel_api {
    server api-skyboard:80;
}

upstream assets_server {
    server assets-skyboard:80;
}

server {
    listen 80;
    server_name skyboard.local;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name skyboard.local;

    ssl_certificate     /etc/nginx/certs/skyboard.local.pem;
    ssl_certificate_key /etc/nginx/certs/skyboard.local-key.pem;

    # Public FIDS Display & Admin UI (Next.js 15)
    location / {
        proxy_pass http://nextjs_app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Sanctum REST API (Laravel 11)
    location /api/ {
        proxy_pass http://laravel_api/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Airline Logos & Promo Banners
    location /assets/ {
        proxy_pass http://assets_server/;
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
}`,
      },
      {
        path: "api-skyboard/routes/api.php",
        language: "php",
        summary: {
          en: "Laravel 11 API routes separating public FIDS terminal polling endpoints from Sanctum-authenticated operator mutations.",
          id: "Rute API Laravel 11 yang memisahkan endpoint polling layar publik FIDS dari endpoint mutasi admin yang diproteksi Laravel Sanctum.",
        },
        code: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\FlightController;
use App\\Http\\Controllers\\AirlineController;
use App\\Http\\Controllers\\PromoController;
use App\\Http\\Controllers\\SettingController;

// Public Terminal Kiosk Endpoints (Polled every 30s by FIDS Display)
Route::get('/flights', [FlightController::class, 'index']);
Route::get('/flights/stats', [FlightController::class, 'stats']);
Route::get('/airlines', [AirlineController::class, 'index']);
Route::get('/promos', [PromoController::class, 'activePromos']);
Route::get('/settings/running-text', [SettingController::class, 'runningText']);

// Operator Authentication
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected Airport Operator Routes (Laravel Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::post('/flights', [FlightController::class, 'store']);
    Route::put('/flights/{flight}', [FlightController::class, 'update']);
    Route::patch('/flights/{flight}/status', [FlightController::class, 'updateStatus']);
    Route::delete('/flights/{flight}', [FlightController::class, 'destroy']);

    Route::apiResource('/airlines', AirlineController::class)->except(['index']);
    Route::apiResource('/promos', PromoController::class)->except(['index']);
    Route::put('/settings/running-text', [SettingController::class, 'updateRunningText']);
});`,
      },
      {
        path: "api-skyboard/app/Http/Controllers/FlightController.php",
        language: "php",
        summary: {
          en: "REST controller handling flight schedule queries, status transitions (SCHEDULED, BOARDING, DEPARTED, DELAYED), and relational airline eager-loading.",
          id: "Controller REST yang menangani query jadwal penerbangan, perubahan status (SCHEDULED, BOARDING, DEPARTED, DELAYED), serta relasi maskapai.",
        },
        code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Flight;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class FlightController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Flight::with('airline')
            ->orderBy('departure_time', 'asc');

        if ($request->filled('status')) {
            $query->where('status', strtoupper($request->string('status')));
        }

        return response()->json([
            'status' => 'success',
            'updated_at' => now()->toIso8601String(),
            'data' => $query->get(),
        ]);
    }

    public function updateStatus(Request $request, Flight $flight): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:ON_TIME,BOARDING,DELAYED,GATE_CLOSED,DEPARTED,CANCELLED',
            'gate'   => 'nullable|string|max:12',
        ]);

        $flight->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => "Flight {$flight->flight_number} status updated to {$flight->status}",
            'data'    => $flight->load('airline'),
        ]);
    }
}`,
      },
      {
        path: "ui-skyboard/app/page.tsx",
        language: "tsx",
        summary: {
          en: "Next.js 15 FIDS departure display polling live flight schedules every 30 seconds and triggering terminal boarding chime alerts.",
          id: "Komponen layar keberangkatan FIDS Next.js 15 yang melakukan polling jadwal tiap 30 detik dan membunyikan bel pengumuman saat boarding.",
        },
        code: `"use client";

import React, { useEffect, useRef, useState } from "react";

interface FlightRecord {
  id: number;
  flight_number: string;
  destination: string;
  departure_time: string;
  gate: string;
  status: "ON_TIME" | "BOARDING" | "DELAYED" | "GATE_CLOSED" | "DEPARTED";
  airline: { name: string; code: string; logo_url: string };
}

export default function SkyboardFidsDisplay() {
  const [flights, setFlights] = useState<FlightRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const announcedBoardingIds = useRef<Set<number>>(new Set());

  useEffect(() => {
    const fetchSchedule = async () => {
      const res = await fetch(\`\${process.env.NEXT_PUBLIC_API_URL}/flights\`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = await res.json();
      const rows: FlightRecord[] = json.data ?? [];
      setFlights(rows);

      // Play boarding chime when a flight newly transitions to BOARDING
      rows.forEach((f) => {
        if (f.status === "BOARDING" && !announcedBoardingIds.current.has(f.id)) {
          announcedBoardingIds.current.add(f.id);
          const audio = new Audio("/audio/boarding-chime.mp3");
          audio.play().catch(() => {});
        }
      });
    };

    fetchSchedule();
    const timer = window.setInterval(fetchSchedule, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const visibleFlights =
    statusFilter === "ALL"
      ? flights
      : flights.filter((f) => f.status === statusFilter);

  return (
    <main className="fids-board">
      <header className="fids-header">
        <h1>DEPARTURES — DIGITAL SKYBOARD TERMINAL</h1>
        <div className="fids-filters">
          {["ALL", "BOARDING", "ON_TIME", "DELAYED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={statusFilter === st ? "active" : ""}
            >
              {st}
            </button>
          ))}
        </div>
      </header>
      <section className="fids-table">
        {visibleFlights.map((flight) => (
          <div key={flight.id} className={\`fids-row status-\${flight.status}\`}>
            <span className="col-time">{flight.departure_time}</span>
            <span className="col-flight">{flight.flight_number}</span>
            <span className="col-dest">{flight.destination}</span>
            <span className="col-gate">{flight.gate}</span>
            <span className="col-status">{flight.status}</span>
          </div>
        ))}
      </section>
    </main>
  );
}`,
      },
    ],
  },

  streamely: {
    slug: "streamely",
    repoName: "streamely",
    branch: "main",
    files: [
      {
        path: "proxy.ts",
        language: "typescript",
        summary: {
          en: "Custom Bun HTTP reverse proxy on port 8000 routing /api/* to Elysia and / to Vite while sanitizing duplicate compression headers for Cloudflare Tunnel.",
          id: "Reverse proxy HTTP Bun di port 8000 yang mengarahkan /api/* ke Elysia dan / ke Vite sekaligus membersihkan duplikasi header kompresi untuk Cloudflare Tunnel.",
        },
        code: `const BACKEND_ORIGIN = "http://localhost:3000";
const FRONTEND_ORIGIN = "http://localhost:5173";

async function forwardRequest(
  req: Request,
  targetOrigin: string,
  isApi: boolean
): Promise<Response> {
  const incomingUrl = new URL(req.url);
  const targetUrl = new URL(incomingUrl.pathname + incomingUrl.search, targetOrigin);

  const upstreamRes = await fetch(targetUrl.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
  });

  // Strip conflicting encoding/length headers to prevent ERR_CONTENT_DECODING_FAILED over Cloudflare Tunnel
  const cleanHeaders = new Headers(upstreamRes.headers);
  cleanHeaders.delete("content-encoding");
  cleanHeaders.delete("content-length");
  cleanHeaders.delete("transfer-encoding");

  if (isApi) {
    cleanHeaders.set("Access-Control-Allow-Origin", "*");
  }

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    statusText: upstreamRes.statusText,
    headers: cleanHeaders,
  });
}

Bun.serve({
  port: 8000,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/")) {
      return forwardRequest(req, BACKEND_ORIGIN, true);
    }
    return forwardRequest(req, FRONTEND_ORIGIN, false);
  },
});

console.log("[StreamEly Proxy] Listening on http://0.0.0.0:8000");`,
      },
      {
        path: "backend/src/index.ts",
        language: "typescript",
        summary: {
          en: "Elysia.js backend preloading 15,000+ TVmaze & OMDB records into in-memory structures (showsDB[] and moviesDB Map) for sub-millisecond search and filtering.",
          id: "Backend Elysia.js yang memuat 15.000+ entri TVmaze & OMDB ke struktur memori (showsDB[] dan Map moviesDB) untuk pencarian instan.",
        },
        code: `import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";

export interface CatalogItem {
  id: string;
  imdbId: string;
  title: string;
  type: "movie" | "series" | "anime";
  year: number;
  rating: number;
  genres: string[];
  poster: string;
  synopsis: string;
}

const showsDB: CatalogItem[] = [];
const moviesDB = new Map<string, CatalogItem>();
const OMDB_API_KEY = process.env.OMDB_API_KEY ?? "";

async function bootstrapInMemoryCatalog() {
  // Preload paginated TVmaze index pages into RAM at startup
  for (let page = 0; page < 60; page++) {
    const res = await fetch(\`https://api.tvmaze.com/shows?page=\${page}\`);
    if (!res.ok) break;
    const rows = (await res.json()) as any[];
    for (const r of rows) {
      const item: CatalogItem = {
        id: String(r.id),
        imdbId: r.externals?.imdb ?? "",
        title: r.name,
        type: r.type === "Animation" ? "anime" : "series",
        year: r.premiered ? Number(r.premiered.slice(0, 4)) : 2024,
        rating: r.rating?.average ?? 7.4,
        genres: r.genres ?? [],
        poster: r.image?.medium ?? "",
        synopsis: (r.summary ?? "").replace(/<[^>]+>/g, ""),
      };
      showsDB.push(item);
      if (item.imdbId) moviesDB.set(item.imdbId, item);
    }
  }
  console.log(\`[Elysia] Preloaded \${showsDB.length} titles into RAM\`);
}

bootstrapInMemoryCatalog();

const app = new Elysia()
  .use(cors())
  .get("/api/catalog", ({ query }) => {
    const q = (query.q ?? "").toLowerCase().trim();
    const genre = query.genre ?? "ALL";
    const page = Math.max(1, Number(query.page ?? 1));
    const limit = 36;

    const filtered = showsDB.filter((item) => {
      const matchQuery = !q || item.title.toLowerCase().includes(q);
      const matchGenre = genre === "ALL" || item.genres.includes(genre);
      return matchQuery && matchGenre;
    });

    return {
      total: filtered.length,
      page,
      items: filtered.slice((page - 1) * limit, page * limit),
    };
  })
  .get("/api/title/:imdbId", async ({ params }) => {
    const cached = moviesDB.get(params.imdbId);
    if (cached) return cached;

    const res = await fetch(
      \`https://www.omdbapi.com/?apikey=\${OMDB_API_KEY}&i=\${params.imdbId}&plot=full\`
    );
    return await res.json();
  })
  .listen(3000);`,
      },
      {
        path: "frontend/src/App.svelte",
        language: "svelte",
        summary: {
          en: "Svelte client computing Jaccard genre similarity recommendations, instant catalog filtering, and multi-server iframe playback switching.",
          id: "Klien Svelte yang menghitung rekomendasi kemiripan genre Jaccard, filter katalog instan, dan perpindahan server pemutar video.",
        },
        code: `<script lang="ts">
  import { onMount } from "svelte";

  interface TitleItem {
    id: string;
    imdbId: string;
    title: string;
    year: number;
    rating: number;
    genres: string[];
    poster: string;
  }

  const EMBED_SERVERS = [
    { id: "vidsrc", name: "VidSrc Pro", buildUrl: (imdb: string) => \`https://vidsrc.xyz/embed/movie/\${imdb}\` },
    { id: "multiembed", name: "MultiEmbed", buildUrl: (imdb: string) => \`https://multiembed.mov/?video_id=\${imdb}\` },
    { id: "2embed", name: "2Embed", buildUrl: (imdb: string) => \`https://www.2embed.cc/embed/\${imdb}\` },
  ];

  let catalog: TitleItem[] = [];
  let activeTitle: TitleItem | null = null;
  let selectedServer = EMBED_SERVERS[0];

  // Jaccard similarity J(A, B) = |A ∩ B| / |A ∪ B| for related title recommendations
  function jaccardSimilarity(a: string[], b: string[]): number {
    const setA = new Set(a);
    const setB = new Set(b);
    let intersection = 0;
    for (const g of setA) {
      if (setB.has(g)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  $: relatedTitles = activeTitle
    ? catalog
        .filter((t) => t.id !== activeTitle?.id)
        .map((t) => ({ item: t, score: jaccardSimilarity(activeTitle!.genres, t.genres) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((r) => r.item)
    : [];

  onMount(async () => {
    const res = await fetch("/api/catalog?page=1");
    const data = await res.json();
    catalog = data.items ?? [];
  });
</script>`,
      },
      {
        path: "ecosystem.config.cjs",
        language: "javascript",
        summary: {
          en: "PM2 process configuration managing the Bun reverse proxy, Elysia API server, and Vite frontend in production.",
          id: "Konfigurasi proses PM2 yang mengelola reverse proxy Bun, server API Elysia, dan frontend Vite secara bersamaan.",
        },
        code: `module.exports = {
  apps: [
    {
      name: "streamely-proxy",
      script: "proxy.ts",
      interpreter: "bun",
      env: { NODE_ENV: "production" },
    },
    {
      name: "streamely-api",
      cwd: "./backend",
      script: "src/index.ts",
      interpreter: "bun",
      env: { NODE_ENV: "production", PORT: 3000 },
    },
    {
      name: "streamely-web",
      cwd: "./frontend",
      script: "bun",
      args: "run preview --port 5173 --host",
      env: { NODE_ENV: "production" },
    },
  ],
};`,
      },
    ],
  },
};

