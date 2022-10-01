<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useCraftStore} from '@/store/craft'
import {BlockItem} from '@/enum/block'
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
  <div :class="{active}" class="tool-item font-minecraft" :title="item.title">
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
  width: 39px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  position: relative;
  color: white;

  &::before {
    width: 48px;
    height: 48px;
    background-image: url('@/assets/gui/widgets-item-selected.png');
    background-size: contain;
    position: absolute;
    transform: translateX(1px) scale(0.9);
    z-index: 0;
    content: '';
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s;
  }

  &.active {
    &::before {
      opacity: 1;
      visibility: visible;
      transform: translateX(1px) scale(1);
    }
  }

  .tool-item-bg {
    position: absolute;
    top: 7px;
    left: 5px;
    right: 5px;
    bottom: 8px;
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
    text-shadow: 1px 1px 1px black;
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
