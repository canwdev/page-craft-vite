<script lang="ts" setup>
import type { IComponentItem } from '@/components/PageCraft/ComponentExplorer/enum'

import DropdownMenu from '@canwdev/vgo-ui/src/components/QuickOptions/DropdownMenu.vue'
import QuickOptions from '@canwdev/vgo-ui/src/components/QuickOptions/index.vue'
import QuickContextMenu from '@canwdev/vgo-ui/src/components/QuickOptions/QuickContextMenu.vue'
import { useVModel } from '@vueuse/core'
import DialogImageCropper from '@/components/CommonUI/DialogImageCropper.vue'
import { useCopyPaste } from '@/components/FileManager/ExplorerUI/hooks/use-copy-paste'
import { useSelection } from '@/components/FileManager/ExplorerUI/hooks/use-selection'
import { normalizePath } from '@/components/FileManager/utils'
import { regComponentV2 } from '@/components/PageCraft/ComponentExplorer/enum'
import {
  useComponentMigrationToV2,
  useComponentStorageV2,
} from '@/components/PageCraft/ComponentExplorer/hooks/use-component-manage'
import { useComponentFileActions } from '@/components/PageCraft/ComponentExplorer/hooks/use-file-actions'
import { useLocalDir } from '@/components/PageCraft/ComponentExplorer/hooks/use-local-dir'
import PopFloat from '@/components/PageCraft/ComponentExplorer/PopFloat.vue'
import { useSettingsStore } from '@/store/settings'
import { GlobalEvents, useGlobalBusOn } from '@/utils/global-event-bus'
import ComponentCard from './ComponentCard.vue'
import { useLayoutSort } from './hooks/use-layout-sort'

const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['open', 'update:isLoading', 'refresh'])

interface Props {
  files: IComponentItem[]
  isLoading: boolean
  basePath: string
}

const { basePath, files } = toRefs(props)
const isLoading = useVModel(props, 'isLoading', emit)
const settingsStore = useSettingsStore()

// 布局和排序方式
const { showSortMenu, sortOptions, filteredFiles } = useLayoutSort(files)

// 文件选择功能
const {
  selectedItems,
  selectedItemsSet,
  explorerContentRef,
  toggleSelect,
  toggleSelectAll,
  selectedPaths,
  selectionArea,
} = useSelection({ filteredFiles, basePath })

onMounted(() => {
  {
    selectionArea.value.on('beforestart', ({ event }) => {
      return !event.target?.closest('.mc-comp-item')
    })
  }
})

// 复制粘贴功能
const { enablePaste, handleCut, handleCopy, handlePaste } = useCopyPaste({
  selectedPaths,
  basePath,
  isLoading,
  emit,
})

// 文件操作功能
const {
  handleCreateFolder,
  handleRename,
  confirmDelete,
  ctxMenuOptions,
  ctxMenuRef,
  handleShowCtxMenu,
  enableAction,
  handleCreateComponent,
  handleDragStart,

  // cover params
  isShowImageCropper,
  cropperEditingSrc,
  handleCropperSave,
  handleCropperCancel,
} = useComponentFileActions({
  isLoading,
  selectedPaths,
  basePath,
  selectedItems,
  enablePaste,
  handlePaste,
  handleCut,
  handleCopy,
  selectedItemsSet,
  files,
  emit,
})

useGlobalBusOn(GlobalEvents.CREATE_COMPONENT, handleCreateComponent)

useComponentMigrationToV2(emit)

const { openComponent } = useComponentStorageV2()
function handleOpen(item) {
  const path = normalizePath(`${basePath.value}/${item.name}`)
  // 打开.comp为后缀的组件文件夹
  if (regComponentV2.test(path)) {
    if (
      item.meta.id !== settingsStore.curCompInStore?.id
      || item.basePath !== settingsStore.curCompInStore?.basePath
    ) {
      openComponent(item, path)
    }
    return
  }
  emit('open', item)
}

const { handleOpenLocalDir, localDirHistoryOptions } = useLocalDir({ emit })
</script>

<template>
  <div v-loading="isLoading" class="comp-list-wrap" @contextmenu.prevent>
    <div class="explorer-actions vgo-panel">
      <div class="action-group">
        <button
          class="btn-action btn-no-style"
          :title="$t('actions.add_component')"
          @click="handleCreateComponent()"
        >
          <span class="mdi mdi-file-document-plus-outline" />
        </button>
        <button class="btn-action btn-no-style" title="Create Folder" @click="handleCreateFolder">
          <span class="mdi mdi-folder-plus-outline" />
        </button>

        <div class="split-line" />

        <button
          class="btn-action btn-no-style"
          :disabled="!enableAction"
          title="Cut"
          @click="handleCut"
        >
          <span class="mdi mdi-content-cut" />
        </button>
        <button
          class="btn-action btn-no-style"
          :disabled="!enableAction"
          title="Copy"
          @click="handleCopy"
        >
          <span class="mdi mdi-content-copy" />
        </button>
        <button
          class="btn-action btn-no-style"
          :disabled="!enablePaste"
          title="Paste"
          @click="handlePaste"
        >
          <span class="mdi mdi-content-paste" />
        </button>

        <button
          class="btn-action btn-no-style"
          :disabled="selectedItems.length !== 1"
          title="Rename"
          @click="handleRename"
        >
          <span class="mdi mdi-rename" />
        </button>
        <button
          class="btn-action btn-no-style"
          :disabled="!enableAction"
          title="Delete"
          @click="confirmDelete"
        >
          <span class="mdi mdi-delete-forever-outline" />
        </button>

        <div class="split-line" />

        <DropdownMenu :options="localDirHistoryOptions">
          <button
            class="btn-action btn-no-style"
            title="Open Local Folder"
            @click="handleOpenLocalDir"
          >
            <span class="mdi mdi-folder-open-outline" />
          </button>
        </DropdownMenu>
      </div>
      <div class="action-group">
        <div class="action-button-wrap">
          <button class="btn-action btn-no-style" title="Toggle Sort" @click="showSortMenu = true">
            <span class="mdi mdi-sort-alphabetical-variant" />
          </button>
          <transition name="fade-scale">
            <QuickOptions v-model:visible="showSortMenu" :options="sortOptions" />
          </transition>
        </div>

        <button class="btn-action btn-no-style" title="Toggle Select All" @click="toggleSelectAll">
          <span class="mdi mdi-check-all" />
        </button>

        <button
          class="btn-action btn-no-style"
          title="Menu"
          @click="($event) => handleShowCtxMenu(null, $event)"
        >
          <span class="mdi mdi-menu" />
        </button>
      </div>
    </div>
    <div
      ref="explorerContentRef"
      class="explorer-content"
      @click="selectedItems = []"
      @contextmenu.prevent.stop="handleShowCtxMenu(undefined, $event)"
    >
      <div class="explorer-grid-view">
        <ComponentCard
          v-for="item in filteredFiles"
          :key="item.name"
          class="selectable"
          :item="item"
          :data-name="item.name"
          :checked="selectedItemsSet.has(item)"
          @open="handleOpen"
          @select="toggleSelect"
          @contextmenu.prevent.stop="handleShowCtxMenu(item, $event)"
          @handle-drag-start="(event) => handleDragStart({ item, event })"
        />
      </div>

      <Teleport to="body">
        <QuickContextMenu ref="ctxMenuRef" :options="ctxMenuOptions" />
      </Teleport>
    </div>
    <PopFloat />

    <DialogImageCropper
      v-model:visible="isShowImageCropper"
      :src="cropperEditingSrc"
      @on-save="handleCropperSave"
      @on-cancel="handleCropperCancel"
    />
  </div>
</template>

<style lang="scss" scoped>
.comp-list-wrap {
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
        font-size: 18px;
        border: none;
        padding: 2px 4px;
        border-radius: 4px;

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

  :deep(.file-checkbox) {
    &::before {
      // 扩大点击范围
      position: absolute;
      top: -6px;
      left: -6px;
      right: -6px;
      bottom: -6px;
      content: '';
    }
  }

  .explorer-grid-view {
    overflow: auto;
    padding: 8px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 8px;
    grid-template-rows: auto;

    * {
      box-sizing: border-box;
    }
  }
}
</style>
