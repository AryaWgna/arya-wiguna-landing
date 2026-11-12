// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import React from "react";
import { KpiStrip } from "../KpiStrip";

describe("KpiStrip", () => {
  it("renders the four KPIs in English by default", () => {
    render(React.createElement(KpiStrip, { isId: false }));
    expect(screen.getByText("3.77 / 4.00")).toBeTruthy();
    expect(screen.getByText("B.Comp.Sc GPA")).toBeTruthy();
    expect(screen.getByText("National Cert")).toBeTruthy();
    expect(screen.getByText("Hospital Mobile Dev")).toBeTruthy();
    expect(screen.getByText("Verified Certs")).toBeTruthy();
    cleanup();
  });

  it("renders Indonesian labels when isId is true", () => {
    render(React.createElement(KpiStrip, { isId: true }));
    expect(screen.getByText("IPK S1 Informatika")).toBeTruthy();
    expect(screen.getByText("Sertifikasi Negara")).toBeTruthy();
    expect(screen.getByText("Mobile & IT RS")).toBeTruthy();
    expect(screen.getByText("Sertifikat Resmi")).toBeTruthy();
    cleanup();
  });
});
