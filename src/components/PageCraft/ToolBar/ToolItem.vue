<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useMainStore} from '@/store/main'
import {BlockItem} from '@/enum/page-craft/block'
import {colorHash} from '@/utils'
import {useFileDrop} from '@/hooks/use-file-drop'
import {useSettingsStore} from '@/store/settings'

export default defineComponent({
  name: 'ToolItem',
  props: {
    item: {
      type: Object as PropType<BlockItem>,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onDrop', 'onDragStart'],
  setup(props, {emit}) {
    const {item} = toRefs(props)
    const mainStore = useMainStore()
    const settingsStore = useSettingsStore()

    // const isActive = computed(() => {
    //   return item.value.id === mainStore.currentBlock.id
    // })
    const showDropzone = ref(false)

    const color = computed(() => {
      return item.value.title && colorHash.hex(item.value.title)
    })
    return {
      mainStore,
      settingsStore,
      color,
      showDropzone,
      onDragover(e) {
        showDropzone.value = true
      },
      async onDrop(e) {
        showDropzone.value = false
        emit('onDrop', e)
      },
    }
  },
})
</script>

<template>
  <div
    :class="{active, blink: showDropzone}"
    class="mc-tool-item _mini font-code vgo-button"
    :title="item.title"
    draggable="true"
    @dragstart="$emit('onDragStart', $event)"
    @dragover.prevent.stop="onDragover"
    @dragleave.prevent.stop="showDropzone = false"
    @drop.prevent.stop="onDrop"
  >
    <div
      :style="{
        backgroundColor: color,
      }"
      class="mc-tool-item-bg"
    ></div>
    <img v-if="item.icon" :src="item.icon" alt="icon" />
    <span v-else-if="item.title" class="item-text">{{ item.title }}</span>
  </div>
</template>

<style lang="scss" scoped>
.mc-tool-item {
  cursor: grab;
  &:active {
    cursor: grabbing;
  }

  &.showDropzone {
    filter: contrast(200%) brightness(5);
  }
}
</style>
