<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useMainStore} from '@/store/main'
import {ActionType, BlockItem} from '@/enum/page-craft/block'
import {colorHash, formatDate} from '@/utils'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useSettingsStore} from '@/store/settings'
import {Star12Filled} from '@vicons/fluent'

let currentEvent: any

export default defineComponent({
  name: 'ComponentCard',
  components: {
    Star12Filled,
  },
  props: {
    item: {
      type: Object as PropType<BlockItem>,
      required: true,
    },
    largeCard: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['contextmenu'],
  setup(props) {
    const {item} = toRefs(props)
    const mainStore = useMainStore()
    const settingsStore = useSettingsStore()

    const color = computed(() => {
      return item.value.title && colorHash.rgb(item.value.title).join(', ')
    })

    const isActive = computed(() => {
      return item.value.title === settingsStore.curCompoName
    })

    const isHover = ref(false)
    const hoverTimer = ref<any>(null)

    // mouse hover delay
    const startHoverTimer = (cb) => {
      if (hoverTimer.value) {
        return
      }
      hoverTimer.value = setTimeout(
        () => {
          isHover.value = true
          clearTimeout(hoverTimer.value)
          hoverTimer.value = null
          cb()
        },
        item.value.data.cover ? 100 : 500
      )
    }

    const emitMouseMove = () => {
      globalEventBus.emit(GlobalEvents.ON_COMP_HOVER, {event: currentEvent, item: item.value})
    }

    const handleMouseMove = (event) => {
      if (!item.value.data.cover && !item.value.data.stared) {
        // todo cover preview
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
      isHover.value = false
      globalEventBus.emit(GlobalEvents.ON_COMP_HOVER_OUT)
      clearTimeout(hoverTimer.value)
      hoverTimer.value = null
    }

    return {
      mainStore,
      settingsStore,
      color,
      isActive,
      formatDate,
      handleMouseMove,
      handleMouseLeave,
      handleDragStart(event) {
        event.dataTransfer.setData('data-block', JSON.stringify(item.value))
      },
    }
  },
})
</script>

<template>
  <div
    :class="{
      active: isActive,
      _rounded: settingsStore.enableRoundedTheme,
      '_large-card': largeCard,
    }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
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
    <div class="title-wrap">
      <img v-if="item.icon" :src="item.icon" alt="icon" style="margin-right: 5px" />
      <span v-if="item.title" class="item-text"> {{ item.title }}</span>
    </div>

    <div class="component-cover" :style="{backgroundImage: `url(${item.data.cover})`}"></div>
    <div class="meta-info">
      <span class="timestamp" v-if="item.data.timestamp">{{
        formatDate(new Date(item.data.timestamp))
      }}</span>
      <span v-if="item.data.stared">
        <n-icon size="12">
          <Star12Filled />
        </n-icon>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tool-item {
  --block-color-rgb: 204, 204, 204;
  width: 180px;
  height: 50px;
  cursor: pointer;
  display: block;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  outline: 1px solid rgb(var(--block-color-rgb));
  $bracket_color: rgb(var(--block-color-rgb));

  &:hover {
    background-color: rgba(var(--block-color-rgb), 0.08);
    box-shadow: 0 0 0px 2px rgb(var(--block-color-rgb)) !important;

    .action-menu {
      visibility: visible;
      opacity: 1;
    }
    .meta-info {
      .timestamp {
        opacity: 1;
      }
    }
  }

  &:active {
    opacity: 0.7;
    transition: all 0.1s;
  }

  &.active {
    background-color: rgba(var(--block-color-rgb), 0.29);
    outline: 3px solid rgb(var(--block-color-rgb));

    .title-wrap {
      .item-text {
        font-weight: bold;
        text-decoration: underline;
      }
    }
  }

  .component-cover {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    pointer-events: none;
    opacity: 0.3;
  }
  &._large-card {
    height: auto;

    .component-cover {
      position: unset;
      width: 100%;
      height: 100px;
      outline: 1px dashed;
      margin-top: 5px;
      margin-bottom: 25px;
      opacity: 1;
      border-radius: 0;
    }
  }

  .title-wrap {
    padding: 2px 20px 2px 5px;
    position: relative;
    z-index: 2;
    img {
      width: 32px;
      height: 32px;
      image-rendering: pixelated;
    }
    .item-text {
      color: inherit;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      width: 100%;
    }
  }

  .action-menu {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 3;
    visibility: hidden;
    opacity: 0;
    transition: all 0.5s;
  }

  $bracket_color: currentColor;
  .meta-info {
    position: absolute;
    bottom: 2px;
    left: 4px;
    right: 4px;
    font-size: 12px;
    font-weight: 100;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .timestamp {
      opacity: 0.3;
      transition: all 0.5s;
      //&::before {
      //  content: '<';
      //  color: $bracket_color;
      //  opacity: 0.5;
      //}
      //&::after {
      //  content: '/>';
      //  color: $bracket_color;
      //  opacity: 0.5;
      //}
    }
  }
}
</style>
