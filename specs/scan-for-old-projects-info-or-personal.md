# 掃描過時專案資訊與個人資訊殘留

- **分支:** `chore/scan-for-old-projects-info-or-personal`
- **日期:** 2026-04-17

## 描述
盤點 SmartResume 專案中所有內容來源、文件與歷史產出，找出過時的專案資訊以及殘留 / 不一致的個人資訊，輸出一份報告（不直接修改任何檔案）。報告交由使用者決定後續處理。

## 任務清單

### 1. 內容來源掃描（SSOT / 靜態資料）
- [x] 掃描 `ref_src/main.md`（履歷 SSOT）
- [x] 掃描 `ref_src/resume_zh.md` / `resume_en.md`
- [x] 掃描 `src/i18n/zh-TW.ts` / `en.ts`（網站文案 + 聯絡資訊）
- [x] 掃描 `src/data/projects.ts`
- [x] 掃描 `src/data/skills.ts` / `stats.ts` / `techStack.ts`

### 2. 文件與設定掃描
- [x] 掃描 `README.md` / `CLAUDE.md` / `AGENTS.md` / `CHANGELOG.md`
- [x] 掃描 `index.html`（`<title>`、meta、OG 標籤）
- [x] 檢查 `public/resume_*.pdf` 的更新時間與 SSOT 對齊情況

### 3. 歷史產出掃描
- [x] 掃描 `output/jd-analysis/`、`output/cover-letters/`、`output/releases/`
- [x] 掃描 `specs/`、`docs/`（標示已完成或過期的項目）

### 4. 個人資訊一致性檢查
- [x] 姓名 / 暱稱（`Lewis`、`Chan` 等）一致性
- [x] Email（是否統一為 `lewsiafat@gmail.com`）
- [x] GitHub URL / username
- [x] LinkedIn URL
- [x] 電話、地理位置
- [x] 照片路徑、社群連結

### 5. 過時內容檢查
- [x] `projects.ts` 中已不代表作者的專案
- [x] i18n 中與 `projects.ts` / `techStack.ts` / `stats.ts` 對不上的孤兒 key
- [x] `stats.ts` 數字是否需更新
- [x] `techStack.ts` 是否列出早已不用的技術
- [x] `CHANGELOG.md` / `README.md` 中 claim 的功能是否仍存在
- [x] `output/releases/` 中明顯過時的應徵封存

### 6. 產出報告
- [x] 將結果寫入 `output/content-audit-2026-04-20.md`（實際使用 04-20），結構：
  - 個人資訊不一致表（位置 → 目前內容 → 建議）
  - 過時專案 / 內容清單（檔案:行 → 問題 → 建議）
  - 摘要與優先級排序
- [x] 不修改原始檔案，僅產出報告
