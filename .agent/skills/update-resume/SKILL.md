---
name: update-resume
description: >
  基於 main.md SSOT 的履歷更新 skill。透過 guided Q&A 更新 ref_src/main.md，
  並提供互動式 web sync 將變更同步至網站檔案。
  Use when the user says "/update-resume", "update resume", "edit resume", "更新履歷",
  "更新 main.md", "新增專案到履歷", "add project to resume", "改履歷", "修改履歷",
  "resume update", "更新 CV", "修改 CV", or "履歷改版".
---

# Update Resume — 基於 SSOT 的履歷更新

## Overview

以 `ref_src/main.md` 為單一資料源（Single Source of Truth），透過 guided Q&A 引導使用者更新履歷內容，完成後提供互動式 web sync 將變更同步至網站檔案。

## File Locations

- **SSOT 主檔**: `ref_src/main.md`
- **設計規格**: `docs/superpowers/specs/2026-04-09-resume-single-source-of-truth-design.md`
- **Web 同步目標**:
  - `src/i18n/zh-TW.ts` — 繁體中文翻譯
  - `src/i18n/en.ts` — 英文翻譯
  - `src/data/projects.ts` — 專案資料
  - `src/data/skills.ts` — 技能進度條
  - `src/data/techStack.ts` — 技術棧分類
  - `src/data/stats.ts` — GitHub 統計
- **中文履歷 Markdown**: `ref_src/resume_zh.md`
- **英文履歷 Markdown**: `ref_src/resume_en.md`
- **中文 PDF**: `public/resume_zh.pdf`
- **英文 PDF**: `public/resume_en.pdf`

## Workflow

### Step 1: 讀取 main.md

讀取 `ref_src/main.md` 的完整內容，解析出所有 `## Section` 區段。

### Step 2: 詢問更新項目

使用 AskUserQuestion 詢問使用者要更新什麼：

```
你想更新履歷的哪個部分？

1. 新增專案 (Side Project)
2. 更新現有專案
3. 更新 About / Hero 區段
4. 更新 Core Skills / Tech Stack
5. 更新 Work Experience
6. 更新 GitHub Stats
7. 更新 Contact 資訊
8. 更新 Education (學歷)
9. 其他

請輸入編號或直接描述你想更新的內容：
```

### Step 3: Guided Q&A

根據使用者選擇，逐一引導輸入相關欄位。

#### 新增專案範例流程：

依序使用 AskUserQuestion 詢問以下欄位（每次一個或相關的一組）：

1. **id** — 用於 i18n key 的駝峰式 ID（如 `myNewProject`）
2. **Emoji** — 代表專案的 emoji
3. **Category** — FinTech / IoT / AI Tools / Full-Stack / Game
4. **Tags** — 技術標籤（逗號分隔）
5. **Stats** — 兩個亮點數據（如 `⭐ 5 Stars, 🚀 Production`）
6. **GitHub** — GitHub 連結
7. **Demo** — Demo 連結（選填）
8. **Title（zh-TW）** 和 **Title（en）**
9. **Subtitle（zh-TW）** 和 **Subtitle（en）**
10. **Description（zh-TW）** 和 **Description（en）**
11. **Achievements** — 重點成果（bullet list）

#### 更新 Education（學歷）：

學歷可有多筆，依時間新到舊排序（學位高的在前）。對每一筆學歷，使用 AskUserQuestion 依序詢問：

1. **學校（zh-TW）** 和 **學校（en）** — 如「範例大學」/「Sample University」
2. **科系（zh-TW）** 和 **科系（en）** — 如「資訊工程學系」/「Computer Science and Engineering」
3. **學位** — 學士 / 碩士 / 博士（自動對應 BS / MS / PhD；高中可填「高中畢業」）
4. **起訖年份** — 如 `2013年 - 2017年` 或 `YYYY - YYYY`
5. **備註**（選填）— GPA、實驗室、論文題目、社團經歷、雙主修等

寫入 `main.md` 時於 `## Education` 區段（位置介於 `## Work Experience` 與 `## Side Projects` 之間）插入：

```
### 資訊工程學系 (Computer Science and Engineering) | 範例大學 (Sample University)
*2013年 - 2017年 (學士 / BS)*

*   主修軟體工程與分散式系統，畢業專題以 Vue.js 與 Node.js 實作協作型任務管理平台。
*   GPA 3.8 / 4.0，連續兩學期獲書卷獎。
```

若 `main.md` 尚未有 `## Education` 區段，需於 Step 4 一併新增該區段標題。

#### 更新其他區段：

- 顯示該區段目前在 `main.md` 中的內容
- 使用 AskUserQuestion 詢問修改方式：
  - 直接貼上新內容
  - 口述要修改的重點，由 AI 協助改寫
  - 跳過（不修改）
- 顯示修改預覽，確認後套用

### Step 4: 更新 main.md

將確認的變更寫入 `ref_src/main.md`，遵循以下格式規範：

- `## Section Name` 區段標題
- `### Item Name` 區段內項目（專案、工作、學歷）
- `**Key:** Value` 單語言欄位
- `**Key（zh-TW）：** Value` 和 `**Key（en）：** Value` 雙語欄位
- 技能百分比格式：`Python (90%)`
- Education 條目格式：`### 系所 (Department) | 學校 (School)` + `*起訖 (學位)*` + bullet list

### Step 5: 提供 Web Sync

更新 `main.md` 後，詢問使用者：

> main.md 已更新完成。是否要同步變更到網站檔案？我會先顯示每個檔案的變更內容，讓你確認後再套用。

若使用者同意，執行 web sync（見下方 Web Sync Logic）。

### Step 6: 同步履歷 Markdown

將 `main.md` 的變更同步到履歷用的 markdown 檔案：

1. **讀取 `ref_src/resume_zh.md`**（中文）和 `ref_src/resume_en.md`（英文）
2. **比對 `main.md` 的變更**，找出需要同步的區段：
   - Side Projects 變更 → 同步到兩份履歷的「個人專案與開源貢獻」區段
   - Core Skills 變更 → 同步到「核心技能」區段
   - Work Experience 變更 → 同步到「工作經歷」區段
   - Professional Summary 變更 → 同步到「專業摘要」區段
   - Header（職稱、聯絡）變更 → 同步到履歷標頭
   - Education 變更 → 同步到「學歷 (Education)」區段（位於工作經歷之後、個人專案之前；若履歷尚未有此區段，需一併新增）
3. **更新 `ref_src/resume_zh.md`** — 將中文內容寫入對應區段
4. **更新 `ref_src/resume_en.md`** — 翻譯為英文寫入對應區段
   - 翻譯注意事項：
     - 保持專業履歷語氣，使用主動動詞開頭（Led, Designed, Implemented...）
     - 公司名稱維持英文翻譯一致性
     - 技術名詞保持原文不翻譯
     - 學校名稱維持英文翻譯一致性（如元智大學 → Yuan-Ze University、銘傳大學 → Ming Chuan University）
     - 學位採英文簡寫（碩士 → MS、學士 → BS、博士 → PhD）
     - 科系名稱使用通用英譯（如資訊工程 → Computer Science and Engineering）

**注意：** 履歷 markdown 的格式與 `main.md` 不同 — 履歷版不含 `**Key（lang）：**` 雙語標記，而是純文本的履歷排版格式。每個專案包含：專案名、粗體副標題、專案概述、技術架構、主要成效（bullet list）、GitHub 連結。學歷條目包含：學校、系所、學位、起訖時間、備註 bullet list。

### Step 7: 產出 PDF

從更新後的履歷 markdown 產出 PDF：

```bash
# mdpdf 的 --output 參數不可靠，改用 mv
npx mdpdf ref_src/resume_zh.md
mv ref_src/resume_zh.pdf public/resume_zh.pdf

npx mdpdf ref_src/resume_en.md
mv ref_src/resume_en.pdf public/resume_en.pdf
```

驗證：
- 確認 `public/resume_zh.pdf` 和 `public/resume_en.pdf` 存在
- 檔案大小合理（> 1KB）
- 若 `mdpdf` 不可用，告知使用者安裝：`npm install -g mdpdf`

### Step 8: 完成摘要

輸出更新摘要，列出所有修改的檔案與變更內容。建議格式：

```
履歷更新完成！本次變更：

📝 SSOT：
  - ref_src/main.md ✅

📄 履歷 Markdown：
  - ref_src/resume_zh.md ✅
  - ref_src/resume_en.md ✅

📑 PDF：
  - public/resume_zh.pdf ✅ (xxx KB)
  - public/resume_en.pdf ✅ (xxx KB)

🎓 學歷異動：
  - [有/無] — 若有，列出新增或修改的學歷條目（僅影響履歷，不同步到網站）

🌐 網站同步：
  - src/i18n/zh-TW.ts — [更新了 xxx]
  - src/i18n/en.ts — [更新了 xxx]
  - (其他有更動的 src/data/*.ts 檔案)

💡 提醒：記得 commit 這些變更並重新部署網站。
```

---

## Web Sync Logic

### Sync 對應表

| main.md 區段 | 目標檔案 | 目標 key / 結構 |
|---|---|---|
| Hero | `src/i18n/zh-TW.ts`, `src/i18n/en.ts` | `hero.subtitle`, `hero.typingText1`-`4` |
| About | `src/i18n/zh-TW.ts`, `src/i18n/en.ts` | `about.subtitle`, `about.whatIDoContent`, `about.focus1`-`3` |
| Core Skills > Skill Bars | `src/data/skills.ts` | `SkillBar[]` — name + percentage |
| Core Skills > Categories | `src/data/techStack.ts` | `TechCategory[]` — id, icon, items |
| Core Skills > Categories | `src/i18n/zh-TW.ts`, `src/i18n/en.ts` | `techStack.{id}` labels |
| Side Projects | `src/data/projects.ts` | `Project[]` — id, emoji, category, tags, stats, github, demo |
| Side Projects | `src/i18n/zh-TW.ts`, `src/i18n/en.ts` | `projects.{id}.title`, `.subtitle`, `.description` |
| GitHub Stats | `src/data/stats.ts` | `GitHubStat[]` — id + value |
| Contact | `src/i18n/zh-TW.ts`, `src/i18n/en.ts` | `contact.locationValue`, `contact.interest1`-`4` |
| Professional Summary | — | 僅限履歷，不同步到網站 |
| Work Experience | — | 僅限履歷，不同步到網站 |
| Education | — | 僅限履歷，不同步到網站 |

### Sync 流程

1. 讀取 `main.md` 中被修改的區段
2. 讀取對應的目標檔案
3. 解析 `main.md` 中的結構化資料（`**Key（lang）：** Value` 等模式）
4. 與目標檔案的現有值進行比對
5. **對每個會變更的檔案**，顯示 diff 並使用 AskUserQuestion 確認：
   ```
   以下是 src/i18n/zh-TW.ts 的變更：
   
   - hero.subtitle: 'FinTech 開發者 | AI協同開發者 | AI 工具打造者'
   + hero.subtitle: 'FinTech 開發者 | AI協同開發者 | 系統架構師'
   
   套用此變更？(y/n)
   ```
6. 使用者確認後，執行 Edit 修改

### Parsing 規則

- `## Section Name` → 定位區段邊界
- `### Item Name` → 定位區段內的個別項目
- `**Key（zh-TW）：** Value` → 提取中文值
- `**Key（en）：** Value` → 提取英文值
- `**Key:** Value` → 提取語言無關的值
- `- Name (N%)` → 提取技能名稱和百分比（Skill Bars）
- `- Item` → 提取清單項目（Tech Stack items）

## Notes

- `main.md` 是唯一的資料源，所有更新都先寫入 `main.md`，再透過 sync 推送到網站檔案
- 網站檔案不應直接修改履歷相關資料，應透過此 skill 從 `main.md` 同步
- Professional Summary、Work Experience 與 Education 為純履歷內容，不同步到網站
- 此 skill 取代舊版 `update-resume` skill，以 SSOT 模式管理所有履歷資料
