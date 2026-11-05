import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CustomCursor } from "@/components/custom-cursor";
import { IntroCurtain } from "@/components/intro-curtain";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://arya-wiguna.my.id";

const BOOTSTRAP_SCRIPT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("theme");var dark=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);d.classList.toggle("dark",dark);var rm=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(!rm&&!sessionStorage.getItem("aw_intro_seen")){d.classList.add("intro-pending");}}catch(e){}})();`;

export const metadata: Metadata = {
  title: {
    default: "Arya Wiguna — Full Stack Developer",
    template: "%s | Arya Wiguna",
  },
  description:
    "Arya Wiguna — Computer science graduate (S1 Informatika) & software engineer based in Bogor. Building field-ready Flutter mobile applications and containerized Next.js & Laravel systems.",
  keywords: [
    "Arya Wiguna",
    "portfolio",
    "software engineer",
    "flutter",
    "dart",
    "next.js",
    "laravel",
    "bun",
    "docker",
    "mobile developer",
    "full-stack",
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
    title: "Arya Wiguna — Full Stack Developer",
    description:
      "Computer science graduate (S1 Informatika) & software engineer based in Bogor. Building field-ready Flutter mobile applications and containerized Next.js & Laravel systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arya Wiguna — Full Stack Developer",
    description:
      "Computer science graduate (S1 Informatika) & software engineer based in Bogor. Building field-ready Flutter mobile applications and containerized Next.js & Laravel systems.",
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP_SCRIPT }} />
      </head>
      <body>
        <IntroCurtain />
        <div id="scroll-progress" aria-hidden="true" />
        <CustomCursor />
        <Providers>
          <SmoothScroll />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
