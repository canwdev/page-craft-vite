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
  sassVariablesList,
  vue2TransitionsList,
} from '@/enum/page-craft/styles'
import {formatCss} from '@/utils/formater'
import {useCompStorage} from '@/hooks/use-component-storage'
import VpWindow from '@/components/CommonUI/VpWindow.vue'

// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as monaco from 'monaco-editor'
import {emmetCSS} from 'emmet-monaco-es'
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

self.MonacoEnvironment = {
  // @ts-ignore
  getWorker(_: string, label: string) {
    // if (label === 'json') {
    //   return new jsonWorker()
    // }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    // if (label === 'html' || label === 'handlebars' || label === 'razor') {
    //   return new htmlWorker()
    // }
    // if (['typescript', 'javascript'].includes(label)) {
    //   return new tsWorker()
    // }
    // return new EditorWorker()
  },
}

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
    const mVisible = useModelWrapper(props, emit, 'visible')
    const editorContainerRef = ref()
    const craftStore = useCraftStore()
    const settingsStore = useSettingsStore()
    // monaco.editor.IStandaloneCodeEditor
    const editorInstance = shallowRef<any>()

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
    }

    onMounted(() => {
      styleEl.value = createOrFindStyleNode(LsKeys.MAIN_STYLE)
      const style = loadCurCompStyle()

      emmetCSS(monaco, ['css', 'scss'])
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
    }

    const copyStyle = () => {
      copyToClipboard(editorInstance.value.getValue())
      message.success('Copy Success!')
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
      if (isAppend) {
        let currentPosition = editorInstance.value.getModel().getLineCount()
        currentPosition += 1
        editorInstance.value.executeEdits('', [
          {
            range: new monaco.Range(currentPosition, 1, currentPosition, 1),
            text: code,
            forceMoveMarkers: false,
          },
        ])
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
        label: 'CSS Snippets',
        children: getToolChildren(cssSnippetList),
      },
      {
        label: 'CSS Helper Classes',
        children: getToolChildren(cssHelperClassList),
      },
      {
        label: '@keyframes',
        children: getToolChildren(cssKeyFramesList),
      },
      {
        label: 'Vue 2 Transitions',
        children: getToolChildren(vue2TransitionsList),
      },
      {
        label: 'Sass Variables',
        children: getToolChildren(sassVariablesList),
      },
    ]

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
  >
    <template #titleBarLeft>
      <n-icon size="20"><PaintBrush20Regular /></n-icon>&nbsp;Style Editor
    </template>
    <template #titleBarRightControls>
      <button
        title="Select an element in the page to generate its CSS Selector"
        :class="{active: craftStore.isSelectMode}"
        @click="enterSelectMode"
      >
        <n-icon size="20">
          <CursorHover20Regular v-if="!craftStore.isSelectMode" />
          <CursorClick20Regular v-else />
        </n-icon>
      </button>
      <n-dropdown :options="toolOptions" key-field="label" size="large">
        <button title="Add tool codes">
          <n-icon size="20"><PaintBucket20Filled /></n-icon>
        </button>
      </n-dropdown>

      <button title="Beautify code" @click="execBeautifyCssAction">
        <n-icon size="20"><Wand20Regular /></n-icon>
      </button>

      <button title="Copy code" @click="copyStyle">
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
