"use client";

import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import { useLang } from "@/components/providers";
import { SectionHeading } from "@/components/section-heading";
import { MagneticWrap } from "@/components/magnetic-wrap";
import { profile } from "@/lib/data/profile";
import { gsap, isReducedMotion } from "@/lib/gsap";

const WEB3FORMS_KEY = "45d3352d-8005-48a8-b024-5840f0914273";

type Status = "idle" | "loading" | "success" | "error";

export function ContactSection() {
  const { t, lang } = useLang();
  const [status, setStatus] = useState<Status>("idle");
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useLayoutEffect(() => {
    const sec = sectionRef.current;
    const form = formRef.current;
    if (!sec || !form || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Form reveal — slides up with a subtle scale
      gsap.fromTo(
        form,
        { autoAlpha: 0, y: 40, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: form,
            start: "top 85%",
            once: true,
          },
        }
      );

      // Stagger form fields
      const fields = form.querySelectorAll<HTMLElement>("[data-form-field]");
      gsap.fromTo(
        fields,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: form,
            start: "top 80%",
            once: true,
          },
          delay: 0.3,
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
      name: lang === "id" ? "Nama Anda" : "Your name",
      email: lang === "id" ? "anda@contoh.com" : "you@example.com",
      message: lang === "id" ? "Ceritakan proyek Anda..." : "Tell me about your project...",
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
            title={
              <>
                {t("ct-h1")}
                <em className="not-italic text-navy">{t("ct-h2")}</em>
              </>
            }
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

            <div data-form-field className="grid gap-5 sm:grid-cols-2">
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

            <div data-form-field>
              <label htmlFor="project" className="mb-2 block text-sm font-medium text-foreground">
                {labels.type}
              </label>
              <select
                id="project"
                name="project"
                className="w-full rounded-lg border border-border-line bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-blue"
              >
                <option value="">{labels.options[0]}</option>
                <option value="freelance">{labels.options[1]}</option>
                <option value="fulltime">{labels.options[2]}</option>
                <option value="consulting">{labels.options[3]}</option>
                <option value="other">{labels.options[4]}</option>
              </select>
            </div>

            <div data-form-field>
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

            <MagneticWrap strength={0.2} className="w-full">
              <button data-form-field type="submit" className="btn btn-primary w-full justify-center" disabled={status === "loading"}>
                {status === "loading"
                  ? lang === "id"
                    ? "Mengirim…"
                    : "Sending…"
                  : labels.send}
              </button>
            </MagneticWrap>

            {status === "success" ? (
              <p
                className="rounded-lg border border-blue-soft bg-blue-soft/40 px-4 py-3 text-sm text-navy"
                role="status"
              >
                {lang === "id"
                  ? "Terima kasih! Pesan Anda terkirim."
                  : "Thank you! Your message has been sent."}
              </p>
            ) : null}
            {status === "error" ? (
              <p
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
                role="alert"
              >
                {lang === "id"
                  ? "Terjadi kesalahan. Coba lagi atau kirim langsung lewat email."
                  : "Something went wrong. Please try again or email me directly."}
              </p>
            ) : null}
          </form>

          <p className="mt-6 text-center font-mono text-xs text-muted">
            {labels.or}
            <a
              href={`mailto:${profile.email}`}
              className="text-blue underline-offset-4 hover:underline"
            >
              {profile.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

