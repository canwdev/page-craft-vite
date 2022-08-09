<script lang="ts">
import {useCraftStore} from "@/store/craft";

export default defineComponent({
  name: 'MainCanvas',
  setup() {
    const mainCanvasRef = ref()
    const craftStore = useCraftStore()

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
      ael.className = craftStore.className || ''
      targetEl.appendChild(ael)
      console.log('[ael]', ael)
    }

    return {
      craftStore,
      mainCanvasRef,
      addComponent
    }
  }
})
</script>

<template>
  <div id="main_canvas" ref="mainCanvasRef" class="main-canvas" @click="addComponent">

  </div>
</template>

<style lang="scss">
.main-canvas {
  max-width: 1200px;
  min-height: 800px;
  margin: 0 auto;
  background: white;

  * {
    outline: 1px solid red;

    &:hover {
      outline-color: blue;
    }
  }
}
</style>
