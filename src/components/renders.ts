import type { MenuItem } from '@imengyu/vue3-context-menu'
import ContextMenu from '@imengyu/vue3-context-menu'
import { contextMenuTheme } from '@/hooks/use-global-theme'

export function renderContextMenu(items: MenuItem[]) {
  return h('button', {
    class: 'btn-no-style mdi mdi-dots-vertical',
    style: {
      width: '18px',
      height: '18px',
      fontSize: '18px',
    },
    onClick(event: MouseEvent) {
      event.preventDefault()
      event.stopPropagation()
      const button = event.target?.closest('button') as HTMLElement
      const rect = button?.getBoundingClientRect()
      ContextMenu.showContextMenu({
        x: rect?.left || event.x,
        y: rect?.top || event.y,
        theme: contextMenuTheme.value,
        items,
      })
    },
  })
}
