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

export function useOgMeta(meta: Ref<OgMeta> | OgMeta) {
  function apply(m: OgMeta) {
    document.title = m.title
    setMeta('og:title', m.title)
    setMeta('og:description', m.description)
    setMeta('og:image', new URL(m.image, location.origin).toString())
    if (m.url) setMeta('og:url', m.url)
    setMeta('twitter:title', m.title, 'name')
    setMeta('twitter:description', m.description, 'name')
    setMeta('twitter:image', new URL(m.image, location.origin).toString(), 'name')
    setMeta('description', m.description, 'name')
  }
  if (meta && typeof meta === 'object' && 'value' in meta) {
    onMounted(() => apply((meta as Ref<OgMeta>).value))
    watch(meta as Ref<OgMeta>, apply, { deep: true })
  } else {
    onMounted(() => apply(meta as OgMeta))
  }
}
