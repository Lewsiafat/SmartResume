<script setup lang="ts">
import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'
import HeroSection from './components/sections/HeroSection.vue'
import SkillsSection from './components/sections/SkillsSection.vue'
import ProjectsSection from './components/sections/ProjectsSection.vue'
import { useTheme } from './composables/useTheme'

useTheme()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
    <TheHeader />
    <main>
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
    </main>
    <TheFooter />
  </div>
</template>
