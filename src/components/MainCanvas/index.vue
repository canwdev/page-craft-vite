<script lang="ts">
import {useCraftStore} from "@/store/craft";
import {copyToClipboard} from "@/utils";
import {throttle} from 'throttle-debounce'
import $ from 'jquery'

const LS_KEY_MAIN_HTML = 'page_craft_main_html'
const LS_KEY_MAIN_CSS = 'page_craft_main_css'

const CLASS_MOUSE_OVER = 'page-craft-mouse-over-dom-element'
const DOT_CLASS_MOUSE_OVER = '.'+CLASS_MOUSE_OVER
const CLASS_MOUSE_OVER_PARENT = 'page-craft-mouse-over-dom-element-parent'
const DOT_CLASS_MOUSE_OVER_PARENT = '.'+CLASS_MOUSE_OVER_PARENT
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
};

export default defineComponent({
  name: 'MainCanvas',
  setup() {
    const mainCanvasRef = ref()
    const craftStore = useCraftStore()
    const message = useMessage()
    const enableDevHelpClass = ref(true)
    const enableSelection = ref(true)
    const isShowImportDialog = ref(false)

    onMounted(() => {
      const html = localStorage.getItem(LS_KEY_MAIN_HTML)
      if (html) {
        handleImportHtml(html)
      }
      mainCanvasRef.value.addEventListener('mousemove', handleMouseMove)
    })
    onBeforeUnmount(() => {
      mainCanvasRef.value.removeEventListener('mousemove', handleMouseMove)
    })

    const saveData = () => {
      const innerHTML = mainCanvasRef.value.innerHTML
      localStorage.setItem(LS_KEY_MAIN_HTML, innerHTML)
    }

    const isInsertMode = computed(() => {
      return Boolean(craftStore.currentBlock.tag)
    })

    const currentHoveredEl = ref<any>(null)
    const handleMousemoveDebounced = throttle(80, false, (event: Event) => {
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
        if (currentHoveredEl.value.className) {
          str += `  ( ${currentHoveredEl.value.className} )`
        }
        return str
      }
      return ''
    })

    watch(enableSelection, (val) => {
      if (!val) {
        removeMouseOverDomElementEffect()
      }
    })
    const handleMouseMove = (event: Event) => {
      if (!enableSelection.value) {
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
        addEl.className = craftStore.className || ''
      }
      targetEl.appendChild(addEl)
      console.log('[addEl]', addEl)
    }

    const copyInnerHtml = () => {
      const innerHTML = mainCanvasRef.value.innerHTML
      copyToClipboard(innerHTML)
      message.success(
        "Copy Success!"
      )
    }

    const importHtml = ref('')
    const handleImportHtml = (html?: string) => {
      mainCanvasRef.value.innerHTML = html || importHtml.value
    }

    return {
      craftStore,
      mainCanvasRef,
      copyInnerHtml,
      isShowImportDialog,
      handleImportHtml,
      importHtml,
      addBlock,
      enableDevHelpClass,
      enableSelection,
      saveData,
      hoveredElDisplay,
      isInsertMode
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
      @positive-click="handleImportHtml"
    >
      <n-input
        v-model:value="importHtml"
        placeholder="Basic HTML"
        rows="20"
        style="font-family: monospace;"
        type="textarea"
      />
    </n-modal>

    <div class="page-craft-main-canvas-indicator">
      <n-space size="small">
        <n-button-group size="small">
          <n-button type="info" @click="isShowImportDialog = true">Import</n-button>
          <n-button type="primary" @click="copyInnerHtml">Copy HTML</n-button>
          <n-button type="warning" @click="saveData">Save LocalStorage</n-button>
        </n-button-group>
        <div>
          DevClass:
          <n-switch  v-model:value="enableDevHelpClass" />
        </div>
        <div>
          Selection:
          <n-switch  v-model:value="enableSelection" />
        </div>
      </n-space>
      <div class="indicator-text">
        {{isInsertMode ? `Insert ${craftStore.currentBlock.tag}` : hoveredElDisplay}}
      </div>
    </div>
    <div ref="mainCanvasRef" :class="{
      'page-craft-main-canvas--dev': enableDevHelpClass,
      'page-craft-main-canvas--is-insert': isInsertMode,
    }" class="page-craft-main-canvas"
         @click="addBlock"></div>
  </div>
</template>

<style lang="scss">
.page-craft-main-canvas-wrap {
  max-width: 1200px;
  min-height: 800px;
  max-height: 100vh;
  overflow: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  .page-craft-main-canvas-indicator {
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    .indicator-text {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 12px;
      font-family: monospace;
    }
  }

  .page-craft-main-canvas {
    flex: 1;
    background: white;
  }
}

.page-craft-main-canvas {
  &--is-insert {
    cursor: crosshair;
    &.page-craft-main-canvas--dev {
      * {
        // set 1px border for selection
        border: 1px dashed red;
        outline: none;
        transition: padding .4s;
      }

      .page-craft-mouse-over-dom-element-parent,
      .page-craft-mouse-over-dom-element {
        padding: 10px;
      }
    }
  }
  &--dev {
    * {
      outline: 1px dashed red;
    }
  }

  &.page-craft-mouse-over-dom-element,
  .page-craft-mouse-over-dom-element {
    outline: 1px solid #f7ff00 !important;
    border-color: #0066ff !important;
    background-color: rgba(144, 205, 238, 0.7) !important;
    //color: #111 !important;
    opacity: 0.85 !important;
    fill: #f7ff00 !important;   /* Helps in highlighting SVG elements */
  }


}
</style>
