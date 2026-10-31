---
name: arya-portfolio-redesign
description: Redesign Arya Wiguna's personal software-engineering portfolio using a modern editorial visual system with restrained 3D. Use when auditing, planning, implementing, reviewing, or improving this portfolio website.
---

# Arya Wiguna Portfolio Redesign Skill

## 1. Mission

Build a credible, distinctive personal portfolio for Arya Wiguna. The result should feel art-directed and thoughtfully engineered, not like a generic AI-generated landing page.

**Design concept:** Modern Editorial + Subtle 3D  
**Visual language:** warm off-white, deep navy, restrained blue accents, editorial typography, generous whitespace, carefully composed project imagery, subtle motion.

The website's purpose:
- Help recruiters understand Arya's profile quickly.
- Demonstrate real engineering work and individual contribution.
- Make projects inspectable through detailed case studies.
- Provide clear contact, CV, GitHub, and LinkedIn paths.
- Work exceptionally well on mobile, not only desktop.

## 2. First action: repository audit

Before editing, inspect and report:

1. Framework and versions (`package.json`, lockfile, config).
2. App structure, routing, layouts, and reusable components.
3. Current pages, sections, navigation, and interactions.
4. Current content and source of truth for profile/project data.
5. Public assets: images, screenshots, CV, certificates, icons, fonts, 3D models.
6. Metadata, SEO, sitemap, robots, analytics, contact form, and external links.
7. Deployment configuration and environment variables (never print secret values).
8. Existing lint, typecheck, test, and build commands.
9. Accessibility and responsive issues visible from code.

Deliver an audit summary with:
- What exists and should be preserved.
- What is broken or inconsistent.
- Missing content/assets.
- Risks and migration options.
- Proposed file/component plan.

Do not perform a destructive rewrite during the audit.

## 3. Content integrity

Use existing repository content as the primary source of truth. Public site content may be incomplete or stale.

Potential profile information to verify against existing content:
- Name: Arya Wiguna.
- Education: Universitas Binaniaga Indonesia, Informatika dan Komputer / Teknik Informatika; SMK Geo Informatika, TKJ.
- Internship: Rumah Sakit UMMI Bogor, 2025.
- Projects mentioned in prior planning: SIMARU, Digital Skyboard, StreamEly.
- Technologies previously discussed: Flutter, Dart, Riverpod, Laravel, Golang, MySQL, Express.js, Svelte, Bun, Elysia.js.

These are **candidate facts**, not permission to publish every item. Verify names, dates, role, stack, project status, screenshots, links, and exact contribution from repository or user-provided material.

Never invent:
- Quantified impact or performance improvements.
- Number of users, assets, downloads, or customers.
- Job title, seniority, employment status, or availability.
- Client endorsements, awards, certifications, or project outcomes.
- Skill ratings/percentages.

If information is missing, add a clearly labelled TODO in a content inventory, not fabricated public copy.

Prefer first-person, concrete writing. Avoid empty claims such as “passionate developer”, “innovative solutions”, “cutting-edge technology”, “pixel-perfect”, or “turning ideas into reality” unless supported by a specific example.

## 4. Design system

### Color tokens

```css
:root {
  --color-background: #F5F4EF;
  --color-foreground: #20252C;
  --color-surface: #E9E8E2;
  --color-navy: #172A45;
  --color-navy-light: #24466F;
  --color-blue: #4778A9;
  --color-blue-soft: #E6EDF5;
  --color-muted: #777D85;
  --color-border: #DCDDD7;
}
```

Usage:
- Mostly off-white/neutral surfaces.
- Navy for strong headings, links, and important actions.
- Blue only for restrained emphasis, states, and small details.
- Maintain WCAG AA contrast for normal text and controls.
- Do not use color alone to convey status.

### Typography
- Primary: Geist or a similarly legible modern grotesk.
- Display: Geist Display if available.
- Mono: Geist Mono for dates, labels, metadata, and code-related details.
- Desktop hero heading: approximately 64–80px, fluid with `clamp()`.
- Section heading: 40–48px desktop.
- Body: 16–18px desktop; 15–16px mobile.
- Keep line lengths comfortable; avoid oversized text on narrow screens.

### Layout
- Max content width: approximately 1200px.
- Desktop horizontal gutter: 56–64px.
- Tablet gutter: 32px.
- Mobile gutter: 20px.
- Desktop grid: 12 columns; adapt naturally on smaller screens.
- Generous section spacing; avoid a uniform stack of identical cards.
- Use thin borders and restrained radii (4–12px).
- Build layouts from alignment, typography, imagery, and whitespace—not decorative boxes.

### Motion
- Prefer CSS transitions for simple interactions.
- Use GSAP only where timeline/scroll choreography genuinely adds value.
- Keep transitions short and subtle.
- Avoid scroll hijacking, excessive parallax, cursor-following effects, autoplay audio, and motion that blocks reading.
- Respect `prefers-reduced-motion`.
- All interactions must work with keyboard and touch.

## 5. Information architecture

Recommended homepage sections:
1. Header / navigation.
2. Hero.
3. Selected work.
4. About.
5. Expertise.
6. Experience.
7. Education.
8. Credentials / certifications.
9. Contact.
10. Footer.

Recommended project routes:
- `/work/[slug]`
- Example slugs: `simaru`, `digital-skyboard`, `streamely` only if confirmed by repository/content.

Keep all useful existing routes and content. If the current website has additional pages or sections, inventory them and decide whether to retain, merge, or redirect. Do not silently remove them.

## 6. Section specifications

### Header
- Compact wordmark `AW.` or current established identity.
- Minimal links: Work, About, Experience, Contact.
- CV link only if a valid current file exists.
- Mobile menu must be keyboard accessible, labelled, and closable with Escape.
- Active section indication should be subtle.

### Hero
- Eyebrow: role / location, only if accurate.
- One strong, specific headline.
- Short plain-language introduction.
- Primary CTA: selected work.
- Secondary CTA: CV or About, depending on available content.
- Optional 3D object on one side or behind a dedicated visual area.
- Never let 3D obscure text or CTA.
- Provide a static image/fallback and avoid loading WebGL before it is needed.

### Selected work
- Feature the strongest 2–3 projects based on evidence and quality, not arbitrary quantity.
- Use real screenshots, product UI, diagrams, or photos.
- Vary layout where useful; avoid identical cards repeated down the page.
- Each item should show project name, type, year (if verified), concise description, contribution/role (if verified), and stack.
- Link to a case study or live demo/repository only when the URL works and is safe to expose.

### Project case study
Use this narrative:
1. Overview.
2. Context and problem.
3. Goals / constraints.
4. My role and responsibilities.
5. Approach and key decisions.
6. Architecture / technical implementation.
7. Screenshots and evidence.
8. Outcome and lessons.
9. Links and related work.

Clearly distinguish team work from Arya's individual contribution. If no measured outcome exists, discuss qualitative results or lessons instead of inventing metrics.

### About
- A concise personal story, not a generic bio.
- Explain interests and engineering approach with specific examples.
- Use a real portrait only if supplied and approved.
- Do not generate a fake portrait or fake workspace imagery.

### Expertise
- Group technologies by discipline.
- Distinguish proven project experience from familiarity or exploration.
- Do not use skill percentage bars or arbitrary star ratings.
- Show evidence by linking technologies to projects where possible.

### Experience and education
- Use a compact editorial timeline/list.
- Verify organization, role, dates, and descriptions.
- Keep descriptions factual and concise.

### Credentials
- Show only verifiable credentials.
- Include issuer, title, date, and verification link when available.
- Group long lists and avoid a wall of badges.

### Contact
- Make email and professional links easy to find.
- Use a form only if a working backend/service is configured.
- Include loading, success, validation, and error states if a form exists.
- Never expose API keys or email service secrets in client code.

## 7. Subtle 3D implementation

Use Three.js / React Three Fiber only for one purposeful hero accent, such as a restrained abstract metallic or navy geometric sculpture.

Requirements:
- 3D is optional decoration, never the only way to understand content.
- Load dynamically and only on the client.
- Use a static fallback image or CSS composition.
- Respect reduced motion.
- Pause or reduce rendering when offscreen / tab is hidden.
- Cap device pixel ratio (for example, 1.5–2).
- Keep geometry, textures, and draw calls modest.
- Avoid huge GLB files, particle fields, full-screen shader backgrounds, and constant high-frequency animation.
- Test on low-powered mobile devices.
- If performance or accessibility suffers, remove 3D rather than compromising the site.

Do not create or use a 3D model unless the repository has one, the user provides one, or the implementation can create a lightweight original procedural shape. Do not use an unrelated stock 3D asset as fake project content.

## 8. Technical implementation

Preferred target stack:
- Next.js App Router
- TypeScript (strict where practical)
- Tailwind CSS
- Three.js / React Three Fiber for the optional hero scene
- GSAP only for justified complex motion
- Lucide icons or existing icon system

But inspect the current repository first. If the stack differs:
- Explain migration costs.
- Preserve existing functionality.
- Prefer incremental migration if practical.
- Do not replace a working project without approval.

Architecture principles:
- Keep content data separate from presentation.
- Use typed project/profile data.
- Reuse components only where patterns are genuinely shared.
- Avoid giant page components.
- Keep client components limited; prefer server components for static content.
- Use `next/image` for optimized local/remote images where appropriate.
- Use semantic landmarks and heading order.
- Keep external URLs centralized and validated.
- Never hardcode secrets.

Suggested data types:

```ts
export type Project = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  year?: string;
  role?: string;
  technologies: string[];
  coverImage: string;
  gallery?: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  featured: boolean;
  status: "published" | "draft";
};
```

Only include fields when verified. Do not fabricate `year`, `role`, links, or outcome.

## 9. SEO, accessibility, performance

SEO:
- Unique title and description for homepage and each project.
- Open Graph metadata and social preview.
- Canonical URL based on the real production domain.
- Sitemap and robots.
- Person and CreativeWork structured data only with accurate values.
- Descriptive URLs and image alt text.

Accessibility:
- Semantic HTML.
- Keyboard-accessible navigation and controls.
- Visible focus states.
- Sufficient contrast.
- Form labels and useful error messages.
- Meaningful alt text; decorative images use empty alt.
- Reduced motion support.
- Do not communicate meaning by color alone.

Performance:
- Optimize image sizes and formats.
- Avoid unnecessary client-side JavaScript.
- Lazy-load below-the-fold media.
- Dynamically load 3D.
- Avoid layout shifts by reserving media dimensions.
- Test mobile performance.
- Aim for Lighthouse 90+ where practical, but report actual measurements rather than claiming targets were achieved.

## 10. Implementation workflow

Work in these phases and report completion after each:

### Phase 0 — Audit
- Inspect repository and current site implementation.
- Create `docs/audit.md`.
- Create `docs/content-inventory.md`.
- List unknowns and risks.
- Do not redesign yet.

### Phase 1 — Plan and foundation
- Confirm routes/content to preserve.
- Define design tokens.
- Establish typography and layout primitives.
- Create or update `docs/design-system.md`.
- Set up tests/checks.

### Phase 2 — Core UI
- Header, footer, hero, section headings.
- Responsive foundations.
- About, expertise, experience, education, credentials, contact.

### Phase 3 — Projects
- Project listing.
- Case study template.
- Populate only verified content.
- Add real project media.

### Phase 4 — Motion and 3D
- Add small motion details.
- Add optional hero 3D.
- Add fallback and reduced-motion path.
- Measure performance.

### Phase 5 — QA and release
- Check all routes and links.
- Test mobile and desktop.
- Run lint, typecheck, tests, production build.
- Test keyboard and reduced motion.
- Run Lighthouse if available.
- Verify domain/deployment setup without changing production settings unless explicitly authorized.

## 11. Definition of done

- Existing useful content and functionality accounted for.
- All public copy is factually verified.
- Every navigation and CTA works.
- Every project page has accurate content and links.
- Responsive at 360, 390, 768, 1024, and 1440px.
- No horizontal overflow.
- Keyboard navigation and focus states work.
- Reduced motion works.
- 3D fallback works and content remains usable without WebGL.
- SEO metadata and social previews exist.
- CV and contact links are verified.
- Lint, typecheck, tests, and production build pass.
- Any known limitations are documented.

## 12. Final reporting format

At the end of each phase, report:
- Summary of work.
- Files created/changed.
- Decisions made.
- Commands/checks executed and actual results.
- Remaining TODOs / questions.
- Risks or regressions.
- Exact next phase.

Do not claim a command passed unless it was actually run.
