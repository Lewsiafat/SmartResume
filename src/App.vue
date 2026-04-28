<script setup lang="ts">
import { useTheme } from './composables/useTheme'
useTheme()
</script>

<template>
  <div class="min-h-screen bg-ivory dark:bg-dark-bg transition-colors duration-200">
    <RouterView />
  </div>
</template>
