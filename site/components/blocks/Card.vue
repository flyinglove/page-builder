<template>
  <article class="card">
    <h3>{{ title }}</h3>
    <p>{{ desc }}</p>
  </article>
</template>
<script setup lang="ts">
const props = defineProps<{ title?: string; desc?: string }>()
</script>
<style scoped>
.card {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
}
.card h3 {
  margin: 0 0 8px;
}
</style>
