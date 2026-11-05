"use client";

import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/lib/data/profile";
import { gsap, isReducedMotion } from "@/lib/gsap";
import { SiGithub } from "react-icons/si";

const WEB3FORMS_KEY = "45d3352d-8005-48a8-b024-5840f0914273";

type Status = "idle" | "loading" | "success" | "error";

export function ContactSection() {
  const { t, lang } = useLang();
  const isId = lang === "id";
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = profile.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    const form = formRef.current;
    if (!sec || !form || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        form,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: form,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  const labels = {
    name: t("ct-name"),
    email: t("ct-email"),
    type: t("ct-type"),
    message: t("ct-msg"),
    send: t("ct-send"),
    or: t("ct-or"),
    placeholders: {
      name: isId ? "Nama Anda" : "Your name",
      email: isId ? "anda@perusahaan.com" : "you@company.com",
      message: isId
        ? "Ceritakan posisi atau proyek yang sedang Anda bangun..."
        : "Share role details or what you are building...",
    },
    options: [
      t("ct-opt0"),
      t("ct-opt1"),
      t("ct-opt2"),
      t("ct-opt3"),
      t("ct-opt4"),
    ],
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="border-t border-border-line">
      <div className="container-x py-24 md:py-32">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow={t("ct-tag")}
            title={t("ct-h1")}
            intro={t("ct-sub")}
          />

          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="flex flex-col gap-5 rounded-2xl border border-border-line bg-background p-6 md:p-8"
          >
            <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
            <input
              type="hidden"
              name="subject"
              value="Pesan baru dari Portfolio Arya Wiguna"
            />
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                  {labels.name}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder={labels.placeholders.name}
                  className="w-full rounded-lg border border-border-line bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-blue"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                  {labels.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={labels.placeholders.email}
                  className="w-full rounded-lg border border-border-line bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-blue"
                />
              </div>
            </div>

            <div>
              <label htmlFor="project" className="mb-2 block text-sm font-medium text-foreground">
                {labels.type}
              </label>
              <select
                id="project"
                name="project"
                className="w-full rounded-lg border border-border-line bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-blue"
              >
                <option value="">{labels.options[0]}</option>
                <option value="fulltime">{labels.options[2]}</option>
                <option value="freelance">{labels.options[1]}</option>
                <option value="consulting">{labels.options[3]}</option>
                <option value="other">{labels.options[4]}</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                {labels.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder={labels.placeholders.message}
                className="w-full resize-y rounded-lg border border-border-line bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-blue"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full justify-center"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? isId
                  ? "Mengirim…"
                  : "Sending…"
                : labels.send}
            </button>

            {status === "success" ? (
              <p
                className="rounded-lg border border-blue-soft bg-blue-soft/40 px-4 py-3 text-sm text-navy"
                role="status"
              >
                {isId
                  ? "Terima kasih, pesan Anda sudah terkirim."
                  : "Thank you, your message has been sent."}
              </p>
            ) : null}
            {status === "error" ? (
              <p
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
                role="alert"
              >
                {isId
                  ? "Pengiriman gagal. Silakan coba lagi atau kirim langsung lewat email."
                  : "Delivery failed. Please try again or reach out via email directly."}
              </p>
            ) : null}
          </form>

          <p className="mt-6 text-center font-mono text-xs text-muted">
            {labels.or}
            <button
              type="button"
              onClick={copyEmail}
              className="text-blue underline-offset-4 hover:underline"
            >
              {copied ? (isId ? "Tersalin ✓" : "Copied ✓") : profile.email}
            </button>
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={copyEmail}
              className="group flex flex-col gap-2 rounded-xl border border-border-line bg-background p-5 text-left transition-colors hover:border-navy/50"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              <span className="text-sm font-medium text-foreground">
                {copied ? (isId ? "Email tersalin ✓" : "Email copied ✓") : "Email"}
              </span>
              <span className="truncate text-[13px] text-muted">{profile.email}</span>
            </button>

            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-xl border border-border-line bg-background p-5 transition-colors hover:border-navy/50"
            >
              <SiGithub size={18} className="text-blue" />
              <span className="text-sm font-medium text-foreground">GitHub</span>
              <span className="text-[13px] text-muted">github.com/AryaWgna</span>
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-xl border border-border-line bg-background p-5 transition-colors hover:border-navy/50"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                className="text-blue"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-sm font-medium text-foreground">LinkedIn</span>
              <span className="text-[13px] text-muted">linkedin.com/in/arya-wgna</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
