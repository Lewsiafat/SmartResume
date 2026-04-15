# Job Apply Skill — Walkthrough

- **分支:** `feat/new-skill-job-apply`
- **日期:** 2026-04-15

## 變更摘要
新增 `/job-apply` skill，可針對特定職缺建立獨立 git 分支，客製化 ref_src/main.md 履歷內容，串接 update-resume 產出完整網站與 PDF。同時將 jd-match skill 從全域搬到專案層級。已完成實際測試驗證（apply/techcorp-senior-frontend 分支）。

## 修改的檔案

| 檔案 | 變更 | 說明 |
|------|------|------|
| `.claude/skills/job-apply/SKILL.md` | 新增 | Skill 定義檔，6 步驟 workflow（取得 JD → 建分支 → 分析建議 → 客製化 main.md → 產出網站+PDF → 總結） |
| `.claude/skills/job-apply/assets/customization-guide.md` | 新增 | 各區段調整策略指引，含 ATS 關鍵字優化建議 |
| `.claude/skills/jd-match/SKILL.md` | 搬移 | 從 `~/.claude/skills/jd-match/` 搬到專案層級，更新模板路徑引用 |
| `.claude/skills/jd-match/assets/analysis-template.md` | 搬移 | 分析報告模板 |
| `.claude/skills/jd-match/assets/cover-letter-template.md` | 搬移 | Cover Letter 模板 |
| `specs/new-skill-job-apply.md` | 新增 | 任務規格文件 |

## 技術細節

- **Skill 架構**: 6 步驟 workflow，支援讀取現有 jd-analysis 報告或新輸入 JD，以 `apply/{company}-{position}` 格式建立獨立分支
- **客製化策略**: 依序調整 Professional Summary → Core Skills → Work Experience → Side Projects → Hero/About，每步提供 AI 建議供使用者選擇
- **串接機制**: 與 jd-match（分析）和 update-resume（同步+PDF）兩個現有 skill 協作
- **jd-match 搬移**: 從全域 `~/.claude/skills/` 移至專案 `.claude/skills/`，更新 SKILL.md 中兩處模板路徑
- **測試結果**: 以 techcorp-senior-frontend 職缺測試，成功建立分支、客製化 main.md、同步網站檔案、build 通過
