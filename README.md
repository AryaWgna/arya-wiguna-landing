# Arya Wiguna — Portfolio Landing Page

**Also available in [Bahasa Indonesia](README.id.md).**

A personal portfolio / landing page for **Arya Wiguna**, a Full Stack Developer based in Indonesia. The page showcases his profile, skills, selected projects, certifications, and contact information — with support for dark mode and a full English/Indonesian (EN/ID) translation toggle.

## Features

- **Single-file app** — all markup, styles, and JavaScript are inline in `index.html` (no build step).
- **Dark / light mode** — follows the system preference by default, toggleable and remembered in `localStorage`.
- **Bilingual UI** — complete English/Indonesian translation toggle via a client-side dictionary.
- **Tailwind CSS** (via CDN) + custom design tokens (`Space Grotesk` & `JetBrains Mono` fonts).
- **Dynamic accents** — typewriter effect for roles, scroll-reveal animations, and a smooth-scroll navigation.
- **Animated aurora background** — soft drifting gradient blobs that adapt to light/dark mode and respect `prefers-reduced-motion`.
- **Accessible & responsive** — mobile-first layout, keyboard focus styles, `prefers-reduced-motion` support, and semantic HTML.
- **Contact form** — wired to Web3Forms for submissions without a backend.

## Tech Stack

| Layer      | Technology |
| ---------- | ---------- |
| Markup     | HTML5 |
| Styling    | CSS3 + Tailwind CSS (CDN) |
| Logic      | Vanilla JavaScript (ES6+) |
| Fonts      | Google Fonts — Space Grotesk, JetBrains Mono |
| Hosting    | Vercel (auto-deploy via GitHub Actions) |

## Project Structure

```
.
├── index.html                    # The entire landing page (markup + CSS + JS)
├── assets/
│   ├── projects/                 # Project logos / previews (SVG)
│   └── sertifikat/               # Certification PDFs + preview images
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD: deploy to Vercel on push to main
├── .vercel/                      # Vercel project configuration
├── .vercelignore                 # Files excluded from Vercel deployments
└── .gitignore
```

## Getting Started

This is a pure static site — no dependencies to install and no build step required.

### Prerequisites

- Any modern web browser (Chrome, Edge, Firefox, Safari).

### Run locally

**Option A — open the file directly:**

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

**Option B — serve with a local static server (recommended for a real preview):**

```bash
# Using npx (requires Node.js)
npx serve .

# Or with Python
python -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

The site is deployed on **Vercel** (project: `arya-wiguna`).

- **Production** — every push to `main` triggers the GitHub Actions workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which runs `npx vercel --prod`.
- **Secret** — the workflow requires a `VERCEL_TOKEN` repository secret; add it in **Settings > Secrets > Actions**.
- **Env / config** — the Vercel project ID and org ID live in `.vercel/project.json`; `.vercelignore` keeps local logs and backup files out of deployments.

## License

No license is specified for this repository; all rights are reserved by the owner. Contact Arya for reuse or collaboration.

