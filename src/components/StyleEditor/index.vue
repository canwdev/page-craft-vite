<script lang="ts">
import {defineComponent} from 'vue'
import {setDraggableMouse} from '@/utils/draggable-mouse'
import {useModelWrapper} from '@/hooks/use-model-wrapper'

export default defineComponent({
  name: 'StyleEditor',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')
    const dialogRef = ref()
    const titleBarRef = ref()

    const clearDraggable = ref<any>(null)
    onMounted(() => {
      clearDraggable.value = setDraggableMouse({
        dragHandleEl: titleBarRef.value,
        dragTargetEl: dialogRef.value,
        allowOut: true,
      })
    })

    onBeforeUnmount(() => {
      if (clearDraggable.value) {
        clearDraggable.value()
      }
    })

    const handleUpdateStyle = (e) => {
      // localStorage.setItem(LS_KEY_GLOBAL_STYLE, e.value)
      const styleEl = document.getElementById('canvasStyle')
      if (styleEl) {
        styleEl.innerHTML = e.target.value
      }
    }

    return {
      dialogRef,
      titleBarRef,
      mVisible,
      handleUpdateStyle,
    }
  },
})
</script>

<template>
  <div v-show="mVisible" class="style-editor-dialog win7" ref="dialogRef">
    <div class="window is-bright glass">
      <div class="title-bar" ref="titleBarRef">
        <div class="title-bar-text">Style Editor</div>
        <div class="title-bar-controls">
          <!--          <button aria-label="Minimize"></button>-->
          <!--          <button aria-label="Maximize"></button>-->
          <button style="color: white; text-shadow: 0 0 2px black">A</button>
          <button aria-label="Close" @click="mVisible = false"></button>
        </div>
      </div>

      <div class="window-body">
        <textarea
          rows="10"
          cols="50"
          style="font-family: monospace"
          @change="handleUpdateStyle"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.style-editor-dialog {
  position: fixed;
  z-index: 1000;
  top: 30%;
  left: 30%;
  .title-bar {
    user-select: none;
  }
}
</style>
