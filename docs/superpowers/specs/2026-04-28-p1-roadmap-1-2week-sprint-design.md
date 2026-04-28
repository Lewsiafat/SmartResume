# P1 Roadmap — 1-2 Week Sprint Design

**Date:** 2026-04-28
**Source:** `specs/road-map_p1.md`
**Sprint length:** 1-2 weeks (estimate 9 days)
**Priorities:** 差異化 > 求職實效

## Goal

針對 `specs/road-map_p1.md` 列出的 5 大方向，在 1-2 週內完成 5 個高槓桿項目，最大化「面試官打開連結時感受到的差距」與「拿到面試/Offer 的機率」。

## Scope (5 items)

| # | 項目 | 估時 | 差異化 | 求職實效 |
|---|------|------|--------|----------|
| 1 | Project Case Study 深度頁 | 3 天 | ⭐⭐⭐ | ⭐⭐⭐ |
| 2 | Open Graph 動態圖 | 1 天 | ⭐⭐ | ⭐ |
| 3 | 訪客分析事件追蹤（GA4 既有） | 0.5 天 | ⭐ | ⭐⭐ |
| 4 | Avatar install skill | 1.5 天 | ⭐ | ⭐ |
| 5 | LinkedIn profile suggestion skill | 1.5 天 | ⭐ | ⭐⭐⭐ |
| | + Vue Router 引入 + 整合測試 | 1.5 天 | | |
| | **Total** | **9 天** | | |

## Architecture

### 新增依賴

- `vue-router` — Case Study 獨立路由所需
- `sharp` — Avatar 多尺寸生成
- `marked`（或 `vue3-markdown-it`）— Case Study markdown 渲染

### 新增/修改的目錄

```
ref_src/
├── case_studies/
│   ├── _template.md                      # 範例骨架（含使用說明 comment）
│   ├── example_taskboard.zh-TW.md        # 完整中文示範
│   ├── example_taskboard.en.md           # 完整英文示範
│   └── (使用者自建 *.md)
└── linkedin_profile.md                    # /linkedin-suggest 輸出（gitignored 預設）

public/
├── avatar/                                # /install-avatar 輸出
│   └── avatar-{128|256|512}.{webp|png}
└── og-images/                             # build 時產生
    ├── home-{zh|en}.png
    ├── case-{slug}.png
    └── about-{zh|en}.png

src/
├── router/
│   └── index.ts                           # Vue Router 設定
├── views/
│   ├── HomePage.vue                       # 把現有 App.vue sections 移進來
│   └── CaseStudyPage.vue                  # 新頁面
├── data/
│   └── case-studies-manifest.ts           # build 時產生（auto-detect）
└── analytics.ts                           # 加 trackEvent() wrapper

scripts/
├── generate-og-images.ts                  # build 時跑
├── generate-case-studies-manifest.ts      # build 時跑（先於 vite build）
└── og-templates/
    ├── home.html
    ├── case-study.html
    └── about.html

.claude/skills/
├── add-case-study/
├── install-avatar/
└── linkedin-suggest/
```

## Detailed Designs

### 1. Project Case Study 深度頁

**資料來源（Hybrid）**
- Summary 留在 `ref_src/main.md`（既有 i18n cards 不變）
- 深度內容放 `ref_src/case_studies/{projectId}.{en|zh-TW}.md`

**檔案約定**
- `projectId` 對應 `src/data/projects.ts` 的 `id` 欄位（如 `taskBoard`）
- 雙語檔名後綴：`taskBoard.en.md` / `taskBoard.zh-TW.md`
- Build 時 `scripts/generate-case-studies-manifest.ts` 掃 `ref_src/case_studies/*.md`，排除 `_template.md` 和 `example_*.md`，產生 `src/data/case-studies-manifest.ts`

**Template 結構**

```markdown
<!--
Case Study Template
1. 把此檔複製為 ref_src/case_studies/{projectId}.{en|zh-TW}.md
2. {projectId} = src/data/projects.ts 的 id 欄位
3. 任何段落都可留空或刪除（不該專案就不會出現深度頁）
4. 完整範例請看 example_taskboard.zh-TW.md
-->
# {Project Title}

## Problem
這個專案要解決什麼問題？什麼情境下會碰到？

## Solution
你的解法概念是什麼？為什麼這樣設計？

## Tech Choices
- 選擇 X 而不是 Y 的原因
- 取捨：A vs B

## Result
具體成果（數字、使用者回饋、demo 連結）

## Lessons Learned
做完這個專案學到什麼？下次會怎麼改？
```

**路由設計**
- `/` → `HomePage`（既有 sections）
- `/projects/:id` → `CaseStudyPage`
- 不存在的 id → 404 → 自動轉回 `/#projects`
- ProjectsSection 卡片：若 `projectId` 在 manifest → 卡片底加「Read Case Study →」；不在 → 卡片不變

**i18n 策略**
- Case Study 內容直接走 markdown（不走 vue-i18n，避免 i18n key 爆炸）
- UI chrome（返回按鈕、metadata）走 vue-i18n
- 切語系：依 `useLocale()` 自動選擇對應的 markdown 檔

**5 個發現管道**
1. 新 skill `.claude/skills/add-case-study/` — 互動式 Q&A 或一鍵 scaffold
2. `update-resume` skill 結尾被動提示：「💡 想為「TaskBoard」加 case study？執行 `/add-case-study taskboard`（可選）」
3. `CLAUDE.md` 新增段落「Case Study 深度頁（可選）」
4. `_template.md` 頂部 comment 自說明
5. `README` Quick Start 加一句

**重點：完全可選**。沒有 case study 檔的專案，網站照常運作，卡片不顯示「Read Case Study」按鈕。`/update-resume` 不會主動詢問是否填寫 case study。

### 2. Open Graph 動態圖

**生成方式**：Build-time + Puppeteer（重用既有 PDF 生成鏈路）

**模板**：`scripts/og-templates/{home,case-study,about}.html` — 純 HTML+CSS，receive query string（`?title=...&subtitle=...&theme=...`）

**腳本邏輯**（`scripts/generate-og-images.ts`）

```
讀 case-studies-manifest.ts → 列出所有路由
Puppeteer launch
對每路由：
  - 開模板 HTML（帶 query string）
  - 1200x630 截圖
  - 存 public/og-images/{slug}.png
```

**HTML meta 注入**
- 用 `vite-plugin-html` 或 Vue Router meta `meta.og`
- Build 時 inject `<meta property="og:image">` 指向對應檔

**Build 整合順序**
```
npm run build:
  1. tsc (vue-tsc) 型別檢查
  2. node scripts/generate-case-studies-manifest.ts
  3. vite build
  4. node scripts/generate-og-images.ts  ← 依賴 manifest + dist
  5. node scripts/generate-pdf.ts (既有)
```

**設計重點**
- 首頁 OG：左側 avatar + 名字 + headline；右側 Autumn Sunset 漸層
- Case Study OG：頂部 project title 大字 + 一行 tagline + 底部你的名字 + 配色塊
- 雙語版本（zh / en）— 透過 query string 切換語系

### 3. 訪客分析（GA4 既有 + 自訂事件）

**決策：不換 service**。沿用既有 `VITE_GA_ID`（GA4），新增 `trackEvent()` wrapper。

**`src/analytics.ts` 擴充**

```ts
export function trackEvent(name: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', name, params)
  }
}
```

**6 個事件埋點**

| 事件名 | 位置 | 觸發 |
|--------|------|------|
| `case_study_view` | `CaseStudyPage.vue` | onMounted |
| `case_study_time_50pct` | `CaseStudyPage.vue` | IntersectionObserver 監測滾到 50% |
| `cta_click_resume_pdf` | Hero / Footer PDF 連結 | onclick |
| `cta_click_contact` | ContactSection submit | submit handler |
| `cta_click_github` / `cta_click_linkedin` | Footer 外連 | onclick |
| `og_share_referrer` | App.vue / HomePage.vue | onMounted 讀 `document.referrer` 上報一次 |

### 4. Avatar install skill

**路徑**：`.claude/skills/install-avatar/SKILL.md` + `.agent/skills/install-avatar/SKILL.md`

**流程**
1. 接收 `/install-avatar <path>`（檔案路徑）
2. 用 `sharp` 產 128 / 256 / 512 px 三尺寸、WebP + PNG fallback，共 6 檔
3. 寫入 `public/avatar/avatar-{size}.{ext}`
4. 更新 `ref_src/main.md` 的 `avatar:` 欄位（若無則新增）
5. 同步 `src/i18n/zh-TW.ts` / `en.ts` 的 `hero.avatar` key（或新增）
6. 互動詢問「PDF 履歷也加頭像？(y/N)」→ Y 觸發 PDF 重生（含 avatar 版）

**Fallback**：若 `public/avatar/` 為空，前端用 hard-coded gradient placeholder（保持目前狀態）

**支援的輸入格式**：JPG / PNG / HEIC / WebP

### 5. LinkedIn profile suggestion skill

**路徑**：`.claude/skills/linkedin-suggest/SKILL.md` + `.agent/skills/linkedin-suggest/SKILL.md`

**流程（Hybrid mode）**
1. 讀 `ref_src/main.md` SSOT
2. One-shot 產出 `ref_src/linkedin_profile.md`，6 區段、雙語並列
3. 印一行：「✅ 已產出。要逐欄精修嗎？(y/N)」
4. Y → 互動：每欄印草稿 → (Y) 接受 / (E) 編輯 / (R) 重產 / (S) 跳過
5. N → 結束，使用者自己複製去 LinkedIn

**輸出格式範例**

```markdown
# LinkedIn Profile Draft

## Headline (EN)
[220 chars max]

## Headline (ZH-TW)
[220 chars max]

## About (EN)
[2600 chars max, narrative tone]

## About (ZH-TW)
...

## Experience — {Company} {Role} (EN)
...

## Skills (Top 50, ranked)
...

## Featured (suggested links)
- {Project name} → {URL}
- ...

## Open to Work
- 地點：...
- 職位：...
```

**Prompt 工程要點**
- 每欄獨立 prompt，含字數限制（Headline 220、About 2600）
- Headline 語氣：punchy / outcome-focused
- About 語氣：narrative / first-person
- Experience：每段 3-5 個 bullet，動詞開頭，含數字
- 輸出純 plain text 給直接複製（無 markdown 標記）

## Risks

1. **Vue Router 引入動到 `App.vue`** — 既有 i18n / dark mode 切換可能受影響
   - 緩解：手動 smoke test 整個首頁所有 sections + 切語系 + 切 dark mode
2. **OG 圖 build 時間增加** — 估增 5-10 秒
   - 緩解：可加環境變數 `SKIP_OG=1` 跳過（dev 不需要）
3. **LinkedIn skill 輸出品質** — LLM prompt 工程效果不穩
   - 緩解：先以 main.md 自己跑一輪、人工審核、再 iterate prompt

## Testing

無自動化測試（YAGNI）。每項自檢 checklist：

- **Case Study**：建一個 `_template.md` 複製版 → `npm run dev` → 點卡片進 detail → 確認 markdown 渲染、雙語切換、返回鈕、404
- **OG**：build 後手動開 `public/og-images/*.png` 確認；`twitter-card-validator` 線上工具驗 meta tag
- **分析**：dev console 看 `window.gtag` 觸發、GA4 Realtime 報表確認事件
- **Avatar**：跑 skill → `public/avatar/` 6 檔 + main.md 更新 + 網站顯示
- **LinkedIn**：跑 skill → `linkedin_profile.md` 6 區段雙語齊全 + 字數合規

## Out of Scope

從 `specs/road-map_p1.md` 砍掉的項目（留待 P2）：
- Contact Form 後端（Formspree 已可用）
- PDF 自動重生（手動觸發已足夠）
- GitHub Stats 自動同步（資料變動低頻）
- Kanban 求職看板（最大但差異化中等，留待 P2）
- 一鍵投遞 Headless（差異化最強但風險最高，1-2 週做不穩）
- 面試準備套件 / 薪資研究 / 技能缺口分析
- 部落格、AI 履歷評分 API、SmartResume-as-a-Service

## File Touchpoints (預估)

- 新檔：~25 個（skills、views、scripts、templates、example case studies）
- 修改：`App.vue`、`vite.config.ts`、`package.json`、`CLAUDE.md`、`README.md`、`src/analytics.ts`、`ref_src/main.md`（avatar field）
- Vue Router 整合：`main.ts` + 新增 `src/router/index.ts`

## Approval

設計於 2026-04-28 brainstorming session 中由 user 三段式確認通過：
1. 整體架構 + 時程 ✅
2. Case Study 細節 ✅
3. OG / 分析 / Avatar / LinkedIn 細節 ✅
