# Resume Single Source of Truth

## Goal

Create a single `main.md` file as the authoritative source for all resume and portfolio data, plus a Claude Code skill (`/resume`) to maintain it and propagate changes to the website and PDF resumes.

## Problem

Resume/portfolio data is fragmented across multiple locations:
- `src/data/*.ts` — structured project/skill/stat metadata
- `src/i18n/zh-TW.ts`, `src/i18n/en.ts` — all user-facing bilingual text
- `ref_src/resume_new.md` — markdown resume with work history
- `ref_src/projects.md`, `ref_src/skills.md` — reference copies
- `public/resume_zh.pdf`, `public/resume_en.pdf` — downloadable PDFs

These diverge over time (e.g., TradeGuard exists in `ref_src/projects.md` but not on the website; AI stack terms differ between files).

## Solution

### 1. `main.md` — Single Source of Truth

**Location:** `ref_src/main.md` (replaces `resume_new.md` as the canonical source)

**Format:** Pure markdown with convention-based sections. No YAML frontmatter. Uses consistent `**Key:** Value` and `**Key（lang）:** Value` patterns for machine-extractable fields.

**Structure:**

```
# [Your Name]
(name, title, contact links)

## Hero
  Bilingual subtitle + 4 typing texts (zh-TW / en pairs)

## About
  Bilingual subtitle, "What I Do" content, current focus items (zh-TW / en pairs)

## Professional Summary
  Free-form paragraph (resume-only, NOT synced to web)

## Core Skills
  Bullet list with categories and percentages
  Maps to: skills.ts (percentages), techStack.ts (categories + items)

## Work Experience
  ### per job with free-form bullets (resume-only, NOT synced to web)

## Side Projects
  ### per project, each containing:
  - Emoji, Category, Tags, Stats, GitHub, Demo (metadata)
  - Title / Subtitle / Description in both zh-TW and en
  - Achievements (free-form bullets)

## GitHub Stats
  Repos count, stars count, Python percentage, status

## Contact
  Location, interests list (bilingual)

## Online Resources
  GitHub, Portfolio links
```

**Conventions:**
- `## Section Name` headings delimit sections
- `### Name` headings delimit items within sections (projects, jobs)
- `**Key:** Value` for single-language or language-agnostic fields
- `**Key（zh-TW）：** Value` and `**Key（en）：** Value` for bilingual fields
- Skill percentages in Core Skills use format: `Python (90%)`
- Sections not present on the website (Professional Summary, Work Experience) are clearly understood as resume-only

### 2. `/resume` Skill — Guided Update

**Skill file:** `~/.claude/skills/resume/SKILL.md`

**Trigger keywords:** `/resume`, "update resume", "edit resume", "更新履歷", "更新 main.md", "新增專案到履歷", "add project to resume"

**Flow:**

1. **Ask what to update** — present options:
   - Add a new project
   - Update an existing project
   - Update About / Hero section
   - Update Core Skills / Tech Stack
   - Update Work Experience
   - Update GitHub Stats
   - Update Contact info
   - Other

2. **Guided Q&A** — walk through relevant fields one at a time based on selection. For example, "Add a new project" asks for: id, emoji, category, tags, stats, GitHub link, demo link, title (zh-TW), title (en), subtitle (zh-TW), subtitle (en), description (zh-TW), description (en), achievements.

3. **Apply to `main.md`** — update the file with the new/changed data.

4. **Offer web sync** — ask:
   > "main.md updated. Want me to sync changes to the website files? I'll show you what would change before applying."

5. **PDF reminder** — after sync (or if user declines sync):
   > "Remember to regenerate your PDF resumes (`public/resume_zh.pdf` and `public/resume_en.pdf`) from the updated main.md."

### 3. Web Sync Logic

The skill reads `main.md`, extracts structured data from the relevant section, diffs against current website files, shows proposed changes, and applies on confirmation.

**Sync mapping:**

| `main.md` section | Target files | Target keys/structure |
|---|---|---|
| Hero | `src/i18n/zh-TW.ts`, `src/i18n/en.ts` | `hero.subtitle`, `hero.typingText1`-`4` |
| About | `src/i18n/zh-TW.ts`, `src/i18n/en.ts` | `about.subtitle`, `about.whatIDoContent`, `about.focus1`-`3` |
| Core Skills | `src/data/skills.ts` | `SkillBar[]` with name + percentage |
| Core Skills | `src/data/techStack.ts` | `TechCategory[]` with id, icon, items |
| Core Skills | `src/i18n/zh-TW.ts`, `src/i18n/en.ts` | `techStack.*` category labels |
| Side Projects | `src/data/projects.ts` | `Project[]` with id, emoji, category, tags, stats, github, demo |
| Side Projects | `src/i18n/zh-TW.ts`, `src/i18n/en.ts` | `projects.{id}.title`, `.subtitle`, `.description` |
| GitHub Stats | `src/data/stats.ts` | `GitHubStat[]` with id + value |
| Contact | `src/i18n/zh-TW.ts`, `src/i18n/en.ts` | `contact.locationValue`, `contact.interest1`-`4` |
| Professional Summary | — | Resume-only, no web sync |
| Work Experience | — | Resume-only, no web sync |

**Parsing strategy:**
- Find `## Section Name` headings to locate sections
- Find `### Item Name` headings within sections for individual items
- Extract `**Key（lang）：** Value` patterns for bilingual fields
- Extract `**Key:** Value` patterns for metadata fields

**Interactive confirmation:** For each file that would change, the skill shows what would be modified and asks "Apply this change? (y/n)" before editing.

### 4. PDF Handling

Semi-manual. After `main.md` is updated, the skill reminds the user to regenerate PDFs externally and replace `public/resume_zh.pdf` and `public/resume_en.pdf`. No automated PDF generation.

## Out of Scope

- Automated PDF generation
- Syncing nav, footer, theme, or form UI labels (these are UI chrome, not resume data)
- Multiple resume variants (e.g., tailored per job application)
- Web scraping to auto-update GitHub stats
