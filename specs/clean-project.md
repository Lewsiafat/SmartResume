# 專案結構清理

- **分支:** `chore/clean-project`
- **日期:** 2026-04-10

## 描述
整理專案結構，移除過時與重複的檔案，更新 .gitignore，使專案保持乾淨一致。

## 任務清單
- [x] 更新 `.gitignore`：加入 `temp/`（`.agent/` 和 `.gemini/` 保留，之後會放 skill）
- [x] 移除根目錄重複檔 `target_git_repos.md`
- [x] 移除 `deploy.skill`（無法使用的二進位檔）
- [x] 移除 `deploy_auto.exp`（expect 自動化腳本）
- [x] 移除 `new_design/` 目錄（舊版設計稿）
- [x] 清理 `ref_src/`：僅保留 `main.md`，移除其他過時履歷版本
- [x] 移除 `deploy.ps1`（macOS 環境不需要 PowerShell 腳本）
- [x] 移除已完成任務的舊 specs（add-demo-links、interview-intro）
- [x] 移除 `docs/ref_repos.md`（與 target_git_repos.md 重複）
- [x] 確認 build 正常運作
