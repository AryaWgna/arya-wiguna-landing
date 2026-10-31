"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { messages, type Locale, type MessageKey } from "@/lib/i18n/messages";

/* ── Theme ───────────────────────────────────── */
function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const ThemeContext = createContext<{
  theme: "light" | "dark";
  toggleTheme: () => void;
}>({ theme: "light", toggleTheme: () => {} });

/* ── Language ────────────────────────────────── */
function getInitialLang(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    return localStorage.getItem("lang") === "id" ? "id" : "en";
  } catch {
    return "en";
  }
}

const LangContext = createContext<{
  lang: Locale;
  setLang: (l: Locale) => void;
  t: (key: string) => string;
}>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [lang, setLangState] = useState<Locale>(getInitialLang);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const lookup = useCallback(
    (key: string): readonly [string, string] | undefined =>
      (messages as Record<string, readonly [string, string] | undefined>)[key],
    []
  );

  const pick = useCallback(
    (pair?: readonly [string, string]): string =>
      pair ? (lang === "id" ? pair[1] : pair[0]) : "",
    [lang]
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
    document.title = pick(lookup("title")) || "Arya Wiguna";
  }, [lang, lookup, pick]);

  const toggleTheme = useCallback(() => {
    setTheme((p) => (p === "dark" ? "light" : "dark"));
  }, []);

  const setLang = useCallback((l: Locale) => setLangState(l), []);

  const t = useCallback((key: string) => pick(lookup(key)) || key, [lookup, pick]);

  const themeValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  const langValue = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <LangContext.Provider value={langValue}>{children}</LangContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useLang() {
  return useContext(LangContext);
}

export type { Locale, MessageKey };
