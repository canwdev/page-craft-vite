<script lang="ts">
import {useCraftStore} from "@/store/craft";
import {copyToClipboard} from "@/utils";
import ToolBar from '@/components/ToolBar/index.vue'
import {throttle} from 'throttle-debounce'
import $ from 'jquery'

const LS_KEY_MAIN_HTML = 'page_craft_main_html'
const LS_KEY_MAIN_CSS = 'page_craft_main_css'
const LS_KEY_INDICATOR_OPTIONS = 'page_craft_indicator_options'

const CLASS_MOUSE_OVER = 'page-craft-mouse-over-dom-element'
const DOT_CLASS_MOUSE_OVER = '.' + CLASS_MOUSE_OVER
const CLASS_MOUSE_OVER_PARENT = 'page-craft-mouse-over-dom-element-parent'
const DOT_CLASS_MOUSE_OVER_PARENT = '.' + CLASS_MOUSE_OVER_PARENT
const CLASS_MAIN_CANVAS_ROOT = 'page-craft-main-canvas'

const removeMouseOverDomElementEffect = () => {
  const $el = $(DOT_CLASS_MOUSE_OVER);
  if ($el.length) {
    $el.removeClass(CLASS_MOUSE_OVER);
  }
  const $el2 = $(DOT_CLASS_MOUSE_OVER_PARENT);
  if ($el2.length) {
    $el2.removeClass(CLASS_MOUSE_OVER_PARENT);
  }
  $('*[class=""]').removeAttr('class')
};

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
    ToolBar
  },
  setup() {
    const mainCanvasRef = ref()
    const craftStore = useCraftStore()
    const message = useMessage()
    const indicatorOptions = reactive<IndicatorOptions>(JSON.parse(localStorage.getItem(LS_KEY_INDICATOR_OPTIONS) || 'null') || {
      enableDevHelpClass: true,
      enableExpand: false,
      enableSelection: true,
      fullWidth: false,
      bgTransparent: false,
      centeredElements: false,
    })
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

    watch(indicatorOptions, () => {
      localStorage.setItem(LS_KEY_INDICATOR_OPTIONS, JSON.stringify({...indicatorOptions}))
    }, {deep: true})

    const saveData = () => {
      removeMouseOverDomElementEffect()
      const innerHTML = mainCanvasRef.value.innerHTML
      localStorage.setItem(LS_KEY_MAIN_HTML, innerHTML)
    }

    const isInsertMode = computed(() => {
      return Boolean(craftStore.currentBlock.tag)
    })

    const currentHoveredEl = ref<any>(null)
    const handleMousemoveDebounced = throttle(50, false, (event: Event) => {
      const currentNode: any = event.target
      if (currentHoveredEl.value === currentNode) {
        return;
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
      $(currentNode).addClass(CLASS_MOUSE_OVER);
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

    watch(() => indicatorOptions.enableSelection, (val) => {
      if (!val) {
        removeMouseOverDomElementEffect()
      }
    })
    const handleMouseMove = (event: Event) => {
      if (!indicatorOptions.enableSelection) {
        return
      }
      handleMousemoveDebounced(event)
    }

    const addBlock = (event: Event) => {
      // console.log('[craftStore]', craftStore, currentBlock.value)
      const {currentBlock} = craftStore

      // console.log('[event]', event)
      let targetEl
      if (event.target) {
        targetEl = event.target
      } else {
        targetEl = mainCanvasRef.value
      }

      console.log('[targetEl]', targetEl)

      if (!currentBlock.tag) {
        return
      }

      const addEl = document.createElement(currentBlock.tag)
      addEl.innerText = craftStore.innerText || ''
      if (craftStore.className) {
        addEl.className = craftStore.className
      }
      targetEl.appendChild(addEl)
      console.log('[addEl]', addEl)

      saveData()
    }

    const copyInnerHtml = () => {
      removeMouseOverDomElementEffect()
      const innerHTML = mainCanvasRef.value.innerHTML
      copyToClipboard(innerHTML)
      message.success(
        "Copy Success!"
      )
    }

    const importHtml = ref('')
    const setMainCanvasHtml = (html?: string) => {
      mainCanvasRef.value.innerHTML = html
    }

    const handleImport = (html: string) => {
      setMainCanvasHtml(html)

      saveData()
    }

    return {
      craftStore,
      mainCanvasRef,
      copyInnerHtml,
      isShowImportDialog,
      setMainCanvasHtml,
      importHtml,
      addBlock,
      indicatorOptions,
      saveData,
      hoveredElDisplay,
      isInsertMode,
      handleImport
    }
  }
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
        style="font-family: monospace;"
        type="textarea"
      />
    </n-modal>

    <div class="page-craft-main-canvas-indicator page-craft-aero-panel">
      <n-space align="center" size="small">
        <n-button-group size="small">
          <n-button type="info" @click="isShowImportDialog = true">Import</n-button>
          <n-button type="primary" @click="copyInnerHtml">Copy HTML</n-button>
          <n-button v-if="false" type="warning" @click="saveData">Save LocalStorage</n-button>
        </n-button-group>

        <div>
          <n-tooltip trigger="hover">
            <template #trigger>
              DevClass:
            </template>
            Add 1px outline per element for better distinction
          </n-tooltip>
          <n-switch v-model:value="indicatorOptions.enableDevHelpClass"/>
        </div>

        <div>
          <n-tooltip trigger="hover">
            <template #trigger>
              Padding:
            </template>
            Pad each element with 10px for selection
          </n-tooltip>
          <n-switch v-model:value="indicatorOptions.enableExpand"/>
        </div>

        <div>
          <n-tooltip trigger="hover">
            <template #trigger>
              Selection:
            </template>
            Add cursor selection effect
          </n-tooltip>
          <n-switch v-model:value="indicatorOptions.enableSelection"/>
        </div>

        <div>
          FullWidth:
          <n-switch v-model:value="indicatorOptions.fullWidth"/>
        </div>

        <div>
          bgTransparent:
          <n-switch v-model:value="indicatorOptions.bgTransparent"/>
        </div>

        <div>
          centeredElements:
          <n-switch v-model:value="indicatorOptions.centeredElements"/>
        </div>

      </n-space>
      <div class="indicator-text">
        {{ hoveredElDisplay }}
      </div>
    </div>
    <div ref="mainCanvasRef"
         :class="{
      'page-craft-main-canvas--dev': indicatorOptions.enableDevHelpClass,
      'page-craft-main-canvas--is-insert': isInsertMode,
      'page-craft-main-canvas--expand': indicatorOptions.enableExpand,
      'page-craft-main-canvas--full-width': indicatorOptions.fullWidth,
      'page-craft-main-canvas--transparent': indicatorOptions.bgTransparent,
      'page-craft-main-canvas--centered': indicatorOptions.centeredElements,
    }"
         class="page-craft-main-canvas"
         @click="addBlock"></div>


    <ToolBar/>
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
      transform: scale(.8);
      transform-origin: top right;
    }
  }

}

.page-craft-main-canvas {
  flex: 1;
  background-color: white;
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  cursor: url("@/assets/textures/iron_sword--cursor.png") 0 0, default;

  &--is-insert {
    cursor: crosshair;
  }

  &--is-pickaxe {
    cursor: url("@/assets/textures/iron_pickaxe--cursor.png") 6 24, default;
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
