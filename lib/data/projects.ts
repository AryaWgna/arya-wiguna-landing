// GENERATED oleh scripts/extract-content.mjs — jangan edit manual.
export type ProjectIndex = {
  slug: string;
  title: string;
  desc: string;
  repo: string | null;
  thumb: string | null;
  chips: string[];
};

export const projects: ProjectIndex[] = [
  {
    "slug": "simaru-mobile-app",
    "title": "SIMARU Mobile App",
    "desc": "A QR-scanning mobile app for medical asset inspection at UMMI Hospital — tracking device location & condition, plus push notifications.",
    "repo": "https://github.com/AryaWgna/SIMARU-Mobile-App",
    "thumb": "assets/projects/simaru.svg",
    "chips": [
      "Flutter",
      "Dart",
      "Mobile"
    ]
  },
  {
    "slug": "digital-skyboard-announcement",
    "title": "Digital Skyboard Announcement",
    "desc": "A Flight Information Display (FIDS) system for airports: API gateway, database, and realtime UI for flight schedules.",
    "repo": "https://github.com/AryaWgna/Digital-Skyboard-Announcement",
    "thumb": "assets/projects/skyboard.svg",
    "chips": [
      "TypeScript",
      "PHP",
      "UI"
    ]
  },
  {
    "slug": "streamely",
    "title": "StreamEly",
    "desc": "A self-hosted VOD platform: Bun gateway + Elysia.js API + Svelte frontend, aggregating TVmaze & OMDB metadata.",
    "repo": "https://github.com/AryaWgna/streamely",
    "thumb": "assets/projects/streamely.svg",
    "chips": [
      "Svelte",
      "Bun",
      "TS"
    ]
  }
];
