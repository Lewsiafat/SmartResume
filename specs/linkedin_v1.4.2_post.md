# Plan — v1.4.2 LinkedIn 發佈與專案推廣

## Context

v1.4.2 剛 release（2026-04-30），把社群分享預覽 pipeline 修到端到端可用、SEO/OG meta 收進 `main.md` SSOT。專案已累積到 v1.4.x，使用者面向的能力（Case Study 深度頁、/install-avatar、/linkedin-suggest、JD-match → job-apply 流程）已成熟，但目前只有單一官方 demo（`lewsi.ddns.net/smartresume/`，內容是 template-default Alex Chen sample）。使用者已自行部署一個真實 fork 範例 `https://naicha-resume.pages.dev/`（Cloudflare Pages），這是 LinkedIn 貼文最有說服力的「他人也用了」社會證明。

目標：寫一篇 LinkedIn 貼文發佈本版更新 + 推廣專案，讓讀者意識到「這不只是 portfolio template，是給懂用 AI 的人的個人品牌工具包」，並驅動三類行動 — fork/star、發 PR 修 bug、open issue 給發展建議。

**範圍（依使用者回答收斂）：**
- 不做新部署（naicha-resume.pages.dev 已存在，僅需要在貼文內導流）
- 不沉澱成 skill（一次性 v1.4.2 release post）
- 內容聚焦最近版本的「使用者面向更新」，不講實作細節

## 交付物

單一檔案：`ref_src/linkedin_posts/v1.4.2-release.md`（新目錄、新檔）

內含：
- zh-TW 主版本（LinkedIn 貼文預設 ≤3000 char，目標 1500–2200 char）
- en 短版（≤1300 char，給英文受眾轉貼）
- 4 種變體 hashtag 組合（中文職場圈 / 英文工程圈 / AI 圈 / 開源圈）
- 1 段建議的圖卡描述（取現有 `public/og-images/home-zh-TW.png`，本版剛修好的 OG 圖即是最佳素材，不需另外設計）

不寫進 README / 不改 CHANGELOG / 不改 skill 檔。

## 貼文結構（zh-TW 主版）

```
[Hook 1–2 行]
   ↓
[v1.4.2 一句話摘要 + 為什麼 user 該知道]
   ↓
[最近三版重點（user-facing only）3 條]
   ↓
[兩個 demo 並列] ← 社會證明
   ↓
[3 段 CTA：Fork / PR / Issue]
   ↓
[Hashtags]
```

### 各段內容大綱

**Hook（≤2 行）**
> 「履歷不是寫給人看，是寫給 AI agent 看的時代。我把過去半年的 AI 求職工具鏈打包成 SmartResume 1.4.2，今天 release。」

**v1.4.2 一句話**
> 修好了 LinkedIn / FB / Threads 分享預覽（OG image 不再是空頭像）+ SEO/OG meta 收進 `main.md` 單一資料源。fork 完跑一次 `/update-resume`，社群分享預覽就是你的名字，不再是 demo 的 Alex Chen。

**最近三版重點（user-facing）3 條** — 從 CHANGELOG 1.4.0 → 1.4.2 篩出對 LinkedIn 受眾最有共鳴的：

1. **Case Study 深度頁** （v1.4.0）— 專案從卡片升級成完整故事頁，路由 `/projects/:id`，markdown 撰寫，scaffold 用 `/add-case-study {projectId}`。對「履歷沒有故事」的痛點直球解法。
2. **`/linkedin-suggest` 雙語 LinkedIn profile 草稿**（v1.4.0）— SSOT 一鍵產出 Headline / About / Experience / Skills / Featured / Open to Work。寫 LinkedIn 不用再自己想中英文版本。
3. **`/install-avatar` + 社群分享預覽修正**（v1.4.0 + v1.4.2）— 一張原圖 → 多尺寸 WebP+PNG → 同步進履歷 PDF + OG 預覽圖。fork 完從 demo 變成「自己」最快的一步。

**兩個 demo 並列** — 這是貼文最關鍵的轉化點：

- **官方範例**：`https://lewsi.ddns.net/smartresume/`（template default，看完整功能面）
- **真實 fork**：`https://naicha-resume.pages.dev/`（社群成員實際部署版本，看別人怎麼用）

兩個並列的訊息：「不只我自己用，已經有人 fork 出去做自己的版本」。社會證明 > 自吹自擂。

**3 段 CTA**
1. 想試 → Fork repo，跑 `/update-resume`，10 分鐘有自己的 portfolio + PDF 履歷
2. 發現 bug → 歡迎 PR，CHANGELOG 1.4.1 / 1.4.2 都是 community-spotted 的問題
3. 有想法 → open issue 提 feature request 或新 skill 想法（特別歡迎求職、面試、個人品牌相關 workflow）

**Hashtags**
- 共通：`#SmartResume #AI履歷 #個人品牌 #ClaudeCode #OpenSource`
- 中文職場圈加：`#求職 #履歷 #職涯`
- 英文工程圈加：`#VueJS #TypeScript #DevTools`

## 檔案結構

```
ref_src/
├── linkedin_posts/                  ← 新目錄
│   └── v1.4.2-release.md            ← 唯一新檔
└── linkedin_profile.md              ← 既有，由 /linkedin-suggest 產，不動
```

選用 `ref_src/linkedin_posts/` 而非 `output/`：
- `output/` 是 AI skill 自動產出，會被 `/job-release` 之類流程操作
- `ref_src/` 是人工撰寫的 SSOT 內容，貼文是人寫的，放這裡語意正確
- 未來若新增 `/linkedin-post` skill，就改成讀寫此目錄；先建立慣例

## v1.4.2-release.md 檔案結構

```markdown
# LinkedIn Release Post — SmartResume v1.4.2

> 撰寫日期：2026-04-30。發佈時直接複製對應段落貼到 LinkedIn。

## 建議圖卡
- 主圖：public/og-images/home-zh-TW.png（v1.4.2 剛修好的 OG 圖，含頭像 + 標題 + 站名）
- 替代：public/og-images/home-en.png（英文受眾用）
- 不要另外設計 — 用「自己 dogfooding」自家工具產生的 OG 圖最有說服力

## 主版（zh-TW，貼到 LinkedIn 首發用）
[完整貼文文字，純文字格式，無 markdown 修飾，可直接複製]

## 短版（en，預留給英文受眾轉貼）
[英文版貼文，≤1300 chars]

## Hashtag 變體
- 中文職場圈：...
- 英文工程圈：...
- AI 圈：...
- 開源圈：...

## 發佈後追蹤
- 每篇 LinkedIn / Threads / X 各發一次，間隔 2–3 天避免演算法降權
- 觀察 GA4 `og_share_referrer` 事件 confirm 來流量（已在 v1.4.0 wired）
- 7 天後若有迴響，整理 issue / PR 數作為 v1.4.3 release post 的 social proof

## 撰寫原則 reference
- 開頭兩行決定打開率，避免「Excited to announce...」開場
- 一段一個重點，斷行讓手機掃描友善
- 兩個 demo 連結並列放在中段（≈ 1/2 處），不放結尾（讀者不會滑到底）
- CTA 三選一就好，不要全要
```

## 實作步驟（approval 後）

1. `mkdir -p ref_src/linkedin_posts/`
2. Write `ref_src/linkedin_posts/v1.4.2-release.md`，依上節 schema 填入完整貼文文字
3. **不需要 build / deploy / 動 skill 檔**
4. 完成後 commit，message 例：`docs(release): v1.4.2 LinkedIn release post draft`
5. （使用者後續手動）開 LinkedIn → 複製主版 → 上傳 og-images/home-zh-TW.png → 發佈

## 驗證

- 字數檢查：zh-TW 版 1500–2200 chars / en 版 ≤1300 chars（用 `wc -m`）
- 格式檢查：純文字段落，無 markdown `*`/`#`/`-`（LinkedIn 不渲染，貼上會看到原始符號）
- 連結檢查：兩個 demo URL 各打開一次，確認沒被使用者 typo
- 圖卡檢查：開 `public/og-images/home-zh-TW.png` 確認檔案存在、頭像正常顯示（v1.4.2 剛修的就是這個）
- Hook 檢查：找一個非工程師朋友讀前兩行，能在 5 秒內理解「這是什麼」就過關

## 不做的事（避免 scope creep）

- ❌ 不寫新 skill（使用者明確要求一次性）
- ❌ 不部署第三個 demo（已有 lewsi + naicha 兩個就夠）
- ❌ 不改 README / CHANGELOG（v1.4.2 文件已完成）
- ❌ 不寫部落格長文（LinkedIn 貼文 ≠ blog post，有需要再另案）
- ❌ 不改 `linkedin-suggest` skill（它管 profile，不管 post，職責分離）
