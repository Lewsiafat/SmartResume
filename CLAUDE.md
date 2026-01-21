# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

個人履歷 Landing Page，使用 Vue 3 + Vite + TypeScript + Tailwind CSS 建構。
展示個人簡介、技能專長與專案作品，支援深色/淺色模式切換與多語言（繁體中文/英文）。

## Commands

### Development
```bash
npm run dev      # 啟動開發伺服器
```

### Build
```bash
npm run build    # 建置生產版本
npm run preview  # 預覽建置結果
```

## Architecture

```
src/
├── main.ts                    # 應用程式入口
├── App.vue                    # 根組件
├── style.css                  # 全域樣式 (Tailwind CSS)
├── components/
│   ├── layout/                # 佈局組件
│   │   ├── TheHeader.vue      # 導覽列
│   │   ├── TheFooter.vue      # 頁尾
│   │   ├── ThemeToggle.vue    # 主題切換按鈕
│   │   └── LanguageSwitcher.vue # 語言切換器
│   ├── sections/              # 頁面區塊
│   │   ├── HeroSection.vue    # 個人簡介
│   │   ├── SkillsSection.vue  # 技能展示
│   │   └── ProjectsSection.vue # 專案作品
│   └── ui/                    # UI 組件
│       ├── SkillCard.vue      # 技能卡片
│       └── ProjectCard.vue    # 專案卡片
├── composables/               # 可組合函式
│   ├── useTheme.ts            # 主題切換邏輯
│   └── useLocale.ts           # 語言切換邏輯
├── i18n/                      # 國際化
│   ├── index.ts               # i18n 設定
│   ├── zh-TW.ts               # 繁體中文翻譯
│   └── en.ts                  # 英文翻譯
├── data/                      # 資料檔
│   ├── skills.ts              # 技能資料
│   └── projects.ts            # 專案資料
└── types/                     # TypeScript 型別
    └── index.ts
```

## Key Technologies

- **Vue 3** - 使用 Composition API + `<script setup>`
- **Tailwind CSS** - 使用 `dark:` 前綴支援深色模式
- **vue-i18n** - 使用 Composition API 模式
- **Vite** - 建置工具

## Customization

- 頭像：將圖片放入 `public/avatar.jpg`
- 個人資訊：編輯 `src/i18n/zh-TW.ts` 和 `src/i18n/en.ts`
- 技能：編輯 `src/data/skills.ts`
- 專案：編輯 `src/data/projects.ts`
