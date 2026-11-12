import type { Metadata, Viewport } from "next";
import {
  Inter_Tight,
  JetBrains_Mono,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CustomCursor } from "@/components/custom-cursor";

const interTight = Inter_Tight({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const SITE_URL = "https://arya-wiguna.my.id";

export const metadata: Metadata = {
  title: {
    default: "Arya Wiguna, Full-Stack & Flutter Engineer",
    template: "%s | Arya Wiguna",
  },
  description:
    "Arya Wiguna, full-stack web and Flutter mobile engineer based in Bogor, Indonesia. Production hospital asset systems, containerized airport displays, and high-throughput APIs. Scroll to fly through the work.",
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
    title: "Arya Wiguna, Full-Stack & Flutter Engineer",
    description:
      "Production Flutter mobile systems, containerized Next.js & Laravel architectures, and 21 verified engineering credentials. Scroll to fly through the work.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arya Wiguna, Full-Stack & Flutter Engineer",
    description:
      "Production Flutter mobile systems, containerized Next.js & Laravel architectures, and 21 verified engineering credentials. Scroll to fly through the work.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/aw-favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/aw-favicon.svg",
    apple: "/aw-favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "var(--bg)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${interTight.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} dark`}
    >
      <body suppressHydrationWarning>
        {/* Warm the cache for the avatar before the boot sequence requests it */}
        <link rel="preload" as="image" href="/assets/avatar.jpg" />
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
