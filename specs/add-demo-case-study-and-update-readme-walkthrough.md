# 為 taskBoard 新增 demo case study 並更新雙語 README — Walkthrough

- **分支:** `chore/add-demo-case-study-and-update-readme`
- **日期:** 2026-04-29

## 變更摘要

為 demo 專案 `taskBoard` 撰寫雙語 case study（內容由 AI 編寫，獨立於 example_taskBoard.*），讓 fork users 親眼看到 `/add-case-study` skill 實際輸出的成果。同步更新雙語 README：Quick Start 加入「進階個人化」步驟、新增 3 個情境（case study / avatar / linkedin），並新增 Skills 全景 Mermaid 圖。

## 修改的檔案

### 新增
- `ref_src/case_studies/taskBoard.zh-TW.md` — 繁中 case study：Problem / Solution / Tech Choices / Result / Lessons Learned
- `ref_src/case_studies/taskBoard.en.md` — 英文 case study（內容對應但獨立撰寫，非直譯）
- `specs/add-demo-case-study-and-update-readme.md` — 任務規格文件
- `specs/add-demo-case-study-and-update-readme-walkthrough.md` — 本檔

### 修改
- `README.md`
  - Quick Start 新增 `Step 3：進階個人化（推薦）`，列出 install-avatar / add-case-study / linkedin-suggest 三件式
  - 部署步驟順延為 `Step 4`
  - 「📖 使用情境」追加 `情境 7~9`：撰寫 Case Study、安裝頭像、同步 LinkedIn
  - Skills 表格下方新增 `### Skills 全景圖` 含 Mermaid，視覺化「個人化打磨」與「求職流程」兩條軸線
- `README.en.md` — 對齊上述三項變更（Polish step、Use Case 7~9、Skills at a Glance）

## 技術細節

### Case study 流程驗證
- `scripts/generate-case-studies-manifest.ts` 在 `npm run build` 時執行 `gen:manifest` 產出 `src/data/case-studies-manifest.ts`（git-ignored）
- 該腳本忽略 `_template.md` 與 `example_*` 前綴，因此新增 `taskBoard.{en,zh-TW}.md` 後 manifest 自動收錄 1 個 entry，雙語 locale 都偵測到
- `src/views/CaseStudyPage.vue` 透過 `import.meta.glob('../../ref_src/case_studies/*.md', { query: '?raw', import: 'default' })` 載入 markdown，依 `useI18n().locale` 選擇對應語系；缺檔會 fallback 到 manifest 內第一個可用 locale
- OG image `public/og-images/case-taskBoard.png` 由 `scripts/generate-og-images.ts` 自動產出（讀取 manifest）

### 瀏覽器驗證
透過 Playwright 確認：
- 首頁 ProjectCard 出現 `深度解析 →` / `Read Case Study →` 連結，href = `/projects/taskBoard`
- 路由 `/projects/taskBoard` 雙語都能正確渲染：
  - zh-TW 標題 `TaskBoard — 即時協作看板`、教訓區包含「Real-time 比想像中複雜」
  - en 標題 `TaskBoard — Real-time Collaboration Kanban`
- 切換語系後 `watch([projectId, locale])` 觸發 `loadMarkdown()` 重新載入對應語系檔

### 內容策略
- 兩語版本獨立撰寫（非機器翻譯），保留語感但要點對齊
- 與既有的 `example_taskBoard.{en,zh-TW}.md` 內容刻意做出差異（不同數字、不同 lessons），避免使用者誤以為是直接複製
- 雖屬 demo 內容，但維持「可信度高」的細節：具體延遲數字、stars / fork 數、具體技術取捨理由

### Git 留意事項
- 同分支下尚有 3 個未追蹤的 `.claude/skills/` 目錄（dispatching-parallel-agents / executing-plans / writing-plans，superpowers 系列），與本任務無關，commit 時刻意排除
