// editor/src/vue-materials/index.ts
import { createApp, h, reactive } from 'vue'
import Card from './Card.vue'
import CtaButton from './CtaButton.vue'
import Swiper from './Swiper.vue'
type TraitType = 'text' | 'textarea' | 'number' | 'checkbox' | 'select' | 'radio' | 'color'

export interface PropMeta {
  name: string                       // props 字段名
  label: string                      // 面板显示名
  type: TraitType                    // 面板控件类型
  default?: any                      // 默认值
  options?: { id: string; label: string }[] // select/radio 选项
  min?: number; max?: number; step?: number // number 控件范围
  category?: string                  // 分组（面板分组）
}

export interface VueBlockDef {
  type: string
  label: string
  component: any
  props: PropMeta[]                  // 可配置属性元数据
}

// —— 物料库清单（示例：Card / CtaButton）——
export const vueBlocks: VueBlockDef[] = [
  {
    type: 'Card',
    label: '卡片',
    component: Card,
    props: [
      { name: 'title', label: '标题', type: 'text', default: '卡片标题', category: '内容' },
      { name: 'desc',  label: '描述', type: 'textarea', default: '这里是描述文案', category: '内容' },
      { name: 'variant', label: '样式', type: 'select', default: 'solid', category: '样式',
        options: [
          { id: 'solid', label: '实心' },
          { id: 'outline', label: '描边' },
          { id: 'soft', label: '柔和' },
        ] },
      { name: 'align', label: '对齐', type: 'radio', default: 'left', category: '样式',
        options: [
          { id: 'left', label: '左' },
          { id: 'center', label: '中' },
          { id: 'right', label: '右' },
        ] },
      { name: 'elevation', label: '阴影等级', type: 'number', default: 1, min: 0, max: 3, step: 1, category: '样式' },
      { name: 'rounded', label: '圆角', type: 'checkbox', default: true, category: '样式' },
    ],
  },
  {
    type: 'CtaButton',
    label: 'CTA 按钮',
    component: CtaButton,
    props: [
      { name: 'text',  label: '文案', type: 'text', default: '立即行动', category: '内容' },
      { name: 'href',  label: '链接', type: 'text', default: '#', category: '交互' },
      { name: 'size',  label: '尺寸', type: 'select', default: 'md', category: '样式',
        options: [
          { id: 'sm', label: '小' }, { id: 'md', label: '中' }, { id: 'lg', label: '大' },
        ] },
      { name: 'tone',  label: '色调', type: 'select', default: 'primary', category: '样式',
        options: [
          { id: 'primary', label: '主色' }, { id: 'neutral', label: '中性' }, { id: 'danger', label: '警示' },
        ] },
      { name: 'block', label: '通栏', type: 'checkbox', default: false, category: '样式' },
      { name: 'newTab', label: '新窗口打开', type: 'checkbox', default: false, category: '交互' },
      { name: 'ariaLabel', label: '无障碍标签', type: 'text', default: '', category: '无障碍' },
    ],
  },
    {
    type: 'Carousel',
    label: '轮播图',
    component: Swiper,
    props: [
      // 用 textarea 存 JSON，编辑器里更直观
      {
        name: 'items',
        label: '数据(JSON 数组)',
        type: 'textarea',
        default: JSON.stringify(
          [{ title: 'A', color: '#fde68a' }, { title: 'B', color: '#a7f3d0' }, { title: 'C', color: '#bfdbfe' }],
          null, 2
        ),
        category: '内容'
      },
      { name: 'height', label: '高度(如280px/40vh)', type: 'text', default: '280px', category: '样式' },
      { name: 'loop', label: '循环', type: 'checkbox', default: true, category: '行为' },
      { name: 'autoplay', label: '自动播放', type: 'checkbox', default: true, category: '行为' },
      { name: 'interval', label: '间隔(ms)', type: 'number', default: 3000, min: 1000, step: 500, category: '行为' },
      { name: 'pauseOnHover', label: '悬停暂停', type: 'checkbox', default: true, category: '行为' },
      { name: 'draggable', label: '可拖拽', type: 'checkbox', default: true, category: '交互' },
      { name: 'showIndicators', label: '指示点', type: 'checkbox', default: true, category: '可视' },
      { name: 'showArrows', label: '左右箭头', type: 'checkbox', default: true, category: '可视' },
      { name: 'duration', label: '动画时长(ms)', type: 'number', default: 350, min: 0, step: 50, category: '动效' },
      { name: 'easing', label: '缓动', type: 'text', default: 'ease', category: '动效' },
      { name: 'ariaLabel', label: '无障碍标签', type: 'text', default: 'Carousel', category: '无障碍' },
    ]
  }
]


// editor/src/vue-materials/index.ts （接上）
function buildTraits(meta: PropMeta[]) {
  // GrapesJS 支持 category 对 traits 分组；radio 用 'radio'，select 用 'select'
  return meta.map(m => {
    const base: any = {
      name: m.name,
      label: m.label,
      changeProp: 1,
      category: m.category || '配置',
    }
    switch (m.type) {
      case 'text':
      case 'textarea':
      case 'color':
        return { ...base, type: m.type }
      case 'number':
        return { ...base, type: 'number', min: m.min, max: m.max, step: m.step }
      case 'checkbox':
        return { ...base, type: 'checkbox' }
      case 'radio':
        return { ...base, type: 'radio', options: (m.options || []).map(o => ({ id: o.id, name: o.label })) }
      case 'select':
        return { ...base, type: 'select', options: (m.options || []).map(o => ({ id: o.id, name: o.label })) }
      default:
        return base
    }
  })
}
function safeParseItems(v:any){
  if (Array.isArray(v)) return v
  if (typeof v === 'string') {
    try { const obj = JSON.parse(v); return Array.isArray(obj) ? obj : [] } catch { return [] }
  }
  return []
}

export function registerVueBlocks(editor: any) {
  const bm = editor.BlockManager
  const cm = editor.Components

  vueBlocks.forEach(b => {
    // —— 1) Block 面板
    bm.add(b.type, {
      label: b.label,
      category: 'Vue 物料',
      content: { type: b.type }
    })

    // —— 2) 自定义组件类型
    cm.addType(b.type, {
      model: {
        defaults: {
          name: b.type,
          droppable: false,
          // 将每个 props 的默认值放在“顶层属性”上，便于 traits 的 changeProp 写回
          ...Object.fromEntries(b.props.map(p => [p.name, p.default])),
          traits: buildTraits(b.props),
          // 也可以设置自定义 classes / stylable 等策略
          // stylable: ['width','margin','padding','text-align']
        }
      },
      view: {
        // 为了热更新 props，用 reactive 状态承载
        _app: null as any,
        _state: null as any,
        onRender({ el, model }) {
          const state = reactive(Object.fromEntries(
            b.props.map(p => [p.name, model.get(p.name)])
          ))
          // 监听 traits 改动 → 写回 state
          b.props.forEach(p => {
            this.listenTo(model, `change:${p.name}`, () => {
              // @ts-ignore
              state[p.name] = model.get(p.name)
            })
          })

          // 组装传入组件的 props
        const render = () => {
            // 针对 Carousel 的 items 做 JSON 解析（其他组件也兼容）
            const finalProps = { ...state } as any
            if ('items' in finalProps) finalProps.items = safeParseItems(finalProps.items)
            return h(b.component, finalProps)
          }
          // 首次/重复挂载
          if (this._app) this._app.unmount()
          this._state = state
          this._app = createApp({ render })
          this._app.mount(el)
        },
        removed() {
          if (this._app) {
            this._app.unmount()
            this._app = null
          }
        }
      }
    })
  })
}
