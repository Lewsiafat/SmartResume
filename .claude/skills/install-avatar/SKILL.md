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
