"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/providers";
import type { ArchitectureFlow as ArchitectureFlowType, ArchitectureStep } from "@/lib/data/projects";
import { useWebAudioGlitch } from "@/lib/use-web-audio-glitch";

interface ArchitectureFlowProps {
  flow: ArchitectureFlowType;
  className?: string;
  autoPlayDefault?: boolean;
}

function getNodeIcon(nodeName: string) {
  const name = nodeName.toLowerCase();
  if (name.includes("client") || name.includes("screen") || name.includes("display") || name.includes("svelte")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }
  if (name.includes("nginx") || name.includes("gateway") || name.includes("proxy")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    );
  }
  if (name.includes("database") || name.includes("storage") || name.includes("mysql") || name.includes("cache")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    );
  }
  if (name.includes("fcm") || name.includes("firebase") || name.includes("cloud") || name.includes("resolver")) {
    return (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    );
  }
  // Default server / engine icon
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  );
}

export function ArchitectureFlow({
  flow,
  className = "",
  autoPlayDefault = false,
}: ArchitectureFlowProps) {
  const { lang } = useLang();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlayDefault);
  const [copied, setCopied] = useState<boolean>(false);
  const { playGlitch } = useWebAudioGlitch();

  // Auto-play pipeline simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= flow.steps.length ? 1 : prev + 1));
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying, flow.steps.length]);

  const selectedStep: ArchitectureStep =
    flow.steps.find((s) => s.step === activeStep) ?? flow.steps[0];

  const handleSelect = (stepNum: number) => {
    setIsPlaying(false);
    playGlitch("click");
    setActiveStep(stepNum);
  };

  const handleCopyPayload = () => {
    if (selectedStep.payloadExample) {
      navigator.clipboard.writeText(selectedStep.payloadExample);
      setCopied(true);
      playGlitch("hover");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`rounded-2xl border border-border-line bg-surface/30 p-5 md:p-7 font-mono transition-all ${className}`}
    >
      {}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-line/70 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue"></span>
            </span>
            <span>{flow.title[lang]}</span>
          </div>
          <p className="mt-1 font-sans text-xs text-muted leading-relaxed">
            {flow.subtitle[lang]}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Simulation Toggle */}
          <button
            type="button"
            onClick={() => {
              playGlitch("click");
              setIsPlaying(!isPlaying);
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors ${
              isPlaying
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500 font-semibold"
                : "border-border-line bg-background text-muted hover:text-foreground"
            }`}
          >
            <span className={`inline-block h-2 w-2 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-muted"}`} />
            <span>{isPlaying ? (lang === "id" ? "Simulasi Jalan" : "Simulating") : (lang === "id" ? "Play Simulasi" : "Simulate Flow")}</span>
          </button>

          <span className="rounded-full border border-border-line bg-background/80 px-2.5 py-1 text-[11px] text-muted">
            <span className="text-blue font-bold">{flow.steps.length}</span> Nodes
          </span>
        </div>
      </div>

      {}
      <div className="relative mt-6 overflow-x-auto pb-4 pt-2 scrollbar-thin">
        <div className="flex min-w-[680px] items-start justify-between gap-2 px-3">
          {flow.steps.map((item, index) => {
            const isCurrent = item.step === activeStep;
            const isPassed = item.step < activeStep;
            const isLast = index === flow.steps.length - 1;

            return (
              <div key={item.step} className="flex flex-1 items-start">
                {/* Node Box */}
                <button
                  type="button"
                  onClick={() => handleSelect(item.step)}
                  className={`group relative flex flex-1 flex-col items-center text-center transition-all ${
                    isCurrent ? "scale-105" : "opacity-80 hover:opacity-100 hover:scale-[1.02]"
                  }`}
                >
                  {/* Icon Card with Radar Glow */}
                  <div
                    className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border transition-all shadow-md ${
                      isCurrent
                        ? "border-blue bg-blue text-white shadow-blue/25 shadow-lg ring-4 ring-blue/20"
                        : isPassed
                        ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-500"
                        : "border-border-line bg-background text-foreground hover:border-navy/40"
                    }`}
                  >
                    {getNodeIcon(item.node)}
                    {/* Step badge in corner */}
                    <span
                      className={`absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        isCurrent
                          ? "bg-foreground text-background shadow"
                          : "bg-surface border border-border-line text-muted"
                      }`}
                    >
                      {item.step}
                    </span>
                  </div>

                  {/* Node Name & Role */}
                  <div className="mt-3 max-w-[120px]">
                    <div
                      className={`truncate text-xs font-semibold tracking-tight transition-colors ${
                        isCurrent ? "text-blue" : "text-foreground group-hover:text-blue"
                      }`}
                    >
                      {item.node}
                    </div>
                    <div className="truncate text-[10px] text-muted">
                      {item.role[lang]}
                    </div>
                    {item.latency && (
                      <span className="mt-1 inline-block rounded bg-surface border border-border-line/60 px-1.5 py-0.2 text-[9px] text-muted">
                        {item.latency}
                      </span>
                    )}
                  </div>
                </button>

                {/* Animated Signal Pipeline Conduit */}
                {!isLast && (
                  <div className="relative mx-1 mt-7 flex flex-1 items-center">
                    {/* Dashed conduit line */}
                    <div className="h-[2px] w-full bg-border-line/80 relative overflow-hidden">
                      {/* Animated moving packet stream */}
                      <div
                        className={`h-full w-full ${
                          isPassed || isCurrent
                            ? "bg-gradient-to-r from-blue via-emerald-400 to-blue animate-pulse"
                            : "bg-transparent"
                        }`}
                      />
                    </div>

                    {/* Flowing packet ball */}
                    <div
                      className={`absolute -top-[3px] h-2 w-2 rounded-full transition-all duration-500 ${
                        isCurrent
                          ? "bg-blue ring-4 ring-blue/30 shadow-md shadow-blue"
                          : isPassed
                          ? "bg-emerald-400"
                          : "bg-muted/40"
                      }`}
                      style={{
                        left: isCurrent ? "50%" : isPassed ? "95%" : "5%",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {}
      <div className="mt-6 rounded-xl border border-border-line bg-background p-5 transition-all shadow-sm">
        {/* Step Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-line/60 pb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue text-xs font-bold text-white">
              0{selectedStep.step}
            </span>
            <div>
              <span className="text-base font-bold text-foreground">
                {selectedStep.node}
              </span>
              <span className="ml-2 font-mono text-xs text-muted">
                · {selectedStep.role[lang]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-md border border-border-line bg-surface/80 px-2.5 py-1 text-muted">
              {selectedStep.protocol}
            </span>
            {selectedStep.latency && (
              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-500 font-semibold">
                ⚡ {selectedStep.latency}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 font-sans text-sm text-foreground/90 leading-relaxed">
          {selectedStep.description[lang]}
        </p>

        {/* Data Packet / Terminal Payload Inspector */}
        {selectedStep.payloadExample && (
          <div className="mt-4 rounded-lg border border-border-line/90 bg-surface/90 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-line/70 bg-surface px-3 py-2 text-[10px] text-muted">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>PACKET TELEMETRY // STEP 0{selectedStep.step} PAYLOAD</span>
              </span>

              <button
                type="button"
                onClick={handleCopyPayload}
                className="font-mono text-[10px] text-blue hover:text-navy hover:underline transition-colors"
              >
                {copied ? (lang === "id" ? "Tersalin ✓" : "Copied ✓") : (lang === "id" ? "Salin Payload" : "Copy Payload")}
              </button>
            </div>

            <pre className="overflow-x-auto p-3 text-[11px] leading-relaxed text-blue-light font-mono scrollbar-thin">
              <code>{selectedStep.payloadExample}</code>
            </pre>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-border-line/50 text-xs text-muted">
          <button
            type="button"
            disabled={activeStep <= 1}
            onClick={() => handleSelect(activeStep - 1)}
            className="rounded px-2.5 py-1 hover:text-foreground disabled:opacity-30 disabled:hover:text-muted transition-colors"
          >
            ← {lang === "id" ? "Tahap Sebelumnya" : "Previous Step"}
          </button>
          <span>
            {activeStep} / {flow.steps.length}
          </span>
          <button
            type="button"
            disabled={activeStep >= flow.steps.length}
            onClick={() => handleSelect(activeStep + 1)}
            className="rounded px-2.5 py-1 text-blue font-semibold hover:text-navy disabled:opacity-30 disabled:hover:text-muted transition-colors"
          >
            {lang === "id" ? "Tahap Selanjutnya" : "Next Step"} →
          </button>
        </div>
      </div>
    </div>
  );
}
