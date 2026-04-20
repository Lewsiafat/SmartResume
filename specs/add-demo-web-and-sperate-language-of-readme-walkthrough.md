# Add Demo Web & Separate README Languages — Walkthrough

- **分支:** `feat/add-demo-web-and-sperate-language-of-readme`
- **日期:** 2026-04-20

## 變更摘要

在 README 頂部加入 Live Demo badge 並將原本中英雙語合併的 README.md（448 行）拆分為 README.md（繁中，primary，273 行）與 README.en.md（英文，177 行）。兩檔頂部各置放語系切換徐章互指。Live Demo 使用 `https://<your-username>.github.io/SmartResume/` placeholder（code 格式），fork 後由使用者替換為實際部署 URL。

## 修改的檔案

| 檔案 | 動作 | 說明 |
|------|------|------|
| `README.md` | 修改 | 448 → 273 行；移除 English Guide 區塊、頂部加語系切換徐章與 Live Demo badge、保留繁中全部內容 |
| `README.en.md` | 新增 | 177 行；遷移原 English Guide 整段（Features / Prerequisites / Quick Start / Use Cases / Skills / Project Structure / Tech Stack / Env Vars），頂部同樣置放語系切換徐章與 Live Demo badge |
| `specs/add-demo-web-and-sperate-language-of-readme.md` | 新增 | 任務規格文件（於 `/task` 建立時產出） |

## 技術細節

### Live Demo Badge 格式

使用 markdown code 格式而非可點擊連結：

```markdown
🌐 **Live Demo:** `https://<your-username>.github.io/SmartResume/` _(Fork 後請替換成你自己的部署 URL)_
```

**Why:** 直接寫 `<your-username>` 作為連結 URL 會被 markdown parser 誤判為 HTML tag；改用 code 格式既維持 placeholder 語意、又不會導向失效連結。參考既有的 `git clone git@github.com:<your-username>/SmartResume.git` 慣例。

### 語系切換徐章格式

當前語系用粗體（不加連結），另一語系用相對連結：

- `README.md` 頂部：`**語系:** **🇹🇼 繁中** | [🇬🇧 English](./README.en.md)`
- `README.en.md` 頂部：`**Language:** [🇹🇼 繁中](./README.md) | **🇬🇧 English**`

GitHub 會正確解析相對路徑 `./README.en.md` 為 repo 內檔案連結。

### 外部依賴檢查

Grep 過 `AGENTS.md` / `CLAUDE.md` / `docs/`，確認無指向舊 README anchor（`#-中文說明`、`#-english-guide`）的連結需修正。`specs/` 中的歷史文件僅為描述 README 存在，非錨點引用。`.claude/skills/job-release/` 與 `.agent/skills/job-release/` 的 `README.md` 指的是 release 資料包內的檔案，與本次拆分無關。

### 驗證

- `npm run build`：✅ 通過（851ms，63 modules transformed，TypeScript 型別檢查與 Vite build 皆無 side effect）
- Playwright 測試：README 透過 GitHub markdown API 渲染後開啟預覽，確認語系切換徐章、Live Demo、placeholder、互指連結 href 全部正確
- Portfolio 網站：Vite dev server (port 5173) 運行正常，`#about` / `#projects` / `#tech` / `#contact` DOM box 尺寸正常，捲動到位後 opacity 均為 1（scroll-reveal 動畫正常觸發）
