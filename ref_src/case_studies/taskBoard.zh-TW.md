# TaskBoard — 即時協作看板

## Problem

我們團隊在做專案排程時碰到三個尷尬狀況：

1. Trello 免費版只能 10 個 board，多專案立刻撞到上限
2. 看板狀態變動沒有即時通知，PM 要不斷重新整理頁面才知道誰動了什麼
3. 想把資料留在自己機器上，但開源 Kanban 大多缺少 real-time 同步、或功能單一到不堪用

於是決定自幹一個，順便把 WebSocket 廣播與多人協作衝突處理徹底搞懂。

## Solution

前後端分離 + WebSocket 雙向通訊：

- **前端** Vue 3 + Pinia。每個看板加入獨立的 Socket.IO room，卡片操作以樂觀更新（optimistic UI）立即反映，不等 server 確認
- **後端** Node.js + Express + Socket.IO。收到 event 後寫入 PostgreSQL，再廣播給 room 內其他連線
- **衝突解決** server-side timestamp + last-write-wins，搭配 reconcile event 通知前端調整本地狀態

整體目標：「卡片拖動感覺像本地操作，但所有人 200ms 內看到一致畫面」。

## Tech Choices

- **Socket.IO vs 原生 WebSocket** — 選 Socket.IO。room、自動重連、transport fallback 都內建，省下一週 plumbing
- **PostgreSQL vs MongoDB** — 看板/卡片/留言之間的關聯與排序需求多，SQL 比 schemaless 順手
- **樂觀更新 vs Server-confirm** — 樂觀更新。UX 大幅提升但要寫 reconcile 路徑，值得
- **單體 vs 微服務** — 單體。10 人以下團隊不需要拆，營運成本省

## Result

- 內部團隊使用 4 個月，承載 6 個 active board、平均同時在線 5–8 人、卡片移動延遲 <100ms
- 開源後 GitHub 18 stars、5 個外部 fork、收到 2 個 contributor PR
- 自架在家用 NAS，每月維運成本（電費 + 備份）不到 NT$50

## Lessons Learned

- **Real-time 比想像中複雜** — 每個 event 都要回答「失敗會怎樣」、「順序錯了會怎樣」，工作量大約是純 REST 的兩倍
- **資料庫 schema 早期就要想清楚** — 加欄位很容易，拆 table 很痛。第二版才把 `card_history` 從 `cards` 分出來，過程很掙扎
- **自架的隱藏成本是維運心智負擔** — 軟體免費，但每次安全公告都要評估要不要更新。下次會考慮 managed 選項
- **WebSocket 連線數爆炸要工程設計** — 單一 Node 進程超過 200 連線開始吃力，要規劃 worker 分流或上 Redis adapter
