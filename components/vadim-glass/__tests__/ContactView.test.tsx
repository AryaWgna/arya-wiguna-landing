// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { ContactView } from "../views/ContactView";

describe("ContactView", () => {
  it("renders the contact form with English labels", () => {
    render(
      <ContactView
        isId={false}
        onChangeView={vi.fn()}
        onClose={vi.fn()}
        totalPieces={31}
      />
    );
    expect(
      screen.getByRole("heading", { name: /Invite for an interview/i })
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Send Message" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Copy Email/i })).toBeTruthy();
    expect(screen.getByText(/Direct Contact & Brief/)).toBeTruthy();
    cleanup();
  });

  it("renders Indonesian labels when isId is true", () => {
    render(
      <ContactView isId onChangeView={vi.fn()} onClose={vi.fn()} totalPieces={31} />
    );
    expect(
      screen.getByRole("heading", { name: /Undang wawancara/i })
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Kirim Pesan" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Salin Email/i })).toBeTruthy();
    cleanup();
  });
});
