# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.3.0] - 2026-04-20

### Added
- **Bilingual README split** — `README.md` now houses zh-TW only (273 lines, was 448); new `README.en.md` (177 lines) hosts the English version. Language switcher badges at the top of each file cross-link via relative paths
- **Live Demo badge** — both README files now show `https://lewsi.ddns.net/smartresume/` at the top
- **VPS deploy via GitHub Actions** — new `.github/workflows/deploy.yml` (manual `workflow_dispatch` only) builds with `VITE_BASE` and rsyncs `dist/` to VPS via SSH using four secrets (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_DEPLOY_PATH`)
- **`docs/deployment.md`** — step-by-step guide for SSH deploy key generation, GitHub Secrets setup, Nginx server block config, local preview commands, and troubleshooting table
- **Subpath deployment support** — `vite.config.ts` now reads `base` from `process.env.VITE_BASE`, defaulting to `/`; CI sets it to `/smartresume/` so generated asset URLs carry the correct prefix

### Changed
- `HeroSection.vue` resume PDF link uses `import.meta.env.BASE_URL` instead of hardcoded `/resume_*.pdf`, so it resolves correctly under any subpath deployment

## [1.2.1] - 2026-04-20

### Fixed
- **README clone URL** — replaced real GitHub username `Lewsifat` with `<your-username>` placeholder in both zh-TW and English Quick Start sections
- **Stale `stats.ts` id naming** — renamed `pythonPercent` → `tsPercent` to match the TypeScript label (was a legacy name from before the template conversion)
- **Docs/font drift** — CLAUDE.md / AGENTS.md now correctly state the bundled fonts as `Inter + Noto Sans TC` (was outdated `Space Grotesk`)

### Removed
- **Orphan project category filters** — `FinTech` / `IoT` / `Game` dropped from `ProjectCategory` union, i18n keys (`filterFinTech` / `filterIoT` / `filterGame`), and `ProjectsSection.vue` filter list; they no longer matched any entry in `projects.ts`
- **Legacy `.gemini/skills/`** — deleted `repo-sync` and `project-info-manager` (referenced non-existent paths and leaked an author-specific GitHub URL via comments); the `.gemini/` directory is now gone entirely

### Added
- **Content audit artifacts** — `specs/scan-for-old-projects-info-or-personal.md` (spec), `specs/scan-for-old-projects-info-or-personal-walkthrough.md`, and `output/content-audit-2026-04-20.md` (full audit report with fix status and open follow-ups)

## [1.2.0] - 2026-04-20

### Added
- **Functional contact form** — Formspree async integration in `ContactSection.vue` with `idle / sending / success / error` states and bilingual feedback messages
- **`src/data/contact.ts`** — single source of truth for GitHub / LinkedIn / email / location; imported by Footer and Contact section
- **SEO meta tags** — OpenGraph, Twitter Card, canonical URL, description, keywords added to `index.html`
- **Scroll reveal animation** — new `useScrollReveal` composable (IntersectionObserver-based) with `.sr-hidden / .sr-visible` transitions applied to About / Projects / TechStack / Stats / Contact
- **`src/analytics.ts`** — runtime Google Analytics loader that injects `gtag.js` only when `VITE_GA_ID` is set (true no-op by default)
- **Environment variables** — `VITE_GA_ID` (optional GA4 tracking) and `VITE_FORMSPREE_ID` (optional contact-form backend), documented in bilingual README and CLAUDE.md
- **Third-party utility skills tracked in repo** — `.claude/skills/` now includes `pdf`, `docx`, `canvas-design`, `frontend-design`, `theme-factory`, `playwright-skill`

### Fixed
- **Typing animation language-switch bug** — `useTyping` now accepts `Ref` / `ComputedRef` and restarts cleanly when locale changes (previously kept stale strings after zh↔en toggle)
- **Hardcoded header initials** — replaced `LC` literal with `t('hero.initials')` so template users see their own initials after `/update-resume`
- **Invalid GA script request** — removed the `%VITE_GA_ID%` block from `index.html` that emitted a Vite build warning and fetched `googletagmanager.com/...?id=%VITE_GA_ID%` literally when the env var was unset

### Changed
- Footer and Contact section now source social/email data from `src/data/contact.ts` instead of hardcoded URLs
- Contact form endpoint is now built at runtime from `import.meta.env.VITE_FORMSPREE_ID`; an absent env var produces a friendly error toast with zero network calls
- `src/vite-env.d.ts` extended with typed declarations for `VITE_GA_ID` and `VITE_FORMSPREE_ID`

## [1.1.0] - 2026-04-16

### Added
- **Job application pipeline** — 3 new skills forming end-to-end workflow:
  - `/jd-match` — JD match analysis + Cover Letter generation
  - `/job-apply` — create `apply/*` branch, customize resume for target job
  - `/job-release` — archive complete application package to `output/releases/`
- **Theme extractor** — `/theme-extractor` skill to extract color palette from any URL or screenshot
- **AGENTS.md** — agent instruction file for non-Claude AI agents (mirrors CLAUDE.md)
- **Bilingual README** — comprehensive zh-TW + English README with prerequisites, use cases, mermaid flowcharts
- **Skill dual-directory sync** — all skills available in both `.claude/skills/` and `.agent/skills/`

### Changed
- Converted project from personal portfolio to reusable template
- Theme switched from Forest Green to Slate Minimal, then to Autumn Sunset
- Moved `jd-match` skill from global `~/.claude/skills/` to project-level `.claude/skills/`
- Updated CLAUDE.md skill path references
- Skills list in README reduced to 5 project-specific skills (utility skills noted separately)

### Removed
- Legacy `.agent/skills/` content (deploy, skill-creator, webapp-testing, agent-browser, Git Commit Helper, project-info-manager, repo-sync)
- GitHub Actions auto-deploy references from README

## [1.0.0] - 2026-04-08

### Added
- Initial release: Vue 3 + Tailwind CSS portfolio website
- Dark/light mode, i18n (zh-TW/EN), typing animation
- `/update-resume` skill for SSOT resume management
- Resume PDF generation (zh/en)
