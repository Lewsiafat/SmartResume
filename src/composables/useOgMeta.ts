import { onMounted, watch, type Ref } from 'vue'

export interface OgMeta {
  title: string
  description: string
  image: string  // absolute or root-relative URL
  url?: string
}

function setMeta(prop: string, value: string, attr: 'name' | 'property' = 'property') {
  let el = document.querySelector(`meta[${attr}="${prop}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, prop)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

// Resolves a path to an absolute URL honoring Vite's BASE_URL (subpath deploys).
// `new URL(path, location.origin)` strips the subpath when path starts with '/',
// so we explicitly join base + path.
function toAbsolute(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  const p = path.startsWith('/') ? path : '/' + path
  const final = base && !p.startsWith(base + '/') && p !== base ? base + p : p
  return new URL(final, location.origin).toString()
}

export function useOgMeta(meta: Ref<OgMeta> | OgMeta) {
  function apply(m: OgMeta) {
    document.title = m.title
    setMeta('og:title', m.title)
    setMeta('og:description', m.description)
    setMeta('og:image', toAbsolute(m.image))
    if (m.url) setMeta('og:url', toAbsolute(m.url))
    setMeta('twitter:title', m.title, 'name')
    setMeta('twitter:description', m.description, 'name')
    setMeta('twitter:image', toAbsolute(m.image), 'name')
    setMeta('description', m.description, 'name')
  }
  if (meta && typeof meta === 'object' && 'value' in meta) {
    onMounted(() => apply((meta as Ref<OgMeta>).value))
    watch(meta as Ref<OgMeta>, apply, { deep: true })
  } else {
    onMounted(() => apply(meta as OgMeta))
  }
}
