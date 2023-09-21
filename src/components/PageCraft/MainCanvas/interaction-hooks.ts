import {ActionType, BlockItem, BlockType} from '@/enum/page-craft/block'
import {useCraftStore} from '@/store/craft'
import {appendCustomBlock, createBlockElement} from '@/utils/dom'
import {TOOL_CLASSES} from '@/enum/page-craft'
import {throttle} from 'throttle-debounce'
import $ from 'jquery'
import {useContextMenu} from '@/hooks/use-context-menu'
import {copyToClipboard} from '@/utils'
import {
  elementCustomPropsMap,
  updateHtmlElement,
} from '@/components/PageCraft/MainCanvas/element-edit'
import {LineHelper} from '@/utils/line-helper'
import {loadComponentHtml, loadComponentStyle} from '@/hooks/use-component-storage'
import {NButton} from 'naive-ui'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useI18n} from 'vue-i18n'

export const removeMouseOverDomElementEffect = () => {
  const $el = $(TOOL_CLASSES.DOT_CLASS_MOUSE_OVER)
  if ($el.length) {
    $el.removeClass(TOOL_CLASSES.CLASS_MOUSE_OVER)
  }
  const $el2 = $(TOOL_CLASSES.DOT_CLASS_MOUSE_OVER_PARENT)
  if ($el2.length) {
    $el2.removeClass(TOOL_CLASSES.CLASS_MOUSE_OVER_PARENT)
  }
  $('*[class=""]').removeAttr('class')
}

const MAX_WAIT_TIME = 0.3 * 1000

export const useInteractionHooks = (options) => {
  const {t: $t} = useI18n()
  const {mainCanvasRef, saveData, indicatorOptions, copyHtml, recordUndo} = options
  const craftStore = useCraftStore()
  const waitingTime = ref(0)
  const waitTimer = ref<any>(null)
  const cursorX = ref(0)
  const cursorY = ref(0)
  const currentHoveredEl = ref<any>(null)
  const isShowElementEdit = ref(false)

  const lineHelper = shallowRef()

  onMounted(() => {
    mainCanvasRef.value.addEventListener('mousemove', handleMouseMove)
    mainCanvasRef.value.addEventListener('contextmenu', handleContextMenu)
    mainCanvasRef.value.addEventListener('pointerdown', handlePointerDown)
    mainCanvasRef.value.addEventListener('pointerup', handlePointerUp)

    lineHelper.value = new LineHelper(mainCanvasRef.value)
  })
  onBeforeUnmount(() => {
    mainCanvasRef.value.removeEventListener('mousemove', handleMouseMove)
    mainCanvasRef.value.removeEventListener('contextmenu', handleContextMenu)
    mainCanvasRef.value.removeEventListener('pointerdown', handlePointerDown)
    mainCanvasRef.value.removeEventListener('pointerup', handlePointerUp)
  })

  const selectionRef = ref<Selection | null>(null)
  const selectionActionStyle = ref<any>(null)
  const isShowSelectionAction = ref(false)

  const isPointerInCanvas = ref(false)
  const handlePointerDown = (e: MouseEvent) => {
    if (e.button === 2) {
      return
    }
    isPointerInCanvas.value = true
    // @ts-ignore
    window.getSelection().removeAllRanges()
    isShowSelectionAction.value = false
  }
  const handlePointerUp = (e) => {
    if (!isPointerInCanvas.value) {
      isShowSelectionAction.value = false
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

    let rect = selection.getRangeAt(0).getBoundingClientRect()
    selectionActionStyle.value = {
      top: `calc(${rect.top}px + ${rect.height}px + 2px)`,
      left: `calc(${rect.left}px + calc(${rect.width}px / 2) - 110px)`,
    }
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
    } catch (e: any) {
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
    ].map((tag) => ({
      label: tag,
      onClick: () => {
        recordUndo()
        surroundSelection(document.createElement(tag))
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
      text
    )
    saveData()
  }

  const pasteReplaceInnerHtml = async (targetEl) => {
    recordUndo()
    targetEl.innerHTML = await navigator.clipboard.readText()
    saveData()
  }

  const insertCurrentBlock = (targetEl, position = 'append', el?) => {
    recordUndo()
    if (!el) {
      el = createBlockElement(craftStore.currentBlock, craftStore)
    }
    targetEl[<any>position](el)
    saveData()
  }

  const {
    editingNode,
    nodeAction,
    handleContextmenu: _handleContextmenu,
    ...contextMenuEtc
  } = useContextMenu((e: Event) => {
    // @ts-ignore
    const targetEl: HTMLElement = e.target
    if (!targetEl) {
      return []
    }
    const blockMenu =
      targetEl === mainCanvasRef.value
        ? []
        : [
            {
              label: '✏️ ' + $t('actions.edit_element'),
              props: {
                onClick: async () => {
                  nodeAction(targetEl, () => {
                    isShowElementEdit.value = true
                  })
                },
              },
            },
            {
              label: `📄 ${$t('actions.copy')} HTML`,
              props: {
                onClick: async () => {
                  copyHtml(targetEl)
                },
              },
            },
            {
              label: '✂️ ' + $t('actions.cut'),
              props: {
                onClick: async () => {
                  removeMouseOverDomElementEffect()
                  copyToClipboard(targetEl.outerHTML)
                  recordUndo()
                  targetEl.parentNode?.removeChild(targetEl)
                  saveData()
                },
              },
            },
            {
              label: '❌ ' + $t('actions.remove_element'),
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
      craftStore.currentBlock.blockType === BlockType.HTML_ELEMENT && {
        label: `➕ ${$t('actions.insert')} ${craftStore.currentBlock.title}`,
        children: ['before', 'prepend', 'append', 'after'].map((position) => ({
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
            contextMenuEtc.showRightMenu.value = false
          },
        },
      },
      ...blockMenu,
      {
        label: `📃 ${$t('actions.paste')} outerHTML`,
        children: ['beforebegin', 'afterbegin', 'beforeend', 'afterend'].map((position) => ({
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
            contextMenuEtc.showRightMenu.value = false
          },
        },
      },
      {
        label: '🎈 ' + $t('actions.paste__replace_inner'),
        props: {
          onClick: async () => {
            await pasteReplaceInnerHtml(targetEl)
            contextMenuEtc.showRightMenu.value = false
          },
        },
      },
      {
        type: 'divider',
        label: 'd10',
      },
      {
        label: '💻 ' + $t('actions.print_to_console'),
        props: {
          onClick: async () => {
            console.log(e.target)
          },
        },
      },
    ].filter(Boolean)
  })

  watch(contextMenuEtc.showRightMenu, (val) => {
    if (!val) {
      removeMouseOverDomElementEffect()
    }
  })

  const handleContextMenu = (e: MouseEvent) => {
    const selectedText = selectionRef.value?.toString()
    if (!indicatorOptions.enableRightClick || selectedText || e.ctrlKey) {
      return
    }
    e.preventDefault()
    if (craftStore.currentBlock.actionType === ActionType.DEBUG) {
      console.log('[handleContextMenu]', e)
    }
    removeMouseOverDomElementEffect()
    $(e.target).addClass(TOOL_CLASSES.CLASS_MOUSE_OVER)
    _handleContextmenu(e, e)
  }

  const isSelectMode = computed(() => {
    return (
      craftStore.isSelectMode ||
      indicatorOptions.enableSelection ||
      craftStore.currentBlock.actionType === ActionType.DEBUG ||
      craftStore.currentBlock.actionType === ActionType.PASTE_REPLACE
    )
  })

  watch(isSelectMode, (val) => {
    if (!val) {
      currentHoveredEl.value = null
      removeMouseOverDomElementEffect()
    }
  })

  const handleMouseMove = (event: Event) => {
    if (!isSelectMode.value) {
      return
    }
    handleMousemoveDebounced(event)
  }

  const handleMousemoveDebounced = throttle(50, false, (event: Event) => {
    const currentNode: any = event.target
    if (currentHoveredEl.value === currentNode) {
      return
    }
    currentHoveredEl.value = currentNode
    // console.log('event', event.target)
    removeMouseOverDomElementEffect()
    if (!currentNode) {
      return
    }
    if (currentNode === mainCanvasRef.value) {
      // do nothing
    } else {
      const $parent = $(currentNode).parent()
      if ($parent) {
        $parent.addClass(TOOL_CLASSES.CLASS_MOUSE_OVER_PARENT)
      }
      $(currentNode).addClass(TOOL_CLASSES.CLASS_MOUSE_OVER)
    }
  })

  const handleBlockClick = async (event: Event, newBlock?: BlockItem, addOptions?) => {
    if (!newBlock) {
      newBlock = craftStore.currentBlock
    }

    // 以下情况不记录
    if (
      newBlock.actionType !== ActionType.CURSOR &&
      newBlock.actionType !== ActionType.DEBUG &&
      newBlock.actionType !== ActionType.DRAG
    ) {
      recordUndo()
    }
    addOptions = addOptions || craftStore

    await appendCustomBlock(newBlock, event, addOptions, mainCanvasRef)
    saveData()
  }

  const clearWait = () => {
    removeMouseOverDomElementEffect()
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
    if (event.button !== 0) {
      return
    }
    if (craftStore.currentBlock.actionType === ActionType.DELETE) {
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
      removeMouseOverDomElementEffect()
      $(event.target).addClass(TOOL_CLASSES.CLASS_MOUSE_OVER)
      event.preventDefault()
      return
    }
    draggingEl.value = null
    if (craftStore.currentBlock.actionType === ActionType.DRAG) {
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
    if (craftStore.currentBlock.actionType === ActionType.DELETE) {
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

    let targetEl = event.target || mainCanvasRef.value
    const currentPosition = lineHelper.value.currentPosition

    // 放置HTML代码
    const dropHTML = async (html) => {
      recordUndo()
      if (currentPosition === 'top') {
        await pasteHtml(targetEl, 'beforebegin', html)
      } else if (currentPosition === 'bottom') {
        await pasteHtml(targetEl, 'afterend', html)
      } else {
        await pasteHtml(targetEl, 'beforeend', html)
      }
      saveData()
    }

    if (draggingEl.value) {
      await dropHTML(draggingEl.value.outerHTML)
      return
    }

    const transferData = event.dataTransfer.getData('data-block')

    if (!transferData) {
      console.warn('drag item must be a BlockItem', event)
      return
    }

    const block = JSON.parse(transferData)

    if (block.blockType === BlockType.COMPONENT) {
      // console.log(block)
      const html = loadComponentHtml(block.title)
      await dropHTML(html)

      const appendStyle = () => {
        const code = loadComponentStyle(block.title)
        globalEventBus.emit(GlobalEvents.ON_ADD_STYLE, {code, isAppend: true})
      }
      if (block.data.stared) {
        appendStyle()
      } else {
        const n = window.$notification.create({
          title: `${$t('actions.insert_at')} ${currentPosition}`,
          content: $t('msgs.component_insert_com'),
          meta: block.title,
          duration: 4000,
          action: () =>
            h(
              NButton,
              {
                text: true,
                type: 'primary',
                onClick: () => {
                  appendStyle()
                  n.destroy()
                },
              },
              {
                default: () => $t('actions.append_style'),
              }
            ),
        })
      }
    } else if (block.blockType === BlockType.HTML_ELEMENT) {
      const addEl = createBlockElement(block, craftStore)
      if (currentPosition === 'top') {
        insertCurrentBlock(targetEl, 'before', addEl)
      } else if (currentPosition === 'bottom') {
        insertCurrentBlock(targetEl, 'after', addEl)
      } else {
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
    } else {
      console.warn('block is unable to insert', block)
      return
    }
  }

  const updateEditingElement = ({el, formValueRef}) => {
    if (!el) {
      return
    }
    recordUndo()
    const data = formValueRef.value
    updateHtmlElement(el, data)

    const cb = afterUpdateCallback.value
    if (typeof cb === 'function') {
      ;(cb as Function)()
    }
    saveData()
  }

  return {
    currentHoveredEl,
    handleBlockClick,
    handleMouseDown,
    handleMouseUp,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    waitingProgress,
    cursorX,
    cursorY,
    contextMenuEtc,
    selectionActionStyle,
    isShowSelectionAction,
    selectionPopupOptions,
    isShowElementEdit,
    editingNode,
    updateEditingElement,
  }
}
