/**
 * Data profil pribadi — terverifikasi dari konten situs sebelumnya.
 * TODO (belum diverifikasi): foto potret resmi selain avatar GitHub.
 */
export const profile = {
  name: "Arya Wiguna",
  firstName: "Arya",
  role: {
    en: "Full Stack Developer · Bogor, Indonesia",
    id: "Pengembang Full Stack · Bogor, Indonesia",
  },
  location: "Bogor, Indonesia",
  heroLine: {
    en: "Full-stack developer based in Bogor, Indonesia, crafting clean, scalable, and secure applications.",
    id: "Pengembang full stack berbasis di Bogor, Indonesia, membuat aplikasi bersih, skalabel, dan aman.",
  },
  motto: {
    en: "First solve the problem, then write the code.",
    id: "Selesaikan masalahnya dulu, baru tulis kodenya.",
  },
  email: "wgnarya123@gmail.com",
  github: "https://github.com/AryaWgna",
  linkedin: "https://www.linkedin.com/in/arya-wgna",
  portrait: "https://avatars.githubusercontent.com/u/156288269?s=400",
  cv: {
    ats: "/assets/cv/cv-ats-arya-wiguna.pdf",
    atsId: "/assets/cv/cv-ats-arya-wiguna-id.pdf",
    creative: "/assets/cv/cv-kreatif-arya-wiguna.pdf",
    creativeId: "/assets/cv/cv-kreatif-arya-wiguna-id.pdf",
  },
} as const;

export type Profile = typeof profile;
