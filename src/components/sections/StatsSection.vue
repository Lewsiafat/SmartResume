<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { githubStats } from '../../data/stats'

const { t } = useI18n()
</script>

<template>
  <section class="py-20 bg-gray-50 dark:bg-slate-800/50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title">{{ t('stats.title') }}</h2>
      <p class="section-subtitle">{{ t('stats.subtitle') }}</p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        <div
          v-for="stat in githubStats"
          :key="stat.id"
          class="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 text-center"
        >
          <div class="text-4xl font-extrabold gradient-text mb-2">
            {{ stat.value }}
          </div>
          <div class="text-gray-500 dark:text-slate-400 text-sm">
            {{ t(`stats.${stat.id}`) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
