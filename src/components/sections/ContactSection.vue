<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { contact } from '../../data/contact'
import { useScrollReveal } from '../../composables/useScrollReveal'
import { trackEvent } from '../../analytics'

const { t } = useI18n()

const sectionRef = ref<HTMLElement | null>(null)
useScrollReveal(sectionRef)

// Set VITE_FORMSPREE_ID in .env.local to enable the contact form.
// Get a free form ID at https://formspree.io (no backend needed).
const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_ID
const FORMSPREE_ENDPOINT = FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${FORMSPREE_FORM_ID}`
  : ''

const form = ref({
  name: '',
  email: '',
  subject: 'inquiry',
  message: '',
})

const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')

const handleSubmit = async () => {
  trackEvent('cta_click_contact', {
    has_message: form.value.message.length > 0,
    has_email: form.value.email.length > 0,
  })

  if (!FORMSPREE_ENDPOINT) {
    // Formspree not configured — show a helpful message
    status.value = 'error'
    setTimeout(() => (status.value = 'idle'), 4000)
    return
  }

  status.value = 'sending'
  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: form.value.name,
        email: form.value.email,
        subject: form.value.subject,
        message: form.value.message,
      }),
    })
    if (res.ok) {
      status.value = 'success'
      form.value = { name: '', email: '', subject: 'inquiry', message: '' }
    } else {
      status.value = 'error'
    }
  } catch {
    status.value = 'error'
  }
  setTimeout(() => (status.value = 'idle'), 5000)
}
</script>

<template>
  <section ref="sectionRef" id="contact" class="py-20 bg-ivory dark:bg-dark-bg">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="section-title">{{ t('contact.title') }}</h2>
      <p class="section-subtitle">{{ t('contact.subtitle') }}</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <!-- Contact Info -->
        <div class="bg-primary-50 dark:bg-dark-card p-8 rounded-2xl border border-primary-100 dark:border-dark-border">
          <h3 class="text-accent-500 font-semibold text-lg mb-6">{{ t('contact.infoTitle') }}</h3>

          <div class="space-y-6">
            <div class="flex items-center gap-4 text-secondary-600 dark:text-accent-400">
              <span class="text-2xl">🐙</span>
              <div>
                <div class="font-medium text-primary-900 dark:text-white">{{ t('contact.github') }}</div>
                <a :href="contact.github.url" target="_blank" rel="noopener noreferrer" class="text-primary-500 hover:text-primary-400">
                  {{ contact.github.handle }}
                </a>
              </div>
            </div>

            <div class="flex items-center gap-4 text-secondary-600 dark:text-accent-400">
              <span class="text-2xl">📧</span>
              <div>
                <div class="font-medium text-primary-900 dark:text-white">{{ t('contact.email') }}</div>
                <a :href="`mailto:${contact.email.address}`" class="text-primary-500 hover:text-primary-400">
                  {{ contact.email.address }}
                </a>
              </div>
            </div>

            <div class="flex items-center gap-4 text-secondary-600 dark:text-accent-400">
              <span class="text-2xl">📍</span>
              <div>
                <div class="font-medium text-primary-900 dark:text-white">{{ t('contact.location') }}</div>
                <span>{{ contact.location }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-primary-100 dark:border-dark-border">
            <p class="text-secondary-600 dark:text-accent-400 text-sm mb-2">{{ t('contact.interests') }}</p>
            <ul class="text-secondary-600 dark:text-accent-400 text-sm space-y-1">
              <li>• {{ t('contact.interest1') }}</li>
              <li>• {{ t('contact.interest2') }}</li>
              <li>• {{ t('contact.interest3') }}</li>
              <li>• {{ t('contact.interest4') }}</li>
            </ul>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-primary-50 dark:bg-dark-card p-8 rounded-2xl border border-primary-100 dark:border-dark-border">
          <h3 class="text-accent-500 font-semibold text-lg mb-6">{{ t('contact.formTitle') }}</h3>

          <!-- Success message -->
          <div v-if="status === 'success'" class="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
            ✅ {{ t('contact.successMessage') }}
          </div>

          <!-- Error message -->
          <div v-else-if="status === 'error'" class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            ⚠️ {{ t('contact.errorMessage') }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="block text-sm text-secondary-600 dark:text-accent-400 mb-1">{{ t('contact.nameLabel') }} *</label>
              <input
                v-model="form.name"
                type="text"
                required
                :placeholder="t('contact.namePlaceholder')"
                class="w-full px-4 py-3 bg-ivory dark:bg-dark-bg border border-primary-100 dark:border-dark-border rounded-lg text-primary-900 dark:text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm text-secondary-600 dark:text-accent-400 mb-1">{{ t('contact.emailLabel') }} *</label>
              <input
                v-model="form.email"
                type="email"
                required
                :placeholder="t('contact.emailPlaceholder')"
                class="w-full px-4 py-3 bg-ivory dark:bg-dark-bg border border-primary-100 dark:border-dark-border rounded-lg text-primary-900 dark:text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm text-secondary-600 dark:text-accent-400 mb-1">{{ t('contact.subjectLabel') }}</label>
              <select
                v-model="form.subject"
                class="w-full px-4 py-3 bg-ivory dark:bg-dark-bg border border-primary-100 dark:border-dark-border rounded-lg text-primary-900 dark:text-white focus:outline-none focus:border-primary-500"
              >
                <option value="inquiry">{{ t('contact.subjectOptions.inquiry') }}</option>
                <option value="collaboration">{{ t('contact.subjectOptions.collaboration') }}</option>
                <option value="question">{{ t('contact.subjectOptions.question') }}</option>
                <option value="other">{{ t('contact.subjectOptions.other') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm text-secondary-600 dark:text-accent-400 mb-1">{{ t('contact.messageLabel') }} *</label>
              <textarea
                v-model="form.message"
                required
                :placeholder="t('contact.messagePlaceholder')"
                rows="4"
                class="w-full px-4 py-3 bg-ivory dark:bg-dark-bg border border-primary-100 dark:border-dark-border rounded-lg text-primary-900 dark:text-white focus:outline-none focus:border-primary-500 resize-y"
              />
            </div>

            <button
              type="submit"
              :disabled="status === 'sending'"
              class="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="status === 'sending'">{{ t('contact.sending') }}...</span>
              <span v-else>{{ t('contact.send') }} →</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
