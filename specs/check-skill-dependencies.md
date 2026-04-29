# Check Skill Dependencies — 自製 Skills 依賴盤點

- **分支:** `chore/check-skill-dependencies`
- **日期:** 2026-04-29

## 描述

盤點 SmartResume 專案中 8 個自製 skills（`update-resume`、`jd-match`、`job-apply`、`job-release`、`theme-extractor`、`linkedin-suggest`、`add-case-study`、`install-avatar`）的依賴關係，並產出一份單一文件 `docs/skill-dependencies.md`，內容涵蓋：

1. **Skill ↔ Skill 串接**：哪些自製 skill 在 runtime 會呼叫其他自製 skill（例：`/job-apply` 串接 `/update-resume`）。
2. **Skill → 外來 Skill**：自製 skill 引用了 repo 內或全域 home 的外來 skill（例：`theme-extractor` 依賴 `playwright-skill` 與 `~/.claude/skills/theme-factory/`）。
3. **外部 npm / 系統工具**：fork user 安裝完 repo 後仍需自行準備的工具（例：`npx playwright` + Chromium、`sharp`、PDF 生成工具）。
4. **Fork user 潛在雷區**：路徑或工具不存在時，skill 會在哪一步失敗，建議的 workaround。

本次只產文件，**不修改任何 skill 邏輯**。3 個未提交的外來 skills（`dispatching-parallel-agents`、`executing-plans`、`writing-plans`）不在本次範圍內，留待後續另行處理。

## 任務清單

- [x] 修正 `theme-extractor/SKILL.md` 中誤指家目錄全域路徑 `~/.claude/skills/theme-factory/themes/` 的兩處引用，改為專案內路徑 `.claude/skills/theme-factory/themes/`（`.claude/` 與 `.agent/` 兩份同步）
- [x] 順手修正 `playwright-skill/API_REFERENCE.md` line 39 安裝範例的全域路徑 `cd ~/.claude/skills/playwright-skill` → `cd .claude/skills/playwright-skill`（`.claude/` 與 `.agent/` 兩份同步）
- [ ] 系統性閱讀 8 個自製 skill 的 `SKILL.md` 與其 `assets/`、`PROMPTS.md` 等附屬檔案，登記每個 skill 內的外部引用（路徑、指令、工具名）
- [ ] 比對 `.gitignore` 規則，確認 fork user clone 後實際會拿到哪些檔案（`.claude/skills/` 是否全數隨版控散布）
- [ ] 列出 npm 套件依賴：跨檢 `package.json`，標出哪些是 skill 需要、哪些是網站需要
- [ ] 列出系統工具依賴：node 版本、playwright 瀏覽器、sharp 平台二進位等
- [ ] 為每個自製 skill 整理一張 dependency table（columns：上游 skill / 下游 skill / 外部工具 / fork user 須注意）
- [ ] 特別標註 `theme-extractor` 依賴 `~/.claude/skills/theme-factory/`（家目錄全域路徑）的問題與 fork user fallback 建議
- [ ] 在文件結尾附「Pipeline 總覽」圖（mermaid 或文字流程）描繪 `/jd-match → /job-apply → /job-release` 串接
- [ ] 寫入 `docs/skill-dependencies.md`，並在 `docs/` 加上 zh / en 雙語版本（與專案其他文件慣例一致）
- [ ] （可選）在 `CLAUDE.md` 的 "AI Skills" 章節加一行連結指向此盤點文件
- [ ] Review：fork user 視角走查文件，確認「我看完這份文件後知道：要裝什麼、不裝會壞在哪、修不好可以去哪查」
