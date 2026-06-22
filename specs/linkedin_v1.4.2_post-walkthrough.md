# v1.4.2 LinkedIn 發佈與專案推廣 — Walkthrough

- **分支:** `docs/linkedin-v1.4.2-post`
- **日期:** 2026-06-22

## 變更摘要

為 v1.4.2 release 撰寫一篇 LinkedIn 推廣貼文。新增 `ref_src/linkedin_posts/` 目錄（人工撰寫的社群貼文 SSOT，與 skill 自動產出的 `output/` 區隔），內含可直接複製貼上的 zh-TW 主版、en 短版、4 種受眾 hashtag 變體，以及建議圖卡與發佈後追蹤指引。一次性交付物，不沉澱成 skill、不改 README / CHANGELOG。

## 修改的檔案

- `ref_src/linkedin_posts/v1.4.2-release.md`（新增）— 唯一交付物。內容：
  - 建議圖卡：直接用 v1.4.2 剛修好的 `public/og-images/home-zh-TW.png`（dogfooding 自家 OG pipeline）
  - 主版（zh-TW）：純文字、無 markdown 修飾，可直接貼 LinkedIn
  - 短版（en）：≤1300 char，給英文受眾轉貼
  - Hashtag 變體 ×4：中文職場圈 / 英文工程圈 / AI 圈 / 開源圈（各 ≤8 個）
  - 發佈後追蹤：平台分流節奏、GA4 `og_share_referrer` 觀測、social proof 滾動
- `specs/linkedin_v1.4.2_post.md`（新增）— 本任務規格
- `specs/linkedin_v1.4.2_post-walkthrough.md`（新增）— 本文件

## 技術細節

- **目錄選址**：貼文放 `ref_src/linkedin_posts/` 而非 `output/`。`output/` 由 AI skill（如 `/job-release`）自動操作，貼文是人工撰寫的 SSOT 內容，放 `ref_src/` 語意正確；同時為未來可能的 `/linkedin-post` skill 預先建立慣例。
- **內容策略**：兩個 demo 並列（官方 template default `lewsi.ddns.net/smartresume/` + 社群真實 fork `naicha-resume.pages.dev`）作為社會證明，置於貼文中段而非結尾。3 段 CTA（Fork / PR / Issue）三選一。
- **撰寫原則**：開頭兩行決定行動裝置打開率（LinkedIn mobile 預設僅顯示 ≈200 char），避免「Excited to announce…」式開場；純文字段落、無 markdown 符號（LinkedIn 不渲染）。

## 任務範圍說明（finish-task 時的決策）

本次收尾**只**納入 LinkedIn 貼文任務相關檔案。工作區其餘 untracked 檔案依使用者指示處理：

- **Akohub 求職申請**（`output/jd-analysis/akohub-2026-06-10.md`、`output/cover-letters/akohub-2026-06-10.md`）— **放棄**，不納入本 commit。
- **雜物清理**（`debug/` 截圖、`.claude/skills/playwright-skill/.temp-execution-*.js`、未追蹤的 superpowers skills 目錄）— **暫時不處理**，保留於工作區。
