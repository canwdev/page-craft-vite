<script setup lang="ts">
import {ref} from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const imageSrc = ref<string | null>(null)
const imageDimensions = ref<{width: number; height: number}>({width: 0, height: 0})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  handleFiles(files)
}

const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  handleFiles(files)
}

const handleFiles = (files: FileList | null) => {
  if (files && files[0]) {
    const file = files[0]
    if (!file.type.startsWith('image/')) {
      window.$message.error(`请选择图片文件！`)
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      console.log(event)
      if (event.target) {
        imageSrc.value = event.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

const getImageDimensions = (event: Event) => {
  const image = event.target as HTMLImageElement
  imageDimensions.value = {
    width: image.naturalWidth,
    height: image.naturalHeight,
  }
}

const dimensionInfo = computed(() => {
  return [
    {label: 'Size', value: `${imageDimensions.value.width}x${imageDimensions.value.height}`},
    {
      label: 'Ratio (H/W)',
      value: parseFloat((imageDimensions.value.height / imageDimensions.value.width).toFixed(4)),
    },
    {
      label: 'Ratio (W/H)',
      value: parseFloat((imageDimensions.value.width / imageDimensions.value.height).toFixed(4)),
    },
  ]
})

const copyToClipboard = (text: string) => {
  window.$mcUtils.copy(text, true)
}

const handleClear = () => {
  imageSrc.value = null
  imageDimensions.value = {width: 0, height: 0}
}
</script>

<template>
  <div
    class="image-size-copier vp-bg"
    @dragenter.prevent
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <div class="drop-area" @click="triggerFileInput">
      <h2>Drag or Select Image...</h2>
      <input type="file" ref="fileInput" accept="image/*" @change="handleFileSelect" hidden />
    </div>
    <div class="result-area vp-panel font-code" v-if="imageDimensions.width">
      <div class="flex-row-center-gap" v-for="(info, index) in dimensionInfo" :key="index">
        <span>{{ info.label }}: {{ info.value }}</span>
        <button class="vp-button primary" @click="copyToClipboard(info.value)">Copy</button>
      </div>
      <div class="flex-row-center-gap">
        <button class="vp-button primary" @click="copyToClipboard(imageSrc)">Copy base64</button>
        <button class="vp-button" @click="handleClear">Clear</button>
      </div>
    </div>
    <div class="image-preview" v-if="imageSrc">
      <img :src="imageSrc" alt="图片预览" @load="getImageDimensions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.image-size-copier {
  height: 100%;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;

  .drop-area {
    border: 2px dashed $primary_opacity;
    padding: 40px;
    cursor: pointer;
    border-radius: 5px;
    transition: border-color 0.3s;

    &:hover {
      border-color: $primary;
    }
  }

  .result-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 16px auto;
    padding: 10px;
    max-width: 300px;

    div {
    }
  }

  .image-preview {
    margin: 0 auto;
    width: 100%;
    height: 300px;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
