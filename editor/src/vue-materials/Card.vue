<!-- editor/src/vue-materials/Card.vue -->
<template>
  <article
    class="card"
    :class="[
      `v-${variant}`,
      `a-${align}`,
      rounded ? 'rounded' : 'square',
      `e-${elevation}`,
    ]"
  >
    <h3 class="title">{{ title }}</h3>
    <p class="desc">{{ desc }}</p>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  title?: string
  desc?: string
  variant?: "solid" | "outline" | "soft"
  align?: "left" | "center" | "right"
  elevation?: number
  rounded?: boolean
}>()

// 这里也可以根据 props 做复杂渲染逻辑
</script>

<style scoped>
.card {
  padding: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: 0.2s;
}
.title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
}
.desc {
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

/* 对齐 */
.a-left {
  text-align: left;
}
.a-center {
  text-align: center;
}
.a-right {
  text-align: right;
}

/* 变体 */
.v-solid {
  background: #111;
  color: #fff;
  border-color: #111;
}
.v-outline {
  background: #fff;
  color: #111;
  border-color: #111;
}
.v-soft {
  background: #f5f7fb;
}

/* 阴影等级（示意） */
.e-0 {
  box-shadow: none;
}
.e-1 {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}
.e-2 {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
.e-3 {
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

/* 圆角 */
.rounded {
  border-radius: 12px;
}
.square {
  border-radius: 0;
}
</style>
