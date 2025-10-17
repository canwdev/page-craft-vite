<script setup lang="ts">
import { ref } from 'vue'
import { getBase64FromImageUrl, pasteImage } from '@/utils/screenshot'

const fileInput = ref<HTMLInputElement | null>(null)
const imageSrc = ref<string | null>(null)
const imageDimensions = ref<{ width: number, height: number }>({ width: 0, height: 0 })

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const files = (event.target as HTMLInputElement).files
  handleFiles(files)
}

function handleDrop(event: DragEvent) {
  const files = event.dataTransfer?.files
  handleFiles(files)
}

function handleFiles(files: FileList | null) {
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

function getImageDimensions(event: Event) {
  const image = event.target as HTMLImageElement
  imageDimensions.value = {
    width: image.naturalWidth,
    height: image.naturalHeight,
  }
}

const dimensionInfo = computed(() => {
  return [
    { label: 'Size', value: `${imageDimensions.value.width}x${imageDimensions.value.height}` },
    {
      label: 'Ratio (H/W)',
      value: Number.parseFloat((imageDimensions.value.height / imageDimensions.value.width).toFixed(4)),
    },
    {
      label: 'AspectRatio (W/H)',
      value: Number.parseFloat((imageDimensions.value.width / imageDimensions.value.height).toFixed(4)),
    },
  ]
})

function copyToClipboard(text: string) {
  window.$mcUtils.copy(text, true)
}

function handleClear() {
  imageSrc.value = null
  imageDimensions.value = { width: 0, height: 0 }
}

async function handlePasteImage() {
  try {
    const imgSrc = await pasteImage()
    if (imgSrc) {
      imageSrc.value = imgSrc
    }
  }
  catch (error) {
    console.error(error)
    window.$message.error(error.message)
  }
}

async function copyBase64() {
  const base64url = await getBase64FromImageUrl(imageSrc.value)
  copyToClipboard(base64url)
}

function downloadImage() {
  if (imageSrc.value) {
    const a = document.createElement('a')
    a.href = imageSrc.value
    a.download = 'image.png'
    a.click()
  }
}
</script>

<template>
  <div
    class="image-size-copier vgo-bg"
    @dragenter.prevent
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <div class="drop-area" @click="triggerFileInput">
      <h2>
        <span class="mdi mdi-upload" />
        Drag or Select Image...
      </h2>
      <input ref="fileInput" type="file" accept="image/*" hidden @change="handleFileSelect">
      <button class="vgo-button" @click.stop="handlePasteImage">
        <span class="mdi mdi-clipboard-outline" />
        Paste Image
      </button>
    </div>

    <div v-if="imageDimensions.width" class="result-area vgo-panel font-code">
      <div v-for="(info, index) in dimensionInfo" :key="index" class="flex-row-center-gap">
        <span>{{ info.label }}: {{ info.value }}</span>
        <button class="vgo-button primary" @click="copyToClipboard(info.value)">
          Copy
        </button>
      </div>
      <div class="flex-row-center-gap">
        <button class="vgo-button primary" @click="copyBase64">
          Copy base64
        </button>
        <button class="vgo-button" @click="handleClear">
          Clear
        </button>
        <button class="vgo-button" @click="downloadImage">
          Download
        </button>
      </div>
    </div>
    <div v-if="imageSrc" class="image-preview">
      <img :src="imageSrc" alt="图片预览" @load="getImageDimensions">
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
    border: 2px dashed var(--vgo-primary-opacity);
    padding: 40px;
    cursor: pointer;
    border-radius: 5px;
    transition: border-color 0.3s;

    &:hover {
      border-color: var(--vgo-primary);
    }
  }

  .result-area {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 16px auto;
    padding: 10px;
    max-width: 360px;
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
