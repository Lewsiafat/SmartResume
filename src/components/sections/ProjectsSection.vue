<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ProjectCard from '../ui/ProjectCard.vue'
import { projects } from '../../data/projects'

const { t } = useI18n()
</script>

<template>
  <section id="projects" class="py-20 bg-gray-50 dark:bg-gray-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="section-title">{{ t('projects.title') }}</h2>
        <p class="section-subtitle">{{ t('projects.subtitle') }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>
