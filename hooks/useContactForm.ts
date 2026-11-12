"use client";

import { useState } from "react";
import { profile } from "@/lib/data/profile";

const WEB3FORMS_KEY = "45d3352d-8005-48a8-b024-5840f0914273";

/**
 * Owns the contact brief form state, validation and submission. Renders
 * nothing — the view consumes the returned values.
 */
export function useContactForm(isId: boolean) {
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentName, setSentName] = useState<string | null>(null);
  const [formErr, setFormErr] = useState("");

  const handleBriefSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setTried(true);
    if (!form.checkValidity()) {
      setFormErr(
        isId
          ? "Mohon lengkapi nama, email yang valid, dan deskripsi singkat proyek."
          : "Please add your name, a valid email and a few lines about the project."
      );
      return;
    }
    setFormErr("");
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const company = String(fd.get("company") || "").trim();
    const needs = fd.getAll("need").map(String);
    const scope = String(fd.get("budget") || "");
    const message = String(fd.get("message") || "").trim();

    setSending(true);
    let ok = false;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name,
          email,
          company,
          needs: needs.join(", "),
          scope,
          message,
          subject: `New Brief from ${name}${company ? ` (${company})` : ""}`,
        }),
      });
      const json = await res.json();
      ok = Boolean(json?.success);
    } catch {
      ok = false;
    }
    setSending(false);

    if (!ok) {
      const lines = [`Name: ${name}`, `Email: ${email}`];
      if (company) lines.push(`Company: ${company}`);
      if (needs.length) lines.push(`Needs: ${needs.join(", ")}`);
      if (scope) lines.push(`Scope: ${scope}`);
      lines.push("", message);
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
        `Project Brief: ${company || name}`
      )}&body=${encodeURIComponent(lines.join("\n"))}`;
    }
    setSentName(name.split(/\s+/)[0] || "");
  };

  const reset = () => {
    setSentName(null);
    setTried(false);
  };

  return { tried, sending, sentName, formErr, handleBriefSubmit, reset };
}
