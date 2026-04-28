<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
</script>

<template>
  <div class="min-h-screen p-8">
    <button @click="router.push('/#projects')" class="mb-4">← Back</button>
    <h1>Case Study: {{ route.params.id }}</h1>
    <p>Placeholder — markdown rendering arrives in Task 5.</p>
  </div>
</template>
