# JD Match Analysis Skill — Walkthrough

- **分支:** `feat/add-new-skill-for-jd-match-analysis`
- **日期:** 2026-04-15

## 變更摘要
新增 `/jd-match` skill，可將使用者履歷（ref_src/main.md SSOT）與目標職缺 JD 進行匹配度分析，產出評分報告與客製化 Cover Letter。已完成 skill 建立與實際測試驗證。

## 修改的檔案

| 檔案 | 變更 | 說明 |
|------|------|------|
| `~/.claude/skills/jd-match/SKILL.md` | 新增 | Skill 定義檔，含 6 步驟 workflow（取得 JD → 讀取履歷 → 匹配分析 → 產出報告 → 產生 Cover Letter → 總結） |
| `~/.claude/skills/jd-match/assets/analysis-template.md` | 新增 | 分析報告模板，含 JD 摘要、4 維度評分表、強項/部分匹配/缺口分析、建議 |
| `~/.claude/skills/jd-match/assets/cover-letter-template.md` | 新增 | Cover Letter 模板，含開頭/核心/結尾段落結構 |
| `output/jd-analysis/.gitkeep` | 新增 | JD 分析報告輸出目錄 |
| `output/cover-letters/.gitkeep` | 新增 | Cover Letter 輸出目錄 |
| `specs/add-new-skill-for-jd-match-analysis.md` | 新增 | 任務規格文件 |

## 技術細節

- **Skill 架構**: 採用 6 步驟 workflow，支援文字貼入、URL 抓取、本地檔案三種 JD 輸入方式
- **評分機制**: 4 維度評分（技能匹配 40%、經驗匹配 35%、專案相關性 25%），各項 0-100 分
- **分析深度**: 分為強項亮點 (✅)、部分匹配 (⚠️)、缺口分析 (❌) 三個層級，並附履歷調整與面試準備建議
- **Cover Letter**: 支援中/英/雙語，三種語氣風格（正式、專業親切、熱情積極），根據分析報告中的強項自動撰寫
- **測試結果**: 以一份資深前端工程師 JD 實測，成功產出分析報告（81/100 匹配度）與中文 Cover Letter
