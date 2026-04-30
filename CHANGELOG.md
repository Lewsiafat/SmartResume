# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.4.2] - 2026-04-30

Patch release — social sharing fixes + meta SSOT. SEO/OG meta tags moved into the `ref_src/main.md` SSOT (out of hand-edited `index.html`), and the OG preview pipeline now actually works end-to-end on Facebook / LinkedIn / Twitter / Threads / Slack — both server-rendered and client-rendered meta tags carry the correct absolute URL with subpath, and the avatar shows up instead of an empty circle.

### Added
- **`## Site Meta` section in `ref_src/main.md`** + sync into `index.html` — adds `Site URL`, bilingual `SEO Title` / `SEO Description`, and `Keywords` to the SSOT. The `update-resume` skill writes these into `<title>`, `<meta name="description">`, `<meta name="keywords">`, `og:url` / `og:title` / `og:description`, `twitter:url` / `twitter:title` / `twitter:description`, and `<link rel="canonical">`. Why: social-sharing crawlers (Facebook / Twitter / LinkedIn / Slack) don't execute JavaScript, so the runtime `useOgMeta` composable is invisible to them — they only ever see static `index.html`. Without this sync, fork users' shared links keep showing the template demo (`Alex Chen` / `example.com`) until they hand-edit `index.html`. Mirrored across `.claude/skills/update-resume/SKILL.md` + `.agent/skills/update-resume/SKILL.md`
- **README "Update Site Meta" tip** — both `README.md` (zh) and `README.en.md` Step 2 (Update Resume) now flag the menu option that wires the SSOT into `index.html`, so fork users don't ship to production with the demo's OG preview text

### Fixed
- **Empty avatar circle in OG previews** — `scripts/og-templates/home.html` / `about.html` had a placeholder `<div>` with no `<img>`, so the LinkedIn / Facebook preview rendered an empty translucent circle. `scripts/generate-og-images.ts` now reads the avatar PNG, encodes it as a base64 data URL, and injects via `page.evaluate` (avoids file:// URL length limits some hosts hit). The `<img>` lives hidden in the template and is revealed once `src` is set and `decoded`. `case-study.html` intentionally has no avatar so it's left alone
- **`og:image` missing the `/smartresume/` subpath** — crawlers like Threads / X / Discord / Slack are spec-strict and reject root-relative URLs. Two separate paths were producing relative URLs:
  1. **Server-side** — `dist/index.html` shipped `/smartresume/og-images/home-zh-TW.png` after Vite's base rewrite, which is still relative
  2. **Client-side** — `useOgMeta` ran `onMounted` and overwrote the meta with `new URL(path, location.origin)`, which silently strips the base subpath when path starts with `/`, producing `https://host/og-images/...` (no `/smartresume/`)

  Fix: `vite.config.ts` adds an `absoluteOgImagePlugin` (`enforce: 'post'`) that reads Site URL origin from `main.md` and prepends it to `og:image` / `twitter:image` after Vite's base rewrite. `useOgMeta` now resolves paths through `import.meta.env.BASE_URL` so client-side meta also carry the subpath. `HomePage` / `CaseStudyPage` pass relative `url` and let `useOgMeta` handle origin/base. Verified end-to-end with Playwright against `vite preview` (`VITE_BASE=/smartresume/`) — all three meta tags include `/smartresume/`

## [1.4.1] - 2026-04-29

Patch release — documentation, demo content, and one fork-user-blocking skill bug fix. No source code changed.

### Added
- **`ref_src/case_studies/taskBoard.{zh-TW,en}.md`** — independently authored bilingual case study for the demo `taskBoard` project (intentionally distinct from `example_taskBoard.*` so the manifest picks it up and the demo site actually renders a `Read Case Study →` deep page at `/projects/taskBoard`). Lets fork users see the real shape of `/add-case-study` output before scaffolding their own
- **README "polish" step + extra use cases** — both `README.md` and `README.en.md` Quick Start gain `Step 3: 進階個人化 / Polish` listing `install-avatar` / `add-case-study` / `linkedin-suggest`; deploy step renumbered to 4. Use Cases append three new scenarios (write a case study, install avatar, sync LinkedIn)
- **Skills overview Mermaid diagram** — README Skills section grows a Mermaid graph splitting the toolchain into two axes: *personal polish* (avatar / case study / linkedin) vs *job application flow* (jd-match → job-apply → job-release)

### Fixed
- **`theme-extractor` SKILL.md pointed at home-dir global path** — Step 2b read presets from `~/.claude/skills/theme-factory/themes/`, which fork users do not have. The skill is bundled at `.claude/skills/theme-factory/` (10 preset themes, version-controlled via `.gitignore` `!.claude/skills/`), so both occurrences (Input Sources list + Step 2b body) now point at the project-relative path with a `(bundled in this project)` note. Mirrored in `.agent/skills/theme-extractor/SKILL.md`
- **`playwright-skill/API_REFERENCE.md` install example used home-dir path** — `cd ~/.claude/skills/playwright-skill` would have sent fork users hunting in `~/.claude/`. Repointed to `cd .claude/skills/playwright-skill` with a clarifying comment. Mirrored in `.agent/skills/playwright-skill/API_REFERENCE.md`

## [1.4.0] - 2026-04-28

P1 roadmap sprint — five plans landed in one minor release. Spec lives in `docs/superpowers/specs/2026-04-28-p1-roadmap-1-2week-sprint-design.md`; the 5 implementation plans are tracked in `specs/road-map_p1.md`.

### Added
- **Case Study deep-dive pages** — Vue Router (`/projects/:id`) with new `src/views/CaseStudyPage.vue` (111 lines) and extracted `src/views/HomePage.vue` (54 lines). Markdown rendered via `marked`, bundled through `import.meta.glob` so files actually ship in `vite build` output (the `@vite-ignore` dynamic-import path silently dropped them). Auto-detection: `scripts/generate-case-studies-manifest.ts` (prebuild hook) scans `ref_src/case_studies/{projectId}.{en|zh-TW}.md` and emits `src/data/case-studies-manifest.ts`; `ProjectCard.vue` renders the "Read Case Study →" link only when the manifest contains the id. Projects without a case study show normal cards. Bundled with bilingual `_template.md` and `example_taskBoard.{en,zh-TW}.md`. New deps: `vue-router@4.6`, `marked@15.0`, `tsx@4.21`, `@tailwindcss/typography@0.5`
- **`/add-case-study {projectId}` skill** — scaffolds case-study markdown for both languages by copying from `_template.md`. Mirrored across `.claude/skills/add-case-study/` and `.agent/skills/add-case-study/`. Discovery surfaced through five channels (Quick Start hint, CLAUDE.md section, README mention, post-`/update-resume` prompt, ProjectCard CTA when present)
- **Open Graph dynamic images** — build-time Puppeteer generator (`scripts/generate-og-images.ts`) renders three HTML templates (`home.html`, `case-study.html`, `about.html` in `scripts/og-templates/`) into per-route 1200×630 PNGs. Wired into the build chain (`gen:manifest → vue-tsc → vite build → gen:og`). Per-route `og:image` / Twitter meta tags via new `src/composables/useOgMeta.ts` composable, mounted in `App.vue`. Adds `puppeteer@24.42` dev dep
- **GA4 custom events** — `src/analytics.ts` gains a `trackEvent(name, params)` wrapper that no-ops when `VITE_GA_ID` is unset. New events: `case_study_view`, `case_study_time_50pct` (50% scroll-depth on case-study pages), `og_share_referrer` (fired on home mount when `document.referrer` matches social hosts), and four `cta_click_*` variants (`resume_pdf`, `github`, `linkedin`, `contact`) wired through `HeroSection`, `ProjectCard`, `ContactSection`, and `TheFooter`
- **`/install-avatar` skill** — sharp-based multi-size resizer (`scripts/install-avatar.ts`, exposed as `npm run avatar:install`). Reads a single source image and produces `public/avatar/avatar-{128,256,512}.{webp,png}`, updates `ref_src/main.md`'s `**Avatar:**` field, and offers to regenerate resume PDFs. `HeroSection.vue` consumes the assets via a `<picture>` element with WebP source + PNG fallback. New dev dep: `sharp@0.34.5`
- **`/linkedin-suggest` skill** — bilingual hybrid skill that drafts a full LinkedIn profile (Headline / About / Experience / Skills / Featured / Open to Work) in one shot from `ref_src/main.md`, then offers per-field interactive refinement via `AskUserQuestion`. Mirrored in `.claude/` and `.agent/`
- **`ref_src/case_studies/`** — new directory housing case-study source markdown plus `_template.md` and `example_taskBoard.{en,zh-TW}.md`

### Changed
- **`package.json` build chain** — `dev` and `build` now prefix `npm run gen:manifest`; `build` suffixes `npm run gen:og`. Three new scripts: `gen:manifest`, `gen:og`, `avatar:install`
- **`src/App.vue`** — routes through `<router-view>` instead of inlining the home layout; `src/main.ts` registers the router
- **`HeroSection.vue`** — avatar block (`<picture>` with WebP+PNG fallback) added; `i18n` keys extended in both `zh-TW.ts` and `en.ts`
- **`ProjectsSection.vue`, `ProjectCard.vue`, `ContactSection.vue`, `TheFooter.vue`** — wired CTA tracking calls into existing buttons

### Fixed
- **Resume PDF YAML frontmatter leak** — `ref_src/resume_zh.md` / `ref_src/resume_en.md` carried unparsed YAML frontmatter that mdpdf 3.x rendered as visible text at the top of every PDF. Frontmatter stripped; both PDFs regenerated. Embedded avatar now lands cleanly at the top of both language versions
- **Case-study markdown missing from production bundle** — first cut used `@vite-ignore` dynamic imports, which prevented Vite from bundling the markdown content. Switched to `import.meta.glob`; `vite preview` and prod deploys now render case-study pages correctly

## [1.3.3] - 2026-04-28

### Added
- **`npm run deploy`** — new local-build-and-rsync alternative to the GitHub Actions workflow. Driven by `scripts/deploy.sh`, sources `.env` then `.env.local` (Vite convention; both gitignored), validates `VPS_HOST` / `VPS_USER` / `VPS_DEPLOY_PATH`, runs `VITE_BASE=… npm run build`, then `rsync -avz --delete dist/` to the VPS. Picks one path or the other — mixing both rsync clients with `--delete` would race
- **Build marker in footer + console** — `vite.config.ts` injects `__BUILD_SHA__` (from `git rev-parse --short HEAD`, falling back to `dev`) and `__BUILD_TIME__` (`YYYY-MM-DD HH:mm UTC`) via Vite's `define`. `TheFooter.vue` renders a `text-[10px] opacity-60 font-mono` `build <sha> · <time>` line; `main.ts` also `console.info`'s the same string on app boot. After deploying, refreshing the site (cache-busted) shows the new SHA, confirming the build landed on the server. Bundle grew ~240 bytes
- **One-time symlink command in deployment docs** — `sudo ln -s /home/<user>/<path>/smartresume /var/www/smartresume` lets the deployed files live in user-space (no sudo per rsync) while Nginx still serves through `/var/www/smartresume`. Documented in both `docs/deployment.md` and `docs/deployment.en.md` alongside the new Alternative section

### Changed
- **Deployment docs split into two methods** — `docs/deployment.md` and `docs/deployment.en.md` now cover GitHub Actions and local `npm run deploy` side by side, with shared one-time-setup steps (SSH deploy key, GitHub Secrets / `.env`, Nginx server block) and per-method workflows
- **`CLAUDE.md`, `README.md`, `README.en.md`** surface both deployment paths and link to the same deployment doc

## [1.3.2] - 2026-04-27

### Added
- **Education / 學歷 in `update-resume` skill workflow** — `update-resume` SKILL.md (mirrored across `.claude/` and `.agent/`) now treats Education as a first-class step rather than a thin menu addition: Step 2 menu adds option 8 `更新 Education (學歷)`; Step 3 has an Education-specific Q&A block (school zh/en, department zh/en, degree, dates, optional notes) plus a `main.md` insertion-format example; Step 4 lists the Education item structural format; Step 6 covers school-name conventions and degree abbreviations (BS / MS / PhD) in the translation notes; the web-sync mapping table marks Education as resume-only; Step 8 summary adds a `學歷異動` field; Notes section lists Education alongside Professional Summary and Work Experience as resume-only content
- **Sample Education entries** in `ref_src/main.md`, `ref_src/resume_zh.md`, and `ref_src/resume_en.md` — placeholder data (Sample University, Sample Senior High School) demonstrating the section format for fork users
- **Regenerated** `public/resume_zh.pdf` / `public/resume_en.pdf` to include the new Education section, verified to land between Work Experience and Side Projects

### Fixed
- **Stale filename references in `update-resume` SKILL.md** — five locations across File Locations, Step 6 sync, and Step 7 PDF generation pointed at `ref_src/resume_new.md`, a file removed during the Apr 10 cleanup. They now point at `ref_src/resume_zh.md`. Also removed the `歷史版本（不需更新）` line that referenced the long-gone `resume_full.md` / `resume_updated.md`. The PDF generation step now runs end-to-end without manual filename substitution

## [1.3.1] - 2026-04-21

### Added
- **`docs/deploy-options.md`** — fork-friendly deployment guide covering Vercel / Netlify / Cloudflare Pages / GitHub Pages with a quick-comparison table and step-by-step instructions (intentionally excludes self-hosted VPS; defers to `deployment.md`)
- **`docs/deploy-options.en.md`** and **`docs/deployment.en.md`** — English counterparts of the deployment docs, matching the `README.md` / `README.en.md` bilingual convention; each language version cross-links to the other at the top

### Changed
- **`docs/deployment.md` sanitized** — personal data replaced with generic placeholders (`lewsi.ddns.net` → `your-domain.example.com`, VPS user `lewsi` → `deploy`, deploy path `/home/lewsi/workspace/SmartResumeBuild/smartresume` → `/var/www/smartresume`) so fork users can follow the doc directly
- **README deploy sections** — both zh and en versions now link to `docs/deploy-options.md` first and treat `docs/deployment.md` as the advanced/self-hosted VPS option

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
