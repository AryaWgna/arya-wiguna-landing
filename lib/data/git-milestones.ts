export type MilestoneKind = "work" | "education";

export type CareerMilestone = {
  id: string;
  kind: MilestoneKind;
  roleKey: string;
  organizationKey: string;
  locationKey: string | null;
  period: { en: string; id: string };
  titleKey: string;
  contextKey: string;
  responsibilitiesKeys: string[];
  deliverables: { labelKey: string; url: string }[];
};

export const careerMilestones: CareerMilestone[] = [
  {
    id: "ubi",
    kind: "education",
    roleKey: "edu-r1",
    organizationKey: "edu-c1",
    locationKey: "edu-l1",
    period: { en: "2022 – Aug 2026", id: "2022 – Agu 2026" },
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
    kind: "work",
    roleKey: "exp-r1",
    organizationKey: "exp-c1",
    locationKey: "exp-l1",
    period: { en: "Feb 2025 – Jul 2025", id: "Feb 2025 – Jul 2025" },
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
    kind: "work",
    roleKey: "exp-r2",
    organizationKey: "exp-c2",
    locationKey: "exp-l2",
    period: { en: "Dec 2020 – Feb 2021", id: "Des 2020 – Feb 2021" },
    titleKey: "exp-r2",
    contextKey: "mm-batavia-context",
    responsibilitiesKeys: ["mm-batavia-r1", "mm-batavia-r2"],
    deliverables: [],
  },
  {
    id: "smk",
    kind: "education",
    roleKey: "edu-r2",
    organizationKey: "edu-c2",
    locationKey: "edu-l2",
    period: { en: "2019 – 2022", id: "2019 – 2022" },
    titleKey: "edu-r2",
    contextKey: "mm-smk-context",
    responsibilitiesKeys: ["mm-smk-r1"],
    deliverables: [],
  },
  {
    id: "geosinema",
    kind: "work",
    roleKey: "exp-r3",
    organizationKey: "exp-c3",
    locationKey: "exp-l3",
    period: { en: "Sep 2019 – Dec 2022", id: "Sep 2019 – Des 2022" },
    titleKey: "exp-r3",
    contextKey: "mm-geosinema-context",
    responsibilitiesKeys: ["mm-geosinema-r1"],
    deliverables: [],
  },
];
