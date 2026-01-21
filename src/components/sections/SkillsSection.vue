<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SkillCard from '../ui/SkillCard.vue'
import { skills } from '../../data/skills'

const { t } = useI18n()
</script>

<template>
  <section id="skills" class="py-20 bg-white dark:bg-gray-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="section-title">{{ t('skills.title') }}</h2>
        <p class="section-subtitle">{{ t('skills.subtitle') }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkillCard
          v-for="skill in skills"
          :key="skill.id"
          :skill="skill"
        />
      </div>
    </div>
  </section>
</template>
