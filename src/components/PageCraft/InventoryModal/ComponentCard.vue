<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useCraftStore} from '@/store/craft'
import {ActionType, BlockItem} from '@/enum/page-craft/block'
import {colorHash, formatDate} from '@/utils'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'

let currentEvent: any

export default defineComponent({
  name: 'ComponentCard',
  props: {
    item: {
      type: Object as PropType<BlockItem>,
      required: true,
    },
  },
  emits: ['contextmenu'],
  setup(props) {
    const {item} = toRefs(props)
    const craftStore = useCraftStore()

    const color = computed(() => {
      return item.value.title && colorHash.rgb(item.value.title).join(', ')
    })

    const isActive = computed(() => {
      return item.value.title === craftStore.currentComponentName
    })

    const isCrate = computed(() => {
      return item.value.actionType === ActionType.ADD_COMPONENT
    })

    const isHover = ref(false)
    const hoverTimer = ref<any>(null)

    // mouse hover delay
    const startHoverTimer = (cb) => {
      if (hoverTimer.value) {
        return
      }
      hoverTimer.value = setTimeout(() => {
        isHover.value = true
        clearTimeout(hoverTimer.value)
        hoverTimer.value = null
        cb()
      }, 800)
    }

    const emitMouseMove = () => {
      globalEventBus.emit(GlobalEvents.ON_COMP_HOVER, {event: currentEvent, item: item.value})
    }

    const handleMouseMove = (event) => {
      if (isCrate.value) {
        return
      }
      currentEvent = event
      if (!isHover.value) {
        startHoverTimer(() => {
          emitMouseMove()
        })
        return
      }
      emitMouseMove()
    }
    const handleMouseLeave = () => {
      if (isCrate.value) {
        return
      }
      isHover.value = false
      globalEventBus.emit(GlobalEvents.ON_COMP_HOVER_OUT)
      clearTimeout(hoverTimer.value)
      hoverTimer.value = null
    }

    return {
      craftStore,
      color,
      isActive,
      formatDate,
      isCrate,
      handleMouseMove,
      handleMouseLeave,
    }
  },
})
</script>

<template>
  <div
    :class="{active: isActive}"
    class="tool-item font-code"
    :style="{
      '--block-color-rgb': color,
    }"
    @contextmenu="$emit('contextmenu', $event, item)"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="action-menu">
      <slot name="actionMenu" :item="item"></slot>
    </div>
    <img v-if="item.icon" :src="item.icon" alt="icon" style="margin-right: 5px" />
    <span v-if="item.title" class="item-text">{{ item.title }}</span>
    <span class="timestamp" v-if="item.data.timestamp">{{
      formatDate(new Date(item.data.timestamp))
    }}</span>
  </div>
</template>

<style lang="scss" scoped>
.tool-item {
  --block-color-rgb: 204, 204, 204;
  width: 200px;
  height: 100px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  padding: 5px;
  transition: all 0.3s;
  outline: 1px dashed rgb(var(--block-color-rgb));
  $bracket_color: rgb(var(--block-color-rgb));

  &:hover {
    background-color: rgba(var(--block-color-rgb), 0.08);
    box-shadow: 0 0 10px rgb(var(--block-color-rgb)) !important;
  }

  &:active {
    opacity: 0.7;
    transition: all 0.1s;
  }

  &.active {
    background-color: rgba(var(--block-color-rgb), 0.29);
    outline: 3px solid rgb(var(--block-color-rgb));
  }

  img {
    width: 32px;
    height: 32px;
    image-rendering: pixelated;
  }

  .action-menu {
    position: absolute;
    top: 0;
    right: 0;
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
    color: inherit;
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
