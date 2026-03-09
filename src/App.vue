<script setup lang="ts">
import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'
import HeroSection from './components/sections/HeroSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import ProjectsSection from './components/sections/ProjectsSection.vue'
import TechStackSection from './components/sections/TechStackSection.vue'
import StatsSection from './components/sections/StatsSection.vue'
import ContactSection from './components/sections/ContactSection.vue'
import { useTheme } from './composables/useTheme'

useTheme()
</script>

<template>
  <div class="min-h-screen bg-ivory dark:bg-dark-bg transition-colors duration-200">
    <TheHeader />
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <TechStackSection />
      <StatsSection />
      <ContactSection />
    </main>
    <TheFooter />
  </div>
</template>
