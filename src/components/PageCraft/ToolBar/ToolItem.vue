<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useCraftStore} from '@/store/craft'
import {BlockItem} from '@/enum/page-craft/block'
import {colorHash} from '@/utils'

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
  setup(props) {
    const {item} = toRefs(props)
    const craftStore = useCraftStore()

    // const isActive = computed(() => {
    //   return item.value.id === craftStore.currentBlock.id
    // })

    const color = computed(() => {
      return item.value.title && colorHash.hex(item.value.title)
    })
    return {
      craftStore,
      color,
    }
  },
})
</script>

<template>
  <div :class="{active}" class="tool-item _mini font-code" :title="item.title">
    <div
      :style="{
        backgroundColor: color,
      }"
      class="tool-item-bg"
    ></div>
    <img v-if="item.icon" :src="item.icon" alt="icon" />
    <span v-else-if="item.title" class="item-text">{{ item.title }}</span>
  </div>
</template>

<style lang="scss" scoped>
@import './tool-item.scss';
</style>
