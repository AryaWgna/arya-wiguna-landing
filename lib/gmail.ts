import type { Locale } from "@/lib/i18n/messages";

/**
 * Pre-filled Gmail compose templates, matching the visitor's selected
 * website language (EN/ID). Placeholders like [Your Name] are left for
 * the visitor to complete before sending.
 */
export const gmailTemplates: Record<Locale, { subject: string; body: string }> = {
  en: {
    subject: "Hello Arya — let's build something dependable",
    body: [
      "Hi Arya,",
      "",
      "My name is [Your Name], from [Company / Organization].",
      "",
      "I found your portfolio (arya-wiguna.vercel.app) and I'm interested in discussing a [full-time role / freelance project / collaboration] with you.",
      "",
      "[Add a few lines about the role or the system you want to build.]",
      "",
      "Looking forward to hearing from you.",
      "",
      "Best regards,",
      "[Your Name]",
    ].join("\n"),
  },
  id: {
    subject: "Halo Arya — mari bangun sistem yang andal",
    body: [
      "Halo Arya,",
      "",
      "Nama saya [Nama Anda], dari [Perusahaan / Organisasi].",
      "",
      "Saya menemukan portofolio Anda (arya-wiguna.vercel.app) dan tertarik berdiskusi mengenai [posisi tetap / proyek lepas / kolaborasi] dengan Anda.",
      "",
      "[Tambahkan beberapa baris tentang posisi atau sistem yang ingin Anda bangun.]",
      "",
      "Terima kasih, saya tunggu kabar baiknya.",
      "",
      "Salam hangat,",
      "[Nama Anda]",
    ].join("\n"),
  },
};

/**
 * Builds a Gmail web compose URL that opens mail.google.com with the
 * recipient, subject, and body pre-filled.
 *
 * Requires the visitor to be signed in to a Google account in the same
 * browser; otherwise Gmail will ask them to log in first.
 */
export function gmailComposeUrl(to: string, subject = "", body = ""): string {
  const params = new URLSearchParams({ view: "cm", fs: "1" });
  if (to) params.set("to", to);
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
}
