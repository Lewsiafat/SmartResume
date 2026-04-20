# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Project Overview

AI-powered personal branding toolkit: Portfolio website + resume management + job application automation.
Built with Vue 3 + Vite + TypeScript + Tailwind CSS. Supports dark/light mode and i18n (Traditional Chinese / English).

Users can update all website content and resume PDFs through AI Skills (`/update-resume`, `/jd-match`, `/job-apply`, `/job-release`, `/theme-extractor`) without manually editing multiple files.

## Commands

```bash
npm run dev        # Start development server
npm run build      # TypeScript type check (vue-tsc) + Vite build
npm run preview    # Preview build output
```

## Architecture

```
src/
├── components/
│   ├── layout/        # Layout components (Header, Footer, ThemeToggle, LanguageSwitcher)
│   ├── sections/      # Page sections (Hero, About, Projects, TechStack, Stats, Contact)
│   └── ui/            # UI components (ProjectCard)
├── composables/       # useTheme (dark mode), useLocale (i18n), useTyping (typing animation)
├── i18n/              # vue-i18n translation files (zh-TW, en)
├── data/              # Static data (projects, skills, techStack, stats)
└── types/             # TypeScript type definitions

ref_src/
├── main.md            # Resume SSOT (Single Source of Truth)
├── resume_zh.md       # Chinese resume markdown (PDF source)
└── resume_en.md       # English resume markdown (PDF source)

output/                # AI Skills output
├── jd-analysis/       # JD match analysis reports
├── cover-letters/     # Generated cover letters
└── releases/          # Archived application packages (committed by /job-release)

.claude/skills/        # Skill definitions (read by Claude Code)
.agent/skills/         # Skill definitions (read by other agents, synced with .claude/)
```

## Page Structure (Section Order)

```
TheHeader (fixed top, nav: About / Projects / Tech Stack / Contact)
  HeroSection          — Full-screen, typing animation, gradient background, CTA
  AboutSection         — Bio + skill progress bars (IntersectionObserver animation)
  ProjectsSection      — Filter buttons + project cards (3-column grid)
  TechStackSection     — 4-column categorized tech list
  StatsSection         — 4 GitHub stat cards
  ContactSection       — Contact info + form (placeholder, pending backend)
TheFooter (social links + Back to Top)
```

## Key Technologies

- **Vue 3** — Composition API + `<script setup>`
- **Tailwind CSS** — `dark:` prefix for dark mode (class strategy), custom primary/secondary/accent palette
- **vue-i18n** — Composition API mode
- **Vite** — Build tool

## Important Patterns

- **i18n key mapping**: `Project.id` maps directly to i18n translation keys. e.g. `id: 'taskBoard'` maps to `projects.taskBoard.title` / `.subtitle` / `.description`. `TechCategory.id` maps to `techStack.{id}`, `GitHubStat.id` maps to `stats.{id}`. When adding data, update both `src/i18n/zh-TW.ts` and `src/i18n/en.ts`.
- **Typing animation**: Standalone composable `useTyping`, accepts string array, types/deletes in loop, cleans up timer on `onUnmounted`. Uses individual keys `hero.typingText1` ~ `hero.typingText4`.
- **Project filtering**: `ProjectsSection` uses `ref<ProjectCategory>` + `computed` filteredProjects for real-time filtering.
- **Skill bar animation**: `AboutSection` uses `IntersectionObserver` to trigger CSS transition from `width: 0` to actual percentage.
- **Dark mode**: Toggles via `document.documentElement.classList.add('dark')`, preference stored in `localStorage('theme')`.
- **Locale**: Stored in `localStorage('locale')`, defaults to browser language detection.
- **Color palette**: Autumn Sunset theme — primary #f4a261 (coral), secondary #c1666b (terracotta), accent #e9c46a (warm sand), dark-bg #264653 (deep teal).
- **Fonts**: Inter + Noto Sans TC.

## AI Skills

All skills are stored in `.claude/skills/` and `.agent/skills/` (identical content).

### Resume & Job Application Pipeline

| Skill | Command | Description |
|-------|---------|-------------|
| `update-resume` | `/update-resume` | Interactive resume update, SSOT sync to website + PDF |
| `jd-match` | `/jd-match` | JD match analysis + Cover Letter generation |
| `job-apply` | `/job-apply` | Create `apply/*` branch, customize resume for target job |
| `job-release` | `/job-release` | Archive application package to `output/releases/` |
| `theme-extractor` | `/theme-extractor` | Extract color palette from URL/screenshot and apply |

### Pipeline Flow

```
/jd-match → /job-apply → /job-release
```

- `/jd-match`: Analyze JD, produce match report + cover letter in `output/`
- `/job-apply`: Create `apply/{company}-{position}` branch, customize `ref_src/main.md`, sync website + PDF
- `/job-release`: Archive PDFs, JD analysis, cover letter, main.md snapshot, dist/ to `output/releases/{company}-{date}/`

### Key Concepts

- **SSOT**: `ref_src/main.md` is the single source of truth for all resume and portfolio data
- **Data flow**: `main.md` → (skill sync) → `src/data/*.ts` + `src/i18n/*.ts` → `public/resume_*.pdf`
- **Branch strategy**: `master` stays generic; `apply/*` branches hold per-job customization
- **Design spec**: `docs/superpowers/specs/2026-04-09-resume-single-source-of-truth-design.md`

### Quick Start (Using as Template)

1. Fork this repository
2. Run `/update-resume` skill and fill in your personal data through interactive Q&A
3. The skill automatically syncs all website files and regenerates resume PDFs
4. `npm run dev` to preview, `npm run build` to build

## Customization

- **Recommended**: Use `/update-resume` skill to update resume and portfolio data
- Personal info: Edit `src/i18n/zh-TW.ts` and `src/i18n/en.ts`
- Projects: Edit `src/data/projects.ts` (sync i18n translation files)
- Skill bars: Edit `src/data/skills.ts`
- Tech stack: Edit `src/data/techStack.ts` (sync i18n translation files)
- GitHub stats: Edit `src/data/stats.ts` (sync i18n translation files)
- Contact form: Currently a UI placeholder, can integrate Formspree or similar services
