<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useCraftStore} from '@/store/craft'
import {BlockItem} from '@/enum/page-craft/block'
import {colorHash} from '@/utils'

export default defineComponent({
  name: 'BlockCard',
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
    const craftStore = useCraftStore()

    const isActive = computed(() => {
      return item.value.id === craftStore.currentBlock.id
    })

    const color = computed(() => {
      return item.value.title && colorHash.hex(item.value.title)
    })

    return {
      craftStore,
      isActive,
      color,
    }
  },
})
</script>

<template>
  <div :class="{active: isActive}" class="tool-item font-minecraft" :title="item.title">
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
.tool-item {
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  position: relative;
  border: 3px solid rgba(128, 128, 128, 0.5);
  border-radius: 4px;

  &.active {
    border-color: currentColor !important;
  }

  .tool-item-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    opacity: 0.5;
  }

  img {
    width: 32px;
    height: 32px;
    image-rendering: pixelated;
    position: relative;
    z-index: 1;
  }

  $bracket_color: currentColor;
  .item-text {
    transform: rotate(-45deg);
    text-shadow: 0px 0px 1px black;
    &::before {
      content: '<';
      color: $bracket_color;
      opacity: 0.5;
    }
    &::after {
      content: '>';
      color: $bracket_color;
      opacity: 0.5;
    }
  }
}
</style>
