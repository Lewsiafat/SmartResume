# Check Skill Dependencies — Walkthrough

- **分支:** `chore/check-skill-dependencies`
- **日期:** 2026-04-29

## 變更摘要

修正自製與外來 skills 中 2 個錯誤指向家目錄全域路徑（`~/.claude/skills/...`）的引用，改為專案內相對路徑（`.claude/skills/...`），讓 fork user clone 後不需在 `~/.claude/` 額外安裝對應 skill 也能正常使用。原計畫中「產出 skill 依賴盤點文件」的工作項目本次未執行，依使用者決定縮小本次任務範圍。

## 修改的檔案

- **`.claude/skills/theme-extractor/SKILL.md`** — line 22 與 line 70 兩處引用 `~/.claude/skills/theme-factory/themes/` 改為 `.claude/skills/theme-factory/themes/`，並補一句 `(bundled in this project)` 說明散布來源
- **`.agent/skills/theme-extractor/SKILL.md`** — 同步上面的修改（CLAUDE.md 規定兩個目錄內容 identical）
- **`.claude/skills/playwright-skill/API_REFERENCE.md`** — line 39 安裝範例的 `cd ~/.claude/skills/playwright-skill` 改為 `cd .claude/skills/playwright-skill`，並補註解 `# Install (if needed) — playwright-skill is bundled in this project`
- **`.agent/skills/playwright-skill/API_REFERENCE.md`** — 同步上面的修改
- **`specs/check-skill-dependencies.md`** — 任務 spec 文件，紀錄本次盤點的初始計畫與後續縮小後的範圍

## 技術細節

### 為什麼要修這兩處

1. **`theme-extractor`** — 透過 `~/.claude/skills/theme-factory/` 讀取 10 個 preset 主題，但 fork user 的家目錄預設不會有 `theme-factory` skill；專案根目錄下的 `.claude/skills/theme-factory/` 已隨 repo 散布（`.gitignore` 設定 `.claude/*` + `!.claude/skills/`），所以改用專案內路徑可避免「fork user 需另外安裝 theme-factory」的隱性依賴。
2. **`playwright-skill`** — 同理。`.claude/skills/playwright-skill/` 已隨 repo 散布，安裝範例不應引導使用者去家目錄安裝另一份。

### 為什麼 `.claude/` 與 `.agent/` 兩份都要改

CLAUDE.md 註明「`.claude/skills/` 與 `.agent/skills/` 內容 identical」。修改一份後使用 `cp` 同步另一份並以 `diff -q` 驗證。

### 為什麼不收 3 個 untracked skill 目錄

`.claude/skills/` 下另有 `dispatching-parallel-agents`、`executing-plans`、`writing-plans` 三個 untracked 目錄，依任務開工時確認，**不在本次範圍**，保留為 untracked 待後續另行處理。`.agent/` 並未複製對應目錄。

### 為什麼沒做原計畫中的盤點文件

原 spec 規劃產出 `docs/skill-dependencies.md`（中英雙語）盤點 8 個自製 skill 的依賴。在修完上述兩處 bug 後，使用者判斷「修好就好」，盤點文件這部分不必執行；spec 任務清單中相關項目維持未勾選狀態以保留紀錄。

### 驗證

`grep -rn '~/.claude/skills' .claude/skills/ .agent/skills/` 回傳 `(none)`，確認 repo 內已無殘留家目錄全域路徑引用。
