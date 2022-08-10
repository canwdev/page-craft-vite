<script lang="ts">
import {useCraftStore} from "@/store/craft";
import {copyToClipboard} from "@/utils";
import {throttle} from 'throttle-debounce'

const LS_KEY_MAIN_HTML = 'page_craft_main_html'
const LS_KEY_MAIN_CSS = 'page_craft_main_css'


export default defineComponent({
  name: 'MainCanvas',
  setup() {
    const mainCanvasRef = ref()
    const craftStore = useCraftStore()
    const message = useMessage()
    const enableDevHelpClass = ref(true)
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
    const handleScrollDebounced = throttle(300, false, (event: Event) => {
      // console.log('event', event.target)
      currentHoveredEl.value = event.target
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

    const handleMouseMove = (event: Event) => {
      if (isInsertMode.value) {
        return
      }
      handleScrollDebounced(event)
    }

    const addBlock = (event: Event) => {
      // console.log('[craftStore]', craftStore, currentBlock.value)
      const {currentBlock} = craftStore
      if (!currentBlock.tag) {
        return
      }

      // console.log('[event]', event)
      let targetEl
      if (event.target) {
        targetEl = event.target
      } else {
        targetEl = mainCanvasRef.value
      }

      const ael = document.createElement(currentBlock.tag)
      ael.innerText = craftStore.innerText || ''
      if (craftStore.className) {
        ael.className = craftStore.className || ''
      }
      targetEl.appendChild(ael)
      console.log('[ael]', ael)
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
      saveData,
      hoveredElDisplay,
      isInsertMode
    }
  }
})
</script>

<template>
  <div class="main-canvas-wrap">
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

    <div class="main-canvas-indicator">
      <n-space size="small">
        <n-button-group size="small">
          <n-button type="info" @click="isShowImportDialog = true">Import</n-button>
          <n-button type="primary" @click="copyInnerHtml">Copy HTML</n-button>
          <n-button type="warning" @click="saveData">Save LocalStorage</n-button>
        </n-button-group>
        <n-switch  v-model:value="enableDevHelpClass">
          <template #checked>
            Dev Class
          </template>
          <template #unchecked>
            Dev Class
          </template>
        </n-switch>
      </n-space>
      <n-space style="font-family: monospace">
        {{isInsertMode ? `Insert ${craftStore.currentBlock.tag}` : hoveredElDisplay}}
      </n-space>
    </div>
    <div ref="mainCanvasRef" :class="{
      'main-canvas--dev': enableDevHelpClass,
      'main-canvas--is-insert': isInsertMode,
    }" class="main-canvas"
         @click="addBlock"></div>
  </div>
</template>

<style lang="scss">
.main-canvas-wrap {
  max-width: 1200px;
  min-height: 800px;
  max-height: 100vh;
  overflow: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  .main-canvas-indicator {
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .main-canvas {
    flex: 1;
    background: white;
  }
}

.main-canvas {
  &--is-insert {
    cursor: crosshair;
  }

  &--dev {
    * {
      border: 1px dashed red;

      &:hover {
        padding: 10px;
        border-color: blue;
        //background-color: rgba(137, 137, 106, 0.1);
      }


    }
  }


}
</style>
