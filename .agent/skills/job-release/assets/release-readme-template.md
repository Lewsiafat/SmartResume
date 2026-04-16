# 應徵資料包 — {position} @ {company}

- **封存日期:** {date}
- **分支:** `apply/{company}-{position}`
- **匹配度:** {match_score}/100

---

## 目標職缺

- **公司:** {company}
- **職位:** {position}
- **JD 來源:** {jd_source}

---

## 客製化改動摘要

{customization_summary}

---

## 封存檔案清單

| 檔案 | 說明 |
|------|------|
| `resume_zh.pdf` | 客製化中文履歷 PDF |
| `resume_en.pdf` | 客製化英文履歷 PDF |
| `main-snapshot.md` | 客製化後的 ref_src/main.md 快照 |
| `jd-analysis.md` | JD 匹配度分析報告 |
| `cover-letter.md` | 客製化 Cover Letter |
| `dist/` | 客製化網站建置產出 |

---

## 如何還原

```bash
# 切到此應徵的完整分支
git checkout apply/{company}-{position}

# 啟動開發伺服器預覽
npm run dev

# 切回通用版本
git checkout master
```
