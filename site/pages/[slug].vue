<script setup lang="ts">
import type { PageSchema } from "../types"
import { useRenderNode } from "../composables/useRenderNode"

const route = useRoute()
const slug = computed(() => (route.params.slug as string) || "home")

const { data: page } = await useAsyncData<PageSchema>(
  () => `page:${slug.value}`,
  () => $fetch(`/api/pages/${slug.value}`),
  { server: true }
)

if (page.value) {
  useHead({
    title: page.value.title || slug.value,
    meta: [{ name: "description", content: page.value.description || "" }],
  })
}

const { renderNode } = useRenderNode()
</script>

<template>
  <div>
    <component :is="'div'" v-for="(node, i) in page?.body || []" :key="i">
      <component :is="renderNode(node)" />
    </component>
  </div>
</template>
