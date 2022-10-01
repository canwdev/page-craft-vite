import {ActionType, BlockType} from '@/enum/block'
import {useCraftStore} from '@/store/craft'
import {appendCustomBlock, createBlockElement} from '@/utils/dom'
import {TOOL_CLASSES} from '@/enum'
import {throttle} from 'throttle-debounce'
import $ from 'jquery'
import {useContextMenu} from '@/hooks/use-context-menu'
import {copyToClipboard} from '@/utils'

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

const MAX_WAIT_TIME = 0.5 * 1000

export const useInteractionHooks = (options) => {
  const {mainCanvasRef, saveData, indicatorOptions, copyHtml} = options
  const craftStore = useCraftStore()
  const waitingTime = ref(0)
  const waitTimer = ref<any>(null)
  const cursorX = ref(0)
  const cursorY = ref(0)
  const currentHoveredEl = ref<any>(null)

  onMounted(() => {
    mainCanvasRef.value.addEventListener('mousemove', handleMouseMove)
    mainCanvasRef.value.addEventListener('contextmenu', handleContextMenu)
    mainCanvasRef.value.addEventListener('pointerdown', handleCancelSelection, true)
    mainCanvasRef.value.addEventListener('pointerup', handleSelection)
  })
  onBeforeUnmount(() => {
    mainCanvasRef.value.removeEventListener('mousemove', handleMouseMove)
    mainCanvasRef.value.removeEventListener('contextmenu', handleContextMenu)
    mainCanvasRef.value.removeEventListener('pointerdown', handleCancelSelection)
    mainCanvasRef.value.removeEventListener('pointerup', handleSelection)
  })

  const selectionRef = ref<Selection | null>(null)
  const selectionActionStyle = ref<any>(null)
  const isShowSelectionAction = ref(false)

  const handleSelection = (e) => {
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
  }
  const handleCancelSelection = (e: MouseEvent) => {
    if (e.button === 2) {
      return
    }
    // @ts-ignore
    window.getSelection().removeAllRanges()
    isShowSelectionAction.value = false
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
    } catch (e) {
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
        surroundSelection(document.createElement(tag))
        saveData()
      },
    })),
  ]

  const pasteHtml = async (targetEl, position = 'beforeend') => {
    const text = await navigator.clipboard.readText()
    targetEl.insertAdjacentHTML(
      <'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'>position,
      text
    )
    saveData()
  }

  const insertCurrentBlock = (targetEl, position = 'append') => {
    targetEl[<any>position](createBlockElement(craftStore.currentBlock, craftStore))
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
              label: '✏️ Rename Class',
              props: {
                onClick: async () => {
                  removeMouseOverDomElementEffect()
                  const className = await prompt('Rename Class', targetEl.className)
                  if (className) {
                    targetEl.className = className
                    saveData()
                  }
                },
              },
            },
            {
              label: '📄 Copy HTML',
              props: {
                onClick: async () => {
                  copyHtml(targetEl)
                },
              },
            },
            {
              label: '✂️ Cut',
              props: {
                onClick: async () => {
                  removeMouseOverDomElementEffect()
                  copyToClipboard(targetEl.outerHTML)
                  targetEl.parentNode?.removeChild(targetEl)
                  saveData()
                },
              },
            },
            {
              label: '❌ Remove Element',
              props: {
                onClick: async () => {
                  targetEl.parentNode?.removeChild(targetEl)
                  saveData()
                },
              },
            },
          ]
    return [
      craftStore.currentBlock.blockType === BlockType.HTML_ELEMENT && {
        label: `➕ Insert ${craftStore.currentBlock.title}`,
        children: ['before', 'prepend', 'append', 'after'].map((position) => ({
          label: `Insert ${position}`,
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
        label: '📃 Paste outerHTML',
        children: ['beforebegin', 'afterbegin', 'beforeend', 'afterend'].map((position) => ({
          label: `Paste at ${position}`,
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
        type: 'divider',
        label: 'd10',
      },
      {
        label: '💻 Print to Console',
        props: {
          onClick: async () => {
            console.log(e.target)
          },
        },
      },
    ].filter(Boolean)
  })

  const handleContextMenu = (e: MouseEvent) => {
    const selectedText = selectionRef.value?.toString()
    if (!indicatorOptions.enableRightClick || selectedText) {
      return
    }
    e.preventDefault()
    if (craftStore.currentBlock.actionType === ActionType.DEBUG) {
      console.log('[handleContextMenu]', e)
    }
    _handleContextmenu(e, e)
  }

  const isSelectMode = computed(() => {
    return (
      craftStore.isSelectMode ||
      indicatorOptions.enableSelection ||
      craftStore.currentBlock.actionType === ActionType.DEBUG
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
    if (currentNode.classList.contains(TOOL_CLASSES.CLASS_MAIN_CANVAS_ROOT)) {
      // do nothing
    } else {
      const $parent = $(currentNode).parent()
      if ($parent) {
        $parent.addClass(TOOL_CLASSES.CLASS_MOUSE_OVER_PARENT)
      }
    }
    $(currentNode).addClass(TOOL_CLASSES.CLASS_MOUSE_OVER)
  })

  const handleBlockClick = (event: Event) => {
    const {currentBlock} = craftStore
    appendCustomBlock(currentBlock, event, craftStore, mainCanvasRef)
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
  const handleMouseDown = (event: MouseEvent) => {
    if (event.button !== 0) {
      return
    }
    if (craftStore.currentBlock.actionType === ActionType.DELETE) {
      // 仿 Minecraft 挖掘等待时间效果
      console.log('[handleMouseDown]', event.x, event.y)
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
      cursorX.value = event.x - 10
      cursorY.value = event.y + 10
      event.preventDefault()
      return
    }
    handleBlockClick(event)
  }
  const handleMouseUp = (event: MouseEvent) => {
    // console.log('[handleMouseUp]', event)
    if (craftStore.currentBlock.actionType === ActionType.DELETE) {
      clearWait()
    }
  }

  return {
    currentHoveredEl,
    handleBlockClick,
    handleMouseDown,
    handleMouseUp,
    waitingProgress,
    cursorX,
    cursorY,
    contextMenuEtc,
    selectionActionStyle,
    isShowSelectionAction,
    selectionPopupOptions,
  }
}
