// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { CredentialsView } from "../views/CredentialsView";
import { SelectedView } from "../views/SelectedView";
import { AboutView } from "../views/AboutView";
import { ProjectView } from "../views/ProjectView";

describe("Views smoke tests", () => {
  it("CredentialsView renders with empty items", () => {
    render(
      <CredentialsView
        lang="en"
        onChangeView={vi.fn()}
        onClose={vi.fn()}
        onFlyToItem={vi.fn()}
        items={[]}
      />
    );
    expect(
      screen.getByRole("heading", {
        name: /Technical arsenal/i,
      })
    ).toBeTruthy();
    cleanup();
  });

  it("SelectedView renders with empty projectItems", () => {
    render(
      <SelectedView
        lang="en"
        onChangeView={vi.fn()}
        onClose={vi.fn()}
        onFlyToItem={vi.fn()}
        onFlyAll={vi.fn()}
        projectItems={[]}
        openSourceSlug={null}
        setOpenSourceSlug={vi.fn()}
        setActiveArchStep={vi.fn()}
      />
    );
    expect(
      screen.getByRole("heading", {
        name: /Production systems engineered/i,
      })
    ).toBeTruthy();
    cleanup();
  });

  it("AboutView renders without visitor stats", () => {
    render(
      <AboutView
        lang="en"
        onChangeView={vi.fn()}
        onClose={vi.fn()}
        visitorStats={null}
      />
    );
    expect(
      screen.getByRole("heading", {
        name: /Software engineering grounded/i,
      })
    ).toBeTruthy();
    cleanup();
  });

  it("ProjectView renders nothing when activeItem is null", () => {
    const { container } = render(
      <ProjectView
        lang="en"
        activeItem={null}
        activeMediaIndex={0}
        copied={false}
        onCopyLink={vi.fn()}
        scrollToProjectSource={vi.fn()}
        activeArchStep={0}
        setActiveArchStep={vi.fn()}
        projectItems={[]}
        onFlyToItem={vi.fn()}
        onClose={vi.fn()}
        onChangeView={vi.fn()}
      />
    );
    expect(container.innerHTML).toBe("");
    cleanup();
  });
});
