<template>
  <NuxtLink :to="href || '#'" class="cta">{{ text || "立即行动" }}</NuxtLink>
</template>
<script setup lang="ts">
const props = defineProps<{ text?: string; href?: string }>()
</script>
<style scoped>
.cta {
  display: inline-block;
  padding: 10px 16px;
  border: 1px solid #111;
  border-radius: 8px;
}
</style>
