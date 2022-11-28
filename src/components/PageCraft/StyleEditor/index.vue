<script lang="ts">
import {defineComponent, shallowRef} from 'vue'
import {setDraggableMouse} from '@/utils/draggable-mouse'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {debounce, throttle} from 'throttle-debounce'
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
import {useIsDarkMode} from '@/hooks/use-global-theme'
import {useCompStorage} from '@/hooks/use-component-storage'

// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as monaco from 'monaco-editor'
import {emmetCSS} from 'emmet-monaco-es'

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

type StyleEditorOptions = {
  wTop: string
  wLeft: string
  wWidth: string
  wHeight: string
}

export default defineComponent({
  name: 'StyleEditor',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')
    const dialogRef = ref()
    const titleBarRef = ref()
    const titleBarButtonsRef = ref()
    const editorContainerRef = ref()
    const craftStore = useCraftStore()
    const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor>()

    const clearDraggable = ref<any>(null)
    const styleEl = ref<HTMLElement | null>(null)

    const styleEditorOptions = reactive<StyleEditorOptions>(
      JSON.parse(localStorage.getItem(LsKeys.STYLE_EDITOR_OPTIONS) || 'null') || {
        wTop: '100px',
        wLeft: '100px',
        wWidth: '300px',
        wHeight: '300px',
      }
    )
    watch(
      styleEditorOptions,
      () => {
        localStorage.setItem(LsKeys.STYLE_EDITOR_OPTIONS, JSON.stringify({...styleEditorOptions}))
      },
      {deep: true}
    )

    watch(mVisible, () => {
      if (mVisible) {
        editorInstance.value.layout()
      }
    })
    const {isDarkMode} = useIsDarkMode()

    const getThemeName = () => {
      return isDarkMode.value ? 'vs-dark' : 'vs'
    }
    watch(isDarkMode, (val) => {
      editorInstance.value.updateOptions({theme: getThemeName()})
    })

    const {loadCurCompStyle, saveCurCompStyle} = useCompStorage()

    watch(
      () => craftStore.currentComponentName,
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
      clearDraggable.value = setDraggableMouse({
        dragHandleEl: titleBarRef.value,
        dragTargetEl: dialogRef.value,
        allowOut: true,
        opacify: 0.8,
        preventNode: titleBarButtonsRef.value,
        onMove(data) {
          handleMoveDebounced(data)
        },
        autoPosOnResize: true,
      })

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

      new ResizeObserver(() => {
        handleResizeDebounced()
      }).observe(editorContainerRef.value)

      handleUpdateStyle(style, false)

      initDialogStyle()

      globalEventBus.on(GlobalEvents.ON_NODE_SELECT, handleNodeSelect)
      globalEventBus.on(GlobalEvents.IMPORT_SUCCESS, reloadStyle)
    })

    onBeforeUnmount(() => {
      if (clearDraggable.value) {
        clearDraggable.value()
      }
      editorInstance.value.dispose()
      globalEventBus.off(GlobalEvents.ON_NODE_SELECT, handleNodeSelect)
      globalEventBus.off(GlobalEvents.IMPORT_SUCCESS, reloadStyle)
    })

    const handleMoveDebounced = throttle(500, false, ({top, left}) => {
      styleEditorOptions.wTop = top
      styleEditorOptions.wLeft = left
    })

    const handleResizeDebounced = throttle(100, false, () => {
      if (!mVisible.value || !editorContainerRef.value) {
        return
      }
      const width = editorContainerRef.value.offsetWidth
      const height = editorContainerRef.value.offsetHeight

      // update editor layout
      editorInstance.value.layout()

      styleEditorOptions.wWidth = width + 'px'
      styleEditorOptions.wHeight = height + 'px'
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

    const initDialogStyle = () => {
      dialogRef.value.style.top = styleEditorOptions.wTop
      dialogRef.value.style.left = styleEditorOptions.wLeft

      editorContainerRef.value.style.width = styleEditorOptions.wWidth
      editorContainerRef.value.style.height = styleEditorOptions.wHeight
    }

    const message = useMessage()
    const execBeautifyCssAction = async () => {
      const textValue = editorInstance.value.getValue()
      if (!textValue.trim()) {
        message.info('Please type some code to be beautified')
      } else {
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

          message.success('Your code has been beautified :-)')
        } else {
          message.success('Your code already looks beautiful :-)')
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
    const handleNodeSelect = (el) => {
      nextTick(() => {
        let className = suggestElementClass(el)
        // console.log('[handleNodeSelect]', className)
        insertStyleCode(`\n${className} {\n\n}\n`)
      })
      exitSelectMode()
    }

    const insertStyleCode = (code) => {
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
      dialogRef,
      titleBarRef,
      titleBarButtonsRef,
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
      isDarkMode,
    }
  },
})
</script>

<template>
  <transition name="zoom">
    <div
      v-show="mVisible"
      class="style-editor-dialog page-craft-window _thin-window"
      :class="{_dark: isDarkMode}"
      ref="dialogRef"
    >
      <div class="page-craft-window-content">
        <div ref="titleBarRef" class="page-craft-title-bar">
          <div
            class="page-craft-title-bar-text font-minecraft"
            style="display: flex; align-items: center; height: 14px"
          >
            <img src="~@/assets/textures/redstone.png" alt="tools" />
            &nbsp;Style Editor
          </div>
          <div ref="titleBarButtonsRef" class="page-craft-window-controls">
            <button
              title="Select an element in the page to generate its CSS Selector"
              :class="{active: craftStore.isSelectMode}"
              @click="enterSelectMode"
            >
              <img
                src="~@/assets/textures/arrow.png"
                alt="select"
                style="transform: rotateY(180deg)"
              />
            </button>

            <n-dropdown
              :options="toolOptions"
              key-field="label"
              placement="bottom"
              trigger="hover"
              size="medium"
              :animated="false"
            >
              <button title="Tools">
                <img src="~@/assets/textures/enchanted_book.png" alt="tools" />
              </button>
            </n-dropdown>

            <button title="Beautify code" @click="execBeautifyCssAction">
              <img src="~@/assets/textures/iron_hoe.png" alt="beautify" />
            </button>

            <button title="Copy code" @click="copyStyle">
              <img src="~@/assets/textures/map.png" alt="copy" />
            </button>

            <button title="Close" @click="mVisible = false">
              <img src="~@/assets/textures/barrier.png" alt="close" />
            </button>
          </div>
        </div>

        <div class="page-craft-window-body">
          <transition name="fade">
            <div v-show="errorTip" class="code-error-tip font-code" @click="handleErrorTipClick">
              {{ errorTip?.message }}
            </div>
          </transition>

          <div ref="editorContainerRef" class="code-editor-placeholder" />
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.style-editor-dialog {
  position: fixed;
  z-index: 998;
  top: 30%;
  left: 30%;
  .page-craft-title-bar {
    user-select: none;

    img {
      pointer-events: none;
    }
  }

  :deep([role='tabpanel']) {
    margin-bottom: 0;
    padding: 0px;
    display: flex;
  }

  .page-craft-window-body {
    position: relative;

    .code-editor-placeholder {
      min-width: 400px;
      min-height: 200px;
      width: 100%;
      height: 100%;
      resize: both;
      overflow: hidden;
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
}
</style>
