<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useCraftStore} from '@/store/craft'
import {BlockItem} from '@/enum/block'
import {colorHash} from '@/utils'

export default defineComponent({
  name: 'BlockListItem',
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
      return item.value.title && colorHash.rgb(item.value.title).join(', ')
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
  <div
    :class="{active: isActive}"
    class="tool-item"
    :title="item.title"
    :style="{
      '--block-color-rgb': color,
    }"
  >
    <img v-if="item.icon" :src="item.icon" alt="icon" />
    <span v-else-if="item.title" class="item-text">{{ item.title }}</span>
  </div>
</template>

<style lang="scss" scoped>
.tool-item {
  --block-color-rgb: 204, 204, 204;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  font-family: 'Operator Mono', 'Source Code Pro', Menlo, Monaco, Consolas, Courier New, monospace;
  color: white;
  transition: all 0.3s;
  outline: 1px solid rgb(var(--block-color-rgb));
  background-color: rgba(var(--block-color-rgb), 0.65);

  &:hover {
    background-color: rgb(var(--block-color-rgb));
    box-shadow: 0 0 10px rgb(var(--block-color-rgb)) !important;
    transform: scale(1.2);
  }

  &:active {
    opacity: 0.7;
    transform: scale(0.9);
    transition: all 0.1s;
  }

  &::before {
    width: 54px;
    height: 54px;
    background-image: url('@/assets/gui/widgets-item-selected.png');
    background-size: contain;
    position: absolute;
    transform: translateX(1px) scale(0.9);
    z-index: 0;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
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

  img {
    width: 32px;
    height: 32px;
    image-rendering: pixelated;
  }
  $bracket_color: currentColor;
  .item-text {
    transform: rotate(-45deg);
    text-shadow: 0 0 2px black, 0 0 1px black;
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
