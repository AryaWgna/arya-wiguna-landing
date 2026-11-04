import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { BootSequence } from "@/components/boot-sequence";
import { CustomCursor } from "@/components/custom-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://arya-wiguna.my.id";

export const metadata: Metadata = {
  title: {
    default: "Arya Wiguna — Full Stack Developer",
    template: "%s | Arya Wiguna",
  },
  description:
    "Arya Wiguna — Full Stack Developer based in Bogor, Indonesia. Building clean, scalable, secure web & mobile applications.",
  keywords: [
    "Arya Wiguna",
    "portfolio",
    "developer",
    "full-stack",
    "react",
    "vue",
    "next.js",
    "laravel",
    "software engineer",
  ],
  authors: [{ name: "Arya Wiguna" }],
  creator: "Arya Wiguna",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: "en_US",
    url: SITE_URL,
    siteName: "Arya Wiguna",
    title: "Arya Wiguna | Full Stack Developer Portfolio",
    description: "Full-stack developer based in Bogor, Indonesia, crafting clean, scalable, and secure applications.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arya Wiguna | Full Stack Developer Portfolio",
    description: "Full-stack developer based in Bogor, Indonesia, crafting clean, scalable, and secure applications.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F4EF" },
    { media: "(prefers-color-scheme: dark)", color: "#10161C" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <div id="scroll-progress" aria-hidden="true" />
        <CustomCursor />
        <Providers>
          <BootSequence />
          <SmoothScroll />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
