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
      <transition name="fade">
        <QuickContextMenu :options="ctxMenuOptions" ref="ctxMenuRef" />
      </transition>
    </Teleport>

    <n-modal
      v-model:show="isShowImportDialog"
      :negative-text="$t('actions.cancel')"
      :positive-text="$t('actions.import')"
      preset="dialog"
      :title="`${$t('actions.paste')} HTML`"
      @positive-click="handleImportHtml(pasteHtmlText)"
      style="width: 600px"
    >
      <VueMonaco v-if="isShowImportDialog" v-model="pasteHtmlText" style="height: 500px" />
    </n-modal>

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
            {{ settingsStore.curCompInStore?.title?.slice(0, 10) || 'Default' }}
          </button>
        </DropdownMenu>

        <n-popover :duration="100" :show-arrow="false" trigger="hover">
          <template #trigger>
            <button class="vp-button">⚙️ {{ $t('common.options') }}</button>
          </template>
          <template #header></template>
          <div v-for="item in toggleList" :key="item.flag" class="toggle-list">
            <div style="display: flex; align-items: center">
              <n-checkbox
                v-model:checked="indicatorOptions[item.flag]"
                :label="item.title"
                size="small"
              />

              <template v-if="item.desc">
                <n-popover style="padding: 0; min-width: 200px" trigger="hover">
                  <template #trigger>
                    <n-icon size="16">
                      <QuestionCircle20Regular />
                    </n-icon>
                  </template>
                  <span style="font-size: 14px">{{ item.desc }}</span>
                </n-popover>
              </template>
            </div>
          </div>
          <n-slider v-model:value="indicatorOptions.bgTransparentPercent" :step="1" />
          <template #footer>
            <n-space align="center" size="small">
              <n-button title="(alt+w)" size="small" @click="mainStore.isShowSettings = true">{{
                $t('common.settings')
              }}</n-button>

              <n-button quaternary type="primary" size="small" @click="openPlayground">
                Playground
              </n-button>
            </n-space>
          </template>
        </n-popover>
      </template>

      <n-button-group>
        <n-button
          size="tiny"
          title="Undo (ctrl+z)"
          :disabled="!undoRedo.undoStack.length"
          @click="handleUndo"
        >
          <template #icon>
            <n-icon size="18">
              <ArrowUndo20Filled />
            </n-icon>
          </template>
        </n-button>
        <n-button
          size="tiny"
          title="Redo (ctrl+shift+z)"
          :disabled="!undoRedo.redoStack.length"
          @click="handleRedo"
        >
          <template #icon>
            <n-icon size="18">
              <ArrowRedo20Filled />
            </n-icon>
          </template>
        </n-button>
      </n-button-group>

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
</style>
