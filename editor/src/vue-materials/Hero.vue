<template>
  <section class="hero" :style="{ padding: '48px 16px', textAlign: 'center' }">
    <h1>{{ title }}</h1>
    <p>{{ subtitle }}</p>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title?: string; subtitle?: string }>()
</script>
