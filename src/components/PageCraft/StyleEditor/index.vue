<script lang="ts">
import {defineComponent, shallowRef} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {debounce} from 'throttle-debounce'
import {LsKeys} from '@/enum/page-craft'
import {createOrFindStyleNode} from '@/utils/dom'
import {sassToCSS, suggestElementClass} from '@/utils/css'
import {copyToClipboard} from '@/utils'
import {useCraftStore} from '@/store/craft'
import {ActionBlockItems, BlockItem} from '@/enum/page-craft/block'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {
  cssHelperClassList,
  cssKeyFramesList,
  cssSnippetList,
  mediaQueryList,
  sassVariablesList,
  vue2TransitionsList,
  vue3TransitionsList,
} from '@/enum/page-craft/styles'
import {formatCss} from '@/utils/formater'
import {useCompStorage} from '@/hooks/use-component-storage'
import VpWindow from '@/components/CommonUI/VpWindow.vue'

import * as monaco from 'monaco-editor'
import {emmetCSS} from 'emmet-monaco-es'
emmetCSS(monaco, ['css', 'scss'])
import {useSettingsStore} from '@/store/settings'
import {
  CursorHover20Regular,
  CursorClick20Regular,
  Dismiss20Regular,
  PaintBucket20Filled,
  Copy20Regular,
  Wand20Regular,
  PaintBrush20Regular,
} from '@vicons/fluent'
import {useI18n} from 'vue-i18n'
import {useBeforeUnload} from '@/hooks/use-beforeunload'
import {
  useOpenCloseSelect,
  useOpenCloseSound,
  useSfxBell,
  useSfxBrush,
  useSfxFill,
} from '@/hooks/use-sfx'

export default defineComponent({
  name: 'StyleEditor',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VpWindow,
    CursorHover20Regular,
    CursorClick20Regular,
    Dismiss20Regular,
    PaintBucket20Filled,
    Copy20Regular,
    Wand20Regular,
    PaintBrush20Regular,
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mVisible = useModelWrapper(props, emit, 'visible')
    const editorContainerRef = ref()
    const craftStore = useCraftStore()
    const settingsStore = useSettingsStore()
    // monaco.editor.IStandaloneCodeEditor
    const editorInstance = shallowRef<any>()

    const isEditorContentChanged = ref(false)
    useBeforeUnload(() => {
      return isEditorContentChanged.value
    })

    const styleEl = ref<HTMLElement | null>(null)

    watch(mVisible, () => {
      if (mVisible) {
        editorInstance.value.layout()
      }
    })

    const getThemeName = () => {
      return craftStore.isAppDarkMode ? 'vs-dark' : 'vs'
    }
    watch(
      () => craftStore.isAppDarkMode,
      (val) => {
        editorInstance.value.updateOptions({theme: getThemeName()})
      }
    )

    const {loadCurCompStyle, saveCurCompStyle} = useCompStorage()

    watch(
      () => settingsStore.curCompoName,
      () => {
        reloadStyle()
      }
    )

    const reloadStyle = () => {
      const style = loadCurCompStyle()
      editorInstance.value.setValue(style)
      // call instantly
      handleUpdateStyle(style, false)

      setTimeout(() => {
        isEditorContentChanged.value = false
      }, 500)
    }

    onMounted(() => {
      styleEl.value = createOrFindStyleNode(LsKeys.MAIN_STYLE)
      const style = loadCurCompStyle()

      editorInstance.value = monaco.editor.create(editorContainerRef.value, {
        value: style,
        language: 'scss',
        theme: getThemeName(), // 'vs' 'hc-black' 'vs-dark'
        wordWrap: 'on',
        foldingStrategy: 'indentation', // 代码可分小段折叠
        minimap: {
          enabled: false,
        },
        scrollbar: {
          alwaysConsumeMouseWheel: false,
        },
        quickSuggestions: true,
        suggest: {
          snippetsPreventQuickSuggestions: false,
        },
        // cursorSmoothCaretAnimation: true, // 是否启用光标平滑插入动画
        tabSize: 2,
      })

      editorInstance.value.onDidChangeModelContent(() => {
        handleEditorChangeDebounced()
      })

      handleUpdateStyle(style, false)

      // @ts-ignore
      globalEventBus.on(GlobalEvents.ON_ADD_STYLE, handleAddStyle)
      globalEventBus.on(GlobalEvents.IMPORT_SUCCESS, reloadStyle)
    })

    onBeforeUnmount(() => {
      editorInstance.value.dispose()
      // @ts-ignore
      globalEventBus.off(GlobalEvents.ON_ADD_STYLE, handleAddStyle)
      globalEventBus.off(GlobalEvents.IMPORT_SUCCESS, reloadStyle)
    })

    const handleEditorChangeDebounced = debounce(500, false, () => {
      isEditorContentChanged.value = true
      handleUpdateStyle(editorInstance.value.getValue())
    })

    const errorTip = ref()
    const handleErrorTipClick = () => {
      console.warn(errorTip.value.message, {...errorTip.value})
      setTimeout(() => {
        errorTip.value = null
      }, 500)
    }

    const _prevStyleValue = ref('') // 创建一个临时变量防止重复更新
    const handleUpdateStyle = async (value, isSave = true) => {
      if (styleEl.value) {
        try {
          if (_prevStyleValue.value === value) {
            // console.log('prevent update')
            return
          }
          // console.warn('handleUpdateStyle')
          _prevStyleValue.value = value
          styleEl.value.innerHTML = value ? await sassToCSS(value) : ''
          if (isSave) {
            saveCurCompStyle(value)
          }
          errorTip.value = ''
        } catch (error: any) {
          // console.error(error)
          // message.error(error.message)
          errorTip.value = error
        }
      }
    }

    const message = useMessage()

    const {play: playSfxBrush} = useSfxBrush()
    const execBeautifyCssAction = async () => {
      const textValue = editorInstance.value.getValue()
      if (textValue.trim()) {
        const beautifiedCSS = formatCss(textValue)
        if (textValue.trim() !== beautifiedCSS.trim()) {
          // Select all text
          const fullRange = editorInstance.value.getModel()?.getFullModelRange()
          if (fullRange) {
            // Apply the text over the range
            editorInstance.value.executeEdits(null, [
              {
                text: beautifiedCSS,
                range: fullRange,
              },
            ])
            // Indicates the above edit is a complete undo/redo change.
            // editorInstance.value.pushUndoStop()
          } else {
            await editorInstance.value.setValue(beautifiedCSS)
          }

          await handleUpdateStyle(beautifiedCSS)
          // await editor.reInitTextComponent({pleaseIgnoreCursorActivity: true})
        }
      }
      editorInstance.value.focus()
      playSfxBrush()
    }

    const {play: playSfxBell} = useSfxBell()
    const {play: sfxFill} = useSfxFill()
    const copyStyle = () => {
      copyToClipboard(editorInstance.value.getValue())
      message.success($t('msgs.copy_success'))
      playSfxBell()
    }

    const backupBlock = ref<BlockItem | null>(null)
    const enterSelectMode = () => {
      if (craftStore.isSelectMode) {
        return exitSelectMode()
      }
      backupBlock.value = craftStore.currentBlock
      craftStore.isSelectMode = true
      craftStore.currentBlock = ActionBlockItems.SELECTION
    }
    const exitSelectMode = () => {
      if (backupBlock.value) {
        craftStore.currentBlock = backupBlock.value
      }
      craftStore.isSelectMode = false
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
        const style = loadCurCompStyle()
        editorInstance.value.setValue(style + '\n' + code)
        return
      }

      const selection = editorInstance.value.getSelection()
      editorInstance.value.executeEdits('', [
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
        editorInstance.value.focus()
      }, 100)
    }

    const getToolChildren = (list) => {
      return list.map((item) => {
        return {
          label: item.name,
          props: {
            onClick: async () => {
              insertStyleCode(item.code)
            },
          },
        }
      })
    }

    const toolOptions = [
      {
        label: 'CSS ' + $t('common.snippets'),
        children: getToolChildren(cssSnippetList),
      },
      {
        label: 'CSS ' + $t('common.helper_classes'),
        children: getToolChildren(cssHelperClassList),
      },
      {
        label: 'Animation',
        children: [
          {
            label: '@keyframes',
            children: getToolChildren(cssKeyFramesList),
          },
          {
            label: 'Vue 2 ' + $t('common.transitions'),
            children: getToolChildren(vue2TransitionsList),
          },
          {
            label: 'Vue 3 ' + $t('common.transitions'),
            children: getToolChildren(vue3TransitionsList),
          },
        ],
      },
      {
        label: 'Media Query',
        children: getToolChildren(mediaQueryList),
      },
      {
        label: 'Sass ' + $t('common.variables'),
        children: getToolChildren(sassVariablesList),
      },
    ]

    useOpenCloseSelect(() => craftStore.isSelectMode)

    const listenShortcuts = (event) => {
      // console.log(event)
      const key = event.key.toLowerCase()
      if (event.ctrlKey && event.shiftKey && key === 'f') {
        execBeautifyCssAction()
      }
    }

    const listenGlobalShortcuts = (event) => {
      // console.log(event)
      const key = event.key.toLowerCase()
      if (event.ctrlKey && event.shiftKey && key === 'x') {
        enterSelectMode()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', listenGlobalShortcuts)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', listenGlobalShortcuts)
    })

    return {
      settingsStore,
      mVisible,
      handleUpdateStyle,
      editorContainerRef,
      execBeautifyCssAction,
      copyStyle,
      enterSelectMode,
      exitSelectMode,
      craftStore,
      errorTip,
      handleErrorTipClick,
      toolOptions,
      editorInstance,
      listenShortcuts,
    }
  },
})
</script>

<template>
  <VpWindow
    class="style-editor-dialog"
    v-model:visible="mVisible"
    @resize="editorInstance.layout()"
    wid="style_editor"
    @keyup="listenShortcuts"
  >
    <template #titleBarLeft>
      <n-icon class="window-icon" size="20"><PaintBrush20Regular /></n-icon
      >{{ $t('common.style_editor') }}
      (scss)
    </template>
    <template #titleBarRightControls>
      <button
        :title="$t('msgs.select_an_element_in') + ' (ctrl+shift+x)'"
        :class="{active: craftStore.isSelectMode}"
        @click="enterSelectMode"
      >
        <n-icon size="20">
          <CursorHover20Regular v-if="!craftStore.isSelectMode" />
          <CursorClick20Regular v-else />
        </n-icon>
      </button>
      <n-dropdown :options="toolOptions" key-field="label" size="large">
        <button :title="$t('actions.add_tool_codes')">
          <n-icon size="20"><PaintBucket20Filled /></n-icon>
        </button>
      </n-dropdown>

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
      <div v-show="errorTip" class="code-error-tip font-code" @click="handleErrorTipClick">
        {{ errorTip?.message }}
      </div>
    </transition>

    <div ref="editorContainerRef" class="code-editor-placeholder" />
  </VpWindow>
</template>

<style lang="scss" scoped>
.style-editor-dialog {
  min-width: 400px;
  min-height: 200px;
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

  .code-editor-placeholder {
    width: 100%;
    height: 100%;
  }

  .code-error-tip {
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
}
</style>
