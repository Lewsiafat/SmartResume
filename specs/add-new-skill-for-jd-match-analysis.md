# JD Match Analysis Skill — JD 比對分析與 Cover Letter 產生

- **分支:** `feat/add-new-skill-for-jd-match-analysis`
- **日期:** 2026-04-14

## 描述
建立一個新的 Claude Code skill `/jd-match`，用於將使用者的履歷（`ref_src/main.md` SSOT）與目標職缺 JD 進行比對分析，產出匹配度報告，並自動產生客製化 Cover Letter（中/英文）。

## 功能流程

1. **輸入 JD** — 使用者貼入 Job Description 文字或提供 URL
2. **解析比對** — 從 JD 提取關鍵需求（技能、經驗年資、資格條件），與 `ref_src/main.md` 比對
3. **產出分析報告** — 匹配度評分 + 強項亮點 + 缺口分析 + 建議
4. **產生 Cover Letter** — 根據分析結果，自動產生針對該職缺的客製化 Cover Letter

## 檔案結構

```
~/.claude/skills/jd-match/
├── SKILL.md                          # Skill 定義檔
└── assets/
    ├── analysis-template.md          # 分析報告模板
    └── cover-letter-template.md      # Cover Letter 模板

output/                               # 產出目錄（專案根目錄下）
├── jd-analysis/
│   └── {company}-{date}.md           # 分析報告
└── cover-letters/
    └── {company}-{date}.md           # Cover Letter
```

## 觸發詞

`/jd-match`、"JD 分析"、"職缺比對"、"cover letter"、"求職信"、"job match"

## 任務清單
- [x] 建立 `~/.claude/skills/jd-match/` 目錄結構
- [x] 撰寫 `SKILL.md` skill 定義檔（含觸發詞、workflow、prompt 設計）
- [x] 建立 `assets/analysis-template.md` 分析報告模板
- [x] 建立 `assets/cover-letter-template.md` Cover Letter 模板
- [x] 在專案中建立 `output/jd-analysis/` 和 `output/cover-letters/` 目錄（含 .gitkeep）
- [x] 測試 skill 觸發與完整流程
