<script setup lang="ts">
import DropdownMenu from '@canwdev/vgo-ui/src/components/QuickOptions/DropdownMenu.vue'
import QuickContextMenu from '@canwdev/vgo-ui/src/components/QuickOptions/QuickContextMenu.vue'
import VueMonaco from '@canwdev/vgo-ui/src/components/VueMonaco/VueMonaco.vue'
import { WebviewWindow } from '@tauri-apps/api/window'

import { useEventListener } from '@vueuse/core'

import { useRoute, useRouter } from 'vue-router'
import ElementEditDialog from '@/components/PageCraft/MainPlayground/components/ElementEditDialog.vue'
import ExtractComponentDialog from '@/components/PageCraft/MainPlayground/components/ExtractComponentDialog.vue'
import IndicatorInfo from '@/components/PageCraft/MainPlayground/components/IndicatorInfo.vue'
import { useIndicator } from '@/components/PageCraft/MainPlayground/hooks/indicator-hooks'
import { useInteractionHooks } from '@/components/PageCraft/MainPlayground/hooks/interaction-hooks'
import { useMcMain } from '@/components/PageCraft/MainPlayground/hooks/main-hooks'
import { SettingsTabType } from '@/enum/settings'
import { useMainStore } from '@/store/main'
import { useSettingsStore } from '@/store/settings'
import { useSystemStore } from '@/store/system'
import globalEventBus, { GlobalEvents } from '@/utils/global-event-bus'

const emit = defineEmits([])

const router = useRouter()
const route = useRoute()
const mainPlaygroundRef = ref()
const mainStore = useMainStore()
const settingsStore = useSettingsStore()
const systemStore = useSystemStore()

const isLitePage = computed(() => {
  return route.name === 'PlaygroundPage'
})

const {
  htmlMenuOptions,
  isShowImportDialog,
  setPlaygroundHtml,
  pasteHtmlText,
  handleImportHtml,
  saveData,
  copyHtml,
  undoRedo,
  recordUndo,
  handleUndo,
  handleRedo,
} = useMcMain({
  mainPlaygroundRef,
  emit,
})

const { indicatorOptions, mainCanvasClass, toggleList, backgroundStyle } = useIndicator()

const {
  isSelectMode,
  handleMouseDown,
  handleMouseUp,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  waitingProgress,
  cursorX,
  cursorY,
  ctxMenuRef,
  ctxMenuOptions,
  selectionActionStyle,
  selectionElRef,
  isShowSelectionAction,
  selectionPopupOptions,
  isShowElementEdit,
  editingNode,
  isEditingRoot,
  updateEditingElement,
  extractCompRef,
} = useInteractionHooks({
  mainPlaygroundRef,
  saveData,
  indicatorOptions,
  copyHtml,
  recordUndo,
})

function listenShortcuts(event) {
  // console.log(event)
  const key = event.key.toLowerCase()
  if (event.ctrlKey && event.shiftKey && key === 'z') {
    handleRedo()
  }
  else if (event.ctrlKey && key === 'z') {
    handleUndo()
  }
}

useEventListener(document, 'keydown', (event) => {
  // console.log(event)
  const key = event.key.toLowerCase()
  if (event.altKey && key === 'x') {
    indicatorOptions.enableExpand = !indicatorOptions.enableExpand
  }
  else if (event.altKey && key === 'z') {
    indicatorOptions.enableDevHelpClass = !indicatorOptions.enableDevHelpClass
  }
})

function openPlayground() {
  const url = router.resolve({
    name: 'PlaygroundPage',
  }).href
  console.log(url)
  if (window.__TAURI__) {
    new WebviewWindow('PlaygroundPage', {
      url,
    })
    return
  }
  window.open(url)
}

function doImportAction() {
  handleImportHtml(pasteHtmlText.value)
  isShowImportDialog.value = false
}
</script>

<template>
  <div tabindex="0" class="page-craft-mc-wrap" @keyup="listenShortcuts">
    <IndicatorInfo v-if="isSelectMode" />

    <transition name="fade">
      <div
        v-if="isShowSelectionAction"
        ref="selectionElRef"
        class="selection-action"
        :style="selectionActionStyle"
        @click="isShowSelectionAction = false"
      >
        <button
          v-for="item in selectionPopupOptions"
          :key="item.label"
          class="btn-no-style font-code"
          @click="item.onClick"
        >
          {{ item.label }}
        </button>
      </div>
    </transition>

    <Teleport to="body">
      <QuickContextMenu ref="ctxMenuRef" :options="ctxMenuOptions" />
    </Teleport>

    <el-dialog
      v-model="isShowImportDialog"
      draggable
      :title="`${$t('actions.paste')} HTML`"
      width="660"
      top="5vh"
      append-to=".page-craft-root"
    >
      <VueMonaco v-if="isShowImportDialog" v-model="pasteHtmlText" style="height: 76vh" />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isShowImportDialog = false">
            {{ $t('actions.cancel') }}
          </el-button>
          <el-button type="primary" @click="doImportAction">
            {{ $t('actions.import') }} HTML
          </el-button>
        </div>
      </template>
    </el-dialog>

    <Teleport to=".page-craft-root .desktop-window-manager">
      <ElementEditDialog
        v-model:visible="isShowElementEdit"
        :editing-node="editingNode"
        :is-root="isEditingRoot"
        @on-save="updateEditingElement"
      />
      <ExtractComponentDialog ref="extractCompRef" />
    </Teleport>

    <portal to="indicatorBarTeleportDest">
      <template v-if="!isLitePage">
        <DropdownMenu :options="htmlMenuOptions">
          <button
            class="vgo-button"
            :title="`${settingsStore.curCompInStore?.basePath}
${settingsStore.curCompInStore?.title}`"
          >
            <span class="mdi mdi-xml" />
            {{ settingsStore.curCompInStore?.title?.slice(0, 10) || 'Default' }}
          </button>
        </DropdownMenu>

        <el-popover width="180" trigger="hover" :persistent="false">
          <template #reference>
            <button class="vgo-button">
              <span class="mdi mdi-cog" />
              {{ $t('common.options') }}
            </button>
          </template>
          <div v-for="item in toggleList" :key="item.flag" class="toggle-list">
            <div class="flex-row-center-gap">
              <el-checkbox v-model="indicatorOptions[item.flag]" :label="item.title" size="small" />

              <template v-if="item.desc">
                <el-popover trigger="hover">
                  <template #reference>
                    <span class="mdi mdi-help-circle-outline" />
                  </template>
                  <span style="font-size: 14px">{{ item.desc }}</span>
                </el-popover>
              </template>
            </div>
          </div>
          <el-slider v-model="indicatorOptions.bgTransparentPercent" :step="1" size="small" />
          <div class="flex-row-center-gap">
            <button
              class="vgo-button primary"
              @click="globalEventBus.emit(GlobalEvents.OPEN_SETTINGS, SettingsTabType.COMMON)"
            >
              {{ $t('common.settings') }}
            </button>

            <button class="vgo-button" @click="openPlayground">
              Playground
            </button>
          </div>
        </el-popover>
      </template>

      <div class="vgo-button-group">
        <button
          class="vgo-button"
          title="Undo (ctrl+z)"
          :disabled="!undoRedo.undoStack.length"
          @click="handleUndo"
        >
          <span class="mdi mdi-undo-variant" />
        </button>
        <button
          class="vgo-button"
          title="Redo (ctrl+shift+z)"
          :disabled="!undoRedo.redoStack.length"
          @click="handleRedo"
        >
          <span class="mdi mdi-redo-variant" />
        </button>
      </div>

      <span v-if="!isLitePage" style="border-right: 1px solid; opacity: 0.3" />
    </portal>

    <!-- Main Canvas -->
    <div
      ref="mainPlaygroundRef"
      :class="mainCanvasClass"
      :contenteditable="indicatorOptions.contentEditable"
      class="page-craft-mc"
      :style="backgroundStyle"
      @mousedown="handleMouseDown"
      @mouseleave="handleMouseUp"
      @mouseup="handleMouseUp"
      @dragover.prevent.stop="handleDragOver"
      @dragleave.prevent.stop="handleDragLeave"
      @drop.prevent.stop="handleDrop"
    />

    <!-- 辅助定位线 -->
    <div class="line-helper-x" />

    <!-- 删除元素的动画 -->
    <div
      v-if="cursorX"
      class="mc-digging-wrap"
      :style="{ top: `${cursorY}px`, left: `${cursorX}px` }"
    >
      <div
        class="mc-digging-inner"
        :style="{
          width: `${waitingProgress}%`,
          height: `${waitingProgress}%`,
        }"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import './main-playground';
.mc-toolbar-above {
  .mdi {
    font-size: 14px;
  }
}
</style>
