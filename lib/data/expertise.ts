export type ExpertiseGroup = {
  key: string;
  items: string[];
};

export const expertiseGroups: ExpertiseGroup[] = [
  {
    key: "sk-mobile",
    items: ["Flutter", "Dart", "Firebase FCM", "REST API"],
  },
  {
    key: "sk-frontend",
    items: ["Next.js", "React", "Svelte", "Tailwind CSS"],
  },
  {
    key: "sk-backend",
    items: ["Laravel", "Bun", "Elysia.js", "Node.js"],
  },
  {
    key: "sk-database",
    items: ["MySQL", "SQLite", "Secure Storage"],
  },
  {
    key: "sk-devops",
    items: ["Docker", "Nginx", "Cloudflare", "Git"],
  },
  {
    key: "sk-languages",
    items: ["TypeScript", "Dart", "PHP", "JavaScript", "Python", "C"],
  },
];
