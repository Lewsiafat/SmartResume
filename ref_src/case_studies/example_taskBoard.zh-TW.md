# TaskBoard — 即時協作看板

## Problem

小型團隊用 Trello / Asana 卡在三個痛點：免費版功能受限、團隊間多帳號管理麻煩、自架時不熟悉 WebSocket / 即時同步的工程細節無從入門。我想做一個從零打造、可自架的 Kanban，順便練 real-time 後端。

## Solution

Vue 3 前端 + Node.js + Socket.IO 後端 + PostgreSQL。卡片移動透過 WebSocket 廣播，所有連線使用者即時看到變動。看板 / 卡片 / 留言皆有樂觀更新（optimistic UI）+ server reconcile，網路抖動時體驗仍順暢。

## Tech Choices

- **Socket.IO 而非原生 WebSocket**：room-based broadcast 直接內建，省一週重造輪子
- **PostgreSQL 而非 MongoDB**：卡片/看板/留言關聯複雜，SQL 適合
- **樂觀更新 vs 等 server confirm**：選樂觀，UX 順但要寫 reconcile 邏輯（值得）

## Result

- 部署後團隊內測 2 個月、平均日活 8 人、無資料衝突回報
- 看板載入 <300ms、卡片移動廣播 <80ms（區域網路）
- GitHub 11 stars、3 個外部 fork

## Lessons Learned

- WebSocket 連線數爆炸時 Node.js 單執行緒會吃緊，下次該設計 worker 分流
- 樂觀更新的 reconcile 比想像難，建議先寫測試再寫業務邏輯
- 自架真的省錢但維運成本（資安更新、備份）容易低估
