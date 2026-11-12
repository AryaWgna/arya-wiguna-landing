"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/providers";

export function Header() {
  const { lang, setLang } = useLang();
  const pathname = usePathname();
  const [clock, setClock] = useState("12:00");
  const isId = lang === "id";

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta",
        }).format(new Date());
        setClock(formatted);
      } catch {
        // ignore
      }
    };
    updateClock();
    const timer = window.setInterval(updateClock, 15000);
    return () => window.clearInterval(timer);
  }, []);

  if (pathname === "/") return null;

  return (
    <header className="topbar">
      <Link
        href="/"
        className="mark"
        aria-label="Arya Wiguna, home"
        title={isId ? "Kembali ke beranda 3D" : "Back to 3D home"}
      >
        <svg
          className="logo"
          viewBox="0 0 88 74"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 58 L25 8 L32 8 L48 58"
            stroke="#ffffff"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 42 H43"
            stroke="#ffffff"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M51 8 L57 58 L62 32 L67 58 L73 8"
            stroke="#ffffff"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <div className="col">
        <span className="k">{isId ? "Saat ini:" : "Currently:"}</span>
        <span className="v">
          Full-Stack &amp; Flutter Engineer,{" "}
          <a
            href="https://github.com/AryaWgna"
            target="_blank"
            rel="noopener noreferrer"
          >
            S.Kom (3.77 GPA)
          </a>
        </span>
      </div>

      <div className="col col-place">
        <span className="k">{isId ? "Domisili:" : "Based in:"}</span>
        <span className="v">
          Bogor, Indonesia (<time className="clock">{clock}</time>)
        </span>
      </div>

      <div className="col col-nav">
        <span className="k">{isId ? "Navigasi:" : "Navigation:"}</span>
        <span className="v">
          <Link href="/?open=selected">{isId ? "Pilihan" : "Selected"}</Link>,{" "}
          <Link href="/?fly=1">{isId ? "Karya" : "Work"}</Link>,{" "}
          <Link href="/?open=credentials">
            {isId ? "Sertifikasi" : "Credentials"}
          </Link>
          , <Link href="/?open=about">{isId ? "Tentang" : "About"}</Link>,{" "}
          <Link href="/?open=contact">{isId ? "Kontak" : "Contact"}</Link> ·{" "}
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "id" : "en")}
          >
            {lang === "en" ? "ID" : "EN"}
          </button>
        </span>
      </div>

      <Link href="/" className="menu-btn">
        <span>{isId ? "Beranda" : "Home"}</span>
      </Link>
    </header>
  );
}
