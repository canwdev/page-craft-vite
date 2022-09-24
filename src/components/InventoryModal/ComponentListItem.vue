<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useCraftStore} from '@/store/craft'
import {BlockItem} from '@/enum/block'
import {colorHash, formatDate} from '@/utils'

export default defineComponent({
  name: 'ComponentItem',
  props: {
    item: {
      type: Object as PropType<BlockItem>,
      required: true,
    },
  },
  setup(props) {
    const {item} = toRefs(props)
    const craftStore = useCraftStore()

    const color = computed(() => {
      return item.value.title && colorHash.hex(item.value.title)
    })

    const isActive = computed(() => {
      return item.value.title === craftStore.currentComponentName
    })

    return {
      craftStore,
      color,
      isActive,
      formatDate,
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
      boxShadow: `0 0 4px ${color}, 0 0 1px 1px ${color}`,
    }"
  >
    <n-popover trigger="hover" :show-arrow="false" :duration="300">
      <template #trigger>
        <n-button size="tiny" class="action-btn" @click.stop> ... </n-button>
      </template>
      <slot name="actionMenu" :item="item"></slot>
    </n-popover>
    <img v-if="item.icon" :src="item.icon" alt="icon" style="margin-right: 5px" />
    <span v-if="item.title" class="item-text">{{ item.title }}</span>
    <span class="timestamp" v-if="item.data.timestamp">{{
      formatDate(new Date(item.data.timestamp))
    }}</span>
  </div>
</template>

<style lang="scss" scoped>
.tool-item {
  width: 200px;
  height: 100px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  font-family: 'Operator Mono', 'Source Code Pro', Menlo, Monaco, Consolas, Courier New, monospace;
  transition: box-shadow 0.3s;
  $bracket_color: currentColor;
  padding: 5px;

  &:hover {
    background-color: rgba(11, 216, 44, 0.29);
    outline: 3px solid #18a058;
    box-shadow: 0 0 10px #18a058 !important;
  }

  &:active {
    opacity: 0.7;
  }

  &.active {
    background-color: rgba(11, 216, 44, 0.29);
    outline: 3px solid #18a058;
  }

  img {
    width: 32px;
    height: 32px;
    image-rendering: pixelated;
  }

  .action-btn {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 10px;
  }

  .timestamp {
    position: absolute;
    bottom: 2px;
    right: 2px;
    font-size: 10px;
    font-weight: 100;
    opacity: 0.6;
  }

  $bracket_color: currentColor;
  .item-text {
    &::before {
      content: '<';
      color: $bracket_color;
      opacity: 0.5;
    }
    &::after {
      content: '/>';
      color: $bracket_color;
      opacity: 0.5;
    }
  }
}
</style>
