/**
 * Pengalaman — sumber: section experience di situs sebelumnya.
 * Semua teks memakai key kamus (bilingual otomatis).
 * Tanggal terverifikasi dari situs sebelumnya.
 */
export type TimelineEntry = {
  id: string;
  roleKey: string;
  companyKey: string;
  locationKey: string;
  descKey: string;
  date: string;
  tag: "work" | "education";
};

export const experience: TimelineEntry[] = [
  {
    id: "ummih",
    roleKey: "exp-r1",
    companyKey: "exp-c1",
    locationKey: "exp-l1",
    descKey: "exp-d1",
    date: "Feb 2025 — Jul 2025",
    tag: "work",
  },
  {
    id: "batavia",
    roleKey: "exp-r2",
    companyKey: "exp-c2",
    locationKey: "exp-l2",
    descKey: "exp-d2",
    date: "Dec 2020 — Feb 2021",
    tag: "work",
  },
  {
    id: "geosinema",
    roleKey: "exp-r3",
    companyKey: "exp-c3",
    locationKey: "exp-l3",
    descKey: "exp-d3",
    date: "Sep 2019 — Dec 2022",
    tag: "work",
  },
];

export const education: TimelineEntry[] = [
  {
    id: "ubi",
    roleKey: "edu-r1",
    companyKey: "edu-c1",
    locationKey: "edu-l1",
    descKey: "edu-d1",
    date: "2022 — 2026",
    tag: "education",
  },
  {
    id: "geo",
    roleKey: "edu-r2",
    companyKey: "edu-c2",
    locationKey: "edu-l2",
    descKey: "edu-d2",
    date: "2019 — 2022",
    tag: "education",
  },
];
