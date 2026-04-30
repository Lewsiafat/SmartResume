# og-image-absolute-url — Walkthrough

- **分支:** `fix/og-image-absolute-url`
- **日期:** 2026-04-30

## 變更摘要

修正 OG 預覽抓不到圖的問題：把 `og:image` / `twitter:image` 從 root-relative 路徑改為絕對 URL。原本以為只需 build-time 在 `index.html` 補完整 URL（vite plugin），實機驗證才發現 client-side `useOgMeta` 在 mount 後又用 `new URL(path, location.origin)` 把 meta 蓋掉，丟失 `/smartresume/` subpath，所以 server-side + client-side 兩邊都要修。

## 修改的檔案

- `vite.config.ts` — 新增 inline plugin `absoluteOgImagePlugin()`（`enforce: 'post'`）。`transformIndexHtml` hook 內讀 `ref_src/main.md` 的 `Site URL`，取 origin（`new URL(siteUrl).origin`），用 regex 把 `og:image` / `twitter:image` 已被 base 重寫過的 root-relative 路徑前面補上 origin。`Site URL` 缺/壞時印 warning 跳過 transform，不阻斷 build。
- `src/composables/useOgMeta.ts` — 新增 `toAbsolute()` helper：HTTP(S) URL 直通；其他用 `import.meta.env.BASE_URL` 拼出 base+path，再 `new URL(final, location.origin)` 解析。`og:image`、`twitter:image`、`og:url` 三條 meta 都改走這個 helper。
- `src/views/HomePage.vue` — `url` 從 `location.origin + '/'` 改為 `'/'`，由 `useOgMeta` 統一補 origin/base。
- `src/views/CaseStudyPage.vue` — `url` 從 `${location.origin}/projects/${id}` 改為 `/projects/${id}`，理由同上。
- `.claude/skills/update-resume/SKILL.md`、`.agent/skills/update-resume/SKILL.md` — 第 290 行附近的注意事項更新：說明 build 時由 `absoluteOgImagePlugin` 自動把相對路徑補成完整 URL，不再只是 base prefix。
- `specs/og-image-absolute-url.md` — 任務規格 + 「為何 server-side 修了還壞」補記。
- `specs/og-image-absolute-url-walkthrough.md` — 本文件。
- Memory `project_og_followups.md` — 第 1 項標為已完成（不在 commit 範圍）。

## 技術細節

- **`enforce: 'post'`：** Vite 自己會把 `<meta content="/og-images/...">` 經 `base` rewrite 成 `/smartresume/og-images/...`。我的 plugin 必須在那之後跑才不會錯位。所以只 prepend `Site URL` 的 **origin**（`https://lewsi.ddns.net`），不含 path — 配上已被 base rewrite 過的路徑剛好組成完整 URL。如果用「整個 Site URL」prepend 會出現 `https://lewsi.ddns.net/smartresume/smartresume/...` 雙 subpath。
- **`new URL(path, location.origin)` 的陷阱：** 當 `path` 以 `/` 開頭，URL constructor 會視為 root-absolute，**完全取代** base 的 path 部分。`location.origin` 沒有 path，所以 `'/og-images/x.png'` 永遠解析成 `https://host/og-images/x.png`，丟失 subpath。修法是手動在 `BASE_URL` 與 `path` 之間做 join，並去重複 prefix（`if (!p.startsWith(base + '/'))`）。
- **HomePage `url` 為何改傳 `'/'` 而非 `BASE_URL`：** `useOgMeta` 已用 `import.meta.env.BASE_URL` 處理；caller 只需給語意路徑（root = `/`、case study = `/projects/:id`），不必知道 deploy subpath。集中責任，未來 base 改變只動一處。
- **playwright 實機驗證：** 起 vite preview（`VITE_BASE=/smartresume/`）、開 `http://localhost:4173/smartresume/`、等 onMounted 跑完，讀 DOM 內三條 meta 都包含 `/smartresume/og-images/`。Production 上 origin 換成 `https://lewsi.ddns.net` 即正確。
- **教訓：** SPA 中有 dynamic meta 時，server-side 的 static HTML 只是初始值，**client-side composable 才是 source of truth** — `curl` 看伺服器 response 不能代表瀏覽器看到的最終 DOM；要用 headless browser 跑過。

## 不在本次範圍

- LinkedIn 行銷貼文（Memory 第 2 項）
- 部署後社群平台快取重抓（需手動到 LinkedIn Inspector / FB Sharing Debugger 觸發）
- `.claude/skills/playwright-skill/.temp-execution-*.js` 的清理（playwright-skill runtime artifact，應加 `.gitignore`，但跟本任務無關）
