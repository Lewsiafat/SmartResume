import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const buildSha = (() => {
  try { return execSync('git rev-parse --short HEAD').toString().trim() }
  catch { return 'dev' }
})()
const buildTime = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC'

// Rewrites root-relative og:image / twitter:image meta to absolute URLs.
// Open Graph spec requires absolute URLs; many crawlers (Threads, X, Discord,
// Slack) won't resolve relative paths. Site URL is read from main.md SSOT.
// `enforce: 'post'` so this runs after Vite's internal `base` prefix rewrite,
// then we prepend only the origin (host) — combining yields the full URL.
function absoluteOgImagePlugin(): Plugin {
  return {
    name: 'smartresume:absolute-og-image',
    enforce: 'post',
    transformIndexHtml(html) {
      let origin = ''
      try {
        const md = readFileSync(resolve(__dirname, 'ref_src/main.md'), 'utf-8')
        const m = md.match(/^\*\*Site URL:?\*\*\s*(\S+)/mi)
        if (m) origin = new URL(m[1].trim()).origin
      } catch {}
      if (!origin) {
        console.warn('[vite] Site URL missing/invalid in ref_src/main.md — skipping og:image absolute-URL rewrite')
        return html
      }
      return html.replace(
        /(<meta\s+(?:property|name)="(?:og:image|twitter:image)"\s+content=")(\/[^"]+)(")/gi,
        (_m, pre, path, post) => `${pre}${origin}${path}${post}`,
      )
    },
  }
}

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [vue(), absoluteOgImagePlugin()],
  define: {
    __BUILD_SHA__: JSON.stringify(buildSha),
    __BUILD_TIME__: JSON.stringify(buildTime),
  },
  resolve: {
    alias: {
      '@case-studies': resolve(__dirname, 'ref_src/case_studies'),
    },
  },
  server: { fs: { allow: ['..'] } },
})
