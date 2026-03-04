<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { techCategories } from '../../data/techStack'

const { t } = useI18n()

const categoryTitleMap: Record<string, string> = {
  languages: 'techStack.languages',
  frameworks: 'techStack.frameworks',
  tools: 'techStack.tools',
  specializations: 'techStack.specializations',
}
</script>

<template>
  <section id="tech" class="py-20 bg-white dark:bg-slate-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title">{{ t('techStack.title') }}</h2>
      <p class="section-subtitle">{{ t('techStack.subtitle') }}</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div
          v-for="category in techCategories"
          :key="category.id"
          class="bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700"
        >
          <h3 class="text-accent-500 font-semibold mb-4 flex items-center gap-2">
            <span>{{ category.icon }}</span>
            {{ t(categoryTitleMap[category.id]) }}
          </h3>
          <ul class="space-y-2">
            <li
              v-for="item in category.items"
              :key="item"
              class="text-gray-600 dark:text-slate-400 text-sm flex items-center gap-2"
            >
              <span class="text-primary-500 font-bold">▹</span>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
