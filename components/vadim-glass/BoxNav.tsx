"use client";

import React from "react";
import type { BoxView } from "../vadim-glass-box";

const TABS: { id: BoxView; label: string }[] = [
  { id: "about", label: "about" },
  { id: "selected", label: "selected" },
  { id: "experience", label: "experience" },
  { id: "credentials", label: "credentials" },
  { id: "contact", label: "contact" },
];

export function BoxNav({
  current,
  isId,
  onChangeView,
}: {
  current: BoxView;
  isId: boolean;
  onChangeView: (v: BoxView) => void;
}) {
  const labelFor = (id: BoxView): string => {
    switch (id) {
      case "about":
        return isId ? "Ringkasan & CV" : "Recruiter & CV";
      case "selected":
        return isId ? "Proyek (3)" : "Projects (3)";
      case "experience":
        return isId ? "Pengalaman & Studi" : "Experience & Edu";
      case "credentials":
        return isId ? "Skill & Sertifikat (21)" : "Stack & Certs (21)";
      case "contact":
        return isId ? "Kontak" : "Contact";
      default:
        return id;
    }
  };

  return (
    <nav className="box-nav" aria-label="Portfolio sections">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`box-tab${current === tab.id ? " active" : ""}`}
          style={tab.id === "contact" ? { marginLeft: "12px" } : undefined}
          onClick={() => onChangeView(tab.id)}
        >
          {labelFor(tab.id)}
        </button>
      ))}
    </nav>
  );
}
