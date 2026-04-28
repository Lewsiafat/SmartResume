<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import { caseStudiesManifest } from '../data/case-studies-manifest'

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
    html.value = await marked.parse(raw)
    notFound.value = false
  } catch {
    notFound.value = true
    html.value = ''
  }
}

onMounted(loadMarkdown)
watch([projectId, locale], loadMarkdown)
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
