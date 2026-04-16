---
name: job-apply
description: >
  針對特定職缺建立獨立分支，客製化履歷與 Portfolio 網站。
  讀取 JD 分析報告或新 JD，透過對話調整 ref_src/main.md 內容，
  串接 update-resume skill 產出完整網站檔案與 PDF。
  Use when the user says "/job-apply", "應徵", "投履歷", "apply job",
  "客製化履歷", "tailor resume", "針對這個職缺", "準備應徵",
  or wants to customize their resume for a specific job application.
---

# Job Apply — 職缺應徵客製化流程

## Overview

針對特定職缺建立獨立 git 分支，根據 JD 分析結果客製化 `ref_src/main.md`，透過對話調整履歷內容以突出與該職缺最匹配的經歷，最後串接 `update-resume` skill 產出完整網站檔案與 PDF。每個職缺一個分支，`master` 保持通用版本不動。

## Workflow

### Step 1: 取得 JD 來源

使用 AskUserQuestion 詢問使用者 JD 來源：

1. **使用現有分析報告** — 列出 `output/jd-analysis/` 目錄下的所有 `.md` 檔案供選擇
2. **輸入新 JD** — 三種方式：
   - 貼上文字
   - 提供 URL（使用 WebFetch 抓取）
   - 提供本地檔案路徑（使用 Read 讀取）

若使用者選擇輸入新 JD，先執行 jd-match 的分析流程（Step 3 匹配度分析），產出分析報告到 `output/jd-analysis/`。

同時詢問：
- **公司名稱**（kebab-case，用於分支與檔案命名）
- **職位名稱**（kebab-case，用於分支命名）

### Step 2: 建立應徵分支

從 `master` 建立獨立分支：

```bash
git checkout master
git checkout -b apply/{company}-{position}
```

例如：`apply/google-senior-frontend`、`apply/line-fullstack`

確認分支建立成功後告知使用者。

### Step 3: 讀取分析報告與履歷

1. 讀取 JD 分析報告（來自 Step 1 選定或新產出的報告）
2. 讀取 `ref_src/main.md`（目前的通用版履歷）
3. 整理出客製化建議摘要，顯示給使用者：

```
## 客製化建議

### 根據 JD 分析（匹配度: XX/100）

**建議強化：**
- [從分析報告的 ✅ 強項中提取，建議在履歷中更突出的項目]

**建議補充：**
- [從分析報告的 ⚠️ 部分匹配中提取，建議在履歷中補上的項目]

**建議調整：**
- [從分析報告的 ❌ 缺口中提取，可透過措辭調整來縮小差距的項目]
```

### Step 4: 客製化 main.md

讀取 `.claude/skills/job-apply/assets/customization-guide.md` 作為調整策略參考。

依序與使用者討論並調整以下區段，每個區段：
1. 顯示目前內容
2. 根據 JD 分析提出具體修改建議
3. 使用 AskUserQuestion 讓使用者選擇：套用建議 / 自行修改 / 跳過
4. 確認後使用 Edit 更新 `ref_src/main.md`

**調整順序：**

#### 4a. Professional Summary
- 根據 JD 的職位描述調整摘要方向
- 突出與目標職缺最相關的經驗與技能
- 加入 JD 中的關鍵字以通過 ATS 篩選

#### 4b. Core Skills
- 調整 Skill Bars 百分比順序，將 JD 最需要的技能排前面
- 補充 JD 要求但目前未列出的技能（如 SCSS、UI Library）
- 調整 Tech Stack 分類，突出相關技術

#### 4c. Work Experience
- 強化與 JD 最相關的工作成就描述
- 補充 JD 提到但履歷中未明確展示的經驗
- 調整用詞以匹配 JD 的關鍵字

#### 4d. Side Projects
- 調整專案描述以突出與 JD 相關的技術
- 重排專案順序，最相關的排前面
- 考慮是否需要調整 tags 或 stats

#### 4e. Hero / About
- 調整 subtitle 和 typing text 以呼應目標職位
- 調整 about 的 focus 項目以匹配 JD 方向

### Step 5: 產出完整網站與 PDF

客製化完成後，告知使用者：

> main.md 客製化完成。接下來會執行 update-resume 流程，將變更同步到網站檔案並產出 PDF。

依序執行 update-resume skill 的同步流程：
1. Web Sync — 同步 `src/data/*.ts` 和 `src/i18n/*.ts`
2. 履歷 Markdown Sync — 同步 `ref_src/resume_new.md` 和 `ref_src/resume_en.md`
3. PDF 產出 — 使用 mdpdf 產出 `public/resume_zh.pdf` 和 `public/resume_en.pdf`
4. 執行 `npm run build` 驗證無錯誤

### Step 6: 總結

顯示完成摘要：

```
## 應徵準備完成

**目標職缺:** {position} @ {company}
**分支:** apply/{company}-{position}
**匹配度:** XX/100

### 產出檔案
- 📄 客製化履歷: ref_src/main.md (此分支)
- 📊 JD 分析報告: output/jd-analysis/{company}-{date}.md
- 📝 中文 PDF: public/resume_zh.pdf
- 📝 英文 PDF: public/resume_en.pdf
- 🌐 網站檔案: 已同步更新

### 後續動作
- `npm run dev` 預覽客製化後的網站
- `git checkout master` 切回通用版本
- 此分支可獨立部署或匯出 PDF 使用
```

詢問使用者是否需要進一步調整。

## Notes

- `master` 分支永遠保持通用版履歷，不在 master 上做客製化修改
- 每個應徵職缺一個獨立分支，方便管理與切換
- 客製化過程中的所有修改都只影響當前分支的 `ref_src/main.md`
- 分析報告（`output/jd-analysis/`）是共享的，不隨分支變動
- 若使用者想修改已存在的應徵分支，直接 checkout 該分支繼續調整
- 客製化應保持誠實，不虛構經驗，只是調整呈現方式與重點
- 與 `jd-match` skill 共用分析邏輯，與 `update-resume` skill 共用同步邏輯
