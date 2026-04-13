# Slate Minimal 主題替換

- **分支:** `feat/theme-factory`
- **日期:** 2026-04-13

## 描述
將現有的 Forest Green 配色替換為 Slate Minimal 極簡灰階主題。不新增主題切換功能，僅更新色值與字體。配色方案：Primary #475569、Dark BG #0f172a、Dark Card #1e293b、Text #334155/#e2e8f0、Accent #94a3b8、Light BG #f8fafc。字體改為 Inter + Noto Sans TC。

## 任務清單
- [x] 替換 `tailwind.config.js` 配色為 Slate Minimal 色值
- [x] 更新 `tailwind.config.js` 字體為 Inter + Noto Sans TC
- [x] 更新 `index.html` Google Fonts link 加入 Inter（實際在 src/style.css 中）
- [x] 掃描所有 `.vue` 組件中硬編碼的 Forest Green 相關色值，替換為新配色
- [x] 確認 dark/light mode 在新配色下正常運作
- [x] 執行 `npm run build` 確認無編譯錯誤
