export const profile = {
  name: "Arya Wiguna",
  firstName: "Arya",
  role: {
    en: "Full Stack Developer · Bogor, Indonesia",
    id: "Pengembang Full Stack · Bogor, Indonesia",
  },
  location: "Bogor, Indonesia",
  heroLine: {
    en: "Informatika graduate & software engineer based in Bogor. Building production-grade Flutter mobile apps and containerized web backends with Next.js & Laravel.",
    id: "Lulusan Informatika & software engineer dari Bogor. Mengembangkan aplikasi mobile Flutter siap rilis dan sistem backend ter-kontainerisasi dengan Next.js & Laravel.",
  },
  motto: {
    en: "Pragmatic engineering over framework trends: reliable database schemas, predictable state management, and real system boundaries.",
    id: "Rekayasa pragmatis di atas tren framework: skema database reliabel, state management terprediksi, dan batasan sistem nyata.",
  },
  email: "wgnarya123@gmail.com",
  github: "https://github.com/AryaWgna",
  linkedin: "https://www.linkedin.com/in/arya-wgna",
  portrait: "/assets/avatar.jpg",
  cv: {
    ats: "/assets/cv/cv-ats-arya-wiguna.pdf",
    atsId: "/assets/cv/cv-ats-arya-wiguna-id.pdf",
    creative: "/assets/cv/cv-kreatif-arya-wiguna.pdf",
    creativeId: "/assets/cv/cv-kreatif-arya-wiguna-id.pdf",
  },
} as const;

export type Profile = typeof profile;
