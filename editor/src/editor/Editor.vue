<template>
  <div style="display: flex; gap: 8px; width: 100%">
    <div
      id="gjs"
      style="border: 1px solid #ddd; flex: 1; min-height: 100vh"
    ></div>
    <div style="width: 320px; display: flex; flex-direction: column; gap: 8px">
      <button @click="save" style="padding: 8px 12px">
        保存为 JSON（打印到控制台）
      </button>
      <textarea
        v-model="raw"
        placeholder="JSON 预览"
        style="flex: 1"
      ></textarea>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
import { initGrapes } from "./grapes/initGrapes"
import { toSchema } from "./grapes/saveSchema"

const raw = ref("")
let editor: any

onMounted(() => {
  editor = initGrapes("#gjs")
})

function save() {
  const schema = toSchema(editor)
  raw.value = JSON.stringify(schema, null, 2)
  console.log("PAGE_SCHEMA", schema)
}
</script>
