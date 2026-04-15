# Job Apply Skill — 職缺應徵客製化流程

- **分支:** `feat/new-skill-job-apply`
- **日期:** 2026-04-15

## 描述
建立 `/job-apply` skill，針對特定職缺建立獨立 git 分支，根據 JD 分析結果客製化 `ref_src/main.md`，透過對話調整履歷內容以突出與該職缺最匹配的經歷，最後串接 `update-resume` skill 產出完整網站檔案與 PDF。

## 功能流程

1. **取得 JD** — 讀取現有 `output/jd-analysis/` 報告，或接受新 JD 輸入（貼文字/URL/檔案）
2. **建立分支** — `apply/{company}-{position}` 格式，master 保持通用版本不動
3. **分析缺口** — 若無現有報告則執行 jd-match 分析流程
4. **客製化 main.md** — 根據 JD 強項/缺口，透過對話逐步調整：
   - Professional Summary 突出相關經驗
   - Core Skills 順序與百分比調整
   - Work Experience 補強相關描述
   - Side Projects 呈現方式優化
5. **產出** — 串接 update-resume skill 同步網站檔案 + PDF
6. **總結** — 列出分支、客製化檔案、PDF 路徑

## 檔案結構

```
.claude/skills/job-apply/
├── SKILL.md                          # Skill 定義檔
└── assets/
    └── customization-guide.md        # 客製化指引與調整策略
```

## 任務清單
- [x] 建立 `.claude/skills/job-apply/` 目錄結構
- [x] 撰寫 `SKILL.md` skill 定義檔（含 workflow、prompt 設計）
- [x] 建立 `assets/customization-guide.md` 客製化策略指引
- [x] 測試 skill 完整流程
