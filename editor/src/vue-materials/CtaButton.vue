<!-- editor/src/vue-materials/CtaButton.vue -->
<template>
  <a
    class="cta"
    :class="[`s-${size}`, `t-${tone}`, { block }]"
    :href="href || '#'"
    :target="newTab ? '_blank' : undefined"
    :aria-label="ariaLabel || text"
    @click.prevent
    >{{ text }}</a
  >
</template>

<script setup lang="ts">
const props = defineProps<{
  text?: string
  href?: string
  size?: "sm" | "md" | "lg"
  tone?: "primary" | "neutral" | "danger"
  block?: boolean
  newTab?: boolean
  ariaLabel?: string
}>()
</script>

<style scoped>
.cta {
  display: inline-block;
  border: 1px solid #111;
  border-radius: 10px;
  padding: 10px 16px;
  text-decoration: none;
  transition: 0.2s;
}

/* 尺寸 */
.s-sm {
  font-size: 12px;
  padding: 8px 12px;
}
.s-md {
  font-size: 14px;
  padding: 10px 16px;
}
.s-lg {
  font-size: 16px;
  padding: 12px 20px;
}

/* 色调（示意） */
.t-primary {
  background: #111;
  color: #fff;
  border-color: #111;
}
.t-neutral {
  background: #fff;
  color: #111;
}
.t-danger {
  background: #b91c1c;
  color: #fff;
  border-color: #b91c1c;
}

/* 通栏 */
.block {
  display: block;
  text-align: center;
  width: 100%;
}
</style>
