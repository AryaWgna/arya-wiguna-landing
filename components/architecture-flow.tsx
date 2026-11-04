"use client";

import { useState } from "react";
import { useLang } from "@/components/providers";
import type { ArchitectureFlow as ArchitectureFlowType, ArchitectureStep } from "@/lib/data/projects";
import { useWebAudioGlitch } from "@/lib/use-web-audio-glitch";

interface ArchitectureFlowProps {
  flow: ArchitectureFlowType;
  className?: string;
}

export function ArchitectureFlow({ flow, className = "" }: ArchitectureFlowProps) {
  const { lang } = useLang();
  const [activeStep, setActiveStep] = useState<number>(1);
  const { playGlitch } = useWebAudioGlitch();

  const selectedStep: ArchitectureStep =
    flow.steps.find((s) => s.step === activeStep) ?? flow.steps[0];

  const handleSelect = (stepNum: number) => {
    playGlitch("click");
    setActiveStep(stepNum);
  };

  return (
    <div
      className={`rounded-2xl border border-border-line bg-surface/30 p-5 md:p-7 font-mono ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border-line/70 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue"></span>
            </span>
            <span>{flow.title[lang]}</span>
          </div>
          <p className="mt-1 font-sans text-xs text-muted leading-relaxed">
            {flow.subtitle[lang]}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto rounded-full border border-border-line bg-background/80 px-3 py-1 text-[11px] text-muted">
          <span className="text-blue font-bold">{flow.steps.length}</span>
          <span>{lang === "id" ? "Tahapan Node" : "Pipeline Nodes"}</span>
        </div>
      </div>

      {/* Visual Pipeline Node Stream */}
      <div className="relative mt-6 overflow-x-auto pb-4 pt-2 scrollbar-thin">
        <div className="flex min-w-[620px] items-center justify-between gap-2 px-2">
          {flow.steps.map((item, index) => {
            const isCurrent = item.step === activeStep;
            const isPassed = item.step < activeStep;
            const isLast = index === flow.steps.length - 1;

            return (
              <div key={item.step} className="flex flex-1 items-center">
                {/* Node Button */}
                <button
                  type="button"
                  onClick={() => handleSelect(item.step)}
                  className={`group relative flex flex-col items-center text-center transition-all ${
                    isCurrent
                      ? "scale-105"
                      : "opacity-80 hover:opacity-100 hover:scale-[1.02]"
                  }`}
                >
                  {/* Step Bubble with Glowing Status */}
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold transition-all shadow-sm ${
                      isCurrent
                        ? "border-blue bg-blue text-white shadow-blue/20 shadow-md ring-4 ring-blue/15"
                        : isPassed
                        ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-500"
                        : "border-border-line bg-background text-muted"
                    }`}
                  >
                    <span>0{item.step}</span>
                  </div>

                  {/* Node Label */}
                  <div className="mt-2.5 max-w-[105px]">
                    <div
                      className={`truncate text-[11px] font-semibold transition-colors ${
                        isCurrent
                          ? "text-blue"
                          : "text-foreground group-hover:text-blue"
                      }`}
                    >
                      {item.node}
                    </div>
                    <div className="truncate text-[9px] text-muted">
                      {item.role[lang]}
                    </div>
                  </div>
                </button>

                {/* Animated Connector Line */}
                {!isLast && (
                  <div className="relative mx-1.5 flex flex-1 items-center">
                    <div className="h-[2px] w-full bg-border-line/70" />
                    {/* Pulsing signal packet */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full ${
                        isPassed || isCurrent
                          ? "bg-blue animate-pulse"
                          : "bg-muted/40"
                      }`}
                      style={{
                        left: isCurrent ? "50%" : isPassed ? "90%" : "20%",
                        transition: "left 0.4s ease-in-out",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Telemetry & Code Inspector */}
      <div className="mt-5 rounded-xl border border-border-line bg-background p-4 sm:p-5 transition-all">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-line/50 pb-3">
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue/10 px-2 py-0.5 text-xs font-bold text-blue">
              STEP 0{selectedStep.step}
            </span>
            <span className="text-sm font-bold text-foreground">
              {selectedStep.node}
            </span>
            <span className="text-xs text-muted">· {selectedStep.role[lang]}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="rounded border border-border-line bg-surface/70 px-2 py-0.5 text-muted">
              {selectedStep.protocol}
            </span>
            {selectedStep.latency && (
              <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-500">
                {selectedStep.latency}
              </span>
            )}
          </div>
        </div>

        <p className="mt-3 font-sans text-sm text-foreground/90 leading-relaxed">
          {selectedStep.description[lang]}
        </p>

        {/* Payload preview if available */}
        {selectedStep.payloadExample && (
          <div className="mt-3 rounded-lg border border-border-line/80 bg-surface/80 p-3">
            <div className="mb-1.5 flex items-center justify-between text-[10px] text-muted">
              <span>DATA PACKET TELEMETRY // JSON PAYLOAD</span>
              <span className="text-emerald-500">200 OK</span>
            </div>
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-blue-light scrollbar-thin">
              <code>{selectedStep.payloadExample}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

