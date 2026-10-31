# Implementation Plan

## Phase 0 — Audit (no destructive changes)
- Inspect repository, stack, routes, assets, content, deployment, scripts.
- Run existing checks and record baseline.
- Create `docs/audit.md`.
- Complete `docs/CONTENT_INVENTORY.md`.
- Identify content/route preservation requirements.

Deliverable: audit report + migration proposal.

## Phase 1 — Design foundation
- Add design tokens and global styles.
- Establish font loading.
- Define container, grid, spacing, type scale, buttons, links, focus states.
- Build reusable SectionHeading, Container, Divider, Metadata components.
- Confirm responsive breakpoints.

Deliverable: working style foundation and component primitives.

## Phase 2 — Homepage shell
- Header and responsive navigation.
- Hero with static fallback visual.
- Selected work list.
- About, expertise, experience, education, credentials, contact, footer.
- Keep copy data-driven.

Deliverable: complete responsive homepage without 3D dependency.

## Phase 3 — Case studies
- Typed project content model.
- Project listing and detail route.
- Reusable case study sections.
- Real screenshots and architecture diagrams.
- Verify all external links.

Deliverable: project pages with evidence-based content.

## Phase 4 — Motion and 3D
- Add restrained transitions.
- Add dynamic 3D hero object only if performance budget allows.
- Reduced-motion and WebGL fallback.
- Test mobile and low-power devices.

Deliverable: progressive-enhancement motion/3D.

## Phase 5 — QA and release
- Lint, typecheck, tests, production build.
- Test keyboard, screen reader basics, contrast, reduced motion.
- Test 360/390/768/1024/1440px.
- Check SEO, sitemap, metadata, OG images.
- Lighthouse and Core Web Vitals measurements.
- Verify production domain and deployment settings.

Deliverable: release checklist and known-issues report.

## Rules
- Do not skip audit.
- Do not remove current routes before mapping redirects or replacements.
- Do not publish unverified facts.
- Do not change DNS, secrets, or production deployment without explicit approval.
- Commit in small, reviewable changes where Git is available.
