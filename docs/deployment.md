# Deployment — VPS + GitHub Actions

本文件說明如何透過 GitHub Actions 手動觸發 `Deploy to VPS` workflow，將 Portfolio 靜態網站部署到自有 VPS（Nginx 架設）。

## 架構

```
GitHub master → (manual) workflow_dispatch → GitHub Actions runner
    ↓ npm ci → npm run build (VITE_BASE=/smartresume/)
    ↓ rsync dist/ → VPS
VPS: /home/lewsi/workspace/SmartResumeBuild/smartresume/  ← Nginx root
    ↓
https://lewsi.ddns.net/smartresume/
```

## 一次性設定（僅需做一次）

### 1. 在 VPS 上產生 deploy key

SSH 登入 VPS 後執行：

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -C "github-actions-deploy" -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

> `-N ""` 代表 passphrase 為空，GitHub Actions 無法互動輸入密碼。此 key 僅供部署用途，請勿與個人 SSH key 混用。

### 2. 將 deploy key 私鑰複製下來

```bash
cat ~/.ssh/github_deploy
```

整段（包含 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）都要複製。

### 3. 在 GitHub 設定 Repository Secrets

GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**，依序新增：

| Name | Value | 說明 |
|------|-------|------|
| `VPS_HOST` | `lewsi.ddns.net` | VPS 連線位址（domain 或 IP） |
| `VPS_USER` | `lewsi` | SSH 使用者名稱 |
| `VPS_SSH_KEY` | 步驟 2 複製的整段私鑰 | Deploy key 私鑰 |
| `VPS_DEPLOY_PATH` | `/home/lewsi/workspace/SmartResumeBuild/smartresume` | 部署目標目錄（不要加結尾斜線） |

### 4. 在 VPS 建立目標目錄並設定 Nginx

建立目錄：

```bash
mkdir -p /home/lewsi/workspace/SmartResumeBuild/smartresume
```

Nginx server block 範例（請依實際站台調整，並記得 `nginx -t && systemctl reload nginx`）：

```nginx
server {
    listen 80;
    server_name lewsi.ddns.net;

    location /smartresume/ {
        alias /home/lewsi/workspace/SmartResumeBuild/smartresume/;
        try_files $uri $uri/ /smartresume/index.html;
        index index.html;
    }
}
```

> 後續若要啟用 HTTPS，可用 `certbot --nginx -d lewsi.ddns.net` 自動設定 Let's Encrypt 憑證。

## 觸發部署

1. 進入 GitHub repo → **Actions** 頁
2. 左側選 `Deploy to VPS`
3. 右上角 `Run workflow`
4. `base_path` 預設 `/smartresume/`，如不需要調整直接按綠色按鈕
5. 約 1-2 分鐘後 workflow 綠勾，網站更新完成

## 本機驗證 build（非部署）

```bash
# 模擬 CI build，產出與 CI 相同的 subpath 資源路徑
VITE_BASE=/smartresume/ npm run build

# 本機預覽（走 preview 模式）
npm run preview -- --base /smartresume/
```

打開 `dist/index.html` 可看到 `<script src="/smartresume/assets/xxx.js">` 前綴已加上。

## 疑難排解

| 症狀 | 可能原因 |
|------|---------|
| Workflow 在 `Configure SSH` 步失敗 | `VPS_SSH_KEY` 格式錯誤（可能複製時遺漏頭尾、或換行被刪除）|
| `rsync` 連不上，`Connection refused` | SSH port 非 22；請在 `-e "ssh -p xxxx ..."` 加 port，或在 VPS 的 `~/.ssh/config` 設定 |
| `rsync` 連上但 `Permission denied` | VPS 目標路徑權限不足；`chown -R $USER:$USER /path` |
| 部署後網站 404 | Nginx `alias` 路徑錯誤或 `try_files` 未導 SPA fallback |
| 資源（JS/CSS）404 | `VITE_BASE` 未正確傳入，或 Nginx location 未對齊 subpath |

## 替換預設部署位址

如果日後要改部署到別處（例如換到 `example.com/app/`）：

- 更新 GitHub secrets 的 `VPS_HOST` / `VPS_USER` / `VPS_DEPLOY_PATH`
- 觸發 workflow 時於 `base_path` 輸入新 subpath（例如 `/app/`）
- 更新 README 的 Live Demo URL

**不需要**改 workflow 檔案本身。
