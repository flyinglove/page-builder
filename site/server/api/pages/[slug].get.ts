// 更稳：不要从 .d.ts import 类型，直接写内联类型
type NodeType = 'Section'|'Hero'|'Grid'|'Card'|'CtaButton'|'Carousel'
type SchemaNode = { type: NodeType; props?: Record<string, any>; children?: SchemaNode[] }
type PageSchema = { slug: string; title?: string; description?: string; body: SchemaNode[]; updatedAt?: string }

const pages: Record<string, PageSchema> = {
  home: {
    slug: 'home',
    title: 'Home',
    description: 'Demo from GrapesJS',
    body: [
      { type: 'Section', children: [
        { type: 'Hero', props: { title: '欢迎使用', subtitle: 'GrapesJS + Nuxt 最小闭环' } },
        { type: 'Grid', children: [
          { type: 'Card', props: { title: '卡片 A', desc: '说明 A' } },
          { type: 'Card', props: { title: '卡片 B', desc: '说明 B' } },
          { type: 'Card', props: { title: '卡片 C', desc: '说明 C' } },
        ]},
        { type: 'CtaButton', props: { text: '立即开始', href: '#' } },
        // 如果你已接入 Carousel（放在 site/components/blocks/Carousel.vue）：
        // { type: 'Carousel', props: { items: [{title:'A',color:'#fde68a'}, ...], height: '280px' } }
      ] }
    ],
    updatedAt: new Date().toISOString(),
  },
}

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') || 'home'
  return pages[slug] || pages['home']
})
