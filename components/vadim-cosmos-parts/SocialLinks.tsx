"use client";

import React from "react";
import { profile } from "@/lib/data/profile";

export function SocialLinks({ isId }: { isId: boolean }) {
  return (
    <div className="social" id="social">
      <span className="k">{isId ? "Tautan lain:" : "Elsewhere:"}</span>
      <span className="v">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        ,{" "}
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        , <a href={`mailto:${profile.email}`}>Email</a>,{" "}
        <a
          href={profile.cv.atsId}
          target="_blank"
          rel="noopener noreferrer"
        >
          CV (ID)
        </a>
        ,{" "}
        <a
          href={profile.cv.ats}
          target="_blank"
          rel="noopener noreferrer"
        >
          CV (EN)
        </a>
      </span>
    </div>
  );
}
