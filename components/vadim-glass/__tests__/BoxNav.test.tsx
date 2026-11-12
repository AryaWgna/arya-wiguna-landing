// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { BoxNav } from "../BoxNav";
import type { BoxView } from "../../vadim-glass-box";

function renderBoxNav(current: BoxView, isId = false, onChangeView = vi.fn()) {
  return render(
    React.createElement(BoxNav, { current, isId, onChangeView })
  );
}

describe("BoxNav", () => {
  it("renders all five tabs and marks the current one active", () => {
    const onChangeView = vi.fn();
    const { container } = renderBoxNav("selected", false, onChangeView);

    expect(screen.getByRole("button", { name: "Recruiter & CV" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Projects (3)" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Experience & Edu" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Stack & Certs (21)" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Contact" })).toBeTruthy();

    const activeTabs = container.querySelectorAll(".box-tab.active");
    expect(activeTabs.length).toBe(1);
    expect(activeTabs[0].textContent).toBe("Projects (3)");

    cleanup();
  });

  it("shows Indonesian labels when isId is true", () => {
    renderBoxNav("contact", true);
    expect(screen.getByRole("button", { name: "Ringkasan & CV" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Proyek (3)" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Kontak" })).toBeTruthy();
    cleanup();
  });

  it("calls onChangeView with the clicked tab id", () => {
    const onChangeView = vi.fn();
    renderBoxNav("closed", false, onChangeView);
    fireEvent.click(screen.getByRole("button", { name: "Contact" }));
    expect(onChangeView).toHaveBeenCalledWith("contact");
    cleanup();
  });
});
