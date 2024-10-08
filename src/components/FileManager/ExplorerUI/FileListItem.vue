<script setup lang="ts">
import {bytesToSize, formatDate} from '@/utils'
import {IEntry} from '../types/filesystem'
import {useFileItem} from './hooks/use-file-item'

const emit = defineEmits(['open', 'select'])

interface Props {
  item: IEntry
  active: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const {iconName, titleDesc} = useFileItem(props)
</script>

<template>
  <button
    class="btn-no-style file-list-item file-list-row"
    :class="{active, hidden: item.hidden}"
    @click.stop="$emit('select', {item, event: $event})"
    @keyup.enter="$emit('open', item)"
    @dblclick.stop="$emit('open', item)"
    :title="titleDesc"
  >
    <div class="list-col c-filename">
      <input
        class="file-checkbox"
        type="checkbox"
        :checked="active"
        @click.stop="$emit('select', {item, event: $event, toggle: true})"
        @dblclick.stop
      />

      <span class="text-overflow filename-text" @click.stop="$emit('open', item)" @dblclick.stop>
        {{ item.isDirectory ? '📁' : '📄' }} {{ item.name }}
      </span>
    </div>
    <div class="list-col c-size">{{ bytesToSize(item.size) }}</div>
    <div class="list-col c-time">{{ formatDate(item.lastModified) }}</div>
    <div class="list-col c-time">{{ formatDate(item.birthtime) }}</div>
  </button>
</template>

<style lang="scss" scoped>
.file-list-item {
  display: flex;
  text-align: unset;
  width: 100%;
  border-bottom: 1px solid $color_border;
  padding-top: 4px;
  padding-bottom: 4px;
  cursor: default;
  &:hover {
    transition: background-color 0s;
    background-color: $primary_opacity;
    .file-checkbox {
      visibility: visible;
    }
  }
  &.hidden {
    .filename-text {
      opacity: 0.6;
    }
  }

  &.active {
    background-color: $primary_opacity;
    outline: 1px solid $primary;
    outline-offset: -1px;
    .file-checkbox {
      visibility: visible;
    }
  }
  &:focus {
    outline: 1px solid $primary;
    outline-offset: -1px;
  }

  .file-checkbox {
    visibility: hidden;
    position: relative;
  }

  .list-col {
    &.c-filename {
      .themed-icon {
        width: 18px;
        height: 18px;
      }
      .filename-text {
        font-size: 12px;
        line-height: 1.2;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    &.c-size {
      font-size: 12px;
    }

    &.c-time {
      font-size: 12px;
    }
  }
}
</style>
