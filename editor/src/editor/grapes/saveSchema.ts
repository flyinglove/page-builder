import type { PageSchema, SchemaNode } from '../../types/schema'
import { vueBlocks } from '../../vue-materials'

// 物料 -> props 元数据映射
const metaMap: Record<string, { name: string }[]> =
  Object.fromEntries(vueBlocks.map(b => [b.type, b.props]))

  function parseMaybeJsonArray(v: any) {
  if (Array.isArray(v)) return v
  if (typeof v === 'string') {
    try { const o = JSON.parse(v); return Array.isArray(o) ? o : v } catch { return v }
  }
  return v
}
/**
 * 将 GrapesJS 组件模型递归转换为 SchemaNode
 * 只收集我们注册过的 Vue 物料（按 type 识别）
 */
export function componentToNode(cmp: any): SchemaNode | null {
  const type: string = cmp.get('type')
  const propMetas = metaMap[type]
  if (!propMetas) return null

  const props: Record<string, any> = {}
  for (const m of propMetas) {
    const val = cmp.get(m.name)
    // 针对 Carousel.items（textarea 存 JSON）做解析
    props[m.name] = m.name === 'items' ? parseMaybeJsonArray(val) : val
  }

  const children: SchemaNode[] = []
  ;(cmp.components?.() || []).forEach((ch: any) => {
    const node = componentToNode(ch)
    if (node) children.push(node)
  })

  return { type: type as SchemaNode['type'], props, children }
}
/**
 * 导出整页 PageSchema
 * 从根 wrapper 的第一层开始遍历，收集所有物料节点
 */

export function toSchema(editor: any): PageSchema {
  const wrapper = editor.getWrapper()
  const roots = wrapper?.components?.() || []
  const body: SchemaNode[] = []
  roots.forEach((cmp: any) => {
    const node = componentToNode(cmp)
    if (node) body.push(node)
  })
  return { slug: 'home', title: 'Home', description: 'Demo', body, updatedAt: new Date().toISOString() }
}
