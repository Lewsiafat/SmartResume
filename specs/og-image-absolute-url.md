# og-image-absolute-url — `og:image` / `twitter:image` 改為絕對 URL

- **分支:** `fix/og-image-absolute-url`
- **日期:** 2026-04-30

## 描述

部署到 VPS 後 OG 預覽抓不到圖（多數 crawler 不接受相對 `og:image` URL，OG 規範也要求 absolute URL）。改用 Vite plugin（Memory `project_og_followups.md` 推薦的方案 A）：在 `transformIndexHtml` hook 內讀 `ref_src/main.md` 的 `Site URL`，build 時把 `og:image` / `twitter:image` 的相對路徑自動補成完整 URL。`og:url` / `twitter:url` / `<link rel="canonical">` 已是絕對 URL，無須處理。

維持 `main.md` 為單一資料源（SSOT）：只要 `update-resume` skill 寫入 `Site URL`，OG meta 就會自動跟著正確化，未來改 host/subpath 也只動一個地方。

## 任務清單

- [x] `vite.config.ts`：新增 inline plugin `absoluteOgImagePlugin()`（`enforce: 'post'`），讀 `main.md` 的 `Site URL` origin，build 時補在已被 base 重寫過的 root-relative `og:image` / `twitter:image` 路徑前；缺 `Site URL` 時印 warning 跳過 transform
- [x] 跑 `VITE_BASE=/smartresume/ npm run build`，確認 `dist/index.html` 內 `og:image` / `twitter:image` 為完整 URL
- [x] **client-side 修正（initial spec 漏掉）：** `src/composables/useOgMeta.ts` 加 `toAbsolute()` 用 `import.meta.env.BASE_URL` 解析路徑，避免 `new URL(path, location.origin)` 在 subpath 部署下吃掉 `/smartresume/`；`HomePage.vue` / `CaseStudyPage.vue` 的 `url` 欄位改傳相對路徑，由 `useOgMeta` 統一補 origin/base
- [x] 用 playwright 起 preview（`VITE_BASE=/smartresume/`）實機驗證 client-side 改寫後 og:image / og:url / twitter:image 都包含 `/smartresume/` subpath
- [x] 更新 `.claude/skills/update-resume/SKILL.md` 與 `.agent/skills/update-resume/SKILL.md` 第 290 行附近註解
- [ ] 部署到 VPS（`npm run deploy`），用 LinkedIn Post Inspector / FB Sharing Debugger 重新 scrape，確認 OG card 正確帶圖
- [x] 更新 Memory `project_og_followups.md`：把第 1 項標為已完成

## 設計要點

- **為何不放在 `update-resume` skill 裡（方案 B）：** Site URL 改動時必須重跑 skill，且 dev 環境 index.html 永遠處於「半同步」狀態。Plugin 走 build-time，跟 `VITE_BASE` 機制一致，乾淨。
- **Plugin 位置：** 直接 inline 在 `vite.config.ts` 內（規模小，無需獨立檔案）。若日後長大再拆出去 `scripts/vite-plugin-og-meta.ts`。
- **fallback 行為：** main.md 缺 `Site URL` 時印 warning 並跳過 transform，不影響 build 成功（與 `gen:og` 缺 avatar 時的策略一致）。

## 不在本次範圍

- LinkedIn 行銷貼文（Memory 第 2 項）

## 補記：為何 server-side 修了還壞

第一輪只修 `vite.config.ts` plugin，curl 看 server response 一切正常（含 `/smartresume/` subpath），但實機開瀏覽器仍看到錯誤 URL（少 subpath）。原因是 `src/composables/useOgMeta.ts` 在 mount 後用 `new URL(m.image, location.origin).toString()` 把 meta 蓋掉 — `location.origin` 不含 base path，root-relative 路徑對 origin 解析會丟失 subpath。教訓：**有 SPA + dynamic meta 時，server-side meta 只是初始值，client-side composable 才是 source of truth**。兩邊都要修。
