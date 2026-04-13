# Slate Minimal 主題替換 — Walkthrough

- **分支:** `feat/theme-factory`
- **日期:** 2026-04-13

## 變更摘要
將專案配色從 Forest Green 全面替換為 Slate Minimal 極簡灰階主題，同時將字體從 Space Grotesk + Playfair Display 更換為 Inter。所有硬編碼的綠色系色值已清除，build 驗證通過且零殘留。

## 修改的檔案
- **`tailwind.config.js`** — 將 primary/secondary/accent/dark 色系從綠色改為 Slate 灰階，字體改為 Inter + Noto Sans TC
- **`src/style.css`** — 更新 Google Fonts import（移除 Space Grotesk、Playfair Display，加入 Inter）、heading 字體改為 Inter、btn-primary 和 gradient-text 的 linear-gradient 色值替換
- **`src/components/ui/ProjectCard.vue`** — 替換 emoji header 區塊的硬編碼 gradient 色值
- **`src/components/sections/AboutSection.vue`** — 替換 skill bar 的硬編碼 gradient 色值
- **`specs/theme-factory.md`** — 任務規格文件（新增）

## 技術細節
- 配色方案：Primary #475569 (Slate 600) / Dark BG #0f172a (Slate 900) / Accent #94a3b8 (Slate 400)
- 因為 Tailwind class 名稱（如 `primary-500`、`dark-bg`）保持不變，只改底層色值，所以所有 `.vue` 組件中使用 Tailwind utility class 的部分自動套用新色，不需逐一修改
- 僅 4 處使用 inline `style` 屬性的硬編碼色值需要手動替換（3 處在 style.css、2 處在 .vue 組件）
- 字體移除 Playfair Display serif 標題字體，改為與 body 一致的 Inter sans-serif，風格更現代統一
- Google Fonts import URL 中移除 Space Grotesk 和 Playfair Display，僅保留 Inter 和 Noto Sans TC
