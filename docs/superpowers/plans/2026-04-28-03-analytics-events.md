# Analytics Events Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 6 custom GA4 events on top of the existing `VITE_GA_ID` integration so we know which case study performs best, what referrers drive traffic, and where visitors click.

**Architecture:** Extend `src/analytics.ts` with a thin `trackEvent(name, params)` wrapper around `window.gtag`. Place 6 calls at the appropriate components. No service swap — sticks with GA4.

**Tech Stack:** GA4 (existing) + plain TS.

**Note on TDD:** No tests. Verification: open dev console with `VITE_GA_ID` set, watch `window.gtag` calls; confirm in GA4 Realtime → Events.

---

## File Structure

**Modified files:**
- `src/analytics.ts` — Add `trackEvent` export
- `src/views/CaseStudyPage.vue` — Track view + 50% scroll (Plan 01 prerequisite)
- `src/views/HomePage.vue` — Track referrer once on mount (Plan 01 prerequisite)
- `src/components/sections/HeroSection.vue` — PDF CTA click
- `src/components/layout/TheFooter.vue` — Resume PDF / GitHub / LinkedIn clicks
- `src/components/sections/ContactSection.vue` — Form submit click

---

## Task 1: trackEvent wrapper

**Files:**
- Modify: `src/analytics.ts`

- [ ] **Step 1: Replace file content**

```typescript
const GA_ID = import.meta.env.VITE_GA_ID

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function initAnalytics() {
  if (!GA_ID) return

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(s)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!GA_ID) return
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', name, params || {})
}
```

- [ ] **Step 2: Smoke test**

```bash
VITE_GA_ID=G-TEST npm run dev
```

Open browser DevTools → Network → filter `gtag` and verify `googletagmanager.com/gtag/js` loads. Console: `window.gtag('event', 'test', {x:1})` should not throw.

- [ ] **Step 3: Commit**

```bash
git add src/analytics.ts
git commit -m "feat(analytics): trackEvent wrapper"
```

## Task 2: case_study_view + case_study_time_50pct

**Files:**
- Modify: `src/views/CaseStudyPage.vue`

(Prerequisite: Plan 01 Task 5 has shipped; CaseStudyPage exists.)

- [ ] **Step 1: Add view event**

In `<script setup>` of `CaseStudyPage.vue`, inside `loadMarkdown()` success branch (after `notFound.value = false`):

```typescript
import { trackEvent } from '../analytics'
// ...
trackEvent('case_study_view', { project_id: projectId.value, locale: wantedLocale })
```

- [ ] **Step 2: Add 50% scroll event**

Add at top of `<script setup>`:

```typescript
import { onMounted, onUnmounted, ref } from 'vue'

const halfwayFired = ref(false)

function onScroll() {
  if (halfwayFired.value) return
  const total = document.documentElement.scrollHeight - window.innerHeight
  if (total <= 0) return
  const pct = window.scrollY / total
  if (pct >= 0.5) {
    halfwayFired.value = true
    trackEvent('case_study_time_50pct', { project_id: projectId.value })
  }
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
```

Reset `halfwayFired` whenever `projectId` changes:

```typescript
watch(projectId, () => { halfwayFired.value = false })
```

- [ ] **Step 3: Verify**

`VITE_GA_ID=G-TEST npm run dev` → open `/projects/{realId}` → DevTools console: `window.dataLayer` should grow when arriving + when scrolling past halfway.

- [ ] **Step 4: Commit**

```bash
git add src/views/CaseStudyPage.vue
git commit -m "feat(analytics): case_study_view + case_study_time_50pct"
```

## Task 3: og_share_referrer

**Files:**
- Modify: `src/views/HomePage.vue`

- [ ] **Step 1: Add referrer ping on mount**

In `HomePage.vue` `<script setup>`:

```typescript
import { onMounted } from 'vue'
import { trackEvent } from '../analytics'

onMounted(() => {
  const ref = document.referrer || 'direct'
  let source = 'direct'
  try {
    if (ref !== 'direct') {
      const host = new URL(ref).hostname.toLowerCase()
      if (host.includes('linkedin')) source = 'linkedin'
      else if (host.includes('twitter') || host.includes('t.co') || host.includes('x.com')) source = 'twitter'
      else if (host.includes('github')) source = 'github'
      else if (host.includes('google')) source = 'google'
      else source = host
    }
  } catch {}
  trackEvent('og_share_referrer', { source, raw: ref || null })
})
```

- [ ] **Step 2: Commit**

```bash
git add src/views/HomePage.vue
git commit -m "feat(analytics): og_share_referrer on home mount"
```

## Task 4: CTA click events

**Files:**
- Modify: `src/components/sections/HeroSection.vue` (resume PDF link)
- Modify: `src/components/layout/TheFooter.vue` (resume / github / linkedin)
- Modify: `src/components/sections/ContactSection.vue` (form submit)

- [ ] **Step 1: HeroSection — resume PDF**

Find any `<a href="/resume_zh.pdf">` or similar in HeroSection.vue. Add click handler:

```typescript
import { trackEvent } from '../../analytics'
function onResumeClick(lang: 'zh' | 'en') { trackEvent('cta_click_resume_pdf', { lang }) }
```

In template:

```vue
<a :href="`/resume_${currentLang}.pdf`" @click="onResumeClick(currentLang)" target="_blank" rel="noopener">…</a>
```

- [ ] **Step 2: TheFooter — same for any resume / github / linkedin links**

```typescript
function onCta(name: string, extra?: Record<string, unknown>) { trackEvent(name, extra) }
```

```vue
<a :href="github" @click="onCta('cta_click_github')" target="_blank" rel="noopener">GitHub</a>
<a :href="linkedin" @click="onCta('cta_click_linkedin')" target="_blank" rel="noopener">LinkedIn</a>
<a :href="`/resume_${lang}.pdf`" @click="onCta('cta_click_resume_pdf', { lang, source: 'footer' })">…</a>
```

- [ ] **Step 3: ContactSection — submit click**

In the existing form submit handler, before any actual submit logic:

```typescript
import { trackEvent } from '../../analytics'
// in handleSubmit / onSubmit:
trackEvent('cta_click_contact', {
  has_message: form.message.length > 0,
  has_email: form.email.length > 0,
})
```

- [ ] **Step 4: Smoke test all 6 events**

```bash
VITE_GA_ID=G-TEST npm run dev
```

Run through:
1. Land on home → `og_share_referrer` fires (check `window.dataLayer`)
2. Click Resume PDF in Hero → `cta_click_resume_pdf` fires
3. Click GitHub in Footer → `cta_click_github` fires
4. Click LinkedIn in Footer → `cta_click_linkedin` fires
5. Submit Contact form → `cta_click_contact` fires
6. Navigate to `/projects/{id}` (with real case study) → `case_study_view` fires; scroll 50% → `case_study_time_50pct` fires

Acceptable verification: `window.dataLayer` array contains entries for each event.

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat(analytics): CTA click events (PDF, GitHub, LinkedIn, Contact)"
```

---

## Self-Review Checklist

- [ ] All 6 events from spec implemented:
  - `case_study_view` — Task 2
  - `case_study_time_50pct` — Task 2
  - `cta_click_resume_pdf` — Task 4
  - `cta_click_contact` — Task 4
  - `cta_click_github` / `cta_click_linkedin` — Task 4
  - `og_share_referrer` — Task 3
- [ ] `trackEvent` no-ops when `VITE_GA_ID` unset (so contributors with no env file don't see errors).
- [ ] No `console.log` left from debugging.
