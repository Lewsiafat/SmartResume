# Add VPS Deploy CI — Walkthrough

- **分支:** `feat/add-vps-deploy-ci`
- **日期:** 2026-04-20

## 變更摘要

新增 GitHub Actions 手動觸發的 `Deploy to VPS` workflow：checkout → Node 20 setup → `npm ci` → `npm run build`（帶 `VITE_BASE=/smartresume/`）→ rsync via SSH 到 VPS。同步調整 Vite 設定支援 subpath 部署、修正 `HeroSection.vue` 的硬編碼履歷 PDF 路徑、更新 README Live Demo URL 為實際部署位址 `https://lewsi.ddns.net/smartresume/`，並撰寫 `docs/deployment.md` 說明 SSH key 與 GitHub secrets 一次性設定步驟。

## 修改的檔案

| 檔案 | 動作 | 說明 |
|------|------|------|
| `vite.config.ts` | 修改 | `base` 改讀 `process.env.VITE_BASE`，未設 fallback `/`，保留本機 dev 行為 |
| `.github/workflows/deploy.yml` | 新增 | `workflow_dispatch` 手動觸發；`base_path` input 預設 `/smartresume/`；rsync `--delete` 清除舊雜湊檔；SSH key 用後即刪 |
| `docs/deployment.md` | 新增 | SSH deploy key 產生、GitHub Secrets 設定、Nginx server block 範例、本機 preview 指令、疑難排解表 |
| `src/components/sections/HeroSection.vue` | 修改 | `resumePdfLink` 改用 `import.meta.env.BASE_URL` 串接檔名，subpath 下仍能正確解析 |
| `README.md` | 修改 | Live Demo URL placeholder → `https://lewsi.ddns.net/smartresume/` |
| `README.en.md` | 修改 | 同上 |
| `specs/add-vps-deploy-ci.md` | 新增 | 任務規格 |

## 技術細節

### Subpath 部署的資源路徑

URL 為 `lewsi.ddns.net/smartresume/`，Vite build 的資源必須帶 `/smartresume/` 前綴，否則瀏覽器會到根目錄撈 JS/CSS（404）。

解法：`vite.config.ts` 的 `base` 改從環境變數讀取：

```ts
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
})
```

GitHub Actions workflow 在 build step 帶入 `VITE_BASE=/smartresume/`；本機 dev / build 不設就走 `/`，向後相容。

### Hardcoded 資源路徑修正

`HeroSection.vue` 原本：

```ts
return locale.value === 'en' ? '/resume_en.pdf' : '/resume_zh.pdf'
```

在 subpath 下會變成 `lewsi.ddns.net/resume_en.pdf` 而非 `lewsi.ddns.net/smartresume/resume_en.pdf`。改用 Vite 內建的 `import.meta.env.BASE_URL`：

```ts
const file = locale.value === 'en' ? 'resume_en.pdf' : 'resume_zh.pdf'
return `${import.meta.env.BASE_URL}${file}`
```

Grep 過 `src/` 確認只有這一處硬編碼。

### Workflow 設計決策

| 決策 | 選擇 | 原因 |
|------|------|------|
| 觸發機制 | `workflow_dispatch` only | 使用者明確要求「僅手動觸發」，避免每次 push 都部署 |
| SSH 方式 | 原生 openssh + rsync（非 `appleboy/ssh-action`）| 減少第三方 action 依賴；rsync `--delete` 自動清舊雜湊檔 |
| Node 版本 | 20 LTS | Vite 6 需要 Node 18+，20 為目前 LTS |
| Secrets 命名 | `VPS_HOST` / `VPS_USER` / `VPS_SSH_KEY` / `VPS_DEPLOY_PATH` | 通用化；日後換機器只改 secrets 不改 workflow |
| `base_path` 為 input | 可在觸發時臨時改 | 未來若要部署到其他 subpath 無需改 workflow |

### SSH key 安全

Workflow 在 `Configure SSH` 把私鑰寫入 `~/.ssh/deploy_key`，末尾用 `Cleanup SSH key` step（`if: always()`）確保失敗情境下也會刪掉。
`ssh-keyscan -H ${VPS_HOST}` 把主機公鑰加入 `known_hosts` 後啟用 `StrictHostKeyChecking=yes`，避免 MITM。

## 驗證

| 驗證項 | 指令 | 結果 |
|--------|------|------|
| Default build | `npm run build` | `dist/index.html` 資源走 `/assets/...` ✅ |
| Subpath build | `VITE_BASE=/smartresume/ npm run build` | `dist/index.html` 資源走 `/smartresume/assets/...` ✅ |
| PDF 連結 subpath 下 | Grep `dist/assets/*.js` | 檔名無前綴，運行時 `BASE_URL` 串接成 `/smartresume/resume_zh.pdf` ✅ |

## 使用者後續需自行完成

詳細步驟見 `docs/deployment.md`：

1. VPS 跑 `ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""`，公鑰加 `authorized_keys`
2. GitHub Settings → Secrets 新增 `VPS_HOST` / `VPS_USER` / `VPS_SSH_KEY` / `VPS_DEPLOY_PATH`
3. VPS 建立 `/home/lewsi/workspace/SmartResumeBuild/smartresume/` 目錄
4. 設定 Nginx `location /smartresume/` alias
5. GitHub Actions → `Deploy to VPS` → Run workflow

## Pre-existing 議題（不在此次 scope）

- `index.html:5` 的 `<link rel="icon" href="/vite.svg">` 指向不存在的 `public/vite.svg`，無論 subpath 與否都 404
- `index.html:16,19,25,28,31` 的 og:url / canonical / twitter meta 仍為 `https://example.com/`（測試占位）

兩者與本次部署無直接關係，可獨立開 task 修正。
