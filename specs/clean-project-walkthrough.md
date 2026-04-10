# 專案結構清理 — Walkthrough

- **分支:** `chore/clean-project`
- **日期:** 2026-04-10

## 變更摘要
大規模清理專案結構：移除過時的設計稿、重複檔案、不再使用的部署腳本和已完成任務的 spec 文件。整理 ref_src/ 僅保留 main.md 作為 SSOT。同時提交了先前未 commit 的 Pomodoro Timer 專案新增和 resume PDF 更新。

## 修改的檔案
- `.gitignore` — 加入 `temp/` 排除規則
- `CLAUDE.md` — 移除 deploy 指令說明，更新專案數量 7→8，新增 Tool 分類
- `package.json` — 移除 `deploy` 和 `deploy:ps` npm scripts
- `ref_src/main.md` — 新增，履歷與 Portfolio 的 SSOT 檔案
- `public/resume_en.pdf` — 更新英文履歷 PDF
- `public/resume_zh.pdf` — 更新中文履歷 PDF
- `src/types/index.ts` — ProjectCategory 新增 `'Tool'` 型別
- `src/data/projects.ts` — 新增 pomodoroTimer 專案資料
- `src/components/sections/ProjectsSection.vue` — 新增 Tool 篩選按鈕
- `src/i18n/en.ts` — 新增 pomodoroTimer 英文翻譯 + filterTool
- `src/i18n/zh-TW.ts` — 新增 pomodoroTimer 中文翻譯 + filterTool
- `specs/clean-project.md` — 本次任務規格文件
- 刪除 22 個檔案：`deploy.sh`、`deploy.ps1`、`deploy.skill`、`deploy_auto.exp`、`target_git_repos.md`、`docs/ref_repos.md`、`new_design/*`（4 檔）、`ref_src/` 舊履歷版本（9 檔）、`specs/` 舊任務文件（4 檔）

## 技術細節
- 部署腳本全數移除（deploy.sh、deploy.ps1、deploy.skill、deploy_auto.exp），未來部署方式待重新規劃
- ref_src/ 從 12 個檔案精簡為僅 main.md，配合 Resume SSOT 設計方向
- .agent/ 和 .gemini/ 目錄保留（之後會複製 skill 進去），不加入 .gitignore
