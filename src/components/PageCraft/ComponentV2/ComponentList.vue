<script lang="ts" setup>
import {useVModel} from '@vueuse/core'
import {
  DocumentAdd16Regular,
  FolderAdd16Regular,
  Rename16Regular,
  Delete16Regular,
  SelectAllOn24Regular,
  ArrowSortDownLines16Regular,
  Cut20Regular,
  Copy20Regular,
  ClipboardPaste20Regular,
  Add24Regular,
} from '@vicons/fluent'
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'
import QuickContextMenu from '@/components/CommonUI/QuickOptions/utils/QuickContextMenu.vue'
import {
  useComponentMigrationToV2,
  useComponentStorageV2,
} from '@/components/PageCraft/ComponentV2/hooks/use-component-manage'
import {useLayoutSort} from '@/components/FileManager/ExplorerUI/hooks/use-layout-sort'
import {useSelection} from '@/components/FileManager/ExplorerUI/hooks/use-selection'
import {useCopyPaste} from '@/components/FileManager/ExplorerUI/hooks/use-copy-paste'
import ComponentCard from './ComponentCard.vue'
import {normalizePath} from '@/components/FileManager/utils'
import {IComponentItem, regComponentV2} from '@/components/PageCraft/ComponentV2/enum'
import {useComponentFileActions} from '@/components/PageCraft/ComponentV2/hooks/use-file-actions'

const emit = defineEmits(['open', 'update:isLoading', 'refresh'])

interface Props {
  files: IComponentItem[]
  isLoading: boolean
  basePath: string
}

const props = withDefaults(defineProps<Props>(), {})
const {basePath, files} = toRefs(props)
const isLoading = useVModel(props, 'isLoading', emit)

// 布局和排序方式
const {showSortMenu, sortOptions, filteredFiles} = useLayoutSort(files)

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
  handleCreateFolder,
  handleRename,
  confirmDelete,
  ctxMenuOptions,
  ctxMenuRef,
  handleShowCtxMenu,
  enableAction,
  handleCreateComponent,
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

useComponentMigrationToV2()

const {openComponent} = useComponentStorageV2()
const handleOpen = (item) => {
  const path = normalizePath(basePath.value + '/' + item.name)
  // 打开.comp为后缀的组件文件夹
  if (regComponentV2.test(path)) {
    openComponent(item, path)
    return
  }
  emit('open', item)
}
</script>

<template>
  <div class="comp-list-wrap" @contextmenu.prevent>
    <transition name="fade">
      <div class="os-loading-container _absolute" v-if="isLoading">
        <n-spin />
      </div>
    </transition>

    <div class="explorer-actions vp-panel">
      <div class="action-group">
        <button
          class="vp-button"
          @click="handleCreateComponent()"
          :title="$t('actions.add_component')"
        >
          <n-icon size="16">
            <DocumentAdd16Regular />
          </n-icon>
        </button>
        <button class="vp-button" @click="handleCreateFolder" title="Create Folder">
          <n-icon size="16">
            <FolderAdd16Regular />
          </n-icon>
        </button>

        <div class="split-line"></div>

        <button class="vp-button" :disabled="!enableAction" @click="handleCut" title="Cut">
          <n-icon size="16">
            <Cut20Regular />
          </n-icon>
        </button>
        <button class="vp-button" :disabled="!enableAction" @click="handleCopy" title="Copy">
          <n-icon size="16">
            <Copy20Regular />
          </n-icon>
        </button>
        <button class="vp-button" :disabled="!enablePaste" @click="handlePaste" title="Paste">
          <n-icon size="16">
            <ClipboardPaste20Regular />
          </n-icon>
        </button>

        <button
          class="vp-button"
          :disabled="selectedItems.length !== 1"
          @click="handleRename"
          title="Rename"
        >
          <n-icon size="16">
            <Rename16Regular />
          </n-icon>
        </button>
        <button class="vp-button" :disabled="!enableAction" @click="confirmDelete" title="Delete">
          <n-icon size="16">
            <Delete16Regular />
          </n-icon>
        </button>

        <div class="split-line"></div>
      </div>
      <div class="action-group">
        <div class="action-button-wrap">
          <button class="vp-button" title="Toggle Sort" @click="showSortMenu = true">
            <n-icon size="16">
              <ArrowSortDownLines16Regular />
            </n-icon>
          </button>
          <QuickOptions v-model:visible="showSortMenu" :options="sortOptions" />
        </div>

        <button class="vp-button" @click="toggleSelectAll" title="Toggle Select All">
          <n-icon size="16">
            <SelectAllOn24Regular />
          </n-icon>
        </button>
      </div>
    </div>
    <div
      ref="explorerContentRef"
      class="explorer-content"
      @click="selectedItems = []"
      @contextmenu.prevent.stop="handleShowCtxMenu(null, $event)"
    >
      <div class="explorer-grid-view">
        <ComponentCard
          class="selectable"
          :item="item"
          v-for="item in filteredFiles"
          :key="item.name"
          :data-name="item.name"
          :checked="selectedItemsSet.has(item)"
          @open="handleOpen"
          @select="toggleSelect"
          @contextmenu.prevent.stop="handleShowCtxMenu(item, $event)"
        />
      </div>

      <QuickContextMenu :options="ctxMenuOptions" ref="ctxMenuRef" />
    </div>
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
    outline: 2px dashed $primary;
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
    .action-group {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;

      .split-line {
        border-right: 1px solid $color_border;
        margin-left: 2px;
        margin-right: 2px;
      }
      .vp-button {
        display: inline-flex;
        padding: 4px 6px;
      }
      .action-button-wrap {
        display: inline-flex;
        position: relative;
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
