"use client";

import React from "react";

export function ViewHead({
  onClose,
  isId,
  label,
}: {
  onClose: () => void;
  isId: boolean;
  label: string;
}) {
  return (
    <div className="v-head">
      <button type="button" className="back-link" onClick={onClose}>
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M10 3 5 8l5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{isId ? "Tutup" : "Close"}</span>
      </button>
      <p className="src">{label}</p>
    </div>
  );
}
