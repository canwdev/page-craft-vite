<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {LsKeys} from '@/enum/page-craft'
import {sassToCSS, suggestElementClass} from '@/utils/css'
import {copyToClipboard} from '@/utils'
import {useMainStore} from '@/store/main'
import {ActionBlockItems, BlockItem} from '@/enum/page-craft/block'
import {GlobalEvents, useGlobalBusOn} from '@/utils/global-event-bus'
import {StyleTabType} from '@/enum/page-craft/styles'
import {formatCss} from '@/utils/formater'
import {useCompStorage} from '@/hooks/use-component-storage'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'

import {useSettingsStore} from '@/store/settings'
import {
  Copy20Regular,
  CursorClick20Regular,
  CursorHover20Regular,
  PaintBrush20Regular,
  PaintBucket20Filled,
  Wand20Regular,
} from '@vicons/fluent'
import {useI18n} from 'vue-i18n'
import {useOpenCloseSelect, useSfxBell, useSfxBrush, useSfxFill} from '@/hooks/use-sfx'
import TabLayout from '@/components/CommonUI/TabLayout.vue'
import monaco from '@/components/CommonUI/VueMonaco/monaco-helper'
import VueMonaco from '@/components/CommonUI/VueMonaco/index.vue'
import {useGlobalStyle} from '@/hooks/use-global-theme'
import {usePlaygroundStore} from '@/store/playground'
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {useEventListener, useStorage} from '@vueuse/core'
import {useRemoteOptions} from '@/components/CommonUI/QuickOptions/use-remote-options'

export default defineComponent({
  name: 'StyleEditor',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    QuickOptions,
    VueMonaco,
    TabLayout,
    ViewPortWindow,
    CursorHover20Regular,
    CursorClick20Regular,
    PaintBucket20Filled,
    Copy20Regular,
    Wand20Regular,
    PaintBrush20Regular,
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mVisible = useModelWrapper(props, emit, 'visible')
    const mainStore = useMainStore()
    const settingsStore = useSettingsStore()
    const playgroundStore = usePlaygroundStore()

    const vueMonacoRef = ref()
    const tabList = ref([
      {label: 'Global', value: StyleTabType.GLOBAL},
      {label: 'Variables', value: StyleTabType.VARIABLES},
      {label: 'Current', value: StyleTabType.CURRENT},
    ])

    const isAutoSave = ref(false)
    const isShowQuickOptions = ref(false)

    const updateEditorLayout = () => {
      const eIns = vueMonacoRef.value.getInstance()
      eIns?.layout()
    }
    const focusEditor = () => {
      if (isShowQuickOptions.value) {
        return
      }
      setTimeout(() => {
        const eIns = vueMonacoRef.value.getInstance()
        eIns.focus()
      }, 100)
    }
    watch(mVisible, (val) => {
      if (val) {
        updateEditorLayout()
        focusEditor()
      }
    })
    watch(isShowQuickOptions, (val) => {
      if (!val) {
        focusEditor()
      }
    })

    const {loadCurCompStyle, saveCurCompStyle} = useCompStorage()

    watch(
      () => settingsStore.curCompoName,
      () => {
        reloadStyle()
      }
    )

    const reloadStyle = () => {
      isAutoSave.value = false
      currentStyleCode.value = loadCurCompStyle()
      setTimeout(() => {
        isAutoSave.value = true
      }, 100)
    }

    const {globalStyleText} = useGlobalStyle()

    const variableStyleCode = useStorage(LsKeys.VARIABLES_STYLE, '')
    watch(variableStyleCode, () => {
      handleUpdateStyle()
    })
    const currentStyleCode = ref('')
    watch(currentStyleCode, () => {
      handleUpdateStyle(true)
    })

    onMounted(() => {
      reloadStyle()
    })

    const errorTip = ref()
    const handleErrorTipClick = () => {
      console.warn(errorTip.value.message, {...errorTip.value})
      setTimeout(() => {
        errorTip.value = null
      }, 500)
    }

    // 创建一个临时变量防止重复更新
    const _prevStyleValue = ref('')

    /**
     * 把样式应用到页面
     */
    const handleUpdateStyle = async (doSave = false) => {
      try {
        // combine variables and styles
        const value = variableStyleCode.value + '\n' + currentStyleCode.value
        if (_prevStyleValue.value === value) {
          // console.log('prevent update')
          return
        }
        _prevStyleValue.value = value
        const result = value ? await sassToCSS(value) : ''

        playgroundStore.currentCSS = result

        // console.log('[handleUpdateStyle]', isAutoSave.value)
        if (doSave && isAutoSave.value) {
          saveCurCompStyle(currentStyleCode.value)
        }
        errorTip.value = ''
      } catch (error: any) {
        // console.error(error)
        errorTip.value = error
      }
    }

    const {play: playSfxBrush} = useSfxBrush()
    const {play: playSfxBell} = useSfxBell()
    const {play: sfxFill} = useSfxFill()

    const execBeautifyCssAction = async () => {
      const eIns = vueMonacoRef.value.getInstance()
      const textValue = eIns.getValue()

      if (textValue.trim()) {
        const beautifiedCSS = formatCss(textValue)
        if (textValue.trim() !== beautifiedCSS.trim()) {
          // Select all text
          const fullRange = eIns.getModel()?.getFullModelRange()
          if (fullRange) {
            // Apply the text over the range
            eIns.executeEdits(null, [
              {
                text: beautifiedCSS,
                range: fullRange,
              },
            ])
            // Indicates the above edit is a complete undo/redo change.
            // eIns.pushUndoStop()
          } else {
            currentStyleCode.value = beautifiedCSS
          }

          // await editor.reInitTextComponent({pleaseIgnoreCursorActivity: true})
        }
      }
      eIns.focus()
      playSfxBrush()
    }

    const copyStyle = () => {
      const eIns = vueMonacoRef.value.getInstance()
      const textValue = eIns.getValue()
      copyToClipboard(textValue)
      window.$message.success($t('msgs.copy_success'))
      playSfxBell()
    }

    const backupBlock = ref<BlockItem | null>(null)
    const enterSelectMode = () => {
      if (mainStore.isSelectMode) {
        return exitSelectMode()
      }
      backupBlock.value = mainStore.currentBlock
      mainStore.isSelectMode = true
      mainStore.currentBlock = ActionBlockItems.SELECTION
    }
    const exitSelectMode = () => {
      if (backupBlock.value) {
        mainStore.currentBlock = backupBlock.value
      }
      mainStore.isSelectMode = false
      backupBlock.value = null
    }
    const handleAddStyle = ({el, code, isAppend = false}) => {
      nextTick(() => {
        if (el) {
          let className = suggestElementClass(el)
          code = `\n${className} {\n\n}\n`
        }
        // console.log('[handleAddStyle]', className)
        insertStyleCode(code, isAppend)
      })
      exitSelectMode()
    }

    const insertStyleCode = (code, isAppend = false) => {
      sfxFill()
      if (isAppend) {
        currentStyleCode.value = currentStyleCode.value + '\n' + code
        return
      }

      const eIns = vueMonacoRef.value.getInstance()

      const selection = eIns.getSelection()
      eIns.executeEdits('', [
        {
          range: new monaco.Range(
            selection?.startLineNumber || 0,
            selection?.startColumn || 0,
            selection?.endLineNumber || 0,
            selection?.endColumn || 0
          ),
          text: code,
          forceMoveMarkers: true,
        },
      ])
      setTimeout(() => {
        eIns.focus()
      }, 100)
    }

    const {options: toolOptions} = useRemoteOptions({
      fetchFn: async () => {
        const res = await fetch('./scss-snippets.json')
        return await res.json()
      },
      mapFn: (i) => {
        const r: QuickOptionItem = {
          label: i.label,
          props: {},
        }
        if (i.code) {
          r.props!.onClick = async () => {
            insertStyleCode(i.code)
          }
          r.props!.onContextmenu = async () => {
            await copyToClipboard(i.code)
            window.$message.success($t('msgs.copy_success'))
          }
        }
        return r
      },
    })

    useOpenCloseSelect(() => mainStore.isSelectMode)

    const listenShortcuts = (event) => {
      // console.log(event)
      const key = event.key.toLowerCase()
      if (event.ctrlKey && event.shiftKey && key === 'f') {
        execBeautifyCssAction()
      }
    }

    useEventListener(document, 'keydown', (event) => {
      if (!mVisible.value) {
        return
      }
      // console.log(event)
      const key = event.key.toLowerCase()
      if (event.ctrlKey && event.shiftKey && key === 'x') {
        enterSelectMode()
      } else if (event.altKey && key === 'q') {
        isShowQuickOptions.value = !isShowQuickOptions.value
      }
    })

    // @ts-ignore
    useGlobalBusOn(GlobalEvents.ON_ADD_STYLE, handleAddStyle)
    useGlobalBusOn(GlobalEvents.IMPORT_SUCCESS, reloadStyle)

    return {
      tabList,
      settingsStore,
      mVisible,
      execBeautifyCssAction,
      copyStyle,
      enterSelectMode,
      exitSelectMode,
      mainStore,
      errorTip,
      handleErrorTipClick,
      toolOptions,
      listenShortcuts,
      currentStyleCode,
      vueMonacoRef,
      updateEditorLayout,
      variableStyleCode,
      StyleTabType,
      globalStyleText,
      focusEditor,
      isShowQuickOptions,
    }
  },
})
</script>

<template>
  <ViewPortWindow
    class="mc-style-editor-dialog"
    v-model:visible="mVisible"
    @resize="updateEditorLayout"
    wid="style_editor"
    @keyup="listenShortcuts"
    @onActive="focusEditor"
    allow-maximum
  >
    <template #titleBarLeft>
      <n-icon class="window-icon" size="18"><PaintBrush20Regular /></n-icon
      >{{ $t('common.style_editor') }}
      (scss)
    </template>
    <template #titleBarRightControls>
      <button
        :title="$t('msgs.select_an_element_in') + ' (ctrl+shift+x)'"
        :class="{active: mainStore.isSelectMode}"
        @click="enterSelectMode"
      >
        <n-icon size="20">
          <CursorHover20Regular v-if="!mainStore.isSelectMode" />
          <CursorClick20Regular v-else />
        </n-icon>
      </button>
      <button
        @click="isShowQuickOptions = !isShowQuickOptions"
        :title="$t('actions.add_tool_codes')"
      >
        <n-icon size="20"><PaintBucket20Filled /></n-icon>
      </button>

      <button
        :title="$t('actions.beautify_code') + ' (ctrl+shift+f)'"
        @click="execBeautifyCssAction"
      >
        <n-icon size="20"><Wand20Regular /></n-icon>
      </button>

      <button :title="$t('actions.copy_code') + ' (ctrl+a ctrl+c)'" @click="copyStyle">
        <n-icon size="20"><Copy20Regular /></n-icon>
      </button>
    </template>

    <transition name="mc-fade">
      <div
        v-show="errorTip"
        class="code-mc-error-tip-button font-code"
        @click="handleErrorTipClick"
      >
        {{ errorTip?.message }}
      </div>
    </transition>

    <div class="style-editor-inner">
      <div class="style-editor-action-bar">
        <TabLayout v-model="settingsStore.styleEditorTab" :tab-list="tabList" horizontal />
        <QuickOptions
          v-model:visible="isShowQuickOptions"
          :options="toolOptions"
          :title="`${$t('actions.add_tool_codes')} (alt+q)`"
          class="font-code"
          style="top: 2px; right: 2px; transform: unset"
        />
      </div>
      <div class="code-editor-placeholder">
        <VueMonaco
          v-if="settingsStore.styleEditorTab === StyleTabType.GLOBAL"
          ref="vueMonacoRef"
          v-model="globalStyleText"
          language="scss"
          :debounce-ms="500"
          show-line-numbers
        />
        <VueMonaco
          v-else-if="settingsStore.styleEditorTab === StyleTabType.VARIABLES"
          ref="vueMonacoRef"
          v-model="variableStyleCode"
          language="scss"
          :debounce-ms="500"
          show-line-numbers
        />
        <VueMonaco
          v-else
          ref="vueMonacoRef"
          v-model="currentStyleCode"
          language="scss"
          :debounce-ms="500"
          show-line-numbers
        />
      </div>
    </div>
  </ViewPortWindow>
</template>

<style lang="scss">
.mc-style-editor-dialog {
  min-width: 400px;
  min-height: 320px;
  z-index: 1000;
  top: 30%;
  left: 30%;

  &._aero {
    :deep(.monaco-editor) {
      background-color: transparent;
      .margin {
        background-color: transparent;
      }
    }
    :deep(.monaco-editor-background) {
      background-color: transparent;
    }
  }

  .style-editor-inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .style-editor-action-bar {
      height: 31px;
    }

    .code-editor-placeholder {
      height: calc(100% - 31px);
    }
  }

  .code-mc-error-tip-button {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 12px;
    transform-origin: top right;
    background-color: rgba(0, 0, 0, 0.6);
    color: #ff8989;
    z-index: 1;
    padding: 5px 5px 5px 10px;
  }

  .quick-options {
    max-width: 300px;
  }
}
</style>
