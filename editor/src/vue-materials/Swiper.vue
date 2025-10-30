<template>
  <div
    class="carousel"
    :class="{ 'is-dragging': isDragging }"
    ref="rootEl"
    role="region"
    :aria-label="ariaLabel"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :style="{ height }"
  >
    <div
      class="carousel-track"
      ref="trackEl"
      :style="trackStyle"
      @transitionend="onTransitionEnd"
      @keydown.left.prevent.stop="prev"
      @keydown.right.prevent.stop="next"
      tabindex="0"
      role="listbox"
      :aria-roledescription="`carousel`"
    >
      <div
        v-if="loop && logicalSlides.length > 1"
        class="carousel-slide is-clone"
        role="option"
        aria-hidden="true"
        :style="slideStyle"
      >
        <slot
          name="slide"
          :item="logicalSlides[logicalSlides.length - 1]"
          :index="-1"
        >
          <div class="carousel-default">
            {{ logicalSlides[logicalSlides.length - 1] }}
          </div>
        </slot>
      </div>

      <div
        v-for="(item, i) in logicalSlides"
        :key="`slide-${i}`"
        class="carousel-slide"
        role="option"
        :aria-selected="currentLogicalIndex === i"
        :style="slideStyle"
      >
        <slot name="slide" :item="item" :index="i">
          <div class="carousel-default">{{ item }}</div>
        </slot>
      </div>

      <div
        v-if="loop && logicalSlides.length > 1"
        class="carousel-slide is-clone"
        role="option"
        aria-hidden="true"
        :style="slideStyle"
      >
        <slot
          name="slide"
          :item="logicalSlides[0]"
          :index="logicalSlides.length"
        >
          <div class="carousel-default">{{ logicalSlides[0] }}</div>
        </slot>
      </div>
    </div>

    <button
      v-if="showArrows && logicalSlides.length > 1"
      class="carousel-arrow prev"
      type="button"
      @click="prev"
      aria-label="Previous slide"
    >
      ‹
    </button>
    <button
      v-if="showArrows && logicalSlides.length > 1"
      class="carousel-arrow next"
      type="button"
      @click="next"
      aria-label="Next slide"
    >
      ›
    </button>

    <div
      v-if="showIndicators && logicalSlides.length > 1"
      class="carousel-dots"
      role="tablist"
    >
      <button
        v-for="(item, i) in logicalSlides"
        :key="`dot-${i}`"
        class="carousel-dot"
        :class="{ active: currentLogicalIndex === i }"
        role="tab"
        :aria-selected="currentLogicalIndex === i"
        :aria-controls="`slide-${i}`"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"
type SlideItem = unknown

const props = withDefaults(
  defineProps<{
    items?: SlideItem[]
    modelValue?: number
    loop?: boolean
    autoplay?: boolean
    interval?: number
    pauseOnHover?: boolean
    draggable?: boolean
    showIndicators?: boolean
    showArrows?: boolean
    duration?: number
    easing?: string
    ariaLabel?: string
    height?: string // 新增：编辑面板可直接改高度，如 "280px" / "40vh"
  }>(),
  {
    items: () => [],
    modelValue: 0,
    loop: true,
    autoplay: true,
    interval: 3000,
    pauseOnHover: true,
    draggable: true,
    showIndicators: true,
    showArrows: true,
    duration: 350,
    easing: "ease",
    ariaLabel: "Carousel",
    height: "280px",
  }
)

const emit = defineEmits<{ "update:modelValue": [number]; change: [number] }>()

const rootEl = ref<HTMLDivElement | null>(null)
const trackEl = ref<HTMLDivElement | null>(null)

const logicalSlides = computed(() => props.items || [])
const slideCount = computed(() => logicalSlides.value.length)

const width = ref(0)
const isAnimating = ref(false)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragDeltaX = ref(0)

const internalIndex = ref(clampIndex(props.modelValue))
function clampIndex(i: number) {
  return !slideCount.value ? 0 : Math.min(Math.max(i, 0), slideCount.value - 1)
}
watch(
  () => props.modelValue,
  (v) => {
    if (v != null && v !== currentLogicalIndex.value) goTo(v)
  }
)

const currentLogicalIndex = computed(() => internalIndex.value)
const totalFrames = computed(() =>
  props.loop && slideCount.value > 1 ? slideCount.value + 2 : slideCount.value
)

const translateX = computed(() => {
  if (!width.value) return 0
  const visualIndex =
    props.loop && slideCount.value > 1
      ? internalIndex.value + 1
      : internalIndex.value
  return (
    -(visualIndex * width.value) + (isDragging.value ? dragDeltaX.value : 0)
  )
})

const trackStyle = computed(() => ({
  width: `${totalFrames.value * width.value}px`,
  transform: `translate3d(${translateX.value}px,0,0)`,
  transition:
    isAnimating.value && !isDragging.value
      ? `transform ${props.duration}ms ${props.easing}`
      : "none",
}))
const slideStyle = computed(() => ({
  width: `${width.value}px`,
  flex: `0 0 ${width.value}px`,
}))

let ro: ResizeObserver | null = null
onMounted(() => {
  if (!rootEl.value) return
  const measure = () => {
    width.value = rootEl.value!.clientWidth
  }
  measure()
  ro = new ResizeObserver(measure)
  ro.observe(rootEl.value)
  attachDrag()
  startAutoplay()
  window.addEventListener("visibilitychange", onVisibility)
})
onBeforeUnmount(() => {
  ro?.disconnect()
  ro = null
  stopAutoplay()
  detachDrag()
  window.removeEventListener("visibilitychange", onVisibility)
})

function onTransitionEnd() {
  if (!props.loop || slideCount.value <= 1) return
  isAnimating.value = false
}
function goTo(i: number) {
  if (!slideCount.value) return
  const t = clampIndex(i)
  if (t === internalIndex.value) return
  isAnimating.value = true
  internalIndex.value = t
  emit("update:modelValue", t)
  emit("change", t)
}
function next() {
  if (!slideCount.value) return
  if (props.loop) {
    isAnimating.value = true
    internalIndex.value = (internalIndex.value + 1) % slideCount.value
  } else {
    goTo(Math.min(internalIndex.value + 1, slideCount.value - 1))
  }
  emit("update:modelValue", internalIndex.value)
  emit("change", internalIndex.value)
}
function prev() {
  if (!slideCount.value) return
  if (props.loop) {
    isAnimating.value = true
    internalIndex.value =
      (internalIndex.value - 1 + slideCount.value) % slideCount.value
  } else {
    goTo(Math.max(internalIndex.value - 1, 0))
  }
  emit("update:modelValue", internalIndex.value)
  emit("change", internalIndex.value)
}

let timer: number | null = null
function startAutoplay() {
  stopAutoplay()
  if (!props.autoplay || slideCount.value <= 1) return
  timer = window.setInterval(() => {
    if (!document.hidden) next()
  }, props.interval)
}
function stopAutoplay() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
function onVisibility() {
  if (document.hidden) stopAutoplay()
  else startAutoplay()
}
function handleMouseEnter() {
  if (props.pauseOnHover) stopAutoplay()
}
function handleMouseLeave() {
  if (props.pauseOnHover) startAutoplay()
}

let detachFns: (() => void)[] = []
function attachDrag() {
  if (!props.draggable || !trackEl.value) return
  const el = trackEl.value
  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return
    isDragging.value = true
    isAnimating.value = false
    dragStartX.value = e.clientX
    dragDeltaX.value = 0
    el.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging.value) return
    dragDeltaX.value = e.clientX - dragStartX.value
  }
  const onPointerUp = () => {
    if (!isDragging.value) return
    isDragging.value = false
    const delta = dragDeltaX.value
    dragDeltaX.value = 0
    const th = Math.max(30, width.value * 0.15)
    if (delta > th) prev()
    else if (delta < -th) next()
    else isAnimating.value = true
  }
  el.addEventListener("pointerdown", onPointerDown)
  window.addEventListener("pointermove", onPointerMove)
  window.addEventListener("pointerup", onPointerUp)
  detachFns = [
    () => el.removeEventListener("pointerdown", onPointerDown),
    () => window.removeEventListener("pointermove", onPointerMove),
    () => window.removeEventListener("pointerup", onPointerUp),
  ]
}
function detachDrag() {
  detachFns.forEach((fn) => fn())
  detachFns = []
}
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  user-select: none;
}
.carousel-track {
  display: flex;
  will-change: transform;
}
.carousel-slide {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-default {
  width: 100%;
  height: 100%;
  background: #f3f4f6;
  color: #111;
  display: grid;
  place-items: center;
  font-size: 20px;
}
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  appearance: none;
  background: rgba(17, 17, 17, 0.6);
  color: #fff;
  border: 0;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  cursor: pointer;
  display: grid;
  place-items: center;
}
.carousel-arrow.prev {
  left: 8px;
}
.carousel-arrow.next {
  right: 8px;
}
.carousel-arrow:hover {
  background: rgba(17, 17, 17, 0.8);
}
.carousel-dots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  display: flex;
  gap: 8px;
  justify-content: center;
}
.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: 0;
  background: #cbd5e1;
  cursor: pointer;
}
.carousel-dot.active {
  background: #111;
}
.is-dragging .carousel-track {
  transition: none !important;
}
</style>
