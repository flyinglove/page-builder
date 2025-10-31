<!-- site/components/Renderer.vue -->
<script setup lang="ts">
import { h, resolveComponent, defineProps } from "vue"

type NodeType = "Section" | "Hero" | "Grid" | "Card" | "CtaButton" | "Carousel"
interface SchemaNode {
  type: NodeType
  props?: Record<string, any>
  children?: SchemaNode[]
}

const props = defineProps<{ node: SchemaNode }>()

// Nuxt 会按目录名给组件自动加前缀 “Blocks”
const registry: Record<string, any> = {
  Section: resolveComponent("BlocksSection"),
  Hero: resolveComponent("BlocksHero"),
  Grid: resolveComponent("BlocksGrid"),
  Card: resolveComponent("BlocksCard"),
  CtaButton: resolveComponent("BlocksCtaButton"),
  Carousel: resolveComponent("BlocksCarousel"), // 如果你把 Carousel 放在 blocks 目录下
}

const Comp = registry[props.node.type] || "div"
const slots = props.node.children?.length
  ? {
      default: () =>
        props.node.children!.map((c, i) =>
          h(resolveComponent("Renderer"), { node: c, key: i })
        ),
    }
  : undefined
</script>

<template>
  <component :is="Comp" v-bind="node.props" v-if="Comp">
    <template v-if="node.children?.length" #default>
      <Renderer v-for="(c, i) in node.children" :key="i" :node="c" />
    </template>
  </component>
</template>
