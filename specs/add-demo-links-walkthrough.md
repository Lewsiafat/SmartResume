# 為專案增加 Demo 連結 — Walkthrough

- **分支:** `feat/add-demo-links`
- **日期:** 2026-03-12

## 變更摘要
成功為兩個核心 FinTech 專案新增了線上展示連結，提升使用者體驗並與 WebShareeee 專案的展示風格保持一致。

## 修改的檔案
- `src/data/projects.ts`: 在 `scalpingTrade` 和 `lazyBrother` 物件中新增了 `demo` 屬性。
- `specs/add-demo-links.md`: 更新任務清單為已完成。
- `specs/add-demo-links-walkthrough.md`: 新增此變更紀錄文件。

## 技術細節
- 參考了 `WebShareeee` 專案在 `Project[]` 資料結構中的實作方式。
- 新增的連結分別指向 `https://lewsi.ddns.net/scalping/` 與 `https://lewsi.ddns.net/lazybrother/`。
