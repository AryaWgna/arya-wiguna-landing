export type ExpertiseGroup = {
  key: string;
  items: string[];
};

export const expertiseGroups: ExpertiseGroup[] = [
  {
    key: "sk-mobile",
    items: ["Flutter", "Dart", "Firebase", "REST"],
  },
  {
    key: "sk-frontend",
    items: ["Next.js", "React", "Svelte", "TypeScript"],
  },
  {
    key: "sk-backend",
    items: ["Laravel", "PHP", "Bun", "Node.js"],
  },
  {
    key: "sk-database",
    items: ["MySQL", "Redis", "Firebase"],
  },
  {
    key: "sk-devops",
    items: ["Docker", "Nginx", "Cloudflare"],
  },
  {
    key: "sk-languages",
    items: ["TypeScript", "Dart", "PHP", "JavaScript", "Python"],
  },
];
