<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ThemeToggle from './ThemeToggle.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()
const isMenuOpen = ref(false)

const navLinks = [
  { key: 'nav.about', href: '#about' },
  { key: 'nav.projects', href: '#projects' },
  { key: 'nav.techStack', href: '#tech' },
  { key: 'nav.contact', href: '#contact' },
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
    <nav class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <a href="#" class="text-xl font-bold gradient-text">
          LC
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-gray-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            {{ t(link.key) }}
          </a>
        </div>

        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center space-x-3">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMenu"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          :aria-expanded="isMenuOpen"
          aria-label="Toggle menu"
        >
          <svg
            class="w-6 h-6 text-gray-700 dark:text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!isMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div
        v-show="isMenuOpen"
        class="md:hidden py-4 border-t border-gray-200 dark:border-slate-700"
      >
        <div class="flex flex-col space-y-4">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            @click="closeMenu"
            class="text-gray-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            {{ t(link.key) }}
          </a>
          <div class="flex items-center space-x-3 pt-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
