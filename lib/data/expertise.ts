/**
 * Keahlian — dikelompokkan per disiplin (dari situs sebelumnya).
 * Tanpa persentase / rating (sesuai aturan agent kit).
 */
export type ExpertiseGroup = {
  key: string; // key kamus untuk label grup (sk-languages, sk-frontend, …)
  items: string[];
};

export const expertiseGroups: ExpertiseGroup[] = [
  {
    key: "sk-languages",
    items: ["TypeScript", "JavaScript", "Python", "Go", "PHP", "Dart"],
  },
  {
    key: "sk-frontend",
    items: ["React", "Vue", "Next.js", "Angular", "Svelte"],
  },
  {
    key: "sk-backend",
    items: ["Node.js", "Laravel", "NestJS", "Flask", "Gin"],
  },
  {
    key: "sk-mobile",
    items: ["Flutter", "React Native"],
  },
  {
    key: "sk-database",
    items: ["PostgreSQL", "MongoDB", "Redis", "Firebase"],
  },
  {
    key: "sk-devops",
    items: ["Docker", "K8s", "AWS"],
  },
];
