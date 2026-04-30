<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import TheHeader from '../components/layout/TheHeader.vue'
import TheFooter from '../components/layout/TheFooter.vue'
import HeroSection from '../components/sections/HeroSection.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import ProjectsSection from '../components/sections/ProjectsSection.vue'
import TechStackSection from '../components/sections/TechStackSection.vue'
import StatsSection from '../components/sections/StatsSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import { useOgMeta } from '../composables/useOgMeta'
import { trackEvent } from '../analytics'

const { t, locale } = useI18n()

const ogMeta = computed(() => ({
  title: t('hero.name') + ' — ' + t('hero.subtitle'),
  description: t('hero.typingText1'),
  image: `/og-images/home-${locale.value}.png`,
  url: '/',
}))

useOgMeta(ogMeta)

onMounted(() => {
  const ref = document.referrer || 'direct'
  let source = 'direct'
  try {
    if (ref !== 'direct') {
      const host = new URL(ref).hostname.toLowerCase()
      if (host.includes('linkedin')) source = 'linkedin'
      else if (host.includes('twitter') || host.includes('t.co') || host.includes('x.com')) source = 'twitter'
      else if (host.includes('github')) source = 'github'
      else if (host.includes('google')) source = 'google'
      else source = host
    }
  } catch {}
  trackEvent('og_share_referrer', { source, raw: ref || null })
})
</script>

<template>
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
</template>
