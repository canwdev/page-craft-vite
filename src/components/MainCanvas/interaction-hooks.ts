import {ActionType} from '@/enum/block'
import {useCraftStore} from '@/store/craft'
import {appendCustomBlock} from '@/utils/dom'
import {TOOL_CLASSES} from '@/enum'
import {throttle} from 'throttle-debounce'
import $ from 'jquery'

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
  const {mainCanvasRef, saveData, indicatorOptions} = options
  const craftStore = useCraftStore()
  const waitingTime = ref(0)
  const waitTimer = ref<any>(null)
  const cursorX = ref(0)
  const cursorY = ref(0)
  const currentHoveredEl = ref<any>(null)

  onMounted(() => {
    mainCanvasRef.value.addEventListener('mousemove', handleMouseMove)
  })
  onBeforeUnmount(() => {
    mainCanvasRef.value.removeEventListener('mousemove', handleMouseMove)
  })

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
  }
}
