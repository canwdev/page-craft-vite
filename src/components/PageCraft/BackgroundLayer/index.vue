<script lang="ts">
import {defineComponent} from 'vue'
import FileChooser from '@/components/CommonUI/FileChooser.vue'
import ReferenceMap from '@/components/PageCraft/BackgroundLayer/ReferenceMap.vue'
import {guid} from '@/utils'

export default defineComponent({
  name: 'BackgroundLayer',
  components: {
    ReferenceMap,
    FileChooser,
  },
  setup() {
    const imageChooserRef = ref()
    const imgSrcList = ref<any>([])

    const handleChooseImage = (files) => {
      // 处理选择的多个文件
      for (const file of files) {
        const reader = new FileReader()

        reader.addEventListener(
          'load',
          () => {
            // convert image file to base64 string
            imgSrcList.value.push({
              id: guid(),
              src: String(reader.result),
            })
          },
          false,
        )

        reader.readAsDataURL(file)
      }
    }

    const handleImgClose = (index) => {
      imgSrcList.value.splice(index, 1)
    }

    return {
      imageChooserRef,
      handleChooseImage,
      imgSrcList,
      handleImgClose,
    }
  },
})
</script>

<template>
  <div class="background-layer">
    <ReferenceMap
      :img-src="item.src"
      v-for="(item, index) in imgSrcList"
      :key="item.id"
      @close="handleImgClose(index)"
    />
    <div class="operation-panel vgo-panel font-emoji">
      <button class="vgo-button" @click="imageChooserRef.chooseFile()">🖼</button>
    </div>
    <FileChooser ref="imageChooserRef" accept="image/*" @selected="handleChooseImage" multiple />
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
}
</style>
