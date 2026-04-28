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
