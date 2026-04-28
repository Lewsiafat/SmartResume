import sharp from 'sharp'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT_DIR = join(ROOT, 'public', 'avatar')
const MAIN_MD = join(ROOT, 'ref_src', 'main.md')
const SIZES = [128, 256, 512] as const

async function processImage(input: string) {
  if (!existsSync(input)) {
    console.error(`[avatar] not found: ${input}`)
    process.exit(1)
  }
  mkdirSync(OUT_DIR, { recursive: true })

  // Warn if source is below 512px on either axis
  try {
    const meta = await sharp(input).metadata()
    if ((meta.width ?? 0) < 512 || (meta.height ?? 0) < 512) {
      console.warn(
        `[avatar] ⚠️ source resolution ${meta.width}x${meta.height} below 512px; 512 variant will be slightly soft. Recommend ≥1024×1024 source.`
      )
    }
  } catch (err) {
    console.warn(`[avatar] could not read metadata: ${(err as Error).message}`)
  }

  for (const size of SIZES) {
    const base = sharp(input).resize(size, size, { fit: 'cover', position: 'center' })
    await base.clone().webp({ quality: 88 }).toFile(join(OUT_DIR, `avatar-${size}.webp`))
    await base.clone().png({ compressionLevel: 9 }).toFile(join(OUT_DIR, `avatar-${size}.png`))
    console.log(`[avatar] wrote ${size}px webp + png`)
  }
}

function updateMainMd(): boolean {
  if (!existsSync(MAIN_MD)) return false
  let content = readFileSync(MAIN_MD, 'utf-8')
  const avatarLine = '**Avatar:** /avatar/avatar-512.webp'
  if (content.includes('**Avatar:**')) {
    content = content.replace(/\*\*Avatar:\*\*.*$/m, avatarLine)
  } else {
    // insert after the first contact block (after the title line)
    const lines = content.split('\n')
    const firstBlankAfterHeader = lines.findIndex(
      (l, i) => i > 0 && l.trim() === '' && lines[0].startsWith('# ')
    )
    const insertAt = firstBlankAfterHeader > 0 ? firstBlankAfterHeader : 1
    lines.splice(insertAt, 0, avatarLine)
    content = lines.join('\n')
  }
  writeFileSync(MAIN_MD, content)
  console.log('[avatar] main.md Avatar field updated')
  return true
}

const inputPath = process.argv[2]
if (!inputPath) {
  console.error('Usage: tsx scripts/install-avatar.ts <path-to-image>')
  process.exit(1)
}

await processImage(resolve(inputPath))
updateMainMd()
console.log('[avatar] done')
