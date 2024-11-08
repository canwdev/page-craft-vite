<script lang="ts">
export default {
  name: 'MainPlayground',
}
</script>
<script setup lang="ts">
import {useMainStore} from '@/store/main'
import {useIndicator} from '@/components/PageCraft/MainPlayground/hooks/indicator-hooks'
import {useInteractionHooks} from '@/components/PageCraft/MainPlayground/hooks/interaction-hooks'
import {useMcMain} from '@/components/PageCraft/MainPlayground/hooks/main-hooks'

import {useSettingsStore} from '@/store/settings'

import {WebviewWindow} from '@tauri-apps/api/window'
import {useRoute, useRouter} from 'vue-router'
import {useEventListener} from '@vueuse/core'
import VueMonaco from '@/components/CanUI/packages/VueMonaco/index.vue'
import ElementEditDialog from '@/components/PageCraft/MainPlayground/components/ElementEditDialog.vue'
import DropdownMenu from '@/components/CanUI/packages/OptionUI/Tools/DropdownMenu.vue'
import QuickContextMenu from '@/components/CanUI/packages/QuickOptions/QuickContextMenu.vue'
import IndicatorInfo from '@/components/PageCraft/MainPlayground/components/IndicatorInfo.vue'

const emit = defineEmits([])

const router = useRouter()
const route = useRoute()
const mainPlaygroundRef = ref()
const mainStore = useMainStore()
const settingsStore = useSettingsStore()

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

const {indicatorOptions, mainCanvasClass, toggleList, backgroundStyle} = useIndicator()

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
} = useInteractionHooks({
  mainPlaygroundRef,
  saveData,
  indicatorOptions,
  copyHtml,
  recordUndo,
})

const listenShortcuts = (event) => {
  // console.log(event)
  const key = event.key.toLowerCase()
  if (event.ctrlKey && event.shiftKey && key === 'z') {
    handleRedo()
  } else if (event.ctrlKey && key === 'z') {
    handleUndo()
  }
}

useEventListener(document, 'keydown', (event) => {
  // console.log(event)
  const key = event.key.toLowerCase()
  if (event.altKey && key === 'x') {
    indicatorOptions.enableExpand = !indicatorOptions.enableExpand
  } else if (event.altKey && key === 'z') {
    indicatorOptions.enableDevHelpClass = !indicatorOptions.enableDevHelpClass
  }
})

const openPlayground = () => {
  const url = router.resolve({
    name: 'PlaygroundPage',
  }).href
  console.log(url)
  if (window.__TAURI__) {
    const webview = new WebviewWindow('theUniqueLabel', {
      url,
    })
    return
  }
  window.open(url)
}

const doImportAction = () => {
  handleImportHtml(pasteHtmlText.value)
  isShowImportDialog.value = false
}
</script>

<template>
  <div tabindex="0" @keyup="listenShortcuts" class="page-craft-mc-wrap">
    <IndicatorInfo v-if="isSelectMode" />

    <transition name="mc-fade">
      <div
        ref="selectionElRef"
        class="selection-action"
        v-if="isShowSelectionAction"
        :style="selectionActionStyle"
        @click="isShowSelectionAction = false"
      >
        <button
          v-for="item in selectionPopupOptions"
          :key="item.label"
          @click="item.onClick"
          class="btn-no-style font-code"
        >
          {{ item.label }}
        </button>
      </div>
    </transition>

    <Teleport to="body">
      <QuickContextMenu ref="ctxMenuRef" :options="ctxMenuOptions" />
    </Teleport>

    <el-dialog
      draggable
      v-model="isShowImportDialog"
      :title="`${$t('actions.paste')} HTML`"
      width="600"
      top="10vh"
      append-to=".page-craft-root"
    >
      <VueMonaco v-if="isShowImportDialog" v-model="pasteHtmlText" style="height: 500px" />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isShowImportDialog = false">{{ $t('actions.cancel') }}</el-button>
          <el-button type="primary" @click="doImportAction">
            {{ $t('actions.import') }} HTML
          </el-button>
        </div>
      </template>
    </el-dialog>

    <Teleport to=".page-craft-root">
      <ElementEditDialog
        v-model:visible="isShowElementEdit"
        :editing-node="editingNode"
        :is-root="isEditingRoot"
        @onSave="updateEditingElement"
      />
    </Teleport>

    <portal to="indicatorBarTeleportDest">
      <template v-if="!isLitePage">
        <DropdownMenu :options="htmlMenuOptions">
          <button
            class="vp-button"
            :title="`${settingsStore.curCompInStore?.basePath}
${settingsStore.curCompInStore?.title}`"
          >
            <span class="mdi mdi-xml"></span>
            {{ settingsStore.curCompInStore?.title?.slice(0, 10) || 'Default' }}
          </button>
        </DropdownMenu>

        <el-popover width="180" trigger="hover">
          <template #reference>
            <button class="vp-button">
              <span class="mdi mdi-cog"></span>
              {{ $t('common.options') }}
            </button>
          </template>
          <div v-for="item in toggleList" :key="item.flag" class="toggle-list">
            <div class="flex-row-center-gap">
              <el-checkbox v-model="indicatorOptions[item.flag]" :label="item.title" size="small" />

              <template v-if="item.desc">
                <el-popover trigger="hover">
                  <template #reference>
                    <span class="mdi mdi-help-circle-outline"></span>
                  </template>
                  <span style="font-size: 14px">{{ item.desc }}</span>
                </el-popover>
              </template>
            </div>
          </div>
          <el-slider v-model="indicatorOptions.bgTransparentPercent" :step="1" size="small" />
          <div class="flex-row-center-gap">
            <button
              class="vp-button primary"
              title="(alt+w)"
              @click="mainStore.isShowSettings = !mainStore.isShowSettings"
            >
              {{ $t('common.settings') }}
            </button>

            <button class="vp-button" @click="openPlayground">Playground</button>
          </div>
        </el-popover>
      </template>

      <div class="vp-button-group">
        <button
          class="vp-button"
          title="Undo (ctrl+z)"
          :disabled="!undoRedo.undoStack.length"
          @click="handleUndo"
        >
          <span class="mdi mdi-undo-variant"></span>
        </button>
        <button
          class="vp-button"
          title="Redo (ctrl+shift+z)"
          :disabled="!undoRedo.redoStack.length"
          @click="handleRedo"
        >
          <span class="mdi mdi-redo-variant"></span>
        </button>
      </div>

      <span v-if="!isLitePage" style="border-right: 1px solid; opacity: 0.3"></span>
    </portal>

    <!-- Main Canvas -->
    <div
      ref="mainPlaygroundRef"
      :class="mainCanvasClass"
      :contenteditable="indicatorOptions.contentEditable"
      class="page-craft-mc"
      @mousedown="handleMouseDown"
      @mouseleave="handleMouseUp"
      @mouseup="handleMouseUp"
      @dragover.prevent.stop="handleDragOver"
      @dragleave.prevent.stop="handleDragLeave"
      @drop.prevent.stop="handleDrop"
      :style="backgroundStyle"
    ></div>

    <!-- 辅助定位线 -->
    <div class="line-helper-x"></div>

    <!-- 删除元素的动画 -->
    <div
      v-if="cursorX"
      class="mc-digging-wrap"
      :style="{top: cursorY + 'px', left: cursorX + 'px'}"
    >
      <div
        class="mc-digging-inner"
        :style="{
          width: `${waitingProgress}%`,
          height: `${waitingProgress}%`,
        }"
      ></div>
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
