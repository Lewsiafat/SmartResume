---
name: add-case-study
description: >
  Scaffold a Case Study deep-dive page for a specific project. Copies _template.md to
  ref_src/case_studies/{projectId}.{en|zh-TW}.md, then prompts user to fill in.
  Use when the user says "/add-case-study", "add case study", "新增 case study",
  "深度頁", "scaffold case study", or wants to create a project deep-dive.
---

# Add Case Study — Scaffold Deep-Dive Page

## Overview

Generate a new Case Study markdown file for an existing project, based on `ref_src/case_studies/_template.md`. Auto-detects valid `projectId` values from `src/data/projects.ts`.

## Workflow

### Step 1: Get projectId

If user passed an argument (e.g. `/add-case-study taskBoard`), use it. Otherwise:
- Read `src/data/projects.ts` to extract all valid ids
- Use AskUserQuestion to let user pick one (multiple choice)

### Step 2: Validate

Check id exists in `src/data/projects.ts`. If not, list valid ids and ask user to retry.

### Step 3: Detect existing files

Check `ref_src/case_studies/{id}.en.md` and `{id}.zh-TW.md`. If either exists, ask whether to overwrite.

### Step 4: Pick locales

Ask which locales to scaffold:
1. Both en + zh-TW (recommended)
2. Only zh-TW
3. Only en

### Step 5: Copy template + replace placeholder

For each chosen locale:
- Copy `ref_src/case_studies/_template.md` → `ref_src/case_studies/{id}.{locale}.md`
- Replace `{Project Title}` heading with the project's actual title (read from `ref_src/main.md` Side Projects section, lookup by id)
- Strip the `<!-- ... -->` instructional comment block (template instructions don't belong in real case studies)

### Step 6: Regenerate manifest

Run `npm run gen:manifest` to update `src/data/case-studies-manifest.ts`.

### Step 7: Report

```
✅ Created:
  - ref_src/case_studies/{id}.zh-TW.md
  - ref_src/case_studies/{id}.en.md

下一步：
  1. 編輯這兩個檔案，填入 Problem / Solution / Tech Choices / Result / Lessons
  2. 執行 `npm run dev`、開 http://localhost:5173/projects/{id} 預覽
  3. 滿意後 commit
```

## Notes

- This skill never asks during `/update-resume` — it's invoked explicitly only
- Template's `<!-- -->` comment block must be stripped from generated files
- If `ref_src/case_studies/` doesn't exist, create it
