# 掃描過時專案資訊與個人資訊殘留 — Walkthrough

- **分支:** `chore/scan-for-old-projects-info-or-personal`
- **日期:** 2026-04-20

## 變更摘要

盤點 SmartResume 全專案的過時專案結構與個人資訊殘留，先產出審計報告 `output/content-audit-2026-04-20.md`，並在 rebase 到 `origin/master` (v1.2.0) 後重新驗證。使用者確認後一次修掉高 / 中優先級 finding（H1、H2、M1、M2、M3），`npm run build` 綠燈通過。

## 修改的檔案

### 產出文件
- `specs/scan-for-old-projects-info-or-personal.md` — 任務規格
- `specs/scan-for-old-projects-info-or-personal-walkthrough.md` — 本文件
- `output/content-audit-2026-04-20.md` — 完整審計報告，含 finding / 修復狀態 / 延伸觀察

### 個資洩漏修復
- `README.md` — 兩處 `git clone git@github.com:Lewsifat/SmartResume.git` → `<your-username>` 占位符（第 46、311 行）
- `.gemini/skills/repo-sync/` — 整個刪除（含 `sync_repos.py` 中的 `github.com/Lewsiafat/Picore-W` 註解）
- `.gemini/skills/project-info-manager/` — 整個刪除（legacy skill，路徑已失效）
  > `.gemini/` 目錄因此被清空並一併移除

### 過時專案分類清理（M1）
- `src/types/index.ts` — `ProjectCategory` union 移除 `'FinTech' | 'IoT' | 'Game'`
- `src/i18n/zh-TW.ts` — 移除 `filterFinTech` / `filterIoT` / `filterGame` key
- `src/i18n/en.ts` — 同上
- `src/components/sections/ProjectsSection.vue` — `filters` 陣列移除三項

### 命名一致性（M2）
- `src/data/stats.ts` — id `pythonPercent` → `tsPercent`（value 不變）
- `src/i18n/zh-TW.ts` / `src/i18n/en.ts` — stats key `pythonPercent` → `tsPercent`，同步符合 label 的 TypeScript 語意

### 文件同步（M3）
- `CLAUDE.md` — `Fonts: Space Grotesk + Noto Sans TC` → `Inter + Noto Sans TC`，對齊 `tailwind.config.js` 與 `src/style.css` 實際使用的字型
- `AGENTS.md` — 同上

## 技術細節

### 掃描方法
- 以 CLAUDE.md 架構為地圖，分層盤點 SSOT（`ref_src/*`）、靜態資料（`src/data/*`）、i18n（`src/i18n/*`）、文件（`README.md` / `CLAUDE.md` / `AGENTS.md` / `CHANGELOG.md`）、產物（`public/resume_*.pdf`）、歷史輸出（`output/`）、規格（`specs/` / `docs/`）
- 用 ripgrep 搜尋關鍵字：`Lewsifat|lewsiafat|Lewis Chan|Lewsiafat`、`天旭|鈊象|黑米|英丰寶|Picore`、`alex\.chen|sample-user|example\.com`
- 刻意保留：`specs/remove-personal-data-change-to-sample*.md` 是先前 sanitization 的對照記錄（L1 標示為刻意保留的審計軌跡）

### Rebase 後重跑
- 掃描產出第一版後，使用者要求 rebase 到 `origin/master` 再驗證
- Remote 進到 v1.2.0：新增 `src/data/contact.ts`（聯絡資訊 SSOT）、`src/analytics.ts`（env-gated GA）、Formspree 整合、SEO meta、scroll reveal 等
- 原報告的 L4（Contact 區塊硬編碼 email/URL）已被 v1.2.0 透過 `contact.ts` 修好，其餘 finding 未受影響

### 修復階段
- 使用 `git rm -r` 刪除 `.gemini/skills/` 下的 legacy skill，避免遺漏 git index
- 所有修改後跑 `npm run build`（vue-tsc + vite build），63 modules 轉換成功，894ms 完成，產物大小無明顯變化

### 延伸觀察（未在本次修復範圍）
- `.claude/skills/update-resume/SKILL.md:69` 與 `.agent/skills/update-resume/SKILL.md:69` 仍把 `FinTech / IoT / Game` 列為 Category 可選項；與縮減後的 `ProjectCategory` union 不同步，已記錄於審計報告 🆕 延伸觀察區段
- `L2`：本任務的 spec 文件第 29 行仍列出使用者 email 作為範例，若未來 repo 公開需一併處理
- `L3`：`ref_src/main.md` mtime 晚於 `public/resume_*.pdf` 4 天，內容一致但 PDF 未重建
