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
import {LineHelper2} from '@/utils/line-helper2'

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

const MAX_WAIT_TIME = 0.8 * 1000

export const useInteractionHooks = (options) => {
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

    lineHelper.value = new LineHelper2(mainCanvasRef.value)
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

  const pasteHtml = async (targetEl, position = 'beforeend') => {
    recordUndo()
    const text = await navigator.clipboard.readText()
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

  const insertCurrentBlock = (targetEl, position = 'append') => {
    recordUndo()
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
              label: '✏️ Edit Element',
              props: {
                onClick: async () => {
                  nodeAction(targetEl, () => {
                    isShowElementEdit.value = true
                  })
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
                  recordUndo()
                  targetEl.parentNode?.removeChild(targetEl)
                  saveData()
                },
              },
            },
            {
              label: '❌ Remove Element',
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
        label: '🎈 Paste & Replace innerHTML',
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
        label: '💻 Print to Console',
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
    recordUndo()

    if (!newBlock) {
      newBlock = craftStore.currentBlock
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
    handleBlockClick(event)
  }
  const handleMouseUp = (event: MouseEvent) => {
    // console.log('[handleMouseUp]', event)
    if (craftStore.currentBlock.actionType === ActionType.DELETE) {
      clearWait()
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
    const block = JSON.parse(event.dataTransfer.getData('data-block'))
    console.log(block)
    if (block.blockType !== BlockType.HTML_ELEMENT) {
      return
    }
    recordUndo()

    let targetEl = event.target || mainCanvasRef.value

    const addEl = createBlockElement(block, craftStore)

    // TODO: refactor currentPosition
    const currentPosition = lineHelper.value.currentPosition
    if (currentPosition === 1) {
      targetEl.before(addEl)
    } else if (currentPosition === 3) {
      targetEl.after(addEl)
    } else {
      targetEl.appendChild(addEl)
    }

    // afterUpdateCallback.value = () => {
    //   targetEl.appendChild(addEl)
    // }
    //
    // nextTick(() => {
    //   editingNode.value = addEl
    //   isShowElementEdit.value = true
    // })

    saveData()

    lineHelper.value.hideLine()
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
