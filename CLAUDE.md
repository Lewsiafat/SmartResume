# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portfolio template website + AI Agent resume management system. Built with Vue 3 + Vite + TypeScript + Tailwind CSS.
Provides a ready-to-use personal Portfolio Landing Page (Tech Dark style) with an AI Agent Skill for automated resume data management.
Users can update all website content and resume PDFs through the `/update-resume` skill without manually editing multiple files.

Supports dark/light mode toggle and i18n (Traditional Chinese / English) with typing animation in the Hero section.

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
- **Color palette**: primary #4b7049 (forest green), secondary #9ba38f (sage), accent #c4ccaa (olive), dark-bg #253124 (deep forest).
- **Fonts**: Space Grotesk + Noto Sans TC.

## Resume Management — AI Agent Skill

`ref_src/main.md` is the Single Source of Truth (SSOT) for all resume and portfolio data.
Use the `/update-resume` skill for guided Q&A updates with interactive sync to website files.

- **SSOT file**: `ref_src/main.md`
- **Design spec**: `docs/superpowers/specs/2026-04-09-resume-single-source-of-truth-design.md`
- **Skill location**: `~/.claude/skills/update-resume/SKILL.md`
- **Data flow**: `main.md` → (skill sync) → `src/data/*.ts` + `src/i18n/*.ts` → `public/resume_*.pdf`

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
