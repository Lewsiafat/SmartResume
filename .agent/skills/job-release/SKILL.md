---
name: job-release
description: >
  應徵資料包封存與交付。在 apply/* 分支完成客製化後，
  打包保存整套應徵資料（PDF、JD 分析、Cover Letter、網站建置），
  產出交付記錄文件並 commit 保存。
  Use when the user says "/job-release", "封存", "打包", "release 應徵",
  "交付", "archive", "package application", "保存應徵資料",
  or wants to archive a completed job application package.
---

# Job Release — 應徵資料包封存與交付

## Overview

在 `apply/*` 分支完成履歷客製化後，將所有應徵相關產出（PDF、JD 分析報告、Cover Letter、客製化履歷快照、網站建置）封存到 `output/releases/{company}-{date}/`，並產出交付記錄文件，最後在分支上 commit 保存完整封存。

## Workflow

### Step 1: 確認狀態

1. 取得目前分支名稱，確認是 `apply/*` 格式
   - 若不在 `apply/*` 分支上，提示使用者先切換到正確分支
   - 若在 `master` 上，提示應先執行 `/job-apply` 建立應徵分支
2. 從分支名稱解析 `{company}` 和 `{position}`（如 `apply/google-senior-frontend` → company=`google`, position=`senior-frontend`）
3. 執行 `git status` 確認工作目錄狀態
4. 確認 `ref_src/main.md` 已被客製化（與 master 版本有差異）：
   ```bash
   git diff master -- ref_src/main.md
   ```
   若無差異，警告使用者尚未客製化履歷

### Step 2: Build 網站

1. 執行 `npm run build` 產出 `dist/` 目錄
2. 確認 build 成功（無錯誤）
3. 若 build 失敗，停下來請使用者修復

### Step 3: 確認 PDF

1. 檢查 `public/resume_zh.pdf` 和 `public/resume_en.pdf` 是否存在
2. 若不存在或檔案過舊，執行 PDF 產出：
   ```bash
   npx mdpdf ref_src/resume_new.md && mv ref_src/resume_new.pdf public/resume_zh.pdf
   npx mdpdf ref_src/resume_en.md && mv ref_src/resume_en.pdf public/resume_en.pdf
   ```
3. 確認 PDF 檔案大小合理（> 1KB）

### Step 4: 封存資料包

建立封存目錄 `output/releases/{company}-{date}/`，複製以下檔案：

```bash
mkdir -p output/releases/{company}-{date}

# 必要檔案
cp public/resume_zh.pdf output/releases/{company}-{date}/
cp public/resume_en.pdf output/releases/{company}-{date}/
cp ref_src/main.md output/releases/{company}-{date}/main-snapshot.md

# JD 分析報告（搜尋匹配的檔案）
cp output/jd-analysis/{company}*.md output/releases/{company}-{date}/jd-analysis.md 2>/dev/null

# Cover Letter（搜尋匹配的檔案）
cp output/cover-letters/{company}*.md output/releases/{company}-{date}/cover-letter.md 2>/dev/null

# 網站建置產出
cp -r dist/ output/releases/{company}-{date}/dist/
```

若 JD 分析報告或 Cover Letter 找不到匹配檔案，使用 AskUserQuestion 詢問使用者是否要手動指定路徑或跳過。

### Step 5: 撰寫交付文件

1. 讀取模板 `.claude/skills/job-release/assets/release-readme-template.md`
2. 取得客製化改動摘要：
   ```bash
   git diff master -- ref_src/main.md
   git diff master --stat
   ```
3. 填入模板，產出 `output/releases/{company}-{date}/README.md`：
   - 目標職缺資訊（公司、職位、日期）
   - 匹配度分數（從 JD 分析報告讀取）
   - 客製化改動摘要（從 master 的 diff 歸納）
   - 封存檔案清單與說明
   - 分支名稱（方便日後找回完整程式碼）

### Step 6: Commit 封存

1. 將封存目錄加入 staging：
   ```bash
   git add output/releases/{company}-{date}/
   ```
2. 以 `release({company}): archive application package for {position}` 格式 commit
3. 顯示完成摘要

### Step 7: 總結

顯示封存結果：

```
## 應徵資料包已封存

**目標職缺:** {position} @ {company}
**封存日期:** {date}
**分支:** apply/{company}-{position}

### 封存內容
📁 output/releases/{company}-{date}/
├── 📄 README.md          — 交付記錄
├── 📝 resume_zh.pdf      — 中文履歷
├── 📝 resume_en.pdf      — 英文履歷
├── 📋 main-snapshot.md   — 客製化履歷快照
├── 📊 jd-analysis.md     — JD 分析報告
├── ✉️ cover-letter.md    — Cover Letter
└── 🌐 dist/              — 網站建置

### 後續動作
- 此分支保留完整客製化程式碼
- `git checkout master` 切回通用版本
- 需要修改時隨時 checkout 回此分支
```

## Notes

- 此 skill 只在 `apply/*` 分支上執行，不動 master
- 不修改 CLAUDE.md 或任何專案設定檔
- 封存目錄 `output/releases/` 不需要推送到 remote
- 若同一公司同一天重複封存，在日期後加序號（如 `google-2026-04-15-2`）
- dist/ 目錄可能較大，commit 時注意體積
- 交付文件的改動摘要應以人類可讀的方式呈現，不是原始 diff
