<script setup lang="ts">
import {colorHash, formatDate} from '@/utils'
import {IComponentItem, regComponentV2} from '@/components/PageCraft/ComponentExplorer/enum'
import {useSettingsStore} from '@/store/settings'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useThrottleFn} from '@vueuse/core'

const emit = defineEmits(['open', 'select', 'handleDragStart'])

interface Props {
  item: IComponentItem
  checked: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const {item} = toRefs(props)

const settingsStore = useSettingsStore()

const openItem = () => {
  emit('open', item.value)
}

const nameDisplay = computed(() => {
  return item.value.name.replace(item.value.ext, '')
})

const isComp = computed(() => {
  return regComponentV2.test(item.value.name)
})

const color = computed(() => {
  if (isComp.value) {
    return colorHash.rgb(item.value.name).join(', ')
  }
})

let currentEvent: any
const emitMouseMove = () => {
  globalEventBus.emit(GlobalEvents.ON_COMP_HOVER, {event: currentEvent, item: item.value})
}

const handleMouseMove = useThrottleFn((event) => {
  if (!item.value.meta || !item.value.meta.cover) {
    return
  }
  currentEvent = event
  emitMouseMove()
}, 70)
const handleMouseLeave = () => {
  globalEventBus.emit(GlobalEvents.ON_COMP_HOVER_OUT)
}

const handleDragStart = (event) => {
  emit('handleDragStart', event)
  handleMouseLeave()
}
</script>

<template>
  <div
    tabindex="0"
    class="mc-comp-item btn-no-style"
    :class="{
      checked,
      active:
        item.meta &&
        settingsStore.curCompInStore &&
        item.meta.id === settingsStore.curCompInStore.id,
      hidden: item.hidden,
    }"
    @click.stop="openItem"
    @keyup.enter="openItem"
    :style="{
      '--block-color-rgb': color,
    }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    :draggable="isComp"
    @dragstart="handleDragStart"
  >
    <div
      :style="{
        backgroundColor: `rgb(${color}, 0.24)`,
      }"
      class="mc-comp-item-bg"
    ></div>

    <input
      class="file-checkbox"
      type="checkbox"
      :checked="checked"
      @click.stop="$emit('select', {item, event: $event, toggle: true})"
      @dblclick.stop
    />

    <div class="action-menu">
      <slot name="actionMenu" :item="item"></slot>
    </div>
    <div class="title-wrap">
      <!--<img v-if="item.icon" :src="item.icon" alt="icon" style="margin-right: 5px" />-->
      <span v-if="nameDisplay" class="item-text-c"> {{ nameDisplay }}</span>
    </div>

    <div
      v-if="item.meta?.cover"
      class="component-cover"
      :style="{backgroundImage: `url(${item.meta?.cover})`}"
    ></div>
    <div class="meta-info">
      <span class="timestamp" v-if="item.meta?.timeCreated">{{
        formatDate(item.meta?.timeCreated)
      }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mc-comp-item {
  --block-color-rgb: 204, 204, 204;
  padding: 0 !important;
  width: 180px;
  height: 50px;
  cursor: pointer;
  display: block;
  font-size: 14px;
  font-weight: 600;
  position: relative;
  outline: 1px solid rgb(var(--block-color-rgb));

  .mc-comp-item-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
  }

  &:active {
    opacity: 0.7;
    transition: all 0.1s;
  }
  &:focus {
    outline: 1px dashed currentColor;
    outline-offset: -1px;
  }
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
    .file-checkbox {
      visibility: visible;
    }
  }
  &.hidden {
    & > * {
      opacity: 0.6;
    }
  }

  &.active {
    outline: 3px solid rgb(var(--block-color-rgb));
    .title-wrap {
      .item-text-c {
        font-weight: bold;
        text-decoration: underline;
      }
    }
  }

  &.checked {
    background-color: rgba(var(--block-color-rgb), 0.29);
    outline: 3px solid rgb(var(--block-color-rgb));
    .file-checkbox {
      visibility: visible;
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
    .item-text-c {
      text-align: left;
      color: inherit;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      width: 100%;
    }
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
    }
  }
  .file-checkbox {
    position: absolute;
    bottom: 0px;
    right: 0px;
    visibility: hidden;
    z-index: 20;
  }
}
</style>
