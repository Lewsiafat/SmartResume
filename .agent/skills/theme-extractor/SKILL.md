---
name: theme-extractor
description: Extract color themes from any website URL and apply them to this portfolio project. Also supports selecting from 10 pre-built theme-factory themes. Use this skill whenever the user wants to change the site's color scheme, extract colors from a reference website, apply a new theme, pick a preset theme, or says things like "I want my site to look like X", "change the colors to match this URL", "switch theme", "use ocean depths theme", or "extract the palette from this page".
---

# Theme Extractor & Applier

Extract color palettes from any website or choose from preset themes, preview the result, and apply it to this portfolio project.

## When to Use

- User provides a URL and wants to match its color scheme
- User wants to switch to a theme-factory preset (e.g., "use the Ocean Depths theme")
- User describes a visual style in words (e.g., "I want a warm sunset feel")
- User says "change theme", "new colors", "switch palette", etc.

## Input Sources

There are three ways to get a theme:

1. **URL extraction** — scrape a live website's CSS to pull its actual colors
2. **Theme-factory presets** — pick from 10 curated themes in `~/.claude/skills/theme-factory/themes/`
3. **Description** — user describes what they want, you generate a matching palette

## Workflow

### Step 1: Determine the Source

Ask the user (or infer from context) which input source they want:
- If they gave a URL → go to Step 2a
- If they named a preset (e.g., "Midnight Galaxy") → go to Step 2b
- If they described a style → go to Step 2c

### Step 2a: Extract Colors from URL

Use the playwright-skill to load the page and extract computed CSS colors. The playwright-skill is installed at `.claude/skills/playwright-skill/` in this project.

Write a Playwright script to `/tmp/playwright-extract-theme.js` that:

1. Navigates to the target URL
2. Extracts colors via JavaScript in the page context:
   ```javascript
   // Extract from computed styles of key elements
   const body = getComputedStyle(document.body);
   const h1 = document.querySelector('h1');
   const links = document.querySelectorAll('a');
   const buttons = document.querySelectorAll('button');
   const cards = document.querySelectorAll('[class*="card"], [class*="Card"]');
   const nav = document.querySelector('nav, header');
   ```
3. Collects: background colors, text colors, heading colors, link/button accent colors, card backgrounds, border colors
4. Takes a screenshot for reference
5. Outputs the extracted palette as JSON

Run via: `cd .claude/skills/playwright-skill && node run.js /tmp/playwright-extract-theme.js`

After extraction, deduplicate and cluster the colors. Map them to this project's color roles:
- **primary** (9 shades, 50-900): derived from the dominant brand/accent color
- **secondary** (500, 600): muted supporting color
- **accent** (400, 500, 600): highlight/emphasis color
- **dark.bg**: dark mode background
- **dark.card**: dark mode card surface
- **dark.border**: dark mode border
- **ivory**: light mode background

Use color theory to generate the full shade range (50-900) from the extracted base colors. Lighter shades for 50-200, the extracted color around 500-600, darker for 700-900.

### Step 2b: Use Theme-Factory Preset

Read the chosen theme from `~/.claude/skills/theme-factory/themes/<theme-name>.md`.

Available themes:
1. Ocean Depths — deep navy + teal (#1a2332, #2d8b8b, #a8dadc, #f1faee)
2. Sunset Boulevard — warm sunset tones
3. Forest Canopy — earth greens (#2d4a2b, #7d8471, #a4ac86, #faf9f6)
4. Modern Minimalist — clean grayscale
5. Golden Hour — rich autumnal palette
6. Arctic Frost — cool winter blues
7. Desert Rose — dusty rose tones
8. Tech Innovation — electric blue + neon (#0066ff, #00ffff, #1e1e1e, #ffffff)
9. Botanical Garden — fresh organic greens
10. Midnight Galaxy — cosmic purple (#2b1e3e, #4a4e8f, #a490c2, #e6e6fa)

Map the theme's 4 colors to the project's color roles. The first color becomes the primary base, the last becomes ivory/light-bg.

### Step 2c: Generate from Description

Based on the user's description, select appropriate colors following the same mapping structure. Use established color theory — complementary, analogous, or triadic harmonies depending on the mood described.

### Step 3: Preview

Present the proposed palette to the user in a clear format:

```
## Proposed Theme: [name]

| Role        | Light Mode  | Dark Mode   |
|-------------|-------------|-------------|
| Primary 500 | #xxxxxx     | —           |
| Accent      | #xxxxxx     | —           |
| Background  | #xxxxxx     | #xxxxxx     |
| Card        | #xxxxxx     | #xxxxxx     |
| Border      | #xxxxxx     | #xxxxxx     |
| Text        | #xxxxxx     | #xxxxxx     |

Gradient: linear-gradient(135deg, #xxx, #xxx)
Font suggestion: [keep current / suggest change]
```

Also show the full primary scale (50-900) so the user can see the shade progression.

Ask: "Does this look good? Want to adjust any colors before I apply it?"

### Step 4: Apply

Once confirmed, update these files:

**`tailwind.config.js`** — replace the color definitions:
- `colors.primary` (all 9 shades)
- `colors.secondary` (500, 600)
- `colors.accent` (400, 500, 600)
- `colors.dark` (bg, card, border)
- `colors.ivory`

**`src/style.css`** — update hardcoded values:
- `.btn-primary` background gradient
- `.btn-primary:hover` box-shadow rgba
- `.section-title` gradient
- `.gradient-text` gradient
- Google Fonts import (only if font changes)
- Heading font-family (only if font changes)

**Vue components with inline styles** — scan and replace:
```bash
# Find hardcoded color values in .vue files
grep -rn 'style=".*#[0-9a-fA-F]' src/components/
```
Known locations:
- `src/components/ui/ProjectCard.vue` — emoji header gradient
- `src/components/sections/AboutSection.vue` — skill bar gradient

### Step 5: Verify

1. Run `npm run build` to confirm no errors
2. Scan for any remaining old color values: `grep -rn '#oldcolor' src/`
3. Optionally use playwright-skill to take before/after screenshots

## Notes

- Always preserve the Tailwind class names (primary-500, dark-bg, etc.) — only change the underlying hex values
- The dark mode system (class-based toggle via useTheme composable) stays unchanged
- Font changes are optional — only suggest if the theme calls for it
- Keep Inter + Noto Sans TC as default unless the user explicitly wants different fonts
