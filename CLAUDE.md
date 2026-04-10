# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

個人 Portfolio Landing Page（Tech Dark 風格），使用 Vue 3 + Vite + TypeScript + Tailwind CSS 建構。
展示個人簡介、技能進度條、8 個精選專案（FinTech / IoT / AI Tools / Full-Stack / Game / Tool）、技術棧、GitHub 統計與聯絡表單。
支援深色/淺色模式切換與多語言（繁體中文/英文），Hero 區塊含打字動畫效果。

## Commands

```bash
npm run dev        # 啟動開發伺服器
npm run build      # TypeScript 型別檢查 (vue-tsc) + Vite 建置
npm run preview    # 預覽建置結果
```

## Architecture

```
src/
├── components/
│   ├── layout/        # 佈局組件 (Header, Footer, ThemeToggle, LanguageSwitcher)
│   ├── sections/      # 頁面區塊 (Hero, About, Projects, TechStack, Stats, Contact)
│   └── ui/            # UI 組件 (ProjectCard)
├── composables/       # useTheme (深色模式), useLocale (語言切換), useTyping (打字動畫)
├── i18n/              # vue-i18n 翻譯檔 (zh-TW, en)
├── data/              # 靜態資料 (projects, skills, techStack, stats)
└── types/             # TypeScript 型別定義
```

## Page Structure (Section Order)

```
TheHeader（固定頂部，導覽：About / Projects / Tech Stack / Contact）
  HeroSection          — 全屏、打字動畫、漸層背景、CTA
  AboutSection         — 個人介紹 + 技能進度條（IntersectionObserver 動畫）
  ProjectsSection      — 篩選按鈕（All/FinTech/IoT/AI Tools/Full-Stack/Game）+ 7 專案卡片（3 欄）
  TechStackSection     — 4 欄技術分類清單
  StatsSection         — 4 個 GitHub 統計卡片
  ContactSection       — 聯絡資訊 + 表單（placeholder，待接後端）
TheFooter（社交連結 + Back to Top）
```

## Key Technologies

- **Vue 3** — Composition API + `<script setup>`
- **Tailwind CSS** — `dark:` 前綴支援深色模式（class 策略），自訂 primary/secondary/accent 色盤
- **vue-i18n** — Composition API 模式
- **Vite** — 建置工具

## Important Patterns

- **i18n 翻譯鍵對應**：`Project` 的 `id` 欄位直接對應 i18n 翻譯鍵。例如 `id: 'scalpingTrade'` 對應 `projects.scalpingTrade.title` / `.subtitle` / `.description`。`TechCategory` 的 `id` 對應 `techStack.{id}`，`GitHubStat` 的 `id` 對應 `stats.{id}`。新增資料時須同步更新 `src/i18n/zh-TW.ts` 和 `src/i18n/en.ts`。
- **打字動畫**：獨立 composable `useTyping`，接收字串陣列，逐字打出/刪除循環，`onUnmounted` 清理 timer。打字文字使用 `hero.typingText1` ~ `hero.typingText4` 個別 key。
- **專案篩選**：`ProjectsSection` 用 `ref<ProjectCategory>` + `computed` filteredProjects 實現即時篩選。
- **技能條動畫**：`AboutSection` 使用 `IntersectionObserver` 觸發，初始 `width: 0` → 實際百分比的 CSS transition。
- **深色模式**：透過 `document.documentElement.classList.add('dark')` 切換，偏好設定存於 `localStorage('theme')`。
- **語言設定**：存於 `localStorage('locale')`，預設偵測瀏覽器語言。
- **色盤**：primary #4b7049（森林綠）、secondary #9ba38f（鼠尾草）、accent #c4ccaa（橄欖綠）、dark-bg #253124（深林）。
- **字體**：Space Grotesk + Noto Sans TC。

## Resume Single Source of Truth（進行中）

`ref_src/main.md` 為履歷與 Portfolio 的單一資料源，涵蓋完整個人檔案。搭配 `/resume` skill 透過 guided Q&A 更新，並互動式同步至網站檔案。

- **設計規格**：`docs/superpowers/specs/2026-04-09-resume-single-source-of-truth-design.md`
- **Skill 位置**：`~/.claude/skills/resume/SKILL.md`
- **資料流**：`main.md` →（skill sync）→ `src/data/*.ts` + `src/i18n/*.ts` → （手動）→ `public/resume_*.pdf`

## Customization

- **建議使用 `/resume` skill** 更新履歷與 Portfolio 資料（完成後）
- 個人資訊：編輯 `src/i18n/zh-TW.ts` 和 `src/i18n/en.ts`
- 專案：編輯 `src/data/projects.ts`（同步更新 i18n 翻譯檔）
- 技能條：編輯 `src/data/skills.ts`
- 技術棧：編輯 `src/data/techStack.ts`（同步更新 i18n 翻譯檔）
- GitHub 統計：編輯 `src/data/stats.ts`（同步更新 i18n 翻譯檔）
- Contact 表單：目前為 UI placeholder，後續可接 Formspree 等服務
