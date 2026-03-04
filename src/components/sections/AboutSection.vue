<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { skillBars } from '../../data/skills'

const { t } = useI18n()
const skillsVisible = ref(false)
const skillsRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        skillsVisible.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.3 }
  )
  if (skillsRef.value) {
    observer.observe(skillsRef.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <section id="about" class="py-20 bg-white dark:bg-slate-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title">{{ t('about.title') }}</h2>
      <p class="section-subtitle">{{ t('about.subtitle') }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <!-- What I Do -->
        <div class="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl border border-gray-200 dark:border-slate-700">
          <h3 class="text-accent-500 font-semibold text-lg mb-4 flex items-center gap-2">
            🎯 {{ t('about.whatIDo') }}
          </h3>
          <p class="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            {{ t('about.whatIDoContent') }}
          </p>
          <p class="text-accent-500 font-semibold mb-2">{{ t('about.currentFocus') }}</p>
          <ul class="text-gray-600 dark:text-slate-400 space-y-1">
            <li>• {{ t('about.focus1') }}</li>
            <li>• {{ t('about.focus2') }}</li>
            <li>• {{ t('about.focus3') }}</li>
          </ul>
        </div>

        <!-- Skills -->
        <div ref="skillsRef" class="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl border border-gray-200 dark:border-slate-700">
          <h3 class="text-accent-500 font-semibold text-lg mb-4 flex items-center gap-2">
            💻 {{ t('about.skillsTitle') }}
          </h3>
          <div
            v-for="skill in skillBars"
            :key="skill.name"
            class="mb-4 last:mb-0"
          >
            <div class="flex justify-between mb-1 text-sm">
              <span class="text-gray-700 dark:text-slate-300">{{ skill.name }}</span>
              <span class="text-gray-500 dark:text-slate-400">{{ skill.percentage }}%</span>
            </div>
            <div class="h-2 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-1000 ease-out"
                style="background: linear-gradient(90deg, #667eea, #10b981)"
                :style="{ width: skillsVisible ? `${skill.percentage}%` : '0%' }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
