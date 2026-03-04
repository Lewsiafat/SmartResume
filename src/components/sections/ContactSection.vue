<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const form = ref({
  name: '',
  email: '',
  subject: 'inquiry',
  message: '',
})

const handleSubmit = () => {
  alert('Thank you for your message! This feature will be connected to a backend service soon.')
}
</script>

<template>
  <section id="contact" class="py-20 bg-white dark:bg-slate-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title">{{ t('contact.title') }}</h2>
      <p class="section-subtitle">{{ t('contact.subtitle') }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <!-- Contact Info -->
        <div class="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl border border-gray-200 dark:border-slate-700">
          <h3 class="text-accent-500 font-semibold text-lg mb-6">{{ t('contact.infoTitle') }}</h3>

          <div class="space-y-6">
            <div class="flex items-center gap-4 text-gray-600 dark:text-slate-400">
              <span class="text-2xl">🐙</span>
              <div>
                <div class="font-medium text-gray-700 dark:text-slate-300">{{ t('contact.github') }}</div>
                <a href="https://github.com/Lewsiafat" target="_blank" rel="noopener noreferrer" class="text-primary-500 hover:text-primary-400">@Lewsiafat</a>
              </div>
            </div>

            <div class="flex items-center gap-4 text-gray-600 dark:text-slate-400">
              <span class="text-2xl">📧</span>
              <div>
                <div class="font-medium text-gray-700 dark:text-slate-300">{{ t('contact.email') }}</div>
                <a href="mailto:lewsiafat@gmail.com" class="text-primary-500 hover:text-primary-400">lewsiafat@gmail.com</a>
              </div>
            </div>

            <div class="flex items-center gap-4 text-gray-600 dark:text-slate-400">
              <span class="text-2xl">📍</span>
              <div>
                <div class="font-medium text-gray-700 dark:text-slate-300">{{ t('contact.location') }}</div>
                <span>{{ t('contact.locationValue') }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
            <p class="text-gray-600 dark:text-slate-400 text-sm mb-2">{{ t('contact.interests') }}</p>
            <ul class="text-gray-600 dark:text-slate-400 text-sm space-y-1">
              <li>• {{ t('contact.interest1') }}</li>
              <li>• {{ t('contact.interest2') }}</li>
              <li>• {{ t('contact.interest3') }}</li>
              <li>• {{ t('contact.interest4') }}</li>
            </ul>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-gray-50 dark:bg-slate-800 p-8 rounded-2xl border border-gray-200 dark:border-slate-700">
          <h3 class="text-accent-500 font-semibold text-lg mb-6">{{ t('contact.formTitle') }}</h3>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="block text-sm text-gray-600 dark:text-slate-400 mb-1">{{ t('contact.nameLabel') }} *</label>
              <input
                v-model="form.name"
                type="text"
                required
                :placeholder="t('contact.namePlaceholder')"
                class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-slate-200 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 dark:text-slate-400 mb-1">{{ t('contact.emailLabel') }} *</label>
              <input
                v-model="form.email"
                type="email"
                required
                :placeholder="t('contact.emailPlaceholder')"
                class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-slate-200 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm text-gray-600 dark:text-slate-400 mb-1">{{ t('contact.subjectLabel') }}</label>
              <select
                v-model="form.subject"
                class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-slate-200 focus:outline-none focus:border-primary-500"
              >
                <option value="inquiry">{{ t('contact.subjectOptions.inquiry') }}</option>
                <option value="collaboration">{{ t('contact.subjectOptions.collaboration') }}</option>
                <option value="question">{{ t('contact.subjectOptions.question') }}</option>
                <option value="other">{{ t('contact.subjectOptions.other') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-gray-600 dark:text-slate-400 mb-1">{{ t('contact.messageLabel') }} *</label>
              <textarea
                v-model="form.message"
                required
                :placeholder="t('contact.messagePlaceholder')"
                rows="4"
                class="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-slate-200 focus:outline-none focus:border-primary-500 resize-y"
              />
            </div>

            <button type="submit" class="btn-primary w-full">
              {{ t('contact.send') }} →
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
