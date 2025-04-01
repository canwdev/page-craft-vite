<script lang="ts" setup>
import {IEntry} from '../types/filesystem'
import FileListItem from './FileListItem.vue'
import {useVModel} from '@vueuse/core'
import FileGridItem from './FileGridItem.vue'

import QuickOptions from '@canwdev/vgo-ui/src/components/QuickOptions/index.vue'
import QuickContextMenu from '@canwdev/vgo-ui/src/components/QuickOptions/QuickContextMenu.vue'
import {useCopyPaste} from './hooks/use-copy-paste'
import {useSelection} from './hooks/use-selection'
import {useLayoutSort} from './hooks/use-layout-sort'
import {useFileActions} from './hooks/use-file-actions'
import {setHfsInstance} from '@/components/FileManager/utils/providers/humanfs-api'
import {useLocalDir} from '@/components/PageCraft/ComponentExplorer/hooks/use-local-dir'
import DropdownMenu from '@canwdev/vgo-ui/src/components/QuickOptions/DropdownMenu.vue'

const emit = defineEmits(['open', 'update:isLoading', 'refresh'])

interface Props {
  files: IEntry[]
  isLoading: boolean
  basePath: string
}

const props = withDefaults(defineProps<Props>(), {})
const {basePath, files} = toRefs(props)
const isLoading = useVModel(props, 'isLoading', emit)

// 布局和排序方式
const {isGridView, showSortMenu, sortOptions, filteredFiles} = useLayoutSort(files)

// 文件选择功能
const {
  selectedItems,
  selectedItemsSet,
  explorerContentRef,
  toggleSelect,
  toggleSelectAll,
  selectedPaths,
} = useSelection({filteredFiles, basePath})

// 复制粘贴功能
const {enablePaste, handleCut, handleCopy, handlePaste} = useCopyPaste({
  selectedPaths,
  basePath,
  isLoading,
  emit,
})

// 文件操作功能
const {
  handleCreateFile,
  handleCreateFolder,
  handleRename,
  confirmDelete,
  ctxMenuOptions,
  ctxMenuRef,
  handleShowCtxMenu,
  enableAction,
} = useFileActions({
  isLoading,
  selectedPaths,
  basePath,
  selectedItems,
  enablePaste,
  handlePaste,
  handleCut,
  handleCopy,
  selectedItemsSet,
  emit,
})

const {handleOpenLocalDir, localDirHistoryOptions} = useLocalDir({emit})
</script>

<template>
  <div class="explorer-list-wrap" @contextmenu.prevent v-loading="isLoading">
    <div class="explorer-actions vgo-panel">
      <div class="action-group">
        <button class="btn-action btn-no-style" @click="handleCreateFile()" title="Create Document">
          <span class="mdi mdi-file-document-plus-outline"></span>
        </button>
        <button class="btn-action btn-no-style" @click="handleCreateFolder" title="Create Folder">
          <span class="mdi mdi-folder-plus-outline"></span>
        </button>

        <div class="split-line"></div>

        <button
          class="btn-action btn-no-style"
          :disabled="!enableAction"
          @click="handleCut"
          title="Cut"
        >
          <span class="mdi mdi-content-cut"></span>
        </button>
        <button
          class="btn-action btn-no-style"
          :disabled="!enableAction"
          @click="handleCopy"
          title="Copy"
        >
          <span class="mdi mdi-content-copy"></span>
        </button>
        <button
          class="btn-action btn-no-style"
          :disabled="!enablePaste"
          @click="handlePaste"
          title="Paste"
        >
          <span class="mdi mdi-content-paste"></span>
        </button>

        <button
          class="btn-action btn-no-style"
          :disabled="selectedItems.length !== 1"
          @click="handleRename"
          title="Rename"
        >
          <span class="mdi mdi-rename"></span>
        </button>
        <button
          class="btn-action btn-no-style"
          :disabled="!enableAction"
          @click="confirmDelete"
          title="Delete"
        >
          <span class="mdi mdi-delete-forever-outline"></span>
        </button>

        <div class="split-line"></div>

        <DropdownMenu :options="localDirHistoryOptions">
          <button
            class="btn-action btn-no-style"
            title="Open Local Folder"
            @click="handleOpenLocalDir"
          >
            <span class="mdi mdi-folder-open-outline"></span>
          </button>
        </DropdownMenu>
      </div>
      <div class="action-group">
        <button
          @click="isGridView = !isGridView"
          class="btn-action btn-no-style"
          title="Toggle grid view"
        >
          <template v-if="isGridView">
            <span class="mdi mdi-view-grid-outline"></span>
          </template>
          <template v-else>
            <span class="mdi mdi-view-list-outline"></span>
          </template>
        </button>
        <div class="action-button-wrap">
          <button class="btn-action btn-no-style" title="Toggle Sort" @click="showSortMenu = true">
            <span class="mdi mdi-sort-alphabetical-variant"></span>
          </button>
          <transition name="fade-scale">
            <QuickOptions v-model:visible="showSortMenu" :options="sortOptions" />
          </transition>
        </div>

        <button class="btn-action btn-no-style" @click="toggleSelectAll" title="Toggle Select All">
          <span class="mdi mdi-check-all"></span>
        </button>
      </div>
    </div>
    <div
      ref="explorerContentRef"
      class="explorer-content"
      @click="selectedItems = []"
      @contextmenu.prevent.stop="handleShowCtxMenu(null, $event)"
    >
      <div v-if="!isGridView" class="explorer-list-view">
        <div class="vgo-bg file-list-header file-list-row">
          <div class="list-col c-filename" style="padding-left: 24px">Name</div>
          <div class="list-col c-size">Size</div>
          <div class="list-col c-time">Last Modified</div>
          <div class="list-col c-time">Created</div>
        </div>

        <FileListItem
          class="selectable"
          :item="item"
          v-for="item in filteredFiles"
          :key="item.name"
          :data-name="item.name"
          :active="selectedItemsSet.has(item)"
          @open="(i) => emit('open', i)"
          @select="toggleSelect"
          @contextmenu.prevent.stop="handleShowCtxMenu(item, $event)"
        />
      </div>
      <div v-else class="explorer-grid-view">
        <FileGridItem
          class="selectable"
          :item="item"
          v-for="item in filteredFiles"
          :key="item.name"
          :data-name="item.name"
          :active="selectedItemsSet.has(item)"
          @open="(i) => emit('open', i)"
          @select="toggleSelect"
          @contextmenu.prevent.stop="handleShowCtxMenu(item, $event)"
        />
      </div>

      <Teleport to="body">
        <QuickContextMenu :options="ctxMenuOptions" ref="ctxMenuRef" />
      </Teleport>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.explorer-list-wrap {
  height: 100%;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.isOverDropZone {
    outline: 2px dashed var(--vgo-primary);
    outline-offset: -3px;
  }

  .explorer-actions {
    padding: 4px;
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: space-between;
    border: none;
    box-shadow: none;
    border-radius: 0;
    border-bottom: 1px solid var(--vgo-color-border);

    .action-group {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;

      .split-line {
        border-right: 1px solid var(--vgo-color-border);
        margin-left: 2px;
        margin-right: 2px;
      }
      .btn-action {
        display: inline-flex;
        position: relative;
        font-size: 20px;
        border: none;
        padding: 2px 4px;

        .icon-small-abs {
          font-size: 12px;
          position: absolute;
          left: 50%;
          top: 60%;
          transform: translate(-50%, -50%) scale(0.6);
        }

        &:hover,
        &:focus {
          background-color: var(--vgo-primary-opacity);
        }
      }
      .action-button-wrap {
        display: inline-flex;
        position: relative;
        z-index: 10;
        .quick-options {
          position: absolute;
          top: 100%;
          right: 0;
          left: unset;
          transform: unset;
          width: 200px;
        }
      }
    }
  }

  .explorer-content {
    flex: 1;
    overflow: auto;
    user-select: none;
  }

  .explorer-list-view {
    width: fit-content;
    .file-list-header {
      font-weight: 500;
      text-transform: capitalize;
      border-bottom: 1px solid var(--vgo-color-border);
      border-left: 0;
      border-right: 0;
      position: sticky;
      top: 0;
      z-index: 1;

      .list-col {
        padding: 4px 5px !important;
        font-size: 14px;
        &:hover {
          background-color: var(--vgo-primary-opacity);
        }
        .mdi {
          transform: scale(1.5);
        }
      }
    }

    :deep(.file-list-row) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: fit-content;

      .list-col {
        padding: 0 5px;
        flex-shrink: 0;
        box-sizing: border-box;
        &.c-icon {
          padding-left: 10px;
          width: 50px;
        }

        &.c-filename {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 4px;
          width: 300px;
        }

        &.c-type {
          width: 100px;
        }

        &.c-ext {
          width: 50px;
        }
        &.c-size {
          width: 80px;
        }

        &.c-time {
          width: 140px;
        }

        &.c-actions {
          padding-right: 10px;
          display: flex;
          justify-content: flex-end;
          gap: 4px;
          width: 100px;
        }
      }
    }
  }

  .explorer-grid-view {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
    flex-wrap: wrap;
    gap: 4px;
  }
}
</style>
