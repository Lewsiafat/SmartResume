import { ref, watch, onMounted } from 'vue'
import type { ThemeMode } from '../types'

const theme = ref<ThemeMode>('light')

export function useTheme() {
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null
    if (savedTheme) {
      theme.value = savedTheme
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
    applyTheme()
  }

  const applyTheme = () => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  const isDark = () => theme.value === 'dark'

  onMounted(() => {
    initTheme()
  })

  watch(theme, () => {
    applyTheme()
  })

  return {
    theme,
    toggleTheme,
    isDark,
  }
}
