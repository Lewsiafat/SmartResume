# fix-og-embed-sharing — Walkthrough

- **分支:** `fix/fix-og-embed-sharing`
- **日期:** 2026-04-30

## 變更摘要

修正 OG 預覽圖右側只有半透明圓圈占位符、缺少實際頭像的問題。`scripts/og-templates/home.html` 與 `about.html` 改為內嵌 `<img class="avatar">`；`scripts/generate-og-images.ts` 新增 `readAvatarDataUrl()` 從 `ref_src/main.md` 的 `**Avatar:**` 欄位解析路徑（自動把 `.webp` 換成 `.png`），讀取為 base64 data URL，透過 `page.evaluate()` 在 puppeteer 載入後注入 `img.src` 並等待 `decode()` 完成再截圖。`case-study.html` 設計上沒有頭像、不受影響。

## 修改的檔案

- `scripts/og-templates/home.html` — `.right` 加 `overflow: hidden` + `box-shadow` + `flex-shrink: 0`；新增 `.avatar` rule（`width/height: 100%; object-fit: cover`）；`<div class="right">` 內塞 `<img class="avatar" id="avatar" alt="" hidden />`
- `scripts/og-templates/about.html` — 同 home（layout 一致）
- `scripts/generate-og-images.ts` —
  - 新增 `readAvatarDataUrl()`：從 main.md 讀 `**Avatar:**`（fallback `/avatar/avatar-512.png`），把 `.webp/.jpg/.jpeg` 後綴強制改 `.png`，回傳 `data:image/png;base64,...` 字串；缺檔回 `undefined`
  - `shoot()` 多吃 `avatarDataUrl?: string` 參數；若有值，`page.evaluate` 注入 src、移除 `hidden`、`await img.decode()`（包 try/catch）
  - `main()` 在生成前讀一次 avatar；home / about 兩個 shoot 呼叫加上 avatar 引數，case-study 不傳（template 沒 `#avatar` 元素）
- `specs/fix-og-embed-sharing.md` — 任務規格
- `specs/fix-og-embed-sharing-walkthrough.md` — 本文件

## 技術細節

- **為何不從 query string 傳 data URL：** 512px PNG 約 600 KB → base64 ≈ 800 KB；放進 `file://` URL 可能撞到瀏覽器 URL 上限。改走 `page.evaluate(arg)`，puppeteer 用 CDP 序列化參數，不受 URL 長度限制。
- **為何強制換成 PNG：** main.md 預設是 `/avatar/avatar-512.webp`；puppeteer headless Chrome 讀 webp 沒問題，但 PNG 在 `<img>` data URL 路徑最穩定（避免日後升降版 chromium 對 webp decode 有差異）。`install-avatar` skill 已同時生出 PNG + WebP，所以路徑置換永遠能找到檔。
- **`<img hidden>` + JS 顯示：** template 預設 `hidden`，避免無 src 時出現 broken image icon；JS 注入 src 時 `removeAttribute('hidden')`，搭配 `await img.decode()` 確保 screenshot 截到完整圖。
- **不動 `case-study.html`：** 設計上就沒頭像（純 title + tagline + author），且 template 內無 `#avatar` 元素，`shoot()` 的 `if (avatarDataUrl)` 分支會走進 evaluate 但 `getElementById('avatar')` 為 null 即提早 return。為了避免 case-study 頁面也跑這段（多餘的 round-trip），main() 那邊就不傳 avatar 給它。
- **PNG 檔不入 commit：** `public/og-images/*.png` 已 gitignore，是 build artifact；下次 `npm run gen:og` 會重生。

## 不在本次範圍

- `index.html` 的 `og:image` 絕對路徑改造（memory `project_og_followups.md` 中的方案 A/B）
- `debug/` 目錄下兩張截圖的清理／歸檔
- 部署後到 LinkedIn Post Inspector / FB Sharing Debugger 強制重抓快取
