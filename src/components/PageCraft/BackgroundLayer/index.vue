<script lang="ts">
import {defineComponent} from 'vue'
import {WindowController} from '@/utils/window-controller'
import FileChooser from '@/components/CommonUI/FileChooser.vue'

export default defineComponent({
  name: 'BackgroundLayer',
  components: {
    FileChooser,
  },
  setup() {
    const dWindow = ref<any>(null)
    const imageRef = ref()
    const imageSrc = ref<string | undefined>(undefined)
    const imageChooserRef = ref()
    const isDragMode = ref(false)
    const zoomPercent = ref(100)

    onMounted(() => {
      dWindow.value = new WindowController({
        dragHandleEl: imageRef.value,
        dragTargetEl: imageRef.value,
        allowOut: true,
      })
    })

    const handleChooseImage = (file) => {
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        () => {
          // convert image file to base64 string
          imageSrc.value = String(reader.result)
          isDragMode.value = true
        },
        false
      )

      reader.readAsDataURL(file)
    }

    return {
      imageRef,
      imageSrc,
      imageChooserRef,
      handleChooseImage,
      isDragMode,
      onChoose() {
        if (imageChooserRef.value) {
          imageChooserRef.value.chooseFile()
        }
      },
      onRemoveImage() {
        imageSrc.value = undefined

        imageRef.value.style.top = 0
        imageRef.value.style.left = 0
      },
      zoomPercent,
    }
  },
})
</script>

<template>
  <div class="background-layer">
    <img
      class="reference-map"
      :class="{'is-drag-mode': isDragMode}"
      ref="imageRef"
      :src="imageSrc"
      alt="Reference map"
      draggable="false"
      @dblclick="isDragMode = false"
      :style="{
        transform: `scale(${zoomPercent / 100})`,
      }"
    />
    <div class="operation-panel page-craft-panel font-emoji">
      <n-tooltip>
        <template #trigger>
          <n-button v-if="imageSrc" size="tiny" @click="onRemoveImage">🗑</n-button>
          <n-button v-else size="tiny" @click="onChoose">🖼</n-button>
        </template>
        Add/Remove Reference Map
      </n-tooltip>
      <template v-if="imageSrc">
        |
        <n-tooltip v-if="imageSrc">
          <template #trigger>
            <n-button size="tiny" @click="isDragMode = !isDragMode">{{
              isDragMode ? '📌' : '🪂'
            }}</n-button>
          </template>
          Drag Mode
        </n-tooltip>
        <n-tooltip v-if="imageSrc" show>
          <template #trigger>
            <n-button size="tiny" @click="zoomPercent = 100">🔎</n-button>
          </template>
          <n-slider style="width: 240px" v-model:value="zoomPercent" :min="0" :max="200" />
        </n-tooltip>
      </template>
    </div>
    <FileChooser ref="imageChooserRef" accept="image/*" @selected="handleChooseImage" />
  </div>
</template>

<style lang="scss" scoped>
.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  user-select: none;

  .operation-panel {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 2;
    padding: 3px;
  }

  .reference-map {
    position: absolute;
    top: 0;
    left: 0;
    &.is-drag-mode {
      z-index: 2;
      cursor: grab;
      opacity: 0.5;
      &:active {
        cursor: grabbing;
      }
      outline: 1px dashed blue;
    }
  }
}
</style>
