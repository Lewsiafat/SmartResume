<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTyping } from '../../composables/useTyping'

const { t, locale } = useI18n()

const resumePdfLink = computed(() => {
  const file = locale.value === 'en' ? 'resume_en.pdf' : 'resume_zh.pdf'
  return `${import.meta.env.BASE_URL}${file}`
})

const typingTexts = computed(() => [
  t('hero.typingText1'),
  t('hero.typingText2'),
  t('hero.typingText3'),
  t('hero.typingText4'),
])

const { displayText } = useTyping(typingTexts)

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden bg-gradient-to-br from-ivory to-primary-100 dark:from-dark-bg dark:to-primary-900">
    <!-- Decorative orb -->
    <div class="absolute -top-48 -right-48 w-[500px] h-[500px] rounded-full bg-primary-500/10 dark:bg-primary-500/20 blur-3xl pointer-events-none" />

    <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in-up">
      <!-- Name -->
      <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 gradient-text">
        {{ t('hero.name') }}
      </h1>

      <!-- Subtitle -->
      <p class="text-xl sm:text-2xl font-semibold text-accent-500 mb-4">
        {{ t('hero.subtitle') }}
      </p>

      <!-- Typing animation -->
      <div class="text-lg sm:text-xl text-secondary-500 dark:text-accent-400 min-h-[2em] mb-8 font-medium">
        <span>{{ displayText }}</span>
        <span class="animate-blink">|</span>
      </div>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
        <a @click.prevent="scrollTo('projects')" href="#projects" class="btn-primary cursor-pointer">
          {{ t('hero.viewProjects') }} ↓
        </a>
        <a @click.prevent="scrollTo('contact')" href="#contact" class="btn-secondary cursor-pointer">
          {{ t('hero.contactMe') }} →
        </a>
        <a :href="resumePdfLink" target="_blank" rel="noopener noreferrer" class="btn-secondary flex items-center gap-2">
          <span>📄</span> {{ t('hero.downloadResume') }}
        </a>
      </div>
    </div>
  </section>
</template>
