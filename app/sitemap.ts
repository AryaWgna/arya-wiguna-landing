import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";

const BASE = "https://aryawiguna.my.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE}/work/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages];
}
