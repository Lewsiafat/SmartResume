# Fix & Update README — Walkthrough

- **分支:** `docs/fix-update-readme`
- **日期:** 2026-04-16

## 變更摘要
修正 README.md 多項問題：補齊前置需求（Node.js、AI Agent）、更新 Skill 清單與描述（只列 5 個自撰 skill）、新增「針對不同公司客製化履歷」情境、修正 mermaid 流程圖語法、移除自動部署段落、統一 .agent/skills/ 與 .claude/skills/ 內容。同時新增 AGENTS.md 並修正 CLAUDE.md 過期路徑。

## 修改的檔案

| 檔案 | 變更 | 說明 |
|------|------|------|
| `README.md` | 修改 | 加 Prerequisites、修正 Skill 清單（5 個自撰）、新增情境 4（客製化履歷）、修正 mermaid 圖、移除自動部署、中英文同步、clone URL 改 SSH |
| `AGENTS.md` | 新增 | 與 CLAUDE.md 內容一致，供非 Claude 的 AI agent 讀取 |
| `CLAUDE.md` | 修改 | 修正 skill 路徑從 `~/.claude/skills/` 改為 `.claude/skills/` + `.agent/skills/` |
| `.agent/skills/*` | 刪除+新增 | 清空舊有 9 個 skill（含 binary 格式），從 .claude/skills/ 同步 11 個 skill |
| `specs/fix-update-readme.md` | 新增 | 任務規格文件 |

## 技術細節

- **Skill 雙目錄同步**: `.claude/skills/` 為 source of truth，`.agent/skills/` 完全鏡像，確保 Claude Code 和其他 agent 讀到相同定義
- **mermaid 修正**: 移除節點文字中的 `/`、`*`、`<br/>` 等特殊字元，改用簡化文字避免 GitHub mermaid renderer 解析錯誤
- **Skills 清單精簡**: README 只列 5 個專案自撰 skill（update-resume、jd-match、job-apply、job-release、theme-extractor），通用工具類以附註提及
- **AGENTS.md**: 內容與 CLAUDE.md 一致，差異僅在標題和 skill location 描述（兩個目錄都列出）
