// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { ExperienceView } from "../views/ExperienceView";
import { careerMilestones } from "@/lib/data/git-milestones";

describe("ExperienceView", () => {
  it("renders the timeline with all milestone cards", () => {
    render(
      <ExperienceView lang="en" onChangeView={vi.fn()} onClose={vi.fn()} />
    );
    expect(
      screen.getByRole("heading", { name: /Hospital engineering/i })
    ).toBeTruthy();
    for (const m of careerMilestones) {
      expect(screen.getByText(new RegExp(m.period.en))).toBeTruthy();
    }
    cleanup();
  });

  it("shows Indonesian heading when lang is id", () => {
    render(
      <ExperienceView lang="id" onChangeView={vi.fn()} onClose={vi.fn()} />
    );
    expect(
      screen.getByRole("heading", { name: /Pengalaman rumah sakit/i })
    ).toBeTruthy();
    cleanup();
  });
});
