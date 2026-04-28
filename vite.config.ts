import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { execSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const buildSha = (() => {
  try { return execSync('git rev-parse --short HEAD').toString().trim() }
  catch { return 'dev' }
})()
const buildTime = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC'

export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
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
