<script lang="ts">
import {useCraftStore} from "@/store/craft";
import {copyToClipboard} from "@/utils";

export default defineComponent({
  name: 'MainCanvas',
  setup() {
    const mainCanvasRef = ref()
    const craftStore = useCraftStore()
    const message = useMessage()
    const enableDevHelpClass = ref(true)
    const isShowImportDialog = ref(false)

    onMounted(() => {
      // mainCanvasRef.value.addEventListener('mousemove', handleMouseMove)
    })
    onBeforeUnmount(() => {
      // mainCanvasRef.value.removeEventListener('mousemove', handleMouseMove)
    })

    const handleMouseMove = (event: Event) => {
      console.log(event)
    }

    const addComponent = (event: Event) => {
      // console.log('[event]', event)
      let targetEl
      if (event.target) {
        targetEl = event.target
      } else {
        targetEl = mainCanvasRef.value
      }
      const {currentBlock} = craftStore
      // console.log('[craftStore]', craftStore, currentBlock.value)

      const ael = document.createElement(currentBlock.tag)
      ael.innerText = craftStore.innerText || ''
      if (craftStore.className) {
        ael.className = craftStore.className || ''
      }
      targetEl.appendChild(ael)
      console.log('[ael]', ael)
    }

    const copyInnerHtml = () => {
      console.log('mainCanvasRef', mainCanvasRef)
      const innerHTML = mainCanvasRef.value.innerHTML
      copyToClipboard(innerHTML)
      message.success(
        "Copy Success!"
      )
    }

    const importHtml = ref('')
    const handleImportHtml = () => {
      mainCanvasRef.value.innerHTML = importHtml.value
    }

    return {
      craftStore,
      mainCanvasRef,
      copyInnerHtml,
      isShowImportDialog,
      handleImportHtml,
      importHtml,
      addComponent,
      enableDevHelpClass
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
      <n-space>
        {{0}}
      </n-space>
    </div>
    <div ref="mainCanvasRef" :class="{'main-canvas--dev': enableDevHelpClass}" class="main-canvas"
         @click="addComponent"></div>
  </div>
</template>

<style lang="scss">
.main-canvas-wrap {
  max-width: 1200px;
  min-height: 800px;
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

  &--dev {
    * {
      border: 1px dashed red;

      &:hover {
        padding: 10px;
        border-color: blue;
        background-color: rgba(137, 137, 106, 0.1);
      }


    }
  }


}
</style>
