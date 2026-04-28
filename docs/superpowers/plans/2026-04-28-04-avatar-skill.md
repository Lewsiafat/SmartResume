# /install-avatar Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A skill that takes a single image file path, generates 3 sizes × 2 formats (WebP + PNG fallback), writes them to `public/avatar/`, updates `ref_src/main.md` with an `Avatar:` field, and syncs to i18n + Hero component.

**Architecture:** A bash-driven skill that uses `sharp` (Node lib) for image transforms. Skill prompts user via AskUserQuestion for the source path if not given. After file ops, updates the SSOT (`main.md`) and runs the existing web sync rules from `update-resume`.

**Tech Stack:** sharp (new dev dep), Node, fs.

**Note on TDD:** Skill output verified by file existence + opening one PNG to inspect.

---

## File Structure

**New files:**
- `.claude/skills/install-avatar/SKILL.md`
- `.agent/skills/install-avatar/SKILL.md` (mirror)
- `scripts/install-avatar.ts` — Node script the skill invokes
- `public/avatar/.gitkeep`

**Modified files:**
- `package.json` — Add `sharp` dev dep + `avatar:install` npm script
- `ref_src/main.md` — Add `Avatar:` line under contact section (during first run)
- `src/components/sections/HeroSection.vue` — Render avatar `<picture>` with WebP/PNG sources, fallback to gradient placeholder if file missing
- `src/i18n/zh-TW.ts`, `src/i18n/en.ts` — Add `hero.avatarAlt` key (e.g. "Photo of {name}")
- `.gitignore` — `public/avatar/*` (PNG/WebP) but not `.gitkeep`

---

## Task 1: Install sharp + skeleton script

**Files:**
- Modify: `package.json`
- Create: `scripts/install-avatar.ts`

- [ ] **Step 1: Install sharp**

```bash
npm install --save-dev sharp
```

- [ ] **Step 2: Create script**

```typescript
// scripts/install-avatar.ts
import sharp from 'sharp'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_DIR = join(ROOT, 'public', 'avatar')
const MAIN_MD = join(ROOT, 'ref_src', 'main.md')
const SIZES = [128, 256, 512] as const

async function processImage(input: string) {
  if (!existsSync(input)) {
    console.error(`[avatar] not found: ${input}`)
    process.exit(1)
  }
  mkdirSync(OUT_DIR, { recursive: true })

  for (const size of SIZES) {
    const base = sharp(input).resize(size, size, { fit: 'cover', position: 'center' })
    await base.clone().webp({ quality: 88 }).toFile(join(OUT_DIR, `avatar-${size}.webp`))
    await base.clone().png({ compressionLevel: 9 }).toFile(join(OUT_DIR, `avatar-${size}.png`))
    console.log(`[avatar] wrote ${size}px webp + png`)
  }
}

function updateMainMd(): boolean {
  if (!existsSync(MAIN_MD)) return false
  let content = readFileSync(MAIN_MD, 'utf-8')
  const avatarLine = '**Avatar:** /avatar/avatar-512.webp'
  if (content.includes('**Avatar:**')) {
    content = content.replace(/\*\*Avatar:\*\*.*$/m, avatarLine)
  } else {
    // insert after the first contact block (after ##Hero or under # Name)
    const lines = content.split('\n')
    const firstBlankAfterHeader = lines.findIndex((l, i) => i > 0 && l.trim() === '' && lines[0].startsWith('# '))
    const insertAt = firstBlankAfterHeader > 0 ? firstBlankAfterHeader : 1
    lines.splice(insertAt, 0, avatarLine)
    content = lines.join('\n')
  }
  writeFileSync(MAIN_MD, content)
  console.log('[avatar] main.md Avatar field updated')
  return true
}

const inputPath = process.argv[2]
if (!inputPath) {
  console.error('Usage: tsx scripts/install-avatar.ts <path-to-image>')
  process.exit(1)
}

await processImage(resolve(inputPath))
updateMainMd()
console.log('[avatar] done')
```

- [ ] **Step 3: Add npm script**

In `package.json`:

```json
"scripts": {
  "...": "...",
  "avatar:install": "tsx scripts/install-avatar.ts"
}
```

- [ ] **Step 4: Smoke test with a sample image**

```bash
mkdir -p public/avatar
touch public/avatar/.gitkeep
# place a test image at /tmp/test-avatar.jpg, then:
npm run avatar:install /tmp/test-avatar.jpg
ls public/avatar/
```
Expected: 6 files (128/256/512 × webp/png) + `.gitkeep`.

After verifying, delete the 6 generated files (keep `.gitkeep`).

- [ ] **Step 5: Update .gitignore**

Append:
```
public/avatar/avatar-*.webp
public/avatar/avatar-*.png
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json scripts/install-avatar.ts public/avatar/.gitkeep .gitignore
git commit -m "feat(avatar): sharp-based install script"
```

## Task 2: SKILL.md

**Files:**
- Create: `.claude/skills/install-avatar/SKILL.md`
- Create: `.agent/skills/install-avatar/SKILL.md` (mirror)

- [ ] **Step 1: Write SKILL.md**

```markdown
---
name: install-avatar
description: >
  Install or update the user's avatar/profile photo. Resizes to 128/256/512 px,
  produces WebP + PNG fallbacks, updates ref_src/main.md Avatar field, and offers
  to refresh resume PDFs. Use when the user says "/install-avatar", "set avatar",
  "更新頭像", "上傳頭像", "change profile picture", or wants to install a new photo.
---

# Install Avatar — Profile Photo Pipeline

## Overview

Take a single image file and produce a multi-size, multi-format avatar set used across the portfolio site (Hero, Footer) and resume PDFs.

## Prerequisites

- `sharp` and `tsx` are dev deps (installed during the avatar plan).
- `npm run avatar:install` script exists in package.json.

## Workflow

### Step 1: Get source image path

If user passed a path argument, use it. Otherwise, AskUserQuestion:

> 請提供頭像檔案的絕對路徑（JPG / PNG / HEIC / WebP 皆可）。
> 範例: /Users/me/Desktop/photo.jpg

Validate the file exists and is a supported format (`.jpg`, `.jpeg`, `.png`, `.heic`, `.webp`). If not, show the supported list and ask again.

### Step 2: Run the install script

Execute (Bash):

```bash
npm run avatar:install -- "<absolute-path>"
```

Verify output: `public/avatar/avatar-{128,256,512}.{webp,png}` exist, plus `ref_src/main.md` now contains `**Avatar:** /avatar/avatar-512.webp`.

### Step 3: Sync HeroSection

Read `src/components/sections/HeroSection.vue`. If it doesn't already render an avatar `<picture>`, add this block in the template (inside the hero layout, near the name):

```vue
<picture v-if="hasAvatar">
  <source srcset="/avatar/avatar-512.webp" type="image/webp" />
  <img
    src="/avatar/avatar-512.png"
    :alt="$t('hero.avatarAlt')"
    width="160"
    height="160"
    class="rounded-full shadow-lg"
  />
</picture>
<div v-else class="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-secondary" />
```

Add to script setup:

```typescript
// detect avatar presence at build (constant for static deploy)
const hasAvatar = true  // becomes false only if user explicitly removes
```

(Optional refinement: lookup via `fetch('/avatar/avatar-512.webp', { method: 'HEAD' })` at runtime if you want true dynamic detection. Static `true` is fine because the skill always installs at least one.)

### Step 4: Update i18n

If `hero.avatarAlt` does not exist in `src/i18n/zh-TW.ts` and `src/i18n/en.ts`, add:

```typescript
hero: {
  // ... existing keys
  avatarAlt: '{name} 的頭像',  // zh-TW
  // avatarAlt: 'Photo of {name}',  // en
}
```

(Engineer: substitute the user's actual name from main.md, or use literal placeholder; the simpler choice is just `'頭像'` / `'Profile photo'` with no name interpolation.)

### Step 5: Ask about PDF regeneration

```
✅ Avatar 已安裝（6 個檔案 + main.md 更新）

履歷 PDF 也要加頭像嗎？
1. Yes — 重新產 resume_zh.pdf / resume_en.pdf
2. No — 只更新網站
```

If Yes: invoke whatever PDF regeneration command the project uses (currently no automated script — defer to user to run their existing flow). For now, print:

```
請手動重新產生履歷 PDF（使用既有流程），新版會自動採用 main.md 的 Avatar 欄位。
```

### Step 6: Final summary

```
✅ 完成
  - public/avatar/ — 6 檔（128/256/512 × webp/png）
  - ref_src/main.md — Avatar 欄位
  - src/components/sections/HeroSection.vue — 頭像 <picture>
  - src/i18n/{zh-TW,en}.ts — hero.avatarAlt

下一步：`npm run dev` 預覽
```

## Notes

- Do not commit the binary PNG/WebP files — they're gitignored
- If user passes a low-resolution source (<512px), script still upscales but warn:
  > "⚠️ 來源解析度低於 512px，512 版會略糊。建議用至少 1024×1024 的原圖。"
- HEIC support: requires libheif on system; if conversion fails, ask user to convert to JPG first
```

- [ ] **Step 2: Mirror to .agent/**

```bash
mkdir -p .agent/skills/install-avatar
cp .claude/skills/install-avatar/SKILL.md .agent/skills/install-avatar/SKILL.md
```

- [ ] **Step 3: Manual smoke test**

In a Claude Code session, run `/install-avatar /tmp/test-avatar.jpg`. Verify:
- 6 files appear in `public/avatar/`
- `main.md` has `**Avatar:**` line
- `HeroSection.vue` updated (or already had picture block)
- i18n keys present

Clean up test files after.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/install-avatar/ .agent/skills/install-avatar/
git commit -m "feat(avatar): /install-avatar skill"
```

## Task 3: HeroSection avatar render

**Files:**
- Modify: `src/components/sections/HeroSection.vue`
- Modify: `src/i18n/zh-TW.ts`, `src/i18n/en.ts`

(This task is the static counterpart to Step 3 of the SKILL workflow above. Doing it once during plan execution gives the codebase a stable home for the avatar render — the skill thereafter only re-points at this same block.)

- [ ] **Step 1: Read HeroSection**

```bash
cat src/components/sections/HeroSection.vue
```

Note where the name/title block sits in the template.

- [ ] **Step 2: Insert avatar block**

Add inside the hero layout, positioned by existing CSS (e.g. above name on mobile, beside on desktop):

```vue
<picture class="block mx-auto md:mx-0 w-40 h-40">
  <source srcset="/avatar/avatar-512.webp" type="image/webp" />
  <img
    src="/avatar/avatar-512.png"
    :alt="t('hero.avatarAlt')"
    width="160"
    height="160"
    class="w-full h-full rounded-full shadow-lg object-cover"
    onerror="this.style.display='none'"
  />
</picture>
```

The `onerror` hides the broken image when no avatar is installed (fork users without their own photo).

- [ ] **Step 3: Add i18n keys**

In `src/i18n/zh-TW.ts` `hero:` namespace:
```typescript
avatarAlt: '個人頭像',
```

In `src/i18n/en.ts` `hero:` namespace:
```typescript
avatarAlt: 'Profile photo',
```

- [ ] **Step 4: Verify**

Without an avatar installed: `npm run dev` → home page should render with no broken image (the `onerror` hides it).
With an avatar installed (run skill from Task 2): refresh → photo appears.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HeroSection.vue src/i18n/
git commit -m "feat(avatar): HeroSection picture element + i18n"
```

---

## Self-Review Checklist

- [ ] Skill validates file existence + format before running sharp.
- [ ] `main.md` Avatar field is **idempotent** — running skill twice doesn't add a duplicate line.
- [ ] PNG fallback works in browsers without WebP (rare in 2026, but cheap to support).
- [ ] `<img onerror="...display=none">` handles fork users with no avatar yet (no broken-image icon).
- [ ] No binary files committed.
