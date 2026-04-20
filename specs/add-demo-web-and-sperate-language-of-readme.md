---
name: add-demo-web-and-sperate-language-of-readme
description: README 新增 Live Demo badge 並拆分為中英兩份獨立檔案
type: feat
---

# Add Demo Web & Separate README Languages — 加入 Demo 連結並拆分多語 README

- **分支:** `feat/add-demo-web-and-sperate-language-of-readme`
- **日期:** 2026-04-20

## 描述

1. 在 README 頂部新增 Live Demo badge（先用 placeholder URL，等實際部署後再替換）。
2. 將目前單一檔案 `README.md`（內含中英雙語）拆分成 `README.md`（繁中，primary）與 `README.en.md`（英文），兩份檔案頂部各放語系切換徐章互指。

## 背景

目前 `README.md`（448 行）將中文說明與 English Guide 放在同一份檔案，透過錨點連結切換。這導致：
- 任一語系的使用者都要先跳過另一半內容
- 檔案過長，維護時需要同步兩處
- 缺少 Live Demo 入口，無法讓潛在使用者先預覽 Portfolio 實際效果

## 任務清單

- [x] 在 README 頂部加入 Live Demo badge，使用 placeholder URL `https://<your-username>.github.io/SmartResume/` 並於附近註記「請 fork 後替換為自己的部署 URL」
- [x] 建立 `README.en.md`，遷移原本「English Guide」整段內容（含 Features / Prerequisites / Quick Start / Use Cases / Skills / Project Structure / Tech Stack / Env Vars）
- [x] 精簡 `README.md`，移除英文區塊，僅保留繁中內容並調整頂部的索引連結
- [x] 兩份檔案頂部各加上語系切換徐章：`[🇹🇼 繁中](./README.md) | [🇬🇧 English](./README.en.md)`（當前檔案的語系用粗體或移除連結表示）
- [x] 檢查 `AGENTS.md`、`CLAUDE.md`、`docs/` 是否有指向 README 舊錨點（如 `#-中文說明`、`#-english-guide`）的連結並修正
- [x] `npm run build` 驗證不受影響（README 為靜態文件，主要確認建構無 side effect）
- [x] 產出 walkthrough 文件 `specs/add-demo-web-and-sperate-language-of-readme-walkthrough.md`（於 `/finish-task` 時建立）
