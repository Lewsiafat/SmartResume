---
name: add-vps-deploy-ci
description: GitHub Actions 手動觸發 build + rsync deploy 到 VPS
type: feat
---

# Add VPS Deploy CI — GitHub Actions 手動部署

- **分支:** `feat/add-vps-deploy-ci`
- **日期:** 2026-04-20

## 描述

建立手動觸發的 GitHub Actions workflow，執行 `npm run build` 後透過 SSH + rsync 將 `dist/` 部署到 VPS (`lewsi.ddns.net`) 的 Nginx 目錄。同時調整 Vite 設定支援 subpath 部署（`/smartresume/`），並更新 README Live Demo URL 指向實際部署位址。

## 背景與決策

| 項目 | 決策 |
|------|------|
| 目標網址 | `https://lewsi.ddns.net/smartresume/`（subpath 部署） |
| VPS 路徑 | `/home/lewsi/workspace/SmartResumeBuild/smartresume/` |
| Web server | Nginx（使用者自行設定 server block） |
| 觸發時機 | 僅 `workflow_dispatch`（手動觸發） |
| SSH key | 使用者自行在 VPS 產生專用 deploy key，公鑰加到 `~/.ssh/authorized_keys`，私鑰貼到 GitHub secret |

### Subpath 部署的影響

URL `lewsi.ddns.net/smartresume/` 代表 Vite build 的 JS/CSS 資源路徑必須帶 `/smartresume/` 前綴，否則瀏覽器會到根目錄撈資源（404）。
做法：`vite.config.ts` 的 `base` 改從 `process.env.VITE_BASE` 讀取；CI build 時帶 `VITE_BASE=/smartresume/`，local dev 不設就走預設 `/`。

## 任務清單

- [x] 修改 `vite.config.ts`：`base` 改讀取 `process.env.VITE_BASE`，未設時 fallback 為 `/`
- [x] 建立 `.github/workflows/deploy.yml`：
  - [x] `on: workflow_dispatch` 只允許手動觸發
  - [x] Steps: checkout → setup-node → `npm ci` → `npm run build`（帶 `VITE_BASE`）→ SSH + rsync 部署
  - [x] 使用 `webfactor/ssh-agent` 或 `appleboy/ssh-action` / `appleboy/scp-action` 或純 rsync 走 openssh
  - [x] 使用 secrets：`VPS_HOST`、`VPS_USER`、`VPS_SSH_KEY`、`VPS_DEPLOY_PATH`（允許使用者日後換伺服器無須改 workflow）
- [x] 在 `docs/deployment.md` 撰寫 SSH deploy key 產生與 GitHub secrets 設定步驟
- [x] 更新 `README.md` 與 `README.en.md` 的 Live Demo placeholder → `https://lewsi.ddns.net/smartresume/`
- [x] 本機 dry-run 驗證：
  - [x] `npm run dev` 無 base 設定時正常
  - [x] `VITE_BASE=/smartresume/ npm run build` 產出 `dist/index.html` 內的資源路徑有 `/smartresume/` 前綴
- [x] 產出 walkthrough `specs/add-vps-deploy-ci-walkthrough.md`（於 `/finish-task` 時建立）

## 使用者後續需自行完成

1. 在 VPS 執行 `ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -C "github-actions-deploy"` 產生 deploy key
2. 將公鑰 `~/.ssh/github_deploy.pub` 加到 `~/.ssh/authorized_keys`
3. 在 GitHub repo → Settings → Secrets and variables → Actions 新增以下 secrets：
   - `VPS_HOST` = `lewsi.ddns.net`
   - `VPS_USER` = `lewsi`（或實際 SSH 使用者）
   - `VPS_SSH_KEY` = 私鑰 `~/.ssh/github_deploy` 的完整內容
   - `VPS_DEPLOY_PATH` = `/home/lewsi/workspace/SmartResumeBuild/smartresume`
4. 設定 Nginx server block 將 `/smartresume/` location 指到 `/home/lewsi/workspace/SmartResumeBuild/smartresume/`
5. 到 GitHub Actions 頁面手動執行 `Deploy to VPS` workflow
