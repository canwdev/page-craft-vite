<script lang="ts">
import {useCraftStore} from '@/store/craft'
import {ActionType} from '@/enum/page-craft/block'
import {useIsDarkMode} from '@/hooks/use-global-theme'
import FileChooser from '@/components/CommonUI/FileChooser.vue'
import IndicatorInfo from '@/components/PageCraft/MainCanvas/IndicatorInfo.vue'
import {useIndicator} from '@/components/PageCraft/MainCanvas/indicator-hooks'
import {useInteractionHooks} from '@/components/PageCraft/MainCanvas/interaction-hooks'
import {useMcMain} from '@/components/PageCraft/MainCanvas/main-hooks'
import ElementEditDialog from '@/components/PageCraft/MainCanvas/ElementEditDialog.vue'
import {useRouter} from 'vue-router'

export default defineComponent({
  name: 'MainCanvas',
  components: {
    FileChooser,
    IndicatorInfo,
    ElementEditDialog,
  },
  setup(props, {emit}) {
    const mainCanvasRef = ref()
    const {isDarkMode} = useIsDarkMode()
    const craftStore = useCraftStore()

    const {
      htmlMenuOptions,
      styleMenuOptions,
      fileChooserRef,
      isShowImportDialog,
      setMainCanvasHtml,
      pasteHtmlText,
      handleImportHtml,
      handleImportJsonSelected,
      saveData,
      copyHtml,
      undoRedo,
      recordUndo,
      handleUndo,
      handleRedo,
    } = useMcMain({
      mainCanvasRef,
      emit,
    })

    const {indicatorOptions, mainCanvasClass, toggleList, backgroundStyle} = useIndicator()

    const {
      currentHoveredEl,
      handleBlockClick,
      handleMouseDown,
      handleMouseUp,
      waitingProgress,
      cursorX,
      cursorY,
      contextMenuEtc,
      selectionActionStyle,
      isShowSelectionAction,
      selectionPopupOptions,
      isShowElementEdit,
      editingNode,
      updateEditingElement,
    } = useInteractionHooks({
      mainCanvasRef,
      saveData,
      indicatorOptions,
      copyHtml,
      recordUndo,
    })

    watch(
      () => indicatorOptions.enableSelection,
      (val) => {
        if (!val) {
          currentHoveredEl.value = null
        }
      }
    )

    const router = useRouter()
    const toolsMenuOptions = [
      {
        label: 'Stylus Format Tool',
        props: {
          onClick: async () => {
            emit('openStylusTools')
          },
        },
      },
      {
        label: 'Excel Copy Tool',
        props: {
          onClick: async () => {
            await router.push({name: 'ExcelCopyTool'})
          },
        },
      },
      {
        label: 'Vue i18n Copy Tool',
        props: {
          onClick: async () => {
            await router.push({name: 'VueI18nCopyTool'})
          },
        },
      },
    ]

    return {
      craftStore,
      mainCanvasRef,
      handleBlockClick,
      indicatorOptions,
      currentHoveredEl,
      BlockType: ActionType,
      toggleList,
      handleMouseDown,
      handleMouseUp,
      waitingProgress,
      cursorX,
      cursorY,
      mainCanvasClass,
      isDarkMode,
      htmlMenuOptions,
      styleMenuOptions,
      toolsMenuOptions,
      fileChooserRef,
      isShowImportDialog,
      setMainCanvasHtml,
      pasteHtmlText,
      handleImportHtml,
      handleImportJsonSelected,
      selectionActionStyle,
      isShowSelectionAction,
      selectionPopupOptions,
      ...contextMenuEtc,
      undoRedo,
      handleUndo,
      handleRedo,
      isShowElementEdit,
      editingNode,
      updateEditingElement,
      backgroundStyle,
    }
  },
})
</script>

<template>
  <div class="page-craft-mc-wrap">
    <IndicatorInfo :current-el="currentHoveredEl" v-if="currentHoveredEl !== mainCanvasRef" />

    <transition name="fade">
      <div
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

    <n-dropdown
      size="small"
      trigger="manual"
      placement="bottom-start"
      :show="showRightMenu"
      :options="rightMenuOptions"
      :x="xRef"
      :y="yRef"
      @select="handleSelect"
      key-field="label"
      :on-clickoutside="handleClickOutside"
    />

    <n-modal
      v-model:show="isShowImportDialog"
      negative-text="Cancel"
      positive-text="Import"
      preset="dialog"
      title="Paste HTML"
      @positive-click="handleImportHtml(pasteHtmlText)"
    >
      <n-input
        v-model:value="pasteHtmlText"
        placeholder="Basic HTML"
        rows="20"
        style="font-family: monospace"
        type="textarea"
      />
    </n-modal>

    <ElementEditDialog
      v-model:visible="isShowElementEdit"
      :editing-node="editingNode"
      @onSave="updateEditingElement"
    />

    <FileChooser
      ref="fileChooserRef"
      accept="application/JSON"
      @selected="handleImportJsonSelected"
    />

    <div :class="{_dark: isDarkMode}" class="page-craft-mc-indicator page-craft-aero-panel">
      <n-space align="center">
        <n-space align="center" size="small">
          <n-dropdown
            :options="htmlMenuOptions"
            key-field="label"
            placement="bottom-start"
            trigger="hover"
          >
            <n-button size="tiny">{{ craftStore.currentComponentName || '🎨HTML' }}</n-button>
          </n-dropdown>

          <n-popover :duration="100" :show-arrow="false" trigger="hover">
            <template #trigger>
              <n-button size="tiny">Options</n-button>
            </template>
            <template #header></template>
            <div v-for="item in toggleList" :key="item.flag" class="toggle-list">
              <n-checkbox
                v-model:checked="indicatorOptions[item.flag]"
                :label="item.title"
                :title="item.desc"
                size="small"
              />
            </div>
            <n-slider v-model:value="indicatorOptions.bgTransparentPercent" :step="1" />
            <template #footer>
              <slot name="settingsButtons"></slot>
            </template>
          </n-popover>

          <span>|</span>
          <n-button
            size="tiny"
            title="Undo"
            :disabled="!undoRedo.undoStack.length"
            @click="handleUndo"
            >↩</n-button
          >
          <n-button
            size="tiny"
            title="Redo"
            :disabled="!undoRedo.redoStack.length"
            @click="handleRedo"
            >↪</n-button
          >
          <span>|</span>

          <n-dropdown
            :options="styleMenuOptions"
            key-field="label"
            placement="bottom-start"
            trigger="hover"
          >
            <slot name="barExtra"></slot>
          </n-dropdown>

          <n-dropdown
            :options="toolsMenuOptions"
            key-field="label"
            placement="bottom-start"
            trigger="hover"
          >
            <n-button size="tiny"> Tools </n-button>
          </n-dropdown>
        </n-space>
      </n-space>
    </div>
    <div
      ref="mainCanvasRef"
      :class="mainCanvasClass"
      :contenteditable="indicatorOptions.contentEditable"
      class="page-craft-mc"
      @mousedown="handleMouseDown"
      @mouseleave="handleMouseUp"
      @mouseup="handleMouseUp"
      :style="backgroundStyle"
    ></div>

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
.page-craft-mc-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  z-index: 1;
}

.selection-action {
  position: fixed;
  top: 10px;
  left: 10px;
  background: #13181e;
  color: #fcffff;
  box-sizing: border-box;
  z-index: 100;
  font-size: 11px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
  outline: 1px solid #41484e;
  border-top: 2px solid rgb(225, 101, 101);
  max-width: 220px;

  button {
    padding: 2px 5px;

    &:hover {
      background: rgba(255, 255, 255, 0.32);
    }

    &:active {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  &:before {
    bottom: -20px;
    border-color: #41484e transparent transparent transparent;
  }

  &.reverse {
    flex-direction: column-reverse;
  }

  &.reverse:before,
  &.reverse:after {
    bottom: 0;
    top: -19px;
    border-color: transparent transparent #13181e transparent;
  }

  &.reverse:before {
    bottom: 0;
    top: -20px;
    border-color: transparent transparent #41484e transparent;
  }
}

.page-craft-mc-indicator {
  //width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  border-top: 0;
  z-index: 997;

  text-shadow: 0 0 10px white;
}
.mc-digging-wrap {
  $fill-color: white;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  pointer-events: none;
  transform: translate(-50%, -50%);
  width: 86px;
  height: 86px;
  border-radius: 50%;
  outline: 4px solid $fill-color;
  mix-blend-mode: difference;

  .mc-digging-inner {
    border-radius: 50%;
    background-color: $fill-color;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.page-craft-mc {
  flex: 1;
  background-color: white;
  width: 1200px;
  margin-left: auto;
  margin-right: auto;

  &._dark {
    background-color: #1e1e1e;
    color: white;
  }

  @media screen and (max-width: 1200px) {
    width: 100%;
  }

  &--cursor-insert {
    cursor: crosshair;

    * {
      cursor: crosshair;
    }
  }

  &--cursor-pickaxe {
    cursor: url('@/assets/textures/iron_pickaxe--cursor.png') 6 24, default;

    * {
      cursor: url('@/assets/textures/iron_pickaxe--cursor.png') 6 24, default;
    }
  }

  &--cursor-arrow {
    cursor: url('@/assets/textures/arrow--cursor.png') 2 4, default;

    * {
      cursor: url('@/assets/textures/arrow--cursor.png') 2 4, default;
    }
  }

  &--cursor-sword {
    cursor: url('@/assets/textures/iron_sword--cursor.png') 0 0, default;

    * {
      cursor: url('@/assets/textures/iron_sword--cursor.png') 0 0, default;
    }
  }
  &--cursor-oaksign {
    cursor: url('@/assets/textures/oak_sign.png') 0 0, default;

    * {
      cursor: url('@/assets/textures/oak_sign.png') 0 0, default;
    }
  }

  &--dev {
    * {
      outline: 1px dashed red;
    }

    .page-craft-mouse-over-dom-element-parent,
    .page-craft-mouse-over-dom-element {
    }
  }

  &--expand {
    * {
      transition: padding 1s;
      padding: 10px;
    }
  }

  &--full-width {
    width: 100%;
  }

  &--transparent {
    background-color: transparent !important;
  }

  &--centered-y {
    display: flex;
    align-items: center;
  }

  &--centered-x {
    display: flex;
    justify-content: center;
  }

  &.page-craft-mouse-over-dom-element,
  .page-craft-mouse-over-dom-element {
    outline: 1px solid deeppink !important;
    border-color: deeppink !important;
    background-color: rgba(255, 192, 203, 0.5) !important;
    //color: #111 !important;
    opacity: 0.85 !important;
    fill: deeppink !important; /* Helps in highlighting SVG elements */
  }
}
</style>
