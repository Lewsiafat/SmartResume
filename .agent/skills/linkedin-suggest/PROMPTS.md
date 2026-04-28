# LinkedIn Suggest — Per-Field Prompt Templates

These are the prompt patterns the skill follows for each of the 6 fields.
Output is plain text (no markdown formatting) so it pastes cleanly into LinkedIn.

---

## 1. Headline (≤220 chars)

**Goal:** punchy, outcome-focused, scannable in 1 second.

**Pattern (EN):**
> {Role/Specialty} · {Differentiator} · {Tooling/Stack}
> 或
> {Verb} {outcome} for {who} | {credibility marker}

**Examples:**
- `Full-Stack Engineer · AI tooling & job-search automation · Vue/TS/Python`
- `Backend Engineer | Building scalable APIs · Go/PostgreSQL · ex-{Company}`

**Constraints:**
- ≤220 characters
- No emoji
- No "Open to Work" — that's a separate setting

**ZH-TW pattern:**
- 直譯不一定好，調整為中文 LinkedIn 慣用語：「全端工程師 · AI 工具開發 · Vue/Python」
- 對應職場文化：少用感嘆號、用 `·` 或 `｜` 分隔

---

## 2. About (≤2600 chars)

**Goal:** narrative first-person, 2-4 short paragraphs.

**Structure (EN):**
1. **Opening (1-2 sentences):** who you are, what excites you
2. **Track record (1 paragraph):** 2-3 concrete impacts with metrics
3. **What you're working on now (1 short paragraph):** current focus, recent
   side projects, technical interests
4. **CTA (1 line, optional):** "Open to chats about {X, Y}. Reach me at {email}."

**Source mapping:**
- Pull from `## About` section in main.md (the bilingual `What I Do` content)
- Pull metrics from `## Work Experience` bullets
- Pull current focus from `## Side Projects` recent entries

**Constraints:**
- ≤2600 characters
- First-person ("I"/"我")
- Concrete > vague ("Shipped 4 production AI tools used by 200+ users" > "Worked
  on AI projects")
- No bullets in this field (LinkedIn renders About as plain prose)

**ZH-TW notes:**
- 避免英中混雜過度
- 中文版可略短（中文資訊密度較高）
- 用「我」自然開頭，避免英文翻譯腔

---

## 3. Experience (per role, 3-5 bullets each)

**Goal:** action-verb bullets, metrics-driven.

**Pattern (EN):**
- {Action verb} {what} {how/with what} → {measurable outcome}
- Examples:
  - "Designed real-time WebSocket sync layer with Socket.IO, reducing card
    update latency from 800ms to 80ms across 8 concurrent users."
  - "Authored 12-skill agent orchestration framework, cutting onboarding time
    for new contributors from 2 days to 4 hours."

**Source mapping:**
- For each `### {Job}` block in `## Work Experience`, take the existing
  bullets and rewrite to action-verb-led, metric-bearing form.
- If a bullet has no metric, ask: estimate or omit?

**Constraints:**
- 3-5 bullets per role (LinkedIn truncates beyond ~5)
- Each bullet ≤200 characters
- Start with action verb (Designed / Built / Led / Reduced / Shipped)
- ≥50% of bullets should contain a number

**ZH-TW notes:**
- 動詞開頭：「設計」「主導」「重構」「縮短」「上線」
- 數字保持阿拉伯數字
- 每段條列保持類似結構

---

## 4. Skills (Top 50, ranked)

**Goal:** dense, scannable, ordered by relevance to next role.

**Source mapping:**
- Combine `## Core Skills` (with categories + percentages) and tag clouds
  from `## Side Projects`.
- Rank rule:
  1. Items with %≥80 in Core Skills (top tier)
  2. Items appearing in ≥2 recent projects
  3. Generic ecosystem items (Git, Linux, Docker if used)

**Constraints:**
- Exactly 50 entries (LinkedIn caps at 50)
- One skill per line, no descriptions
- Mix concrete (Vue 3, FastAPI, PostgreSQL) and methodology (Agile, TDD,
  System Design) — favor concrete

**Output format:**
```
1. Vue 3
2. TypeScript
3. Python
... (47 more)
```

(LinkedIn skill section is language-neutral — just one list, no zh-TW variant.)

---

## 5. Featured (3-6 entries)

**Goal:** show 3-6 strongest pieces of work — directly clickable from profile.

**Source mapping:**
- Pull from `## Side Projects` in main.md
- Prefer projects with: live demo URL > GitHub URL > article/blog post
- If a Case Study deep page exists at `/projects/{id}`, include that link
  preferentially over the demo

**Output format:**
```
- TaskBoard — real-time Kanban (Vue/Node/PostgreSQL) → https://example.com/projects/taskBoard
- WeatherDash — AI-powered weather dashboard → https://github.com/.../weather-dash
- ...
```

**Constraints:**
- 3-6 entries (LinkedIn shows up to ~6 prominently)
- Each line: name — short tagline → URL
- Prefer your own domain links over GitHub when both exist (more polished)

---

## 6. Open to Work

**Goal:** settings hints — these go into LinkedIn's "Open to" picker, not
free-form text.

**Source mapping:**
- Locations: `## Contact > Location` in main.md (split if multiple)
- Job titles: derived from Headline + recent Experience role
- Workplace types: ask user (Remote / Hybrid / On-site) if not in main.md

**Output format (informational):**
```
Locations: Taipei, Taiwan | Remote (Asia time zones)
Job titles: Full-Stack Engineer, Backend Engineer, AI Engineer
Workplace types: Remote, Hybrid
Start date: Immediately / Within 3 months / Open
```

**No character limit, but keep it scannable.**
