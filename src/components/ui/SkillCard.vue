<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Skill } from '../../types'

defineProps<{
  skill: Skill
}>()

const { t } = useI18n()
</script>

<template>
  <div class="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
    <div class="flex items-center mb-4">
      <span class="text-3xl mr-3">{{ skill.icon }}</span>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t(`skills.${skill.id}.title`) }}
      </h3>
    </div>
    <div class="flex flex-wrap gap-2">
      <span
        v-for="item in skill.items"
        :key="item"
        class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-200"
      >
        {{ item }}
      </span>
    </div>
  </div>
</template>
