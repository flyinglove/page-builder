// editor/src/editor/grapes/initGrapes.ts
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import { registerVueBlocks } from '../../vue-materials'

export function initGrapes(target: string){
  const editor = grapesjs.init({
    container: target,
    height: '100%',
    fromElement: false,
    storageManager: false,
    selectorManager: { componentFirst: true },
    deviceManager: {
      devices: [
        { name: 'Desktop', width: '' },
        { name: 'Tablet', width: '768px' },
        { name: 'Mobile', width: '375px' },
      ]
    },
    traitManager: { // 打开分组显示
      optionsTarget: '_blank'
    }
  })

  registerVueBlocks(editor)
  // 工具函数
  const getDoc = () => editor.Canvas.getFrameEl()?.contentDocument || null

  // 注入/移除“编辑态禁点”样式
  const EDIT_GUARD_ID = 'gjs-edit-link-guard'
  const installEditGuard = () => {
    const doc = getDoc(); if (!doc) return
    if (doc.getElementById(EDIT_GUARD_ID)) return
    const style = doc.createElement('style')
    style.id = EDIT_GUARD_ID
    style.textContent = `
      /* 编辑状态下禁用所有链接点击与hover样式 */
      a[href] { pointer-events: none !important; cursor: default !important; opacity: .9; }
    `
    doc.head.appendChild(style)
  }
  const removeEditGuard = () => {
    const doc = getDoc(); if (!doc) return
    doc.getElementById(EDIT_GUARD_ID)?.remove()
  }

  // 预览态：允许点击并新标签打开（仅对有效 href）
  const PREVIEW_HOOK_CLASS = 'gjs-preview-link-hook'
  const onLinkClick = (e: MouseEvent) => {
    const a = e.currentTarget as HTMLAnchorElement
    const href = a?.getAttribute('href') || ''
    if (!href || href === '#') return
    e.preventDefault(); e.stopPropagation()
    window.open(a.href, '_blank', 'noopener,noreferrer')
  }
  const enablePreviewLinks = () => {
    const doc = getDoc(); if (!doc) return
    const links = doc.querySelectorAll<HTMLAnchorElement>('a[href]')
    links.forEach(a => {
      if (!a.classList.contains(PREVIEW_HOOK_CLASS)) {
        a.addEventListener('click', onLinkClick, true)
        a.classList.add(PREVIEW_HOOK_CLASS)
      }
    })
  }
  const disablePreviewLinks = () => {
    const doc = getDoc(); if (!doc) return
    const links = doc.querySelectorAll<HTMLAnchorElement>('a[href].' + PREVIEW_HOOK_CLASS)
    links.forEach(a => {
      a.removeEventListener('click', onLinkClick, true)
      a.classList.remove(PREVIEW_HOOK_CLASS)
    })
  }

  // 监听 iframe 载入/重渲染，确保规则生效
  let mo: MutationObserver | null = null
  const attachObservers = () => {
    const doc = getDoc(); if (!doc) return
    // 初始：编辑态默认禁点
    installEditGuard()
    disablePreviewLinks()

    // 观察 DOM 变化，给新增链接应用当前策略
    mo?.disconnect()
    mo = new MutationObserver(() => {
      // 根据是否在预览态应用策略
      if (editor.Commands.isActive('preview')) {
        removeEditGuard()
        enablePreviewLinks()
      } else {
        disablePreviewLinks()
        installEditGuard()
      }
    })
    mo.observe(doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] })
  }

  // 首次 frame 就绪
  editor.on('canvas:frame:load', attachObservers)
  editor.on('load', attachObservers)

  // 进入/退出预览态时切换策略
  editor.on('run:preview', () => {
    removeEditGuard()
    enablePreviewLinks()
  })
  editor.on('stop:preview', () => {
    disablePreviewLinks()
    installEditGuard()
  })

  // 销毁时清理
  editor.on('destroy', () => { mo?.disconnect(); mo = null })

  return editor
}

