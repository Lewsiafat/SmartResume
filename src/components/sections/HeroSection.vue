<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const avatarSrc = ref('/avatar.jpg')
const fallbackAvatar = 'https://ui-avatars.com/api/?name=Lewis+Chan&size=160&background=3b82f6&color=fff'

const handleAvatarError = () => {
  avatarSrc.value = fallbackAvatar
}
</script>

<template>
  <section class="min-h-screen flex items-center justify-center pt-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="flex flex-col items-center text-center">
        <!-- Avatar -->
        <div class="relative mb-8">
          <div class="w-40 h-40 rounded-full overflow-hidden ring-4 ring-primary-500/20 shadow-xl">
            <img
              :src="avatarSrc"
              alt="Lewis Chan"
              class="w-full h-full object-cover"
              @error="handleAvatarError"
            />
          </div>
          <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-800">
            <span class="text-white text-lg">👋</span>
          </div>
        </div>

        <!-- Text Content -->
        <div class="space-y-4">
          <p class="text-lg text-gray-600 dark:text-gray-400">
            {{ t('hero.greeting') }}
          </p>
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            {{ t('hero.name') }}
          </h1>
          <h2 class="text-xl sm:text-2xl text-primary-600 dark:text-primary-400 font-medium">
            {{ t('hero.title') }}
          </h2>
          <p class="max-w-2xl text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            {{ t('hero.description') }}
          </p>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <a href="#projects" class="btn-primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {{ t('hero.viewProjects') }}
          </a>
          <a
            href="https://github.com/lewischan"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-secondary"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            {{ t('hero.github') }}
          </a>
        </div>

        <!-- Scroll Indicator -->
        <div class="mt-16 animate-bounce">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>
