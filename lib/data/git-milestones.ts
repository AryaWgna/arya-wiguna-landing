/**
 * Milestone Git-Graph — sumber: data pengalaman & pendidikan terverifikasi
 * (lib/data/experience.ts) + sertifikat yang sudah diaudit.
 * Semua teks memakai key kamus (bilingual otomatis).
 */

export type GitBranch = "main" | "edu";

export type GitCommitMilestone = {
  id: string;
  hash: string;
  year: string;
  branch: GitBranch;
  roleKey: string;
  organizationKey: string;
  locationKey: string | null;
  dateLabel: string;
  titleKey: string;
  contextKey: string;
  responsibilitiesKeys: string[];
  deliverables: { labelKey: string; url: string }[];
};

export const gitMilestones: GitCommitMilestone[] = [
  {
    id: "ubi",
    hash: "git#2026.1",
    year: "2026",
    branch: "edu",
    roleKey: "edu-r1",
    organizationKey: "edu-c1",
    locationKey: "edu-l1",
    dateLabel: "2022 – 2026",
    titleKey: "mm-ubigrad-title",
    contextKey: "mm-ubigrad-context",
    responsibilitiesKeys: ["mm-ubigrad-r1", "mm-ubigrad-r2"],
    deliverables: [
      { labelKey: "ggt-d-skl", url: "/assets/sertifikat/skl-kuliah.pdf" },
      { labelKey: "ggt-d-bnsp", url: "/assets/sertifikat/bnsp-junior-coder.pdf" },
    ],
  },
  {
    id: "ummi",
    hash: "git#2025.1",
    year: "2025",
    branch: "main",
    roleKey: "exp-r1",
    organizationKey: "exp-c1",
    locationKey: "exp-l1",
    dateLabel: "Feb 2025 – Jul 2025",
    titleKey: "exp-r1",
    contextKey: "mm-ummi-context",
    responsibilitiesKeys: ["mm-ummi-r1", "mm-ummi-r2", "mm-ummi-r3"],
    deliverables: [
      { labelKey: "ggt-d-repo", url: "https://github.com/AryaWgna/SIMARU-Mobile-App" },
      { labelKey: "ggt-d-magang", url: "/assets/sertifikat/magang-ummi.jpg" },
    ],
  },
  {
    id: "batavia",
    hash: "git#2020.1",
    year: "2020",
    branch: "main",
    roleKey: "exp-r2",
    organizationKey: "exp-c2",
    locationKey: "exp-l2",
    dateLabel: "Dec 2020 – Feb 2021",
    titleKey: "exp-r2",
    contextKey: "mm-batavia-context",
    responsibilitiesKeys: ["mm-batavia-r1", "mm-batavia-r2"],
    deliverables: [],
  },
  {
    id: "geosinema",
    hash: "git#2019.2",
    year: "2019",
    branch: "main",
    roleKey: "exp-r3",
    organizationKey: "exp-c3",
    locationKey: "exp-l3",
    dateLabel: "Sep 2019 – Dec 2022",
    titleKey: "exp-r3",
    contextKey: "mm-geosinema-context",
    responsibilitiesKeys: ["mm-geosinema-r1"],
    deliverables: [],
  },
  {
    id: "smk",
    hash: "git#2019.1",
    year: "2019",
    branch: "edu",
    roleKey: "edu-r2",
    organizationKey: "edu-c2",
    locationKey: "edu-l2",
    dateLabel: "2019 – 2022",
    titleKey: "edu-r2",
    contextKey: "mm-smk-context",
    responsibilitiesKeys: ["mm-smk-r1"],
    deliverables: [],
  },
];
