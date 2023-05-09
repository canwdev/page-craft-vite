<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useCraftStore} from '@/store/craft'
import {ActionType, BlockItem} from '@/enum/page-craft/block'
import {colorHash, formatDate} from '@/utils'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useSettingsStore} from '@/store/settings'

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
    const settingsStore = useSettingsStore()

    const color = computed(() => {
      return item.value.title && colorHash.rgb(item.value.title).join(', ')
    })

    const isActive = computed(() => {
      return item.value.title === settingsStore.curCompoName
    })

    // const isHover = ref(false)
    // const hoverTimer = ref<any>(null)
    //
    // // mouse hover delay
    // const startHoverTimer = (cb) => {
    //   if (hoverTimer.value) {
    //     return
    //   }
    //   hoverTimer.value = setTimeout(() => {
    //     isHover.value = true
    //     clearTimeout(hoverTimer.value)
    //     hoverTimer.value = null
    //     cb()
    //   }, 800)
    // }
    //
    // const emitMouseMove = () => {
    //   globalEventBus.emit(GlobalEvents.ON_COMP_HOVER, {event: currentEvent, item: item.value})
    // }
    //
    // const handleMouseMove = (event) => {
    //   currentEvent = event
    //   if (!isHover.value) {
    //     startHoverTimer(() => {
    //       emitMouseMove()
    //     })
    //     return
    //   }
    //   emitMouseMove()
    // }
    // const handleMouseLeave = () => {
    //   isHover.value = false
    //   globalEventBus.emit(GlobalEvents.ON_COMP_HOVER_OUT)
    //   clearTimeout(hoverTimer.value)
    //   hoverTimer.value = null
    // }

    return {
      craftStore,
      settingsStore,
      color,
      isActive,
      formatDate,
      // handleMouseMove,
      // handleMouseLeave,
      handleDragStart(event) {
        event.dataTransfer.setData('data-block', JSON.stringify(item.value))
      },
    }
  },
})
</script>

<template>
  <!--

  @mousemove="handleMouseMove"
  @mouseleave="handleMouseLeave"
-->
  <div
    :class="{active: isActive, _rounded: settingsStore.enableRoundedTheme}"
    class="tool-item"
    :style="{
      '--block-color-rgb': color,
    }"
    @contextmenu="$emit('contextmenu', $event, item)"
    draggable="true"
    @dragstart="handleDragStart"
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
  height: 60px;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  padding: 5px 8px;
  padding-right: 20px;
  outline: 1px solid rgb(var(--block-color-rgb));
  $bracket_color: rgb(var(--block-color-rgb));

  &._rounded {
    border-radius: 4px;
  }

  &:hover {
    background-color: rgba(var(--block-color-rgb), 0.08);
    box-shadow: 0 0 0px 2px rgb(var(--block-color-rgb)) !important;
  }

  &:active {
    opacity: 0.7;
    transition: all 0.1s;
  }

  &.active {
    background-color: rgba(var(--block-color-rgb), 0.29);
    outline: 4px solid rgb(var(--block-color-rgb));
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

  $bracket_color: currentColor;
  .timestamp {
    position: absolute;
    bottom: 2px;
    right: 4px;
    font-size: 12px;
    font-weight: 100;
    opacity: 0.5;
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
  .item-text {
    color: inherit;
    font-weight: 500;
  }
}
</style>
