# 為 taskBoard 新增 demo case study 並更新雙語 README

- **分支:** `chore/add-demo-case-study-and-update-readme`
- **日期:** 2026-04-29

## 描述

範本展示用任務：

1. **Demo case study** — 用 `/add-case-study taskBoard` 流程，為 demo 專案 `taskBoard`（`src/data/projects.ts` 中的第一筆）產出真正會被 manifest 收錄的 case study（目前只有 `example_taskBoard.*.md`，會被 `generate-case-studies-manifest.ts` 排除）。內容由我編寫但獨立於 example，目標是讓 fork users 親眼看到 `/add-case-study` skill 實際輸出的成果。

2. **README 更新** — 雙語 README 同步擴寫新 skills（`install-avatar`、`linkedin-suggest`、`add-case-study`）的使用說明、整合進 Pipeline flow、更新 Quick Start。

## 任務清單

### Case study 內容
- [x] 從 `_template.md` 複製產出 `ref_src/case_studies/taskBoard.zh-TW.md`，撰寫繁中內容（Problem / Solution / Tech Choices / Result / Lessons Learned）
- [x] 產出 `ref_src/case_studies/taskBoard.en.md`，撰寫對應英文內容
- [x] 執行 `npm run build`，確認 `src/data/case-studies-manifest.ts` 收錄 `taskBoard` id 與雙語 locale
- [x] 啟動 dev server (`npm run dev`)，於瀏覽器驗證：
  - [x] taskBoard ProjectCard 顯示「Read Case Study →」連結
  - [x] 路由 `/projects/taskBoard` 正常渲染深度頁，雙語切換正確

### README 更新（README.md）
- [x] AI Skills 區塊：擴寫 `install-avatar` / `linkedin-suggest` / `add-case-study` 三個 skill 的具體使用情境與輸出位置
- [x] Pipeline flow：在現有 `/jd-match → /job-apply → /job-release` 之外，補充 case study / avatar / linkedin 三個輔助 skill 如何串接到主線
- [x] Quick Start：新增「進階個人化」步驟，指引 fork users 安裝頭像、產 linkedin、為主力專案加 case study

### README.en.md 同步
- [x] 上述三項 README.md 變更同步至 `README.en.md`，雙語語意對齊（不直譯但保留所有要點）

### 收尾
- [x] git commit（一份合併 commit：case study + README 同步）

## 驗收條件
- `npm run build` 成功且 manifest 包含 taskBoard
- 瀏覽器看到 taskBoard 的 case study 入口與深度頁
- README 雙語版皆能讓 fork user 看完知道何時用哪個 skill、輸出在哪裡
