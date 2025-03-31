<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useMainStore} from '@/store/main'
import {BlockItem} from '@/enum/page-craft/block'
import {colorHash} from '@/utils'
import {useSettingsStore} from '@/store/settings'

export default defineComponent({
  name: 'BlockItemCard',
  props: {
    item: {
      type: Object as PropType<BlockItem>,
      required: true,
    },
    // isActive: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  setup(props) {
    const {item} = toRefs(props)
    const mainStore = useMainStore()
    const settingsStore = useSettingsStore()

    const isActive = computed(() => {
      return item.value.id === mainStore.currentBlock.id
    })

    const color = computed(() => {
      return item.value.title && colorHash.hex(item.value.title)
    })

    return {
      mainStore,
      settingsStore,
      isActive,
      color,
      handleDragStart(event) {
        event.dataTransfer.setData('data-block', JSON.stringify(item.value))
      },
    }
  },
})
</script>

<template>
  <div
    :class="{active: isActive}"
    class="mc-tool-item font-code vgo-button"
    :title="item.title"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <div
      :style="{
        backgroundColor: color,
      }"
      class="mc-tool-item-bg"
    ></div>

    <img v-if="item.icon" :src="item.icon" alt="icon" />
    <span v-else-if="item.title" class="item-text">{{ item.title }}</span>
    <span v-if="item.icon && item.title" class="item-subtext">{{ item.title }}</span>
  </div>
</template>
