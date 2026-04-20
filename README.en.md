# SmartResume 🧑‍💼

> **AI-powered personal branding toolkit** — Portfolio website + Resume management + Job application automation

**Language:** [🇹🇼 繁中](./README.md) | **🇬🇧 English**

🌐 **Live Demo:** [https://lewsi.ddns.net/smartresume/](https://lewsi.ddns.net/smartresume/)

Designed for AI-fluent users: not just a static site, but a full suite of AI Skills that let any AI agent maintain your resume, analyze job listings, and generate cover letters.

---

## ✨ Features

- 🌐 **Portfolio Website** — Vue 3 + Tailwind CSS, dark theme, bilingual (zh-TW / EN), typing animation
- 📋 **SSOT Resume Management** — `ref_src/main.md` as single source of truth, sync to website + PDF in one step
- 🎯 **JD Match Analysis** — Auto-compare job descriptions against your resume with match scoring
- ✉️ **Cover Letter Generation** — Customized cover letters (Chinese + English) based on JD analysis
- 📦 **Job Application Workflow** — End-to-end: analyze → apply → archive
- 🎨 **Theme Customization** — Extract color palettes from any design reference

---

## 📋 Prerequisites

| Requirement | Details |
|-------------|---------|
| **Node.js** (v18+) | Required to build the website and generate PDFs. [Download Node.js](https://nodejs.org/) |
| **npm** | Included with Node.js |
| **AI Agent** (at least one) | Required to run Skills. Supported: [Claude Code](https://claude.ai/code), [Gemini CLI](https://github.com/google-gemini/gemini-cli), [OpenAI Codex](https://openai.com/codex), or any agent that reads skill definitions |

> Skills are instruction files read by AI Agents. Without an AI Agent, commands like `/update-resume` and `/jd-match` won't work. You can still manually edit `ref_src/main.md` and `src/` files.

---

## 🚀 Quick Start

**Step 1: Fork this repo**

```bash
git clone git@github.com:<your-username>/SmartResume.git
cd SmartResume && npm install
```

**Step 2: Fill in your data with an AI agent**

```
/update-resume
```

Interactive Q&A — AI syncs everything to website files and generates resume PDFs automatically.

**Step 3: Deploy**

```bash
npm run build
```

For GitHub Actions deployment to a VPS (subpath, e.g. `/smartresume/`), see [docs/deployment.md](docs/deployment.md) for SSH key setup, GitHub Secrets, and Nginx config. Pass `VITE_BASE` at build time:

```bash
VITE_BASE=/smartresume/ npm run build
```

---

## 📖 Use Cases

### Use Case 1: Build Your Portfolio

```
/update-resume
```

Guided setup → auto-syncs to `src/data/` and `src/i18n/` → `npm run build` to deploy.

### Use Case 2: Update Resume Content

Edit `ref_src/main.md` → run `/update-resume` → AI detects diffs and syncs all related files + regenerates PDFs.

### Use Case 3: Analyze a Job Description

```
/jd-match
```

Provide JD via text, URL, or file path → get match analysis + custom cover letter saved to `output/`.

### Use Case 4: Tailor Resume for Different Companies

```
/jd-match → /job-apply
```

Start with `/jd-match` to analyze the job description and generate a match report + cover letter. Then use `/job-apply` to create an `apply/{company}-{position}` branch with customized resume, website build, and PDFs. Apply for a frontend role emphasizing Vue/React, or a full-stack role highlighting system architecture — all from the same SSOT, on separate branches.

### Use Case 5: Full Job Application Workflow

```
/jd-match → /job-apply → /job-release
```

From finding a job listing to archiving a complete application package.

### Use Case 6: Customize Website Theme

```
/theme-extractor
```

Provide any website URL or design screenshot. AI extracts the color palette (primary, secondary, accent, background), previews it, and applies it to your entire Portfolio site — including Tailwind CSS variables and dark mode colors.

---

## 🤖 AI Skills — Where They Live

All skills are stored in two directories with identical content, so different AI agents can read them:

| Directory | Used by |
|-----------|---------|
| `.claude/skills/<name>/SKILL.md` | Claude Code |
| `.agent/skills/<name>/SKILL.md` | Codex, Gemini CLI, other agents |

### Skills List

| Skill | Command | Description |
|-------|---------|-------------|
| `update-resume` | `/update-resume` | Interactive resume update, SSOT sync to website + PDF |
| `jd-match` | `/jd-match` | JD match analysis + customized cover letter generation |
| `job-apply` | `/job-apply` | Create `apply/*` branch, customize resume and website for a target job |
| `job-release` | `/job-release` | Archive complete application package (PDF, JD analysis, cover letter, website build) |
| `theme-extractor` | `/theme-extractor` | Extract color palette from URL or screenshot and apply to website |

> The project also includes general-purpose utility skills (`pdf`, `docx`, `canvas-design`, `frontend-design`, `theme-factory`, `playwright-skill`) in the same directories.

---

## 📁 Project Structure

```
SmartResume/
├── src/                    # Vue 3 frontend source
├── ref_src/                # Resume data (SSOT)
│   └── main.md             # ⭐ Single source of truth
├── public/                 # resume_zh.pdf, resume_en.pdf
├── output/                 # AI Skills output
│   ├── jd-analysis/        # JD match reports
│   ├── cover-letters/      # Generated cover letters
│   └── releases/           # Archived application packages (committed by /job-release)
├── .claude/skills/         # Skill definitions (read by Claude Code)
└── .agent/skills/          # Skill definitions (read by other agents, synced with .claude/)
```

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Vue 3 + Composition API |
| Styling | Tailwind CSS (dark mode) |
| i18n | vue-i18n (zh-TW / EN) |
| Build | Vite + TypeScript |
| AI Skills | Claude Code / General Agent / Gemini CLI |

---

## 🔐 Environment Variables

Create `.env.local` at the project root (gitignored) for optional config:

```bash
# Google Analytics (optional) — gtag.js is skipped entirely when unset
VITE_GA_ID=G-XXXXXXXXXX

# Contact form Formspree ID (optional) — form shows an error toast when unset
VITE_FORMSPREE_ID=xxxxxxxx
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_GA_ID` | No | Google Analytics 4 measurement ID (`G-XXXXXXXXXX`). Read at runtime by [src/analytics.ts](src/analytics.ts); when unset the gtag script is not injected at all. |
| `VITE_FORMSPREE_ID` | No | [Formspree](https://formspree.io) form ID — the `<id>` part of `formspree.io/f/<id>`. When unset [ContactSection.vue](src/components/sections/ContactSection.vue) gracefully shows an error prompting users to email you directly. |
| `VITE_BASE` | No | **Build-time only.** Consumed by [vite.config.ts](vite.config.ts) to set Vite's `base` option for subpath deployments (e.g. `/smartresume/`). Defaults to `/` when unset. Example: `VITE_BASE=/smartresume/ npm run build`. |
