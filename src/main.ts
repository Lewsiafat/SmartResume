import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { router } from './router'
import { initAnalytics } from './analytics'
import './style.css'

console.info(`[SmartResume] build ${__BUILD_SHA__} · ${__BUILD_TIME__}`)

const app = createApp(App)
app.use(i18n)
app.use(router)
app.mount('#app')
initAnalytics()
