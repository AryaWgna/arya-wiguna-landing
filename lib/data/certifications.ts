// GENERATED oleh scripts/extract-content.mjs — jangan edit manual.
// Sumber: index.html lama + verifikasi PDF (scripts/pdfscan.py).
export type CertificationCategory =
  | "dicoding"
  | "cisco"
  | "webinar"
  | "akademik"
  | "lainnya";

export type Certification = {
  slug: string;
  titleKey: string;
  descKey: string | null;
  img: string;
  pdf: string | null;
  alt: string;
  category: CertificationCategory;
  issuer: string | null;
  date: string | null;
  credentialId: string | null;
  verifyUrl: string | null;
  note: string | null;
};

export const certifications: Certification[] = [
  {
    "slug": "c1",
    "titleKey": "c1-title",
    "descKey": "c1-desc",
    "img": "assets/sertifikat/ccna-introduction-to-networks.jpg",
    "pdf": "assets/sertifikat/ccna-introduction-to-networks.pdf",
    "alt": "CCNA — Introduction to Networks",
    "category": "cisco",
    "issuer": "Cisco Networking Academy",
    "date": "Sep 06, 2025",
    "credentialId": null,
    "verifyUrl": null,
    "note": null
  },
  {
    "slug": "c2",
    "titleKey": "c2-title",
    "descKey": "c2-desc",
    "img": "assets/sertifikat/english-for-it-1.jpg",
    "pdf": "assets/sertifikat/english-for-it-1.pdf",
    "alt": "English for IT 1",
    "category": "cisco",
    "issuer": "Cisco Networking Academy",
    "date": "Sep 02, 2025",
    "credentialId": null,
    "verifyUrl": null,
    "note": null
  },
  {
    "slug": "c3",
    "titleKey": "c3-title",
    "descKey": "c3-desc",
    "img": "assets/sertifikat/operating-systems-basics.jpg",
    "pdf": "assets/sertifikat/operating-systems-basics.pdf",
    "alt": "Operating Systems Basics",
    "category": "cisco",
    "issuer": "Cisco Networking Academy",
    "date": "Sep 11, 2025",
    "credentialId": null,
    "verifyUrl": null,
    "note": null
  },
  {
    "slug": "c4",
    "titleKey": "c4-title",
    "descKey": "c4-desc",
    "img": "assets/sertifikat/magang-ummi.jpg",
    "pdf": null,
    "alt": "Internship Certificate — UMMI Hospital",
    "category": "lainnya",
    "issuer": null,
    "date": null,
    "credentialId": null,
    "verifyUrl": null,
    "note": "Sertifikat magang RS UMMI (gambar) — tanggal belum terverifikasi"
  },
  {
    "slug": "c5",
    "titleKey": "c5-title",
    "descKey": "c5-desc",
    "img": "assets/sertifikat/skl-kuliah.jpg",
    "pdf": "assets/sertifikat/skl-kuliah.pdf",
    "alt": "Study Completion Letter",
    "category": "akademik",
    "issuer": "Universitas Binaniaga Indonesia",
    "date": "31 Agustus 2026",
    "credentialId": null,
    "verifyUrl": null,
    "note": "SKL No. 258/UNBIN-C/FINKOM/IX/2026 — lulus 31 Agustus 2026"
  },
  {
    "slug": "c6",
    "titleKey": "c6-title",
    "descKey": "c6-desc",
    "img": "assets/sertifikat/seminar-apbn-2024-outlook-2025.jpg",
    "pdf": "assets/sertifikat/seminar-apbn-2024-outlook-2025.pdf",
    "alt": "Seminar APBN 2024 & Outlook 2025",
    "category": "lainnya",
    "issuer": null,
    "date": null,
    "credentialId": null,
    "verifyUrl": null,
    "note": "Penerbit/tanggal belum terverifikasi (PDF berbasis gambar)"
  },
  {
    "slug": "c7",
    "titleKey": "c7-title",
    "descKey": "c7-desc",
    "img": "assets/sertifikat/english-conversation.jpg",
    "pdf": "assets/sertifikat/english-conversation.pdf",
    "alt": "English Conversation",
    "category": "lainnya",
    "issuer": "MAC Training",
    "date": "Agustus 2026",
    "credentialId": null,
    "verifyUrl": null,
    "note": "No. 1384/MAC.TRA/VIII/2026"
  },
  {
    "slug": "c8",
    "titleKey": "c8-title",
    "descKey": "c8-desc",
    "img": "assets/sertifikat/webinar-internasional-smart-decisions-ncd.jpg",
    "pdf": "assets/sertifikat/webinar-internasional-smart-decisions-ncd.pdf",
    "alt": "International Webinar — Smart Decisions for Better Health",
    "category": "akademik",
    "issuer": "UIN Syarif Hidayatullah Jakarta (MTI)",
    "date": "27 Juni 2025",
    "credentialId": null,
    "verifyUrl": null,
    "note": "No. B-675/F.9/KM.03.2/06/2025"
  },
  {
    "slug": "c9",
    "titleKey": "c9-title",
    "descKey": "c9-desc",
    "img": "assets/sertifikat/webinar-figma-desain-website.jpg",
    "pdf": "assets/sertifikat/webinar-figma-desain-website.pdf",
    "alt": "Webinar — Start with Figma",
    "category": "webinar",
    "issuer": "IDwebTalks by IDwebhost",
    "date": "12 Juni 2025",
    "credentialId": null,
    "verifyUrl": null,
    "note": "No. 012/IDWEBTALKS-06/I/2025"
  },
  {
    "slug": "c10",
    "titleKey": "c10-title",
    "descKey": "c10-desc",
    "img": "assets/sertifikat/webinar-optimasi-server.jpg",
    "pdf": "assets/sertifikat/webinar-optimasi-server.pdf",
    "alt": "Webinar — Server Optimization Strategy",
    "category": "webinar",
    "issuer": "IDwebTalks by IDwebhost",
    "date": "14 Maret 2025",
    "credentialId": null,
    "verifyUrl": null,
    "note": "No. 030/IDWEBTALKS-03/I/2025"
  },
  {
    "slug": "c11",
    "titleKey": "c11-title",
    "descKey": "c11-desc",
    "img": "assets/sertifikat/webinar-merek-aset-berharga.jpg",
    "pdf": "assets/sertifikat/webinar-merek-aset-berharga.pdf",
    "alt": "Webinar — Brand as a Valuable Asset",
    "category": "webinar",
    "issuer": "IDwebTalks by IDwebhost",
    "date": "14 Februari 2025",
    "credentialId": null,
    "verifyUrl": null,
    "note": null
  },
  {
    "slug": "c12",
    "titleKey": "c12-title",
    "descKey": "c12-desc",
    "img": "assets/sertifikat/webinar-uiux-tren-2025.jpg",
    "pdf": "assets/sertifikat/webinar-uiux-tren-2025.pdf",
    "alt": "Webinar — UI/UX Design Trends 2025",
    "category": "webinar",
    "issuer": "IDwebTalks by IDwebhost",
    "date": "31 Januari 2025",
    "credentialId": null,
    "verifyUrl": null,
    "note": null
  },
  {
    "slug": "c13",
    "titleKey": "c13-title",
    "descKey": "c13-desc",
    "img": "assets/sertifikat/seminar-nasional-asuransi.jpg",
    "pdf": "assets/sertifikat/seminar-nasional-asuransi.pdf",
    "alt": "National Seminar — Insurance Industry Trust",
    "category": "lainnya",
    "issuer": null,
    "date": null,
    "credentialId": null,
    "verifyUrl": null,
    "note": "Penerbit/tanggal belum terverifikasi"
  },
  {
    "slug": "c14",
    "titleKey": "c14-title",
    "descKey": "c14-desc",
    "img": "assets/sertifikat/webinar-ddos-cloudflare.jpg",
    "pdf": "assets/sertifikat/webinar-ddos-cloudflare.pdf",
    "alt": "Webinar — DDoS Mitigation with Cloudflare",
    "category": "webinar",
    "issuer": "IDwebTalks by IDwebhost",
    "date": "14 Januari 2025",
    "credentialId": null,
    "verifyUrl": null,
    "note": null
  },
  {
    "slug": "c15",
    "titleKey": "c15-title",
    "descKey": "c15-desc",
    "img": "assets/sertifikat/intro-product-management.jpg",
    "pdf": "assets/sertifikat/intro-product-management.pdf",
    "alt": "Intro to Product Management",
    "category": "lainnya",
    "issuer": "RevoU",
    "date": "10 Mei 2024",
    "credentialId": null,
    "verifyUrl": null,
    "note": "Certified online course 2 minggu — CEO RevoU: Matteo Sutto"
  },
  {
    "slug": "c16",
    "titleKey": "c16-title",
    "descKey": "c16-desc",
    "img": "assets/sertifikat/memulai-pemrograman-python.jpg",
    "pdf": "assets/sertifikat/memulai-pemrograman-python.pdf",
    "alt": "Getting Started with Python",
    "category": "dicoding",
    "issuer": "Dicoding Indonesia",
    "date": "04 Oktober 2026",
    "credentialId": "QLZ9NVNL9Z5D",
    "verifyUrl": "https://www.dicoding.com/certificates/QLZ9NVNL9Z5D",
    "note": null
  },
  {
    "slug": "c17",
    "titleKey": "c17-title",
    "descKey": "c17-desc",
    "img": "assets/sertifikat/belajar-cloud-genai-aws.jpg",
    "pdf": "assets/sertifikat/belajar-cloud-genai-aws.pdf",
    "alt": "Cloud & Gen AI Basics on AWS",
    "category": "dicoding",
    "issuer": "Dicoding Indonesia",
    "date": "04 Oktober 2026",
    "credentialId": "0LZ0J6490X65",
    "verifyUrl": "https://www.dicoding.com/certificates/0LZ0J6490X65",
    "note": null
  },
  {
    "slug": "c18",
    "titleKey": "c18-title",
    "descKey": "c18-desc",
    "img": "assets/sertifikat/membangun-app-genai-azure.jpg",
    "pdf": "assets/sertifikat/membangun-app-genai-azure.pdf",
    "alt": "Building Gen AI Apps with Microsoft Azure",
    "category": "dicoding",
    "issuer": "Dicoding Indonesia",
    "date": "30 September 2026",
    "credentialId": "1RXYD1JM3XVM",
    "verifyUrl": "https://www.dicoding.com/certificates/1RXYD1JM3XVM",
    "note": null
  },
  {
    "slug": "c19",
    "titleKey": "c19-title",
    "descKey": "c19-desc",
    "img": "assets/sertifikat/spec-driven-development-kiro.jpg",
    "pdf": "assets/sertifikat/spec-driven-development-kiro.pdf",
    "alt": "Spec-Driven Development with Kiro",
    "category": "dicoding",
    "issuer": "Dicoding Indonesia",
    "date": "30 September 2026",
    "credentialId": "NVP7WQ4ORZR0",
    "verifyUrl": "https://www.dicoding.com/certificates/NVP7WQ4ORZR0",
    "note": null
  },
  {
    "slug": "c20",
    "titleKey": "c20-title",
    "descKey": "c20-desc",
    "img": "assets/sertifikat/belajar-data-science-fabric.jpg",
    "pdf": "assets/sertifikat/belajar-data-science-fabric.pdf",
    "alt": "Data Science with Microsoft Fabric",
    "category": "dicoding",
    "issuer": "Dicoding Indonesia",
    "date": "30 September 2026",
    "credentialId": "72ZDMY6QJZYW",
    "verifyUrl": "https://www.dicoding.com/certificates/72ZDMY6QJZYW",
    "note": null
  },
  {
    "slug": "c21",
    "titleKey": "c21-title",
    "descKey": "c21-desc",
    "img": "assets/sertifikat/belajar-prinsip-solid.jpg",
    "pdf": "assets/sertifikat/belajar-prinsip-solid.pdf",
    "alt": "SOLID Programming Principles",
    "category": "dicoding",
    "issuer": "Dicoding Indonesia",
    "date": "20 Juni 2025",
    "credentialId": "GRX5350LYZ0M",
    "verifyUrl": "https://www.dicoding.com/certificates/GRX5350LYZ0M",
    "note": null
  },
  {
    "slug": "c22",
    "titleKey": "c22-title",
    "descKey": "c22-desc",
    "img": "assets/sertifikat/memulai-pemrograman-c.jpg",
    "pdf": "assets/sertifikat/memulai-pemrograman-c.pdf",
    "alt": "Getting Started with C",
    "category": "dicoding",
    "issuer": "Dicoding Indonesia",
    "date": "06 Juni 2024",
    "credentialId": "4EXGQ7M1QZRL",
    "verifyUrl": "https://www.dicoding.com/certificates/4EXGQ7M1QZRL",
    "note": null
  }
];
