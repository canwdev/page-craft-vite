<script lang="ts" setup>
import QrcodeDecoder from './qrcode-decoder'
import {ref} from 'vue'
import {pasteImage, takeScreenshot} from '@/utils/screenshot'

const emit = defineEmits(['onResult'])

const isLoading = ref()
let qr: QrcodeDecoder | null = null
const startVideoScan = async () => {
  if (qr) {
    qr.stop()
    qr = null
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true

    const video = document.querySelector('#streamVideo')
    qr = new QrcodeDecoder()
    const res = await qr.decodeFromVideo(video)
    console.log(res)

    emit('onResult', res.data)

    await window.$mcUtils.copy(res.data)
  } catch (error: any) {
    console.error(error)
    window.$notification({
      type: 'error',
      message: error.message,
      timeout: 3000,
    })
  } finally {
    isLoading.value = false
    qr = null
  }
}

const startScanUploadImage = async (type: 'screen' | 'file' | 'clipboard') => {
  if (qr) {
    qr.stop()
    qr = null
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true

    const handleImage = async (imgSrc) => {
      const imgElement = await loadImage(imgSrc)
      qr = new QrcodeDecoder()
      const res = await qr.decodeFromImage(imgElement)
      console.log(res)
      if (!res) {
        window.$message.error('No QR detected in the image')
        return
      }

      emit('onResult', res.data)
      await window.$mcUtils.copy(res.data, true)
    }

    if (type === 'file') {
      // 创建文件输入元素
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*' // 只接受图片文件

      // 添加 change 事件监听器
      fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0]
        if (!file) return

        try {
          const imgSrc = await readFile(file)
          await handleImage(imgSrc)
        } catch (error) {
          window.$message.error(error.message)
          console.error(error)
        }
      })

      fileInput.click()
    } else if (type === 'screen') {
      const base64url = await takeScreenshot()
      if (!base64url) {
        throw new Error('Failed to take screenshot')
      }
      await handleImage(base64url)
    } else if (type === 'clipboard') {
      const imgSrc = await pasteImage()
      await handleImage(imgSrc)
    }
  } catch (error) {
    console.error(error)
    window.$notification({
      type: 'error',
      message: error.message,
      timeout: 3000,
    })
  } finally {
    isLoading.value = false
    qr = null
  }
}

// 使用 Promise 封装 FileReader
const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 使用 Promise 封装图像加载
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}
</script>

<template>
  <div class="btn-qr-scanner">
    <button class="vgo-button" :class="{active: isLoading}" @click="startScanUploadImage('screen')">
      <span class="mdi mdi-qrcode-scan"></span>
      Scan QR from screen...
    </button>

    <button class="vgo-button" :class="{active: isLoading}" @click="startScanUploadImage('file')">
      <span class="mdi mdi-upload"></span>
      Scan QR from image file...
    </button>

    <button
      class="vgo-button"
      :class="{active: isLoading}"
      @click="startScanUploadImage('clipboard')"
    >
      <span class="mdi mdi-clipboard-outline"></span>
      Scan QR from clipboard...
    </button>
  </div>
</template>

<style lang="scss" scoped>
.btn-qr-scanner {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .active {
    color: #f44336;
  }
}
</style>
