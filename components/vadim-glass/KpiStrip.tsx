"use client";

import React from "react";

export function KpiStrip({ isId }: { isId: boolean }) {
  return (
    <div className="rec-kpi-grid">
      <div className="rec-kpi">
        <span className="rec-kpi-val">3.77 / 4.00</span>
        <span className="rec-kpi-lbl">
          {isId ? "IPK S1 Informatika" : "B.Comp.Sc GPA"}
        </span>
      </div>
      <div className="rec-kpi">
        <span className="rec-kpi-val">BNSP RI</span>
        <span className="rec-kpi-lbl">
          {isId ? "Sertifikasi Negara" : "National Cert"}
        </span>
      </div>
      <div className="rec-kpi">
        <span className="rec-kpi-val">RS UMMI</span>
        <span className="rec-kpi-lbl">
          {isId ? "Mobile & IT RS" : "Hospital Mobile Dev"}
        </span>
      </div>
      <div className="rec-kpi">
        <span className="rec-kpi-val">21 Docs</span>
        <span className="rec-kpi-lbl">
          {isId ? "Sertifikat Resmi" : "Verified Certs"}
        </span>
      </div>
    </div>
  );
}
