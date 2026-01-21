<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Project } from '../../types'

defineProps<{
  project: Project
}>()

const { t } = useI18n()
</script>

<template>
  <div class="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
    <!-- Project Image -->
    <div class="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-6xl text-white/20">{{ project.id === 'tradeGuard' ? '📈' : project.id === 'webShareee' ? '🔗' : project.id === 'aiReview' ? '🤖' : '🚀' }}</span>
      </div>
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div class="flex gap-3">
          <a
            v-if="project.github"
            :href="project.github"
            target="_blank"
            rel="noopener noreferrer"
            class="p-3 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
            :aria-label="t('projects.viewCode')"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          <a
            v-if="project.demo"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
            class="p-3 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
            :aria-label="t('projects.liveDemo')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Project Info -->
    <div class="p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {{ t(`projects.${project.id}.title`) }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {{ t(`projects.${project.id}.description`) }}
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>
