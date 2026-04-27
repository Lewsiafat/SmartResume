# Add Education section to resume SSOT and PDFs — Walkthrough

- **分支:** `feat/add-education-section`
- **日期:** 2026-04-27

## 變更摘要

把 Education / 學歷正式整合進 `update-resume` SSOT 流程：在 `ref_src/main.md` 新增 `## Education` 區段、同步到中英文履歷 markdown、重生 PDF；同時把 `update-resume` skill 文件從「薄薄的 menu 加一項」升級為「完整 workflow 整合」（menu / Education-specific 提示 / 翻譯慣例 / web sync 跳過 / 完成摘要學歷欄位）。順帶修復 SKILL.md 從 Apr 11 建立時就帶錯的檔名引用 (`resume_new.md` → `resume_zh.md`)，PDF 步驟現在能直接照命令跑成。

## 修改的檔案

| 檔案 | 變更 |
|---|---|
| `.claude/skills/update-resume/SKILL.md` / `.agent/skills/update-resume/SKILL.md` | 兩份對稱重寫：Step 2 menu 加 Education；Step 3 加 Education 專屬 Q&A 子節（學校 zh/en、系所 zh/en、學位、起訖、選填備註）+ 寫入格式範例；Step 4 列表加 Education item 結構；Step 6 sync 規則與翻譯注意事項加學校名稱／學位簡寫；Step 7 PDF 命令修檔名為 `resume_zh.md`；Step 8 完成摘要加「學歷異動」欄位；Sync 對應表多一列 `Education → 僅限履歷`；Notes 第三點同步加上 Education；File Locations 移除已不存在的 `resume_full.md` / `resume_updated.md` 行 |
| `ref_src/main.md` | 在 Work Experience 與 Side Projects 之間插入 `## Education`，含 sample 大學 + 高中兩筆條目，使用 `### 系所 (Department) | 學校 (School)` + `*起訖 (學位 / Abbr)*` + bullet list 格式 |
| `ref_src/resume_zh.md` | 在工作經歷後新增「學歷」段落，與履歷風格一致（`### 學校 | 系所（學位）` + `*起訖*` + bullet list） |
| `ref_src/resume_en.md` | 對稱新增 "Education" 段落（`### School | Degree in Department` + `*Years*` + bullet list） |
| `public/resume_zh.pdf`、`public/resume_en.pdf` | 透過 `npx mdpdf` 重新產出，PDF 文字驗證 Education 段落確實落在「工作經歷」之後、「精選專案」之前 |
| `specs/add-education-section.md` | 任務規格文件（cherry-pick 過程一併納入第二個 commit） |

## 技術細節

### 為什麼分成兩個 commit

- `ac1af39` 純資料層：SSOT (`main.md`) + 兩份履歷 markdown + 重生 PDF + spec —— 全部是新增 sample data，零 regression
- `dc43523` 純文件層：兩份對稱的 `update-resume/SKILL.md` 重寫 —— 把 Education workflow 整合進整個 skill，並順帶修檔名 bug

兩個 commit 各自獨立可以還原，方便日後 audit 與 cherry-pick。

### 為什麼中途 reset 過一次

最初的第一個 commit（`ac20deb` — 只在 menu 加一項）是「薄版」改動，沒整合進 workflow；翻 git history 時發現 `landingPage` 那邊（user 個人專案）`9b6ac53` 已有「Education 整合進整套 workflow」的成熟設計（menu / education-specific 提示 / 翻譯慣例 / sync 跳過 / 完成摘要），於是用 `git reset --hard 2755925` 回到 master，再 `git cherry-pick 2d2cdb1` 把第二個（資料層）commit 帶回來，之後在乾淨基礎上重寫 SKILL.md，避免「薄版 + 完整版」混在 history。被 drop 的 `ac20deb` 仍在 reflog（30 天可救）。

### Education 是 resume-only 的設計選擇

學歷不像專案 / 技能 / 工作經歷需要展示在 portfolio 網站上，所以 Education 在 sync 對應表標 `—`（僅限履歷），不寫入 `src/data` / `src/i18n`。Skill 的 Step 6 sync 規則、Notes、Step 8 完成摘要都明確標示這一點，使用者跑 `/update-resume` 時不會被多餘的網站同步問題打擾。

### SmartResume 與 landingPage 的關係（為了避免日後混淆）

- `landingPage`：user 個人 portfolio repo（含真實工作經歷、學校）。檔案結構保留 `resume_new.md`、`resume_full.md`、`resume_updated.md`
- `SmartResume`：fork-friendly 範例 template，已 sanitize 為 sample data；檔案結構簡化為 `main.md` + `resume_zh.md` + `resume_en.md`
- 兩者的 `update-resume` SKILL.md 在 `78516ab`（SmartResume 建立日）後就分流：landingPage 持續演進並加上 Education；SmartResume 一直停留在 landingPage 早期的簡化版（且檔名沒同步改）。本次只動 SmartResume 端，landingPage 完全沒被觸碰

## 任務清單（已完成）

- [x] 收集學歷資料（用 sample data 寫入：範例大學 + 範例高級中學）
- [x] `ref_src/main.md` 新增 `## Education` section
- [x] `ref_src/resume_zh.md` 新增「學歷」段落
- [x] `ref_src/resume_en.md` 新增 "Education" 段落
- [x] 重新產出 `public/resume_zh.pdf` / `public/resume_en.pdf` 並抽 PDF 文字驗證
- [x] commit `.agent/` 與 `.claude/` 兩份 SKILL.md（feat scope，含 workflow 整合）
- [x] commit SSOT + 履歷 markdown + PDF 變更
- [x] `npm run build` 通過（858ms / 1.00s 兩次都 OK）
- [x] 順帶修復 SKILL.md 的 `resume_new.md` 舊檔名 bug（5 處）
