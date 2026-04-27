# Add Education section to resume SSOT and PDFs

- **分支:** `feat/add-education-section`
- **日期:** 2026-04-27

## 描述

在 `update-resume` skill 已加入 Education menu 的基礎上，補上實際的 SSOT 與履歷內容。讓 skill 文件、`ref_src/main.md`、`ref_src/resume_zh.md`、`ref_src/resume_en.md` 三方一致，並重新產出 PDF。

Education 屬於「履歷限定」內容，不同步到網站 `src/data` / `src/i18n`（與 Professional Summary、Work Experience 同類）。

## 影響範圍

- ✏️ `.agent/skills/update-resume/SKILL.md`、`.claude/skills/update-resume/SKILL.md`（已修改，待 commit）
- ✏️ `ref_src/main.md` — 新增 `## Education` section，位於 Work Experience 與 Side Projects 之間
- ✏️ `ref_src/resume_zh.md`、`ref_src/resume_en.md` — 新增學歷段落
- ✏️ `public/resume_zh.pdf`、`public/resume_en.pdf` — 重新產出
- ❌ 網站 `src/data` / `src/i18n`（不受影響）

## 任務清單

- [x] 跟使用者收集學歷資料（用 sample data 寫入）
- [x] `ref_src/main.md` 新增 `## Education` section（位置：Work Experience 與 Side Projects 之間）
- [x] `ref_src/resume_zh.md` 新增「學歷」段落
- [x] `ref_src/resume_en.md` 新增 "Education" 段落
- [x] 重新產出 `public/resume_zh.pdf` / `public/resume_en.pdf`
- [x] commit `.agent/` 與 `.claude/` 兩份 SKILL.md（已升級為 workflow 整合，非單純 menu 改動）
- [x] commit SSOT + 履歷 markdown + PDF 變更
- [x] `npm run build` 確認沒打壞 Portfolio 網站
- [x] （計畫外）順帶修復 SKILL.md 從 `78516ab` 起就帶錯的檔名引用 `resume_new.md` → `resume_zh.md`
