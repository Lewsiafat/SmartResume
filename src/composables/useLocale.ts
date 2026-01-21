import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from '../types'

export function useLocale() {
  const { locale } = useI18n()

  const currentLocale = computed(() => locale.value as Locale)

  const initLocale = () => {
    const savedLocale = localStorage.getItem('locale') as Locale | null
    if (savedLocale && ['zh-TW', 'en'].includes(savedLocale)) {
      locale.value = savedLocale
    }
  }

  const setLocale = (newLocale: Locale) => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
    document.documentElement.lang = newLocale === 'zh-TW' ? 'zh-TW' : 'en'
  }

  const toggleLocale = () => {
    const newLocale: Locale = locale.value === 'zh-TW' ? 'en' : 'zh-TW'
    setLocale(newLocale)
  }

  onMounted(() => {
    initLocale()
  })

  return {
    currentLocale,
    setLocale,
    toggleLocale,
  }
}
