<script lang="ts" setup>
import QrcodeDecoder from './qrcode-decoder'
import {onBeforeUnmount, onMounted, ref} from 'vue'

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

    await window.$qlUtils.copy(res.data)
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

const startScanUploadImage = async () => {
  if (qr) {
    qr.stop()
    qr = null
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true

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
        const imgElement = await loadImage(imgSrc)
        qr = new QrcodeDecoder()
        const res = await qr.decodeFromImage(imgElement)
        console.log(res)
        if (!res) {
          window.$message.error('No QR code detected in the image')
          return
        }

        await window.$qlUtils.copy(res.data, true)
      } catch (error) {
        window.$message.error(error.message)
        console.error(error)
      }
    })

    fileInput.click()
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
  <button
    class="btn-qr-scanner vp-button"
    title="QR Code Scanner, right click upload image to decode"
    :class="{active: isLoading}"
    @click="startScanUploadImage"
  >
    <span class="mdi mdi-qrcode-scan"></span>
    Scan QR code from image...
  </button>
</template>

<style lang="scss" scoped>
.btn-qr-scanner {
  &.active {
    color: #f44336;
  }
}
</style>
