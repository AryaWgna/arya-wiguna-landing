import { describe, expect, it } from "vitest";
import { gmailComposeUrl, gmailTemplates } from "../gmail";

describe("gmailComposeUrl", () => {
  it("builds a Gmail web compose URL with recipient", () => {
    const url = gmailComposeUrl("wgnarya123@gmail.com");
    expect(url.startsWith("https://mail.google.com/mail/?")).toBe(true);
    expect(url).toContain("view=cm");
    expect(url).toContain("fs=1");
    expect(url).toContain("to=wgnarya123%40gmail.com");
  });

  it("encodes subject and body safely", () => {
    const url = gmailComposeUrl(
      "a@b.com",
      "Hello world & more",
      "Line one\nLine two"
    );
    expect(url).toContain("su=Hello+world+%26+more");
    expect(url).toContain("body=Line+one%0ALine+two");
  });
});

describe("gmailTemplates", () => {
  it("provides non-empty bilingual subjects and bodies", () => {
    for (const lang of ["en", "id"] as const) {
      const tpl = gmailTemplates[lang];
      expect(tpl.subject.length).toBeGreaterThan(0);
      expect(tpl.body.length).toBeGreaterThan(0);
      expect(tpl.body).toContain("\n");
    }
  });

  it("uses a different subject per language", () => {
    expect(gmailTemplates.en.subject === gmailTemplates.id.subject).toBe(false);
  });

  it("addresses the recipient by name", () => {
    expect(gmailTemplates.en.body).toContain("Hi Arya,");
    expect(gmailTemplates.id.body).toContain("Halo Arya,");
  });
});
