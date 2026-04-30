# fix-og-embed-sharing — OG 圖片缺少頭像

- **分支:** `fix/fix-og-embed-sharing`
- **日期:** 2026-04-30

## 描述

修正發佈貼文（LinkedIn、FB、Threads 等）時 OG 預覽圖右側只有空圓圈、沒有頭像的問題。

根因：`scripts/og-templates/home.html` 與 `about.html` 的 `.right` div 只是半透明圓形占位符（`background: rgba(255,255,255,0.4)`），從未被替換為實際頭像；`scripts/generate-og-images.ts` 也沒讀取 `ref_src/main.md` 的 `Avatar` 欄位。

修法：擴充生成腳本讀取 avatar，把 PNG 轉成 base64 data URL 透過 query param 注入模板，模板用 `<img>` 渲染圓形頭像。

參考目標效果：https://naicha-resume.pages.dev/og-images/home-en.png

## 任務清單

- [x] `scripts/generate-og-images.ts`：新增 `readAvatarDataUrl()` 讀 `**Avatar:**` 欄位（fallback `/avatar/avatar-512.png`），讀為 base64 data URL；改用 `page.evaluate` 注入 src（避免 URL 長度限制）
- [x] `scripts/og-templates/home.html`：`.right` 內嵌 `<img class="avatar" id="avatar" hidden>`，套 `overflow:hidden`、`object-fit:cover`、box-shadow
- [x] `scripts/og-templates/about.html`：同 home（layout 一致）
- [x] 跑 `npm run gen:og`，視覺檢查 `home-en.png`、`home-zh-TW.png`、`about.png` 顯示頭像；`case-taskBoard.png` 維持原樣
- [x] 確認 `case-study.html` 不動（設計上沒頭像）
- [ ] 處理 `debug/` 下兩張截圖（不在本次範圍，未來 chore 處理）
- [x] Commit 變更，分支 ready for merge

## 不在本次範圍

- `index.html` 的 `og:image` 絕對路徑改造（memory `project_og_followups.md` 中的方案 A/B）
- LinkedIn 行銷貼文
