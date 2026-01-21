<script setup lang="ts">
import { useLocale } from '../../composables/useLocale'

const { currentLocale, toggleLocale } = useLocale()
</script>

<template>
  <button
    @click="toggleLocale"
    class="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200"
  >
    {{ currentLocale === 'zh-TW' ? 'EN' : '中' }}
  </button>
</template>
