"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/providers";
import type { ArchitectureFlow as ArchitectureFlowType, ArchitectureStep } from "@/lib/data/projects";

interface ArchitectureFlowProps {
  flow: ArchitectureFlowType;
  className?: string;
  autoPlayDefault?: boolean;
}

function getNodeIcon(nodeName: string) {
  const name = nodeName.toLowerCase();
  if (name.includes("scanner") || name.includes("client") || name.includes("svelte") || name.includes("ui")) {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16M9 4v5" />
      </svg>
    );
  }
  if (name.includes("gateway") || name.includes("proxy") || name.includes("token")) {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 4.5-3 8.5-7 9.8C8 20.5 5 16.5 5 12V7l7-4z" />
      </svg>
    );
  }
  if (name.includes("database") || name.includes("mysql") || name.includes("assets")) {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <rect x="3" y="5" width="18" height="6" rx="1.5" />
      <rect x="3" y="13" width="18" height="6" rx="1.5" />
      <path strokeLinecap="round" d="M7 8h.01M7 16h.01" />
    </svg>
  );
}

export function ArchitectureFlow({
  flow,
  className = "",
  autoPlayDefault = false,
}: ArchitectureFlowProps) {
  const { lang } = useLang();
  const isId = lang === "id";
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlayDefault);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= flow.steps.length ? 1 : prev + 1));
    }, 3200);
    return () => clearInterval(timer);
  }, [isPlaying, flow.steps.length]);

  const selectedStep: ArchitectureStep =
    flow.steps.find((s) => s.step === activeStep) ?? flow.steps[0];

  const handleSelect = (stepNum: number) => {
    setIsPlaying(false);
    setActiveStep(stepNum);
  };

  const handleCopyPayload = () => {
    if (!selectedStep.payloadExample) return;
    navigator.clipboard.writeText(selectedStep.payloadExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`bento-card p-5 sm:p-7 ${className}`}>
      <div className="flex flex-col gap-3 border-b border-border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-navy" />
            {isId ? "Alur Arsitektur Sistem" : "System Architecture Flow"}
          </span>
          <h4 className="mt-1 text-lg font-bold tracking-tight text-foreground">
            {flow.title[lang]}
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {flow.subtitle[lang]}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start">
          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-bold transition-colors ${
              isPlaying
                ? "border-navy bg-navy text-white"
                : "border-border-line bg-surface text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {isPlaying
              ? isId
                ? "Jeda"
                : "Pause"
              : isId
                ? "Putar Otomatis"
                : "Auto-step"}
          </button>
          <span className="rounded-full border border-border-line bg-surface px-3 py-1.5 font-mono text-[11px] text-muted">
            {flow.steps.length} {isId ? "tahap" : "stages"}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {flow.steps.map((item) => {
            const isCurrent = item.step === activeStep;

            return (
              <button
                key={item.step}
                type="button"
                onClick={() => handleSelect(item.step)}
                className={`flex min-w-0 w-full flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                  isCurrent
                    ? "border-navy bg-navy text-white shadow-lg"
                    : "border-border-line bg-surface/65 text-foreground hover:border-navy/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isCurrent ? "text-white/90" : "text-navy"
                    }`}
                  >
                    0{item.step}
                  </span>
                  <span className={isCurrent ? "text-white/90" : "text-muted"}>
                    {getNodeIcon(item.node)}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="truncate font-mono text-xs font-bold">
                    {item.node}
                  </div>
                  <div
                    className={`mt-0.5 truncate text-[11px] ${
                      isCurrent ? "text-white/80" : "text-muted"
                    }`}
                  >
                    {item.role[lang]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border-line bg-surface/50 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-line pb-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="rounded-md bg-navy/15 px-2 py-0.5 font-mono text-xs font-bold text-navy">
              0{selectedStep.step}
            </span>
            <h5 className="font-mono text-sm font-bold text-foreground">
              {selectedStep.node}
            </h5>
            <span className="text-xs text-muted">· {selectedStep.role[lang]}</span>
          </div>

          <span className="rounded-full border border-border-line bg-background px-3 py-0.5 font-mono text-[11px] text-muted">
            {selectedStep.protocol}
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          {selectedStep.description[lang]}
        </p>

        {selectedStep.payloadExample ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-border-line bg-background">
            <div className="flex items-center justify-between border-b border-border-line bg-surface px-4 py-2 font-mono text-[11px] text-muted">
              <span className="truncate">
                {selectedStep.codeLabel ?? (isId ? "Potongan konfigurasi / route" : "Route / config reference")}
              </span>
              <button
                type="button"
                onClick={handleCopyPayload}
                className="shrink-0 font-mono text-[11px] font-bold text-navy transition-colors hover:underline"
              >
                {copied ? (isId ? "Tersalin ✓" : "Copied ✓") : isId ? "Salin" : "Copy"}
              </button>
            </div>

            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground">
              <code>{selectedStep.payloadExample}</code>
            </pre>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between border-t border-border-line/70 pt-3 font-mono text-xs text-muted">
          <button
            type="button"
            disabled={activeStep <= 1}
            onClick={() => handleSelect(activeStep - 1)}
            className="rounded-full px-3 py-1 transition-colors hover:text-foreground disabled:opacity-35"
          >
            ← {isId ? "Sebelumnya" : "Previous"}
          </button>
          <span>
            {activeStep} / {flow.steps.length}
          </span>
          <button
            type="button"
            disabled={activeStep >= flow.steps.length}
            onClick={() => handleSelect(activeStep + 1)}
            className="rounded-full px-3 py-1 font-bold text-navy transition-colors hover:underline disabled:opacity-35"
          >
            {isId ? "Berikutnya" : "Next"} →
          </button>
        </div>
      </div>
    </div>
  );
}
