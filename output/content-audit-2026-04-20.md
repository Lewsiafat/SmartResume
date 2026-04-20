# SmartResume 內容稽核報告

- **日期:** 2026-04-20
- **分支:** `chore/scan-for-old-projects-info-or-personal`（已 rebase 到 `origin/master` HEAD = `2a7ef54 release(v1.2.0)`）
- **目的:** 盤點過時專案資訊與個人資訊殘留，不修改原檔
- **基準:** 專案已於 v1.1.0 / 2026-04-11 刻意轉換為範例模板（`Alex Chen / alex.chen@example.com / sample-user`）。v1.2.0 再加入 env-gated analytics、Formspree、SEO、scroll reveal，以及將聯絡資訊集中到 `src/data/contact.ts`。本報告以「範例模板應完全乾淨」為預期狀態。
- **重跑紀錄:** 本版於 rebase 後重新掃描，已標註 v1.2.0 修掉哪些舊 finding。
- **修復紀錄:** 使用者於 2026-04-20 授權修復 H1、H2、M1、M2、M3（`npm run build` 驗證通過）。各節標題保留原狀，狀態由「未修復」改為「✅ 已修復」以便追溯。

---

## 🔴 高優先級

### H1. README.md 的 clone 指令仍指向真實 GitHub 帳號 — ✅ **已修復 2026-04-20**

| 位置 | 目前內容 | 建議 |
|------|---------|------|
| `README.md:46` | `git clone git@github.com:Lewsifat/SmartResume.git` | 改為 `git clone git@github.com:<your-username>/SmartResume.git` 或占位符 `sample-user` |
| `README.md:311` | 同上（英文版區塊） | 同上 |

v1.2.0 並未觸及這兩處，這是對外 README 的主要 CTA，屬於真實個資洩漏。

---

### H2. `.gemini/skills/` 仍保留兩個已移除的 legacy skill — ✅ **已修復 2026-04-20**

CHANGELOG v1.1.0 「Removed」區塊寫明已清除 `repo-sync`、`project-info-manager`，但只清了 `.agent/skills/` 與 `.claude/skills/`，`.gemini/skills/` 沒有一併處理。

| 位置 | 問題 |
|------|------|
| `.gemini/skills/repo-sync/scripts/sync_repos.py:10` | 註解寫 `https://github.com/Lewsiafat/Picore-W` — 真實 GitHub URL 洩漏 |
| `.gemini/skills/repo-sync/SKILL.md` | 參照 `ref_src/target_git_repos.md`（不存在），skill 已失效 |
| `.gemini/skills/project-info-manager/SKILL.md` | 參照 `.agent/skills/project-info-manager/.../patch_project.py`（不存在），skill 已失效 |

**建議：** 整個刪除 `.gemini/skills/repo-sync/` 與 `.gemini/skills/project-info-manager/`。

---

## 🟡 中優先級

### M1. 孤兒 Project Filter（過時專案分類殘留）— ✅ **已修復 2026-04-20**

舊版有 FinTech / IoT / Game 類別的專案，sanitization 後縮減為 Full-Stack / AI Tools / Tool 三類，但以下三層未跟著清：

| 位置 | 內容 |
|------|------|
| `src/types/index.ts:1` | `ProjectCategory` union 仍包含 `'FinTech' \| 'IoT' \| 'Game'` |
| `src/i18n/zh-TW.ts:35-39` / `src/i18n/en.ts:35-39` | 仍有 `filterFinTech`、`filterIoT`、`filterGame` key |
| `src/components/sections/ProjectsSection.vue:17,18,21` | 濾鏡清單硬編碼渲染 FinTech / IoT / Game 按鈕 |

**使用者可見影響：** 訪客點這三個 filter 會得到空結果。

**建議：** 保留有對應 project 的 filter；或改由 `projects.ts` 動態產生 filter 清單，從根本避免再次漂移。

---

### M2. `stats.ts` id 命名誤導 — ✅ **已修復 2026-04-20**

`src/data/stats.ts:6` 中 id 為 `pythonPercent`，value 是 `'60%'`，但 i18n（`zh-TW.ts:71` / `en.ts:71`）把此 key 的 label 設為「TypeScript 專案」/「TypeScript Projects」。

**原因：** 舊版是 Python 占比，sanitization 改成 TypeScript 但沒有重命名 id。

**建議：** 將 id 改為 `tsPercent`（同步更新 i18n key），或把 label 改回 Python 以符合 id。

---

### M3. 文件與實作字型不同步 — ✅ **已修復 2026-04-20**

| 位置 | 內容 |
|------|------|
| `CLAUDE.md:76` / `AGENTS.md:76` | 聲明「Fonts: Space Grotesk + Noto Sans TC」 |
| `tailwind.config.js:40` | `sans: ['Inter', 'Noto Sans TC', 'sans-serif']` |
| `src/style.css:1,17` | 實際載入 Inter + Noto Sans TC |

**建議：** 把 CLAUDE.md / AGENTS.md 更新為 Inter + Noto Sans TC；或若想恢復 Space Grotesk，則更新 config 與 style.css。

---

## 🆕 延伸觀察（來自 M1 修復）

修復 M1 後，發現 `update-resume` skill 文件仍把 `FinTech / IoT / Game` 列為有效 Category 選項：

| 位置 | 內容 |
|------|------|
| `.claude/skills/update-resume/SKILL.md:69` | `3. **Category** — FinTech / IoT / AI Tools / Full-Stack / Game` |
| `.agent/skills/update-resume/SKILL.md:69` | 同上 |

若使用者透過 `/update-resume` 選這三個類別，寫出的 `projects.ts` 會違反 `ProjectCategory` union。

**建議：** 更新兩份 SKILL.md 的選項清單為 `AI Tools / Full-Stack / Tool`，或改由動態讀取 `ProjectCategory` 型別定義。本次未修，屬 M1 延伸。

---

## 🟢 低優先級 / 資訊性

### L1. 刻意保留的歷史個資記錄

`specs/remove-personal-data-change-to-sample.md` 第 15–20 行與 `specs/remove-personal-data-change-to-sample-walkthrough.md` 第 24、47 行包含：

- `Lewis Chan`、`lewsiafat@gmail.com`、`github.com/Lewsiafat`、`linkedin.com/in/lewis-chan-78234221/`、`lewsi.ddns.net`
- 真實公司名（`天旭`、`鈊象`、`黑米`、`英丰寶`）

`remove-personal-data-change-to-sample-walkthrough.md:48` 明確說「僅 specs 對照表文件保留原始個人資料作為替換記錄」— 這是**刻意保留**的審計軌跡。

**建議：** 若要公開為模板，把 walkthrough 中的實際值改為抽象描述，或將兩份 spec 排除在 tracked files 外。私人 repo 可保留。

### L2. 本次掃描規格文件亦有一筆個資

`specs/scan-for-old-projects-info-or-personal.md:29` 列出 `lewsiafat@gmail.com`。若 repo 後續公開，改為抽象描述。

### L3. PDF 時間落後 SSOT

| 檔案 | mtime |
|------|-------|
| `ref_src/main.md` | 2026-04-15 17:53 |
| `ref_src/resume_zh.md` / `resume_en.md` | 2026-04-11 15:30 |
| `public/resume_zh.pdf` / `resume_en.pdf` | 2026-04-11 15:30 |

**內容比對：** 目前三者文字一致，04/15 的 main.md 改動未觸發 PDF 重建但不影響可見內容。若有結構性調整，建議跑一次 `/update-resume` 的 PDF 重建步驟。

---

## ✅ 本次 rebase 後確認已修復

| 原 finding | 修復情況 |
|-----------|---------|
| **L4 — Contact 區塊未走 i18n / 統一來源** | ✅ v1.2.0 新增 `src/data/contact.ts` 作為聯絡 SSOT，`TheFooter.vue:19,30,41` 與 `ContactSection.vue:77,87,88,97` 均已改為 `:href="contact.xxx.url"` / `{{ contact.xxx.handle }}`，不再硬編碼。 |

**附帶觀察（v1.2.0 新增內容全部乾淨）：**
- `src/data/contact.ts` 全部使用 `sample-user` / `alex.chen@example.com` / `example.com`
- `src/analytics.ts` 透過 `import.meta.env.VITE_GA_ID` 取值，無 hardcoded ID
- `index.html` 新增 SEO / OpenGraph / Twitter meta 全部指向 `example.com`、作者 `Alex Chen`
- `ContactSection.vue` Formspree 導入亦透過 `VITE_FORMSPREE_ID` env 取值

---

## 📊 總結

| 類別 | 項目數（本次重跑） |
|------|-------------------|
| 🔴 高優先級（真實個資洩漏到公開檔） | 2（H1、H2）— 全部未修 |
| 🟡 中優先級（過時專案結構 / 文件不同步） | 3（M1、M2、M3）— 全部未修 |
| 🟢 低優先級（刻意保留 / 小不一致） | 3（L1、L2、L3） |
| ✅ 已於 v1.2.0 修復 | 1（原 L4） |

### 建議處理順序

1. **H1、H2**（真實個資 → 公開檔的洩漏）優先處理
2. **M1** 最影響使用者體驗（會渲染空濾鏡）
3. **M2、M3**（命名與文件同步，成本低）順手修
4. **L1、L2** 視 repo 公開策略決定；**L3** 視下次 main.md 改動決定

### 本次實際變更（修復階段）

| 檔案 | 變更 |
|------|------|
| `README.md` | 兩處 clone URL `Lewsifat` → `<your-username>` |
| `.gemini/skills/repo-sync/*` | 刪除（含 sync_repos.py 的 Lewsiafat URL） |
| `.gemini/skills/project-info-manager/*` | 刪除 |
| `src/types/index.ts` | `ProjectCategory` union 移除 `FinTech` / `IoT` / `Game` |
| `src/i18n/zh-TW.ts`、`src/i18n/en.ts` | 移除 `filterFinTech` / `filterIoT` / `filterGame` key；`pythonPercent` → `tsPercent` |
| `src/components/sections/ProjectsSection.vue` | filters 陣列移除三項 |
| `src/data/stats.ts` | id `pythonPercent` → `tsPercent` |
| `CLAUDE.md`、`AGENTS.md` | `Fonts: Space Grotesk + Noto Sans TC` → `Inter + Noto Sans TC` |

**驗證：** `npm run build` 通過，dist 產出正常。
