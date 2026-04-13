<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Project } from '../../types'

defineProps<{
  project: Project
}>()

const { t } = useI18n()
</script>

<template>
  <div class="group bg-ivory dark:bg-dark-card rounded-2xl overflow-hidden border border-primary-100 dark:border-dark-border transition-all duration-300 hover:-translate-y-2 hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/10 dark:hover:shadow-primary-500/20">
    <!-- Emoji Header -->
    <div class="h-48 flex items-center justify-center text-7xl" style="background: linear-gradient(135deg, #475569, #94a3b8);">
      {{ project.emoji }}
    </div>

    <!-- Content -->
    <div class="p-6">
      <h3 class="text-xl font-semibold text-primary-900 dark:text-white mb-1">
        {{ t(`projects.${project.id}.title`) }}
      </h3>
      <p class="text-sm text-secondary-500 dark:text-accent-400 mb-3">
        {{ t(`projects.${project.id}.subtitle`) }}
      </p>
      <p class="text-secondary-600 dark:text-accent-400 text-sm mb-4 leading-relaxed">
        {{ t(`projects.${project.id}.description`) }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="px-3 py-1 text-xs rounded-full border border-primary-500/20 bg-primary-500/10 text-primary-600 dark:text-primary-400"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Stats -->
      <div class="flex flex-wrap gap-3 text-sm text-secondary-500 dark:text-accent-400 mb-4">
        <span v-for="stat in project.stats" :key="stat">{{ stat }}</span>
      </div>

      <!-- Links -->
      <div class="flex gap-4">
        <a
          v-if="project.github"
          :href="project.github"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary-500 hover:text-accent-500 font-semibold text-sm transition-colors"
        >
          {{ t('projects.viewCode') }} →
        </a>
        <a
          v-if="project.demo"
          :href="project.demo"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary-500 hover:text-accent-500 font-semibold text-sm transition-colors"
        >
          {{ t('projects.liveDemo') }} →
        </a>
      </div>
    </div>
  </div>
</template>
