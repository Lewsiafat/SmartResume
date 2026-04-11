# 移除個人資料，替換為範例資料

- **分支:** `feat/remove-personal-data-change-to-sample`
- **日期:** 2026-04-10

## 描述
將專案中所有個人資料替換為通用範例資料（Alex Chen / sample@example.com），
並將專案和工作經歷最小化至各 3 筆，讓專案可作為 Portfolio 模板使用。
最後以更新後的範例資料重新產生中英文履歷 PDF。

## 替換對照表

| 原始資料 | 替換為 |
|---------|--------|
| Lewis Chan | Alex Chen |
| lewsiafat@gmail.com | alex.chen@example.com |
| github.com/Lewsiafat | github.com/sample-user |
| linkedin.com/in/lewis-chan-78234221/ | linkedin.com/in/sample-user |
| lewsi.ddns.net | example.com |
| 真實公司名稱（天旭、鈊象、黑米、英丰寶） | 範例公司（TechCorp、GameStudio、WebAgency） |
| 8 個專案 | 3 個範例專案 |
| 5 段工作經歷 | 3 段範例經歷 |

## 任務清單

### 資料替換
- [x] 更新 `src/i18n/zh-TW.ts` — 姓名、職稱、描述、Email、地點
- [x] 更新 `src/i18n/en.ts` — 同上英文版
- [x] 更新 `src/data/projects.ts` — 縮減為 3 個範例專案（含假連結）
- [x] 更新 `src/data/skills.ts` — 技能百分比改為範例數據
- [x] 更新 `src/data/stats.ts` — GitHub 統計改為範例數據
- [x] 更新 `src/components/sections/ContactSection.vue` — Email/GitHub/LinkedIn
- [x] 更新 `src/components/layout/TheFooter.vue` — GitHub/LinkedIn 連結
- [x] 更新 `index.html` — Page title
- [x] 更新 `ref_src/main.md` — 完整履歷替換為範例（3 段經歷）

### 靜態資源
- [x] 重新產生 `public/resume_en.pdf`（英文範例履歷）
- [x] 重新產生 `public/resume_zh.pdf`（中文範例履歷）

### 驗證
- [x] `npm run build` 通過
- [ ] `npm run dev` 啟動後所有區塊正常顯示
- [x] 確認無任何真實個人資料殘留（搜尋 Lewis、lewsi、Lewsiafat 等關鍵字）
