---
name: jd-match
description: >
  JD 比對分析與客製化 Cover Letter 產生。讀取 ref_src/main.md 履歷 SSOT，
  與目標職缺 JD 進行技能/經驗匹配度分析，產出分析報告並自動生成 Cover Letter。
  Use when the user says "/jd-match", "JD 分析", "職缺比對", "cover letter",
  "求職信", "job match", "分析這個職缺", "幫我寫求職信",
  or wants to compare their resume against a job description.
---

# JD Match Analysis — 職缺比對分析與 Cover Letter 產生

## Overview

將使用者的履歷（`ref_src/main.md` SSOT）與目標職缺的 Job Description 進行深度比對，產出匹配度分析報告，並根據分析結果自動生成客製化 Cover Letter（中/英文）。

## Workflow

### Step 1: 取得 JD 內容

使用 AskUserQuestion 向使用者取得 JD：

1. 詢問使用者提供 JD 的方式：
   - **貼上文字** — 直接在對話中貼入 JD 內容
   - **提供 URL** — 給一個職缺頁面網址（使用 WebFetch 抓取）
   - **提供檔案路徑** — 本地檔案路徑（使用 Read 讀取）
2. 同時詢問目標公司名稱（用於檔案命名）
3. 取得 JD 內容後，提取以下關鍵資訊並顯示摘要讓使用者確認：
   - 職位名稱
   - 公司名稱
   - 必要技能 (Required Skills)
   - 加分技能 (Nice-to-have Skills)
   - 經驗年資要求
   - 其他關鍵條件（學歷、語言、工作地點等）

### Step 2: 讀取履歷 SSOT

讀取 `ref_src/main.md` 取得使用者完整履歷資料，包括：
- Professional Summary
- Core Skills（程式語言、框架、AI Stack、Specializations）
- Work Experience（各職位的職責與成就）
- Side Projects（技術棧與成果）

### Step 3: 匹配度分析

將 JD 需求與履歷進行逐項比對，產出分析：

**評分維度（各項 0-100 分）：**

| 維度 | 說明 |
|------|------|
| 技能匹配 | JD 要求的技術技能 vs 履歷中的技能 |
| 經驗匹配 | 年資要求 vs 實際經驗，職務類型相關性 |
| 專案相關性 | Side Projects 與 JD 領域的關聯程度 |
| 綜合匹配度 | 加權總分（技能 40%、經驗 35%、專案 25%） |

**分析內容：**
- ✅ **強項亮點** — 履歷中完全匹配或超越 JD 要求的項目
- ⚠️ **部分匹配** — 有相關經驗但不完全對口的項目
- ❌ **缺口分析** — JD 要求但履歷中缺乏的項目
- 💡 **建議** — 如何在面試或履歷中補強缺口

### Step 4: 產出分析報告

1. 讀取模板 `.claude/skills/jd-match/assets/analysis-template.md`
2. 填入分析結果
3. 寫入 `output/jd-analysis/{company}-{date}.md`
4. 在終端機顯示報告摘要

### Step 5: 產生 Cover Letter

1. 使用 AskUserQuestion 詢問使用者偏好：
   - 語言：中文 / 英文 / 中英雙版
   - 語氣：正式 / 專業但親切 / 熱情積極
   - 特別想強調的重點（可選）
2. 讀取模板 `.claude/skills/jd-match/assets/cover-letter-template.md`
3. 根據分析報告中的強項亮點，撰寫客製化 Cover Letter：
   - 開頭段：表達對職位的興趣，連結個人背景
   - 核心段：用 2-3 個具體事例展示與 JD 最匹配的能力
   - 結尾段：表達熱忱與後續行動
4. 寫入 `output/cover-letters/{company}-{date}.md`
5. 在終端機顯示 Cover Letter

### Step 6: 總結

顯示產出檔案清單與路徑：
```
📊 分析報告: output/jd-analysis/{company}-{date}.md
✉️ Cover Letter: output/cover-letters/{company}-{date}.md
```

詢問使用者是否需要調整或修改。

## Notes

- `ref_src/main.md` 是唯一的履歷資料來源，不從其他檔案讀取
- 分析應該誠實客觀，不誇大匹配度
- Cover Letter 應該自然流暢，避免模板感過重
- 日期格式使用 YYYY-MM-DD
- 公司名稱使用 kebab-case 作為檔案名（例如 `google-2026-04-14.md`）
- 若使用者只想要分析報告或只想要 Cover Letter，可以跳過對應步驟
- 輸出目錄 `output/` 已加入 `.gitkeep`，產出的報告和 Cover Letter 不需要 commit
