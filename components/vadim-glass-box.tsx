"use client";

import React, { useState } from "react";
import { ContactView } from "./vadim-glass/views/ContactView";
import { CredentialsView } from "./vadim-glass/views/CredentialsView";
import { ExperienceView } from "./vadim-glass/views/ExperienceView";
import { SelectedView } from "./vadim-glass/views/SelectedView";
import { AboutView } from "./vadim-glass/views/AboutView";
import { ProjectView } from "./vadim-glass/views/ProjectView";
import type { CosmosWorkItem } from "@/lib/cosmos-items";

export type BoxView =
  | "closed"
  | "project"
  | "selected"
  | "experience"
  | "credentials"
  | "about"
  | "contact";

export const VadimGlassBox = React.memo(function VadimGlassBox({
  boxRef,
  activeView,
  lang,
  activeItem,
  activeMediaIndex,
  items,
  totalPieces,
  onClose,
  onChangeView,
  onFlyToItem,
  onFlyAll,
  onCopyLink,
  copied,
  visitorStats,
}: {
  boxRef: React.RefObject<HTMLElement | null>;
  activeView: BoxView;
  lang: "en" | "id";
  activeItem: CosmosWorkItem | null;
  activeMediaIndex: number;
  items: CosmosWorkItem[];
  totalPieces: number;
  onClose: () => void;
  onChangeView: (v: BoxView) => void;
  onFlyToItem: (itemIdx: number) => void;
  onFlyAll: () => void;
  onCopyLink: () => void;
  copied: boolean;
  visitorStats?: { online: number; total: number } | null;
}) {
  const isId = lang === "id";
  const [activeArchStep, setActiveArchStep] = useState<number>(0);
  const [openSourceSlug, setOpenSourceSlug] = useState<string | null>(null);

  const scrollToProjectSource = (slug: string) => {
    const el = boxRef.current?.querySelector<HTMLElement>(
      `#source-explorer-${slug}`
    );
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Separate projects (first 3 items) and certificates
  const projectItems = React.useMemo(
    () =>
      items
        .map((item, idx) => ({ item, idx }))
        .filter(({ item }) => item.kind === "project"),
    [items]
  );


  

  return (
    <>
    <aside ref={boxRef} className="box" id="box" data-view={activeView}>
      {/* =====================================================================
          1. PROJECT / CREDENTIAL DETAIL VIEW (.v-project)
         ===================================================================== */}
      <ProjectView lang={lang} activeItem={activeItem} activeMediaIndex={activeMediaIndex} copied={copied} onCopyLink={onCopyLink} scrollToProjectSource={scrollToProjectSource} activeArchStep={activeArchStep} setActiveArchStep={setActiveArchStep} projectItems={projectItems} onFlyToItem={onFlyToItem} onClose={onClose} onChangeView={onChangeView} />

      {/* =====================================================================
          2. SELECTED WORK VIEW — Recruiter Case Study Dossier (.v-selected)
         ===================================================================== */}
      <SelectedView lang={lang} onChangeView={onChangeView} onClose={onClose} onFlyToItem={onFlyToItem} onFlyAll={onFlyAll} projectItems={projectItems} openSourceSlug={openSourceSlug} setOpenSourceSlug={setOpenSourceSlug} setActiveArchStep={setActiveArchStep} />

      {/* =====================================================================
          3. EXPERIENCE & EDUCATION TIMELINE VIEW (.v-experience)
         ===================================================================== */}
      <ExperienceView lang={lang} onChangeView={onChangeView} onClose={onClose} />

      {/* =====================================================================
          4. CREDENTIALS (21) & TECHNICAL STACK VIEW (.v-credentials)
         ===================================================================== */}
      <CredentialsView lang={lang} onChangeView={onChangeView} onClose={onClose} onFlyToItem={onFlyToItem} items={items} />

      {/* =====================================================================
          5. ABOUT & RECRUITER DOSSIER VIEW (.v-about)
         ===================================================================== */}
      <AboutView lang={lang} onChangeView={onChangeView} onClose={onClose} visitorStats={visitorStats} />

      {/* =====================================================================
          6. CONTACT & INTERVIEW DISPATCH VIEW (.v-contact)
         ===================================================================== */}
      <ContactView isId={isId} onChangeView={onChangeView} onClose={onClose} totalPieces={totalPieces} />
      </aside>

    </>
  );
});
