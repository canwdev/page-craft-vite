<script setup lang="ts">
import {IEntry} from '@/components/FileManager/types/filesystem'
import {formatDate} from '@/utils'

const emit = defineEmits(['open', 'select'])

interface Props {
  item: IEntry
  active: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const {item} = toRefs(props)

const openItem = () => {
  emit('open', item.value)
}
</script>

<template>
  <div
    tabindex="0"
    class="file-grid-item btn-no-style"
    :class="{active, hidden: item.hidden}"
    @click.stop="openItem"
    @keyup.enter="openItem"
  >
    <input
      class="file-checkbox"
      type="checkbox"
      :checked="active"
      @click.stop="$emit('select', {item, event: $event, toggle: true})"
      @dblclick.stop
    />

    <div class="action-menu">
      <slot name="actionMenu" :item="item"></slot>
    </div>
    <div class="title-wrap">
      <!--<img v-if="item.icon" :src="item.icon" alt="icon" style="margin-right: 5px" />-->
      <span v-if="item.name" class="item-text-c"> {{ item.name }}</span>
    </div>

    <!--<div class="component-cover" :style="{backgroundImage: `url(${item.meta.image})`}"></div>-->
    <div class="meta-info">
      <span class="timestamp" v-if="item.lastModified">{{
        formatDate(new Date(item.lastModified))
      }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file-grid-item {
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
  $bracket_color: rgb(var(--block-color-rgb));

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
    background-color: rgba(var(--block-color-rgb), 0.29);
    outline: 3px solid rgb(var(--block-color-rgb));
    .file-checkbox {
      visibility: visible;
    }

    .title-wrap {
      .item-text-c {
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
