<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import { caseStudiesManifest } from '../data/case-studies-manifest'
import { useOgMeta, type OgMeta } from '../composables/useOgMeta'
import { trackEvent } from '../analytics'

const caseStudyModules = import.meta.glob<string>(
  '../../ref_src/case_studies/*.md',
  { query: '?raw', import: 'default' }
)

const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n()

const html = ref('')
const notFound = ref(false)

const projectId = computed(() => String(route.params.id))

const ogMetaRef = ref<OgMeta>({
  title: '',
  description: '',
  image: '/og-images/home-zh-TW.png',
})
useOgMeta(ogMetaRef)

async function loadMarkdown() {
  const entry = caseStudiesManifest[projectId.value]
  if (!entry) {
    notFound.value = true
    html.value = ''
    return
  }
  const wantedLocale = entry.locales.includes(locale.value as 'en' | 'zh-TW')
    ? (locale.value as 'en' | 'zh-TW')
    : entry.locales[0]
  const fileName = `${projectId.value}.${wantedLocale}.md`
  const key = Object.keys(caseStudyModules).find(k => k.endsWith('/' + fileName))
  if (!key) {
    notFound.value = true
    html.value = ''
    return
  }
  try {
    const raw = await caseStudyModules[key]()
    const h1 = (raw.match(/^#\s+(.+)$/m)?.[1] || projectId.value).trim()
    const firstPara = (raw.split(/^##\s+/m)[0].split('\n\n').find(p => !p.startsWith('#') && p.trim()) || '').slice(0, 200)
    html.value = await marked.parse(raw)
    notFound.value = false
    trackEvent('case_study_view', { project_id: projectId.value, locale: wantedLocale })
    ogMetaRef.value = {
      title: `${h1} — Case Study`,
      description: firstPara || t('caseStudy.back'),
      image: `/og-images/case-${projectId.value}.png`,
      url: `/projects/${projectId.value}`,
    }
  } catch {
    notFound.value = true
    html.value = ''
  }
}

const halfwayFired = ref(false)

function onScroll() {
  if (halfwayFired.value) return
  const total = document.documentElement.scrollHeight - window.innerHeight
  if (total <= 0) return
  const pct = window.scrollY / total
  if (pct >= 0.5) {
    halfwayFired.value = true
    trackEvent('case_study_time_50pct', { project_id: projectId.value })
  }
}

onMounted(() => {
  loadMarkdown()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

watch([projectId, locale], loadMarkdown)
watch(projectId, () => { halfwayFired.value = false })
</script>

<template>
  <div class="min-h-screen bg-ivory dark:bg-dark-bg">
    <div class="max-w-3xl mx-auto px-6 py-12">
      <button
        @click="router.push('/#projects')"
        class="mb-8 text-primary hover:underline"
      >
        {{ t('caseStudy.back') }}
      </button>
      <article v-if="!notFound" class="prose dark:prose-invert max-w-none" v-html="html" />
      <div v-else class="text-center py-20">
        <p class="text-xl">{{ t('caseStudy.notFound') }}</p>
        <button
          @click="router.push('/#projects')"
          class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
        >
          {{ t('caseStudy.backToProjects') }}
        </button>
      </div>
    </div>
  </div>
</template>
