# Remove Personal Data & Convert to Sample Template — Walkthrough

- **分支:** `feat/remove-personal-data-change-to-sample`
- **日期:** 2026-04-11

## 變更摘要
將專案從個人 Portfolio 轉換為可重用的模板。所有個人資料（姓名、Email、GitHub、LinkedIn、工作經歷、專案）
替換為通用範例資料（Alex Chen / alex.chen@example.com），專案從 8 個縮減至 3 個，工作經歷從 5 段縮減至 3 段。
Tech Stack 簡化為通用技術清單。重新產生中英文履歷 PDF。CLAUDE.md 改寫為英文，重新定位為模板專案 + AI Agent 履歷管理系統。

## 修改的檔案

### 核心資料檔
- `src/i18n/zh-TW.ts` — 替換所有個人資訊為範例資料（繁中），專案翻譯從 8 個縮減至 3 個
- `src/i18n/en.ts` — 同上（英文版）
- `src/data/projects.ts` — 8 個真實專案 → 3 個範例專案（TaskBoard, WeatherDash, DevToolkit）
- `src/data/skills.ts` — 技能改為 TypeScript/Python/JavaScript/Go
- `src/data/stats.ts` — GitHub 統計改為範例數據
- `src/data/techStack.ts` — 簡化為通用技術清單，移除特定工具名稱

### 元件檔
- `src/components/sections/ContactSection.vue` — Email/GitHub 連結替換
- `src/components/layout/TheFooter.vue` — GitHub/LinkedIn/Email 連結替換
- `index.html` — Page title 從 "Lewis Chan" 改為 "Alex Chen"

### 履歷 SSOT
- `ref_src/main.md` — 完整履歷替換（3 段範例工作經歷、3 個範例專案、簡化技術棧）
- `ref_src/resume_zh.md` — 新增：中文履歷 markdown（PDF 來源）
- `ref_src/resume_en.md` — 新增：英文履歷 markdown（PDF 來源）

### 靜態資源
- `public/resume_zh.pdf` — 用 md-to-pdf 重新產生
- `public/resume_en.pdf` — 用 md-to-pdf 重新產生

### 設定與文件
- `CLAUDE.md` — 全面改寫為英文，重新定位為 Portfolio 模板 + AI Agent 履歷管理系統
- `.agent/skills/deploy/SKILL.md` — VPS 資訊替換為 example.com
- `.agent/skills/deploy/scripts/deploy.sh` — 部署腳本連線設定替換
- `.claude/skills/update-resume/SKILL.md` — 移除真實公司名稱範例
- `docs/superpowers/specs/2026-04-09-resume-single-source-of-truth-design.md` — 移除姓名

### 新增
- `specs/remove-personal-data-change-to-sample.md` — 任務規格文件

## 技術細節
- 使用 `npx md-to-pdf` 從 markdown 產生履歷 PDF，支援 A4 格式與自訂 margin
- 個人資料殘留檢查使用 ripgrep 搜尋 `Lewis|lewsi|Lewsiafat|天旭|鈊象|黑米|英丰寶` 等關鍵字
- 僅 specs 對照表文件保留原始個人資料作為替換記錄，其餘零殘留
- `npm run build`（vue-tsc + vite build）通過驗證
