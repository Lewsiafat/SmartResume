<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCard from '../ui/ProjectCard.vue'
import { projects } from '../../data/projects'
import type { ProjectCategory } from '../../types'

const { t } = useI18n()
const activeFilter = ref<ProjectCategory>('All')

const filters: { key: string; value: ProjectCategory }[] = [
  { key: 'projects.filterAll', value: 'All' },
  { key: 'projects.filterFinTech', value: 'FinTech' },
  { key: 'projects.filterIoT', value: 'IoT' },
  { key: 'projects.filterAITools', value: 'AI Tools' },
  { key: 'projects.filterFullStack', value: 'Full-Stack' },
  { key: 'projects.filterGame', value: 'Game' },
]

const filteredProjects = computed(() => {
  if (activeFilter.value === 'All') return projects
  return projects.filter(p => p.category === activeFilter.value)
})
</script>

<template>
  <section id="projects" class="py-20 bg-primary-50 dark:bg-dark-card/50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title">{{ t('projects.title') }}</h2>
      <p class="section-subtitle">{{ t('projects.subtitle') }}</p>

      <!-- Filter Buttons -->
      <div class="flex justify-center flex-wrap gap-3 mb-12">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300"
          :class="activeFilter === filter.value
            ? 'bg-primary-500 text-white border-primary-500'
            : 'bg-ivory dark:bg-dark-card text-secondary-600 dark:text-accent-400 border-primary-100 dark:border-dark-border hover:border-primary-500 hover:text-primary-500'"
        >
          {{ t(filter.key) }}
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </section>
</template>
