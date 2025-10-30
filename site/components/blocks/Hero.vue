<template>
  <div class="hero">
    <h1>{{ title }}</h1>
    <p class="sub">{{ subtitle }}</p>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ title?: string; subtitle?: string }>()
</script>
<style scoped>
.hero {
  padding: 56px 16px;
  text-align: center;
}
.hero h1 {
  font-size: 40px;
  margin: 0 0 12px;
}
.sub {
  opacity: 0.8;
}
@media (max-width: 768px) {
  .hero h1 {
    font-size: 28px;
  }
}
</style>
