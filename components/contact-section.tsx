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
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
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
    placeholders: {
      name: isId ? "Nama lengkap Anda" : "Your full name",
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
    <section id="contact" ref={sectionRef} className="py-16 md:py-24">
      <div className="container-x">
        <SectionHeading
          index="06"
          eyebrow={t("ct-tag")}
          meta="BOGOR, ID · UTC+7"
          title={
            isId ? (
              <>
                Mari bangun sistem{" "}
                <span className="font-editorial font-normal italic text-navy">
                  berikutnya bersama.
                </span>
              </>
            ) : (
              <>
                Let&apos;s build something{" "}
                <span className="font-editorial font-normal italic text-navy">
                  dependable together.
                </span>
              </>
            )
          }
          intro={t("ct-sub")}
        />

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Left Column: Direct Dispatch Bento Cards (5 cols) */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            <div className="bento-card flex flex-col justify-between p-6 sm:p-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-[11px] font-semibold text-emerald-500">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  {isId ? "Siap untuk wawancara & proyek" : "Ready for interviews & projects"}
                </span>

                <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {isId ? "Hubungi langsung tanpa antre." : "Direct reach, zero friction."}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {isId
                    ? "Salin email dengan satu klik atau terhubung lewat GitHub dan LinkedIn untuk diskusi posisi Full-Time maupun proyek."
                    : "Copy my email in one click or connect on GitHub and LinkedIn to discuss engineering roles or freelance systems."}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="group flex w-full items-center justify-between rounded-2xl border border-border-line bg-surface/80 p-4 text-left transition-all hover:border-navy"
                >
                  <div>
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy">
                      {copied ? (isId ? "Tersalin ke Clipboard ✓" : "Copied to Clipboard ✓") : "Direct Email"}
                    </div>
                    <div className="mt-0.5 text-sm font-bold text-foreground sm:text-base">
                      {profile.email}
                    </div>
                  </div>
                  <span className="rounded-full bg-navy/15 px-3 py-1 font-mono text-xs font-bold text-navy">
                    {copied ? "✓" : isId ? "Salin" : "Copy"}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-border-line bg-surface/80 p-4 transition-all hover:border-navy"
                  >
                    <div>
                      <div className="font-mono text-[10px] text-muted">GitHub</div>
                      <div className="mt-0.5 text-sm font-bold text-foreground">
                        @AryaWgna
                      </div>
                    </div>
                    <SiGithub size={18} className="text-navy" />
                  </a>

                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-border-line bg-surface/80 p-4 transition-all hover:border-navy"
                  >
                    <div>
                      <div className="font-mono text-[10px] text-muted">LinkedIn</div>
                      <div className="mt-0.5 text-sm font-bold text-foreground">
                        arya-wgna
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-navy">↗</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bento-card flex items-center justify-between p-6">
              <div>
                <div className="font-mono text-xs font-bold uppercase text-foreground">
                  Bogor, Jawa Barat
                </div>
                <div className="mt-0.5 text-xs text-muted">
                  {isId ? "Terbuka On-site / Hybrid / Remote" : "Open to On-site / Hybrid / Remote"}
                </div>
              </div>
              <span className="font-editorial text-3xl italic text-navy">ID</span>
            </div>
          </div>

          {/* Right Column: Interactive Message Form Bento (7 cols) */}
          <div className="lg:col-span-7">
            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="bento-card flex flex-col gap-5 p-6 sm:p-8 lg:p-9"
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
                  <label
                    htmlFor="name"
                    className="mb-2 block font-mono text-xs font-semibold text-foreground"
                  >
                    {labels.name}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder={labels.placeholders.name}
                    className="w-full rounded-2xl border border-border-line bg-surface/70 px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-navy"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-mono text-xs font-semibold text-foreground"
                  >
                    {labels.email}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={labels.placeholders.email}
                    className="w-full rounded-2xl border border-border-line bg-surface/70 px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-navy"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="project"
                  className="mb-2 block font-mono text-xs font-semibold text-foreground"
                >
                  {labels.type}
                </label>
                <select
                  id="project"
                  name="project"
                  className="w-full rounded-2xl border border-border-line bg-surface/70 px-4 py-3.5 text-sm outline-none transition-colors focus:border-navy"
                >
                  <option value="">{labels.options[0]}</option>
                  <option value="fulltime">{labels.options[2]}</option>
                  <option value="freelance">{labels.options[1]}</option>
                  <option value="consulting">{labels.options[3]}</option>
                  <option value="other">{labels.options[4]}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block font-mono text-xs font-semibold text-foreground"
                >
                  {labels.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder={labels.placeholders.message}
                  className="w-full resize-y rounded-2xl border border-border-line bg-surface/70 px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-navy"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full justify-center !py-4 !text-sm"
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? isId
                    ? "Mengirim Pesan…"
                    : "Sending Message…"
                  : labels.send}
              </button>

              {status === "success" ? (
                <p
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-500"
                  role="status"
                >
                  {isId
                    ? "Terima kasih! Pesan Anda sudah berhasil terkirim."
                    : "Thank you! Your message has been sent."}
                </p>
              ) : null}
              {status === "error" ? (
                <p
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  role="alert"
                >
                  {isId
                    ? "Pengiriman gagal. Silakan coba lagi atau kirim langsung lewat email."
                    : "Delivery failed. Please try again or reach out via email directly."}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
