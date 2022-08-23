<script lang="ts">
import {useCraftStore} from '@/store/craft'
import {copyToClipboard} from '@/utils'
import ToolBar from '@/components/ToolBar/index.vue'
import {throttle} from 'throttle-debounce'
import $ from 'jquery'
import {BlockManualType} from '@/enum/block'

const LS_KEY_MAIN_HTML = 'page_craft_main_html'
const LS_KEY_MAIN_CSS = 'page_craft_main_css'
const LS_KEY_INDICATOR_OPTIONS = 'page_craft_indicator_options'

const CLASS_MOUSE_OVER = 'page-craft-mouse-over-dom-element'
const DOT_CLASS_MOUSE_OVER = '.' + CLASS_MOUSE_OVER
const CLASS_MOUSE_OVER_PARENT = 'page-craft-mouse-over-dom-element-parent'
const DOT_CLASS_MOUSE_OVER_PARENT = '.' + CLASS_MOUSE_OVER_PARENT
const CLASS_MAIN_CANVAS_ROOT = 'page-craft-main-canvas'

const removeMouseOverDomElementEffect = () => {
  const $el = $(DOT_CLASS_MOUSE_OVER)
  if ($el.length) {
    $el.removeClass(CLASS_MOUSE_OVER)
  }
  const $el2 = $(DOT_CLASS_MOUSE_OVER_PARENT)
  if ($el2.length) {
    $el2.removeClass(CLASS_MOUSE_OVER_PARENT)
  }
  $('*[class=""]').removeAttr('class')
}

type IndicatorOptions = {
  enableDevHelpClass: boolean
  enableExpand: boolean
  enableSelection: boolean
  fullWidth: boolean
  bgTransparent: boolean
  centeredElements: boolean
}

export default defineComponent({
  name: 'MainCanvas',
  components: {
    ToolBar,
  },
  setup() {
    const mainCanvasRef = ref()
    const craftStore = useCraftStore()
    const message = useMessage()
    const indicatorOptions = reactive<IndicatorOptions>(
      JSON.parse(localStorage.getItem(LS_KEY_INDICATOR_OPTIONS) || 'null') || {
        enableDevHelpClass: true,
        enableExpand: false,
        enableSelection: true,
        fullWidth: false,
        bgTransparent: false,
        centeredElements: false,
      }
    )
    const isShowImportDialog = ref(false)

    onMounted(() => {
      const html = localStorage.getItem(LS_KEY_MAIN_HTML)
      if (html) {
        setMainCanvasHtml(html)
      }
      mainCanvasRef.value.addEventListener('mousemove', handleMouseMove)
    })
    onBeforeUnmount(() => {
      mainCanvasRef.value.removeEventListener('mousemove', handleMouseMove)
    })

    watch(
      indicatorOptions,
      () => {
        localStorage.setItem(LS_KEY_INDICATOR_OPTIONS, JSON.stringify({...indicatorOptions}))
      },
      {deep: true}
    )

    const saveData = () => {
      removeMouseOverDomElementEffect()
      const innerHTML = mainCanvasRef.value.innerHTML
      localStorage.setItem(LS_KEY_MAIN_HTML, innerHTML)
    }

    const currentHoveredEl = ref<any>(null)
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
      if (currentNode.classList.contains(CLASS_MAIN_CANVAS_ROOT)) {
        // do nothing
      } else {
        const $parent = $(currentNode).parent()
        if ($parent) {
          $parent.addClass(CLASS_MOUSE_OVER_PARENT)
        }
      }
      $(currentNode).addClass(CLASS_MOUSE_OVER)
    })

    const hoveredElDisplay = computed(() => {
      if (currentHoveredEl.value) {
        let str = `${currentHoveredEl.value.localName}`
        let className = currentHoveredEl.value.className || ''
        className = className.replace(CLASS_MOUSE_OVER, '').trim()
        if (className) {
          str += `  ( ${className} )`
        }
        return str
      }
      return ''
    })

    watch(
      () => indicatorOptions.enableSelection,
      (val) => {
        if (!val) {
          removeMouseOverDomElementEffect()
        }
      }
    )
    const handleMouseMove = (event: Event) => {
      if (!indicatorOptions.enableSelection) {
        return
      }
      handleMousemoveDebounced(event)
    }

    const handleBlockClick = (event: Event) => {
      // console.log('[craftStore]', craftStore, currentBlock.value)
      const {currentBlock} = craftStore

      // console.log('[event]', event)
      let targetEl
      if (event.target) {
        targetEl = event.target
      } else {
        targetEl = mainCanvasRef.value
      }

      // console.log('[targetEl]', targetEl)

      if (!currentBlock.tag) {
        if (currentBlock.manualType === BlockManualType.DELETE) {
          if (targetEl === mainCanvasRef.value) {
            return
          }
          targetEl.parentNode.removeChild(targetEl)
        }
      } else {
        const addEl = document.createElement(currentBlock.tag)
        if (currentBlock.tag === 'img') {
          addEl.src = craftStore.innerText || ''
        } else if (currentBlock.tag === 'input') {
          addEl.value = craftStore.innerText || ''
        } else {
          addEl.innerText = craftStore.innerText || ''
        }
        if (craftStore.className) {
          addEl.className = craftStore.className
        }
        targetEl.appendChild(addEl)
        // console.log('[addEl]', addEl)
      }

      saveData()
    }

    const copyInnerHtml = () => {
      removeMouseOverDomElementEffect()
      const innerHTML = mainCanvasRef.value.innerHTML
      copyToClipboard(innerHTML)
      message.success('Copy Success!')
    }

    const importHtml = ref('')
    const setMainCanvasHtml = (html?: string) => {
      mainCanvasRef.value.innerHTML = html
    }

    const handleImport = (html: string) => {
      setMainCanvasHtml(html)

      saveData()
    }

    const toggleList = [
      {
        flag: 'enableDevHelpClass',
        title: 'DevClass',
        desc: 'Add 1px outline per element for better distinction',
      },
      {flag: 'enableExpand', title: 'Padding', desc: 'Pad each element with 10px for selection'},
      {flag: 'enableSelection', title: 'Selection', desc: 'Add cursor selection effect'},
      {flag: 'centeredElements', title: 'centeredElements', desc: ''},
      {flag: 'bgTransparent', title: 'bgTransparent', desc: ''},
      {flag: 'fullWidth', title: 'fullWidth', desc: ''},
    ]

    const MAX_WAIT_TIME = 0.5 * 1000
    const waitingTime = ref(0)
    const waitTimer = ref<any>(null)
    const cursorX = ref(0)
    const cursorY = ref(0)
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
      if (craftStore.currentBlock.manualType !== BlockManualType.DELETE) {
        handleBlockClick(event)
        return
      }
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
    }
    const handleMouseUp = (event: MouseEvent) => {
      // console.log('[handleMouseUp]', event)
      if (craftStore.currentBlock.manualType !== BlockManualType.DELETE) {
        return
      }
      clearWait()
    }

    return {
      craftStore,
      mainCanvasRef,
      copyInnerHtml,
      isShowImportDialog,
      setMainCanvasHtml,
      importHtml,
      handleBlockClick,
      indicatorOptions,
      saveData,
      hoveredElDisplay,
      handleImport,
      BlockManualType,
      toggleList,
      handleMouseDown,
      handleMouseUp,
      waitingProgress,
      cursorX,
      cursorY,
    }
  },
})
</script>

<template>
  <div class="page-craft-main-canvas-wrap">
    <n-modal
      v-model:show="isShowImportDialog"
      negative-text="Cancel"
      positive-text="Import"
      preset="dialog"
      title="Import HTML"
      @positive-click="handleImport(importHtml)"
    >
      <n-input
        v-model:value="importHtml"
        placeholder="Basic HTML"
        rows="20"
        style="font-family: monospace"
        type="textarea"
      />
    </n-modal>

    <div class="page-craft-main-canvas-indicator page-craft-aero-panel win7">
      <n-space align="center" size="small">
        <button @click="isShowImportDialog = true">Import...</button>
        <button @click="copyInnerHtml">Copy HTML</button>
        <button @click="saveData" title="Save DOM to LocalStorage">Save</button>

        <div v-for="item in toggleList" :key="item.flag" class="toggle-list">
          <input
            type="checkbox"
            :id="`checkbox_${item.flag}`"
            v-model="indicatorOptions[item.flag]"
          />
          <label :for="`checkbox_${item.flag}`" :title="item.desc">{{ item.title }}</label>
        </div>
      </n-space>
      <div class="indicator-text">
        {{ hoveredElDisplay }}
      </div>
    </div>
    <div
      ref="mainCanvasRef"
      :class="{
        'page-craft-main-canvas--dev': indicatorOptions.enableDevHelpClass,
        'page-craft-main-canvas--cursor-insert':
          !craftStore.currentBlock.manualType && Boolean(craftStore.currentBlock.tag),
        'page-craft-main-canvas--cursor-pickaxe':
          craftStore.currentBlock.manualType === BlockManualType.DELETE,
        'page-craft-main-canvas--expand': indicatorOptions.enableExpand,
        'page-craft-main-canvas--full-width': indicatorOptions.fullWidth,
        'page-craft-main-canvas--transparent': indicatorOptions.bgTransparent,
        'page-craft-main-canvas--centered': indicatorOptions.centeredElements,
      }"
      class="page-craft-main-canvas"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    ></div>

    <div
      v-if="cursorX"
      class="action-progress win7"
      :style="{top: cursorY + 'px', left: cursorX + 'px'}"
    >
      <div role="progressbar" class="animate error">
        <div :style="`width: ${waitingProgress}%`"></div>
      </div>
    </div>

    <ToolBar />
  </div>
</template>

<style lang="scss">
.page-craft-main-canvas-wrap {
  width: 100%;
  height: 100%;
  overflow: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;

  .page-craft-main-canvas-indicator {
    width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    border-top: 0;
    border-radius: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    z-index: 999;

    .indicator-text {
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 12px;
      font-family: monospace;
      max-width: 300px;
      transform: scale(0.8);
      transform-origin: top right;
    }

    text-shadow: 0 0 10px white;
  }

  .action-progress {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 999;
    width: 50px;
    pointer-events: none;
  }
}

.page-craft-main-canvas {
  flex: 1;
  background-color: white;
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  cursor: url('@/assets/textures/iron_sword--cursor.png') 0 0, default;

  &--cursor-insert {
    cursor: crosshair;
    * {
      cursor: crosshair;
    }
  }

  &--cursor-pickaxe {
    cursor: url('@/assets/textures/iron_pickaxe--cursor.png') 6 24, default;
    * {
      cursor: url('@/assets/textures/iron_pickaxe--cursor.png') 6 24, default;
    }
  }

  &--dev {
    * {
      outline: 1px dashed red;
    }

    .page-craft-mouse-over-dom-element-parent,
    .page-craft-mouse-over-dom-element {
    }
  }

  &--expand {
    * {
      transition: padding 1s;
      padding: 10px;
    }
  }
  &--full-width {
    width: 100%;
  }
  &--transparent {
    background-color: transparent;
  }
  &--centered {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.page-craft-mouse-over-dom-element,
  .page-craft-mouse-over-dom-element {
    outline: 1px solid #f7ff00 !important;
    border-color: #0066ff !important;
    background-color: rgba(144, 205, 238, 0.7) !important;
    //color: #111 !important;
    opacity: 0.85 !important;
    fill: #f7ff00 !important; /* Helps in highlighting SVG elements */
  }
}
</style>
