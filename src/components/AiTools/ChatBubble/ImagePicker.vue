<script setup lang="ts">
import {useVModel} from '@vueuse/core'

interface Props {
  images: string[]
}

const props = withDefaults(defineProps<Props>(), {})

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
    <button class="vp-button" @click="handleChoose" title="Upload image...">🖼️</button>
    <div class="image-list">
      <div v-for="(image, index) in images" :key="index" class="image-item vp-panel">
        <n-image
          show-toolbar-tooltip
          width="40"
          height="30"
          object-fit="contain"
          :src="image"
          alt="Selected Image"
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

  .image-list {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;

    .image-item {
      display: flex;
      align-items: center;
      position: relative;

      .n-image {
      }

      button {
        position: absolute;
        bottom: 0;
        right: 0;
        opacity: 0;

        &:hover {
          color: #f44336;
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
