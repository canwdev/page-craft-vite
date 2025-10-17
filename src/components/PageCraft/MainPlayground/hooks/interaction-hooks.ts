import type { QuickOptionItem } from '@canwdev/vgo-ui/src/components/QuickOptions/enum'
import type { BlockItem } from '@/enum/page-craft/block'
import { getMenuPosStyle } from '@canwdev/vgo-ui/src/components/QuickOptions/utils/use-context-menu'
import { onClickOutside } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  appendCustomBlock,
  autoPasteReplaceValue,
  createBlockElement,
} from '@/components/PageCraft/MainPlayground/utils/dom'
import { updateHtmlElement } from '@/components/PageCraft/MainPlayground/utils/element-edit'
import { ActionType, BlockType } from '@/enum/page-craft/block'
import { useMainStore } from '@/store/main'
import { copyToClipboard } from '@/utils'
import globalEventBus, { GlobalEvents } from '@/utils/global-event-bus'
import { LineHelper } from '@/utils/line-helper'

const MAX_WAIT_TIME = 0.3 * 1000

export function useInteractionHooks(options) {
  const { t: $t } = useI18n()
  const { mainPlaygroundRef, saveData, indicatorOptions, copyHtml, recordUndo } = options
  const mainStore = useMainStore()
  const waitingTime = ref(0)
  const waitTimer = ref<any>(null)
  const cursorX = ref(0)
  const cursorY = ref(0)
  const isShowElementEdit = ref(false)
  const isEditingRoot = ref(false)

  const extractCompRef = ref()

  const lineHelper = shallowRef()

  onMounted(() => {
    mainPlaygroundRef.value.addEventListener('contextmenu', handleContextMenu)
    mainPlaygroundRef.value.addEventListener('pointerdown', handlePointerDown)
    mainPlaygroundRef.value.addEventListener('pointerup', handlePointerUp)

    lineHelper.value = new LineHelper(mainPlaygroundRef.value)
  })
  onBeforeUnmount(() => {
    mainPlaygroundRef.value.removeEventListener('contextmenu', handleContextMenu)
    mainPlaygroundRef.value.removeEventListener('pointerdown', handlePointerDown)
    mainPlaygroundRef.value.removeEventListener('pointerup', handlePointerUp)
  })

  const selectionRef = ref<Selection | null>(null)
  const selectionActionStyle = ref<any>(null)
  const isShowSelectionAction = ref(false)
  const selectionElRef = ref()
  // 点击外部隐藏
  onClickOutside(selectionElRef, (event) => {
    if (isShowSelectionAction.value) {
      setTimeout(() => {
        isShowSelectionAction.value = false
      })
    }
  })

  const isPointerInCanvas = ref(false)
  const handlePointerDown = (e: MouseEvent) => {
    if (e.button === 2) {
      return
    }
    isPointerInCanvas.value = true
    // @ts-ignore
    window.getSelection().removeAllRanges()
  }
  const handlePointerUp = (e) => {
    if (!isPointerInCanvas.value) {
      return
    }
    const selection = window.getSelection()
    selectionRef.value = selection
    if (!selection) {
      return
    }
    const text = selection.toString()
    if (!text) {
      return
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect()
    selectionActionStyle.value = getMenuPosStyle({
      x: rect.left,
      y: rect.top + rect.height,
      width: rect.width,
      height: rect.height,
    })
    isShowSelectionAction.value = true
    isPointerInCanvas.value = false
  }
  const surroundSelection = (element: Element) => {
    try {
      if (window.getSelection) {
        const sel = window.getSelection()
        if (sel && sel.rangeCount) {
          const range = sel.getRangeAt(0).cloneRange()
          range.surroundContents(element)
          sel.removeAllRanges()
        }
      }
    }
    catch (e: any) {
      window.$message.error(e.message)
      console.error(e)
    }
  }
  const collapseSelection = (element: Element) => {
    try {
      if (window.getSelection) {
        const sel = window.getSelection()
        if (sel) {
          // 获取用户当前选中的 Range（范围）
          const selectionRange = sel.getRangeAt(0)

          // 在 Range 的末尾插入 <br> 标签
          selectionRange.collapse(false) // 将光标移到范围的末尾
          selectionRange.insertNode(element)
        }
      }
    }
    catch (e: any) {
      window.$message.error(e.message)
      console.error(e)
    }
  }
  const selectionPopupOptions = [
    ...[
      'b',
      'i',
      'u',
      'del',
      'code',
      'mark',
      'kbd',
      'a',
      'sup',
      'sub',
      'small',
      'big',
      'span',
      'div',
      'br',
    ].map(tag => ({
      label: tag,
      onClick: () => {
        recordUndo()
        const el = document.createElement(tag)
        if (tag === 'br') {
          collapseSelection(el)
        }
        else {
          surroundSelection(el)
        }
        saveData()
      },
    })),
  ]

  const pasteHtml = async (targetEl, position = 'beforeend', text?) => {
    recordUndo()

    if (!text) {
      text = await navigator.clipboard.readText()
    }
    targetEl.insertAdjacentHTML(
      <'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'>position,
      text,
    )
    saveData()
  }

  const pasteReplaceValue = async (targetEl) => {
    recordUndo()
    await autoPasteReplaceValue(targetEl)
    saveData()
  }

  const insertCurrentBlock = (targetEl, position = 'append', el?) => {
    recordUndo()
    if (!el) {
      el = createBlockElement(mainStore.currentBlock, mainStore)
    }
    targetEl[<any>position](el)
    saveData()
  }

  const editingNode = ref<HTMLElement | null>(null)

  const ctxMenuRef = ref()
  const handleContextMenu = (event: MouseEvent) => {
    const selectedText = selectionRef.value?.toString()
    if (!indicatorOptions.enableRightClick || selectedText || event.ctrlKey) {
      return
    }
    event.preventDefault()
    if (mainStore.currentBlock.actionType === ActionType.DEBUG) {
      console.log('[handleContextMenu]', event)
    }
    editingNode.value = event.target as HTMLElement
    ctxMenuRef.value.showMenu(event)
  }

  const ctxMenuOptions = computed((): QuickOptionItem[] => {
    // @ts-ignore
    const targetEl = editingNode.value
    if (!targetEl) {
      return []
    }
    const isRoot = targetEl === mainPlaygroundRef.value

    const iEdit = {
      label: `✏️ ${$t('actions.edit_element')}`,
      props: {
        onClick: async () => {
          isShowElementEdit.value = true
          isEditingRoot.value = isRoot
        },
      },
    }

    const blockMenu = isRoot
      ? [iEdit]
      : [
          iEdit,
          {
            label: `📄 ${$t('actions.copy')} HTML`,
            props: {
              onClick: async () => {
                copyHtml(targetEl)
              },
            },
          },
          {
            label: `✂️ ${$t('actions.cut')}`,
            props: {
              onClick: async () => {
                copyToClipboard(targetEl.outerHTML)
                recordUndo()
                targetEl.parentNode?.removeChild(targetEl)
                saveData()
              },
            },
          },
          {
            label: `❌ ${$t('actions.remove_element')}`,
            props: {
              onClick: async () => {
                recordUndo()
                targetEl.parentNode?.removeChild(targetEl)
                saveData()
              },
            },
          },
        ]
    return [
      mainStore.currentBlock.blockType === BlockType.HTML_ELEMENT && {
        label: `➕ ${$t('actions.insert')} ${mainStore.currentBlock.title}`,
        children: isRoot
          ? undefined
          : ['before', 'prepend', 'append', 'after'].map(position => ({
              label: `${$t('actions.insert')} ${position}`,
              props: {
                onClick: async () => {
                  insertCurrentBlock(targetEl, position)
                },
              },
            })),
        props: {
          onClick: async () => {
            insertCurrentBlock(targetEl)
          },
        },
      },
      ...blockMenu,
      {
        label: `📃 ${$t('actions.paste')} outerHTML`,
        children: isRoot
          ? undefined
          : ['beforebegin', 'afterbegin', 'beforeend', 'afterend'].map(position => ({
              label: `${$t('actions.paste_at')} ${position}`,
              props: {
                onClick: async () => {
                  await pasteHtml(targetEl, position)
                },
              },
            })),
        props: {
          onClick: async () => {
            await pasteHtml(targetEl)
          },
        },
      },
      {
        label: `🎈 ${$t('actions.paste_replace_value')}`,
        props: {
          onClick: async () => {
            await pasteReplaceValue(targetEl)
          },
        },
      },
      {
        split: true,
      },
      {
        label: '📦 Extract component...',
        props: {
          onClick: async () => {
            extractCompRef.value.showDialog(editingNode.value)
          },
        },
      },
      {
        label: `💻 ${$t('actions.print_to_console')}`,
        props: {
          onClick: async () => {
            console.log(editingNode.value)
          },
        },
      },
    ].filter(Boolean)
  })

  const isSelectMode = computed(() => {
    return (
      indicatorOptions.enableSelection
      || mainStore.currentBlock.actionType === ActionType.DEBUG
      || mainStore.currentBlock.actionType === ActionType.PASTE_REPLACE
    )
  })

  const handleBlockClick = async (event: Event, newBlock?: BlockItem, addOptions?) => {
    if (!newBlock) {
      newBlock = mainStore.currentBlock
    }

    // 以下情况不记录
    if (
      newBlock.actionType !== ActionType.CURSOR
      && newBlock.actionType !== ActionType.DEBUG
      && newBlock.actionType !== ActionType.DRAG
    ) {
      recordUndo()
    }
    addOptions = addOptions || mainStore

    await appendCustomBlock(newBlock, event, addOptions, mainPlaygroundRef)
    // if (newBlock.actionType === ActionType.DELETE) {
    // }
    // else if (
    //   newBlock.actionType !== ActionType.DEBUG
    //   && newBlock.actionType !== ActionType.CURSOR
    // ) {
    // }
    saveData()
  }

  const clearWait = () => {
    clearInterval(waitTimer.value)
    waitingTime.value = 0
    cursorX.value = 0
    cursorY.value = 0
  }
  const waitingProgress = computed(() => {
    return ((waitingTime.value / MAX_WAIT_TIME) * 100).toFixed(2)
  })

  // 临时拖拽HTML元素
  const draggingEl = shallowRef<HTMLElement | null>(null)

  const handleMouseDown = (event: MouseEvent) => {
    // 选择模式不进行操作
    if (mainStore.selecting) {
      return
    }
    if (event.button !== 0) {
      return
    }
    if (mainStore.currentBlock.actionType === ActionType.DELETE) {
      // 仿 Minecraft 挖掘等待时间效果
      // console.log('[handleMouseDown]', event.x, event.y)
      clearWait()
      waitTimer.value = setInterval(() => {
        if (waitingTime.value > MAX_WAIT_TIME) {
          clearWait()
          // console.log('fire!!')
          handleBlockClick(event)
          return
        }
        waitingTime.value += 50
      }, 50)
      cursorX.value = event.x
      cursorY.value = event.y
      event.preventDefault()
      return
    }
    draggingEl.value = null
    if (mainStore.currentBlock.actionType === ActionType.DRAG) {
      if (event.target) {
        draggingEl.value = event.target as HTMLElement
        draggingEl.value.draggable = true
      }
      return
    }
    handleBlockClick(event)
  }
  const handleMouseUp = (event: MouseEvent) => {
    // console.log('[handleMouseUp]', event)
    if (mainStore.currentBlock.actionType === ActionType.DELETE) {
      clearWait()
    }
    if (draggingEl.value) {
      draggingEl.value.draggable = false
      draggingEl.value.removeAttribute('draggable')
    }
  }

  const handleDragOver = (event) => {
    // console.log('handleDragOver')
    lineHelper.value.drawLine(event)
  }
  const handleDragLeave = (event) => {
    // console.log('handleDragLeave')
    lineHelper.value.hideLine()
  }
  const afterUpdateCallback = ref<any>(null)

  const handleDrop = async (event) => {
    lineHelper.value.hideLine()

    const targetEl = event.target || mainPlaygroundRef.value
    const currentPosition = lineHelper.value.currentPosition

    // 放置HTML代码
    const dropHTML = async (html) => {
      recordUndo()
      if (currentPosition === 'top') {
        await pasteHtml(targetEl, 'beforebegin', html)
      }
      else if (currentPosition === 'bottom') {
        await pasteHtml(targetEl, 'afterend', html)
      }
      else {
        await pasteHtml(targetEl, 'beforeend', html)
      }
      saveData()
    }

    // 处理DOM元素放置
    if (draggingEl.value) {
      draggingEl.value.draggable = false
      draggingEl.value.removeAttribute('draggable')
      await dropHTML(draggingEl.value.outerHTML)
      if (!event.ctrlKey) {
        // 移除原始DOM
        draggingEl.value.parentNode?.removeChild(draggingEl.value)
      }
      draggingEl.value = null
      return
    }

    // 拖拽组件到画布
    const comp = window.$draggingComponentExportData
    if (comp) {
      window.$draggingComponentExportData = null
      await dropHTML(comp.html)
      globalEventBus.emit(GlobalEvents.ON_ADD_STYLE, { code: comp.style, isAppend: true })
      return
    }

    // 拖拽block到画布
    const transferData = event.dataTransfer.getData('data-block')

    if (!transferData) {
      console.warn('drag item must be a BlockItem', event)
      window.$message.warning('drag item not supported')
      return
    }

    const block = JSON.parse(transferData)

    if (block.blockType === BlockType.HTML_ELEMENT) {
      const addEl = createBlockElement(block, mainStore)
      if (currentPosition === 'top') {
        insertCurrentBlock(targetEl, 'before', addEl)
      }
      else if (currentPosition === 'bottom') {
        insertCurrentBlock(targetEl, 'after', addEl)
      }
      else {
        insertCurrentBlock(targetEl, 'appendChild', addEl)
      }
      // afterUpdateCallback.value = () => {
      //   targetEl.appendChild(addEl)
      // }
      //
      // nextTick(() => {
      //   editingNode.value = addEl
      //   isShowElementEdit.value = true
      // })
    }
    else {
      console.warn('block is unable to insert', block)
    }
  }

  const updateEditingElement = ({ el, data }) => {
    if (!el) {
      return
    }
    recordUndo()
    updateHtmlElement(el, data)

    const cb = afterUpdateCallback.value
    if (typeof cb === 'function') {
      ;(cb as Function)()
    }
    saveData()
  }

  return {
    isSelectMode,
    handleBlockClick,
    handleMouseDown,
    handleMouseUp,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    waitingProgress,
    cursorX,
    cursorY,
    ctxMenuRef,
    ctxMenuOptions,
    selectionActionStyle,
    selectionElRef,
    isShowSelectionAction,
    selectionPopupOptions,
    isShowElementEdit,
    editingNode,
    isEditingRoot,
    updateEditingElement,
    extractCompRef,
  }
}
