<script setup lang="ts">
import {useVModel} from '@vueuse/core'

interface Props {
  images: string[]
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {disabled: false})

const emit = defineEmits(['update:images'])
const mImages = useVModel(props, 'images', emit)

const removeImage = (index: number) => {
  mImages.value.splice(index, 1)
}

const handleChoose = async () => {
  // 仅支持在支持 window.showOpenFilePicker 的环境下运行，如现代浏览器
  try {
    const fileHandles = await window.showOpenFilePicker({
      multiple: true,
      types: [
        {
          description: 'Image files',
          accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
          },
        },
      ],
    })
    for (const fileHandle of fileHandles) {
      const file = await fileHandle.getFile()
      if (file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader()
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target) {
            mImages.value.push(e.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      } else {
        window.$message.warning(`File ${file.name} is larger than 5MB and has been ignored.`)
      }
    }
  } catch (error) {
    console.error('Error picking files: ', error)
  }
}
</script>

<template>
  <div class="image-picker">
    <button class="vgo-button" :disabled="disabled" @click="handleChoose" title="Upload image...">
      <span class="mdi mdi-image"></span>
    </button>
    <div class="image-list">
      <div v-for="(image, index) in images" :key="index" class="image-item vgo-panel">
        <el-image
          :preview-src-list="images"
          :initial-index="index"
          :src="image"
          :preview-teleported="true"
          fit="contain"
        />
        <button @click="removeImage(index)" class="btn-no-style" title="Remove">✖</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.image-picker {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;

  .mdi {
    font-size: 14px;
  }

  .image-list {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;

    .image-item {
      display: flex;
      align-items: center;
      position: relative;

      .el-image {
        width: 40px;
        height: 30px;
        object-fit: contain;
      }

      button {
        position: absolute;
        top: -6px;
        right: -6px;
        z-index: 1;
        background-color: #fff;
        color: #000;
        border: 1px solid currentColor;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        font-size: 12px;
        border-radius: 50%;
        &:hover {
          background-color: #f44336;
          color: white;
        }
      }

      &:hover {
        button {
          opacity: 1;
        }
      }
    }
  }
}
</style>
