"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/providers";
import { profile } from "@/lib/data/profile";

export function Footer() {
  const { lang } = useLang();
  const pathname = usePathname();
  const isId = lang === "id";

  if (pathname === "/") return null;

  return (
    <footer className="pb-12 pt-8">
      <div className="container-x">
        <aside className="p-cta">
          <div className="p-cta-txt">
            <p className="p-cta-k">
              {isId ? "Punya proyek atau posisi yang cocok?" : "Have something in mind?"}
            </p>
            <h3 className="p-cta-t">
              {isId
                ? "Mari bangun sistem berikutnya bersama."
                : "Let’s make the next system yours."}
            </h3>
          </div>
          <div className="p-cta-row">
            <Link className="p-cta-btn" href="/?open=contact">
              {isId ? "Mulai diskusi" : "Start a project"}
            </Link>
            <Link className="p-cta-alt" href="/">
              {isId ? "Kembali ke 3D Cosmos" : "Back to 3D Cosmos"}
            </Link>
            <a
              className="p-cta-alt"
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              className="p-cta-alt"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </aside>
      </div>
    </footer>
  );
}
