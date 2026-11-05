# arya-wiguna.my.id

Source code for my personal software engineering portfolio at **[arya-wiguna.my.id](https://arya-wiguna.my.id)**.

**Baca dalam [Bahasa Indonesia](README.id.md).**

## Stack

- **Framework:** Next.js 15 (App Router, static generation)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + Geist & Geist Mono (`next/font`)
- **Motion & UI:** GSAP + Lenis smooth scroll, editorial intro curtain, and interactive SVG system architecture schematics (`prefers-reduced-motion` aware)
- **Live Presence:** Active visitor counter via `/api/presence` (Upstash Redis REST with automatic in-memory fallback)
- **Contact:** Web3Forms

## Project Structure

```text
app/                  # Root layout, homepage, /work/[slug] case studies, sitemap, robots
components/           # UI sections, interactive architecture flow, custom cursor, theme/i18n providers
lib/
  data/               # Typed data for profile, projects, credentials, expertise, and career timeline
  i18n/messages.ts    # Bilingual dictionary (EN / ID)
  gsap.ts             # GSAP + Lenis helpers
public/assets/        # CV PDFs, project screenshots, and certificate scans
scripts/              # Asset integrity verification scripts
```

## Development

```bash
npm install
npm run dev           # Start local dev server
npm run check:assets  # Verify all referenced images & PDFs exist in public/
npm run typecheck     # Run TypeScript compiler check
npm run lint          # Run ESLint
npm run build         # Build static production bundle
```

## License

Code is MIT-licensed; personal documents, CVs, and certificate scans in `public/assets/` belong to Arya Wiguna.
