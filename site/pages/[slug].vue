<script setup lang="ts">
import type { SchemaNode } from "../types"
const route = useRoute()
const slug = computed(() => (route.params.slug as string) || "home")

const { data: page, error } = await useAsyncData(
  () => `page:${slug.value}`,
  () => $fetch(`/api/pages/${slug.value}`),
  { server: true }
)

if (error.value) {
  console.error("Fetch schema error:", error.value)
}

if (page.value) {
  useHead({
    title: page.value.title || slug.value,
    meta: [{ name: "description", content: page.value.description || "" }],
  })
}
</script>

<template>
  <div>
    <Renderer
      v-for="(node, i) in (page?.body as SchemaNode[] || [])"
      :key="i"
      :node="node"
    />
  </div>
</template>
