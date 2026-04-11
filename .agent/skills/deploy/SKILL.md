---
name: deploy
description: 部署專案到生產環境 VPS。執行 build 並使用 rsync 透過 SSH 上傳 dist/ 到遠端伺服器。使用時機：當用戶說「部署」、「deploy」、「上傳到 VPS」、「發布到生產環境」時觸發此 skill。
---

# 部署到生產環境

將專案建置並部署到 VPS 伺服器。

## VPS 設定

- **主機**: example.com
- **用戶名**: deploy-user
- **遠端路徑**: /home/deploy-user/workspace/landingPage

## 執行指令

直接執行部署腳本（SSH 會提示輸入密碼）：

```bash
bash .claude/skills/deploy/scripts/deploy.sh
```

## 部署流程

1. 執行 `npm run build` 建置專案
2. SSH 連線建立遠端目錄
3. 使用 rsync 同步 dist/ 到 VPS
