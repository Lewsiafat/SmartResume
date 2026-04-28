// scripts/generate-og-images.ts
import puppeteer, { type Page } from 'puppeteer'
import { readFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const TEMPLATES_DIR = join(ROOT, 'scripts', 'og-templates')
const OUTPUT_DIR = join(ROOT, 'public', 'og-images')
const CASE_STUDY_DIR = join(ROOT, 'ref_src', 'case_studies')
const MAIN_MD = join(ROOT, 'ref_src', 'main.md')

interface Author { name: string; role: string; tag: string }

function readAuthor(): Author {
  let name = 'Your Name', role = 'Full-Stack Developer', tag = 'Building software'
  try {
    const md = readFileSync(MAIN_MD, 'utf-8')
    const nameMatch = md.match(/^#\s+(.+)$/m)
    if (nameMatch) name = nameMatch[1].trim()
    const roleMatch = md.match(/^\*\*Title.*?:\*\*\s*(.+)$/m)
      || md.match(/^\*\*Headline.*?:\*\*\s*(.+)$/m)
    if (roleMatch) role = roleMatch[1].trim()
  } catch {}
  return { name, role, tag }
}

function listCaseStudies(): { id: string; locales: string[] }[] {
  if (!existsSync(CASE_STUDY_DIR)) return []
  const files = readdirSync(CASE_STUDY_DIR).filter(f => f.endsWith('.md'))
  const map: Record<string, string[]> = {}
  for (const f of files) {
    if (f === '_template.md' || f.startsWith('example_')) continue
    const m = f.match(/^([a-zA-Z0-9_]+)\.(en|zh-TW)\.md$/)
    if (!m) continue
    const [, id, locale] = m
    if (!map[id]) map[id] = []
    map[id].push(locale)
  }
  return Object.entries(map).map(([id, locales]) => ({ id, locales }))
}

function readCaseStudyTitleAndTagline(id: string, locale: string): { title: string; tagline: string } {
  const file = join(CASE_STUDY_DIR, `${id}.${locale}.md`)
  if (!existsSync(file)) return { title: id, tagline: '' }
  const md = readFileSync(file, 'utf-8')
  const titleMatch = md.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : id
  // tagline: first non-heading paragraph after Problem section
  const problemBlock = md.split(/^##\s+Problem\s*$/m)[1] || ''
  const firstPara = problemBlock.trim().split('\n\n')[0] || ''
  const tagline = firstPara.replace(/\n/g, ' ').slice(0, 100)
  return { title, tagline }
}

async function shoot(page: Page, templateUrl: string, output: string) {
  await page.goto(templateUrl, { waitUntil: 'networkidle0' })
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
  await page.screenshot({ path: output as `${string}.png`, type: 'png' })
  console.log(`[og] wrote ${output}`)
}

async function main() {
  if (process.env.SKIP_OG === '1') {
    console.log('[og] SKIP_OG=1, skipping')
    return
  }
  mkdirSync(OUTPUT_DIR, { recursive: true })
  const author = readAuthor()

  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()

  // Home (zh + en — currently same content; English would use translated headline)
  for (const lang of ['zh-TW', 'en']) {
    const u = `file://${join(TEMPLATES_DIR, 'home.html')}?name=${encodeURIComponent(author.name)}&role=${encodeURIComponent(author.role)}&tag=${encodeURIComponent(author.tag)}`
    await shoot(page, u, join(OUTPUT_DIR, `home-${lang}.png`))
  }

  // About (one image, language-neutral)
  await shoot(
    page,
    `file://${join(TEMPLATES_DIR, 'about.html')}?name=${encodeURIComponent(author.name)}&role=${encodeURIComponent(author.role)}`,
    join(OUTPUT_DIR, 'about.png'),
  )

  // Case studies (one image per id; English title preferred when available)
  for (const cs of listCaseStudies()) {
    const locale = cs.locales.includes('en') ? 'en' : cs.locales[0]
    const { title, tagline } = readCaseStudyTitleAndTagline(cs.id, locale)
    const u = `file://${join(TEMPLATES_DIR, 'case-study.html')}?title=${encodeURIComponent(title)}&tagline=${encodeURIComponent(tagline)}&author=${encodeURIComponent(author.name)}`
    await shoot(page, u, join(OUTPUT_DIR, `case-${cs.id}.png`))
  }

  await browser.close()
  console.log('[og] done')
}

main().catch(e => { console.error(e); process.exit(1) })
