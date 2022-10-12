<script lang="ts">
import {defineComponent} from 'vue'
import {setDraggableMouse} from '@/utils/draggable-mouse'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/sass/sass' // 代码高亮
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/idea.css'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint'
// import 'codemirror/addon/lint/css-lint'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/selection/active-line'
import emmet from '@emmetio/codemirror-plugin'
import {debounce, throttle} from 'throttle-debounce'
import {LsKeys} from '@/enum'
import {createOrFindStyleNode} from '@/utils/dom'
import 'codemirror-colorpicker/dist/codemirror-colorpicker.css'
import 'codemirror-colorpicker'
import {sassToCSS, suggestElementClass} from '@/utils/css'
import {copyToClipboard} from '@/utils'
import {useCraftStore} from '@/store/craft'
import {ActionBlockItems, BlockItem} from '@/enum/block'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {
  cssHelperClassList,
  cssKeyFramesList,
  cssSnippetList,
  sassVariablesList,
  vue2TransitionsList,
} from '@/enum/styles'
import {formatCss} from '@/utils/formater'
import {useIsDarkMode} from '@/hooks/use-global-theme'
import {useCompStorage} from '@/hooks/use-component-storage'

// Register extension on CodeMirror object
emmet(CodeMirror)

type StyleEditorOptions = {
  wTop: string
  wLeft: string
  wWidth: string
  wHeight: string
}

// do not use vue ref for CodeMirror: https://github.com/codemirror/codemirror5/issues/6805#issuecomment-955151134
let codeMirrorInstance: any = null

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
    const textareaRef = ref()
    const craftStore = useCraftStore()

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
        codeMirrorInstance.refresh()
      }
    })
    const {isDarkMode} = useIsDarkMode()

    const getThemeName = () => {
      return isDarkMode.value ? 'dracula' : 'idea'
    }
    watch(isDarkMode, (val) => {
      codeMirrorInstance.setOption('theme', getThemeName())
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
      codeMirrorInstance.setValue(style)
      // call instantly
      handleUpdateStyle(style, false)
    }

    onMounted(() => {
      clearDraggable.value = setDraggableMouse({
        dragHandleEl: titleBarRef.value,
        dragTargetEl: dialogRef.value,
        allowOut: true,
        // opacify: 0.5,
        preventNode: titleBarButtonsRef.value,
        onMove(data) {
          handleMoveDebounced(data)
        },
      })

      styleEl.value = createOrFindStyleNode(LsKeys.MAIN_STYLE)
      const style = loadCurCompStyle()

      codeMirrorInstance = CodeMirror(textareaRef.value, {
        value: style,
        mode: 'text/x-scss',
        placeholder: 'Write your Sass(scss) code here...',
        lint: true,
        theme: getThemeName(), // 主题样式
        keyMap: 'sublime',
        undoDepth: 500,
        smartIndent: true, // 是否智能缩进
        indentUnit: 2,
        lineNumbers: true, // 显示行号
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        lineWrapping: true, // 自动换行
        matchBrackets: true, // 括号匹配显示
        autoCloseBrackets: true, // 输入和退格时成对
        foldGutter: true,
        showCursorWhenSelecting: true,
        styleActiveLine: {
          nonEmpty: true,
        },
        colorpicker: true,
        extraKeys: {
          Tab: (cm: any) => {
            if (cm.doc.somethingSelected()) {
              return CodeMirror.Pass
            }
            var emmetExpanded = cm.execCommand('emmetExpandAbbreviation')
            if (emmetExpanded === CodeMirror.Pass) {
              // If it didn't expand, then "emmetExpanded === CodeMirror.Pass function"
              cm.replaceSelection('  ', 'end')
            }
          },
          // when ctrl+k  keys pressed, color picker is able to open.
          // @ts-ignore
          'Ctrl-K': (cm, event) => {
            return cm.state.colorpicker.popup_color_picker()
          },
        },
      })
      codeMirrorInstance.on('change', () => {
        handleEditorChangeDebounced(codeMirrorInstance)
      })

      new ResizeObserver(() => {
        handleResizeDebounced()
      }).observe(textareaRef.value)

      handleUpdateStyle(style, false)

      initDialogStyle()

      globalEventBus.on(GlobalEvents.ON_NODE_SELECT, handleNodeSelect)
      globalEventBus.on(GlobalEvents.IMPORT_SUCCESS, reloadStyle)
    })

    onBeforeUnmount(() => {
      if (clearDraggable.value) {
        clearDraggable.value()
      }
      globalEventBus.off(GlobalEvents.ON_NODE_SELECT, handleNodeSelect)
      globalEventBus.off(GlobalEvents.IMPORT_SUCCESS, reloadStyle)
    })

    const handleMoveDebounced = throttle(500, false, ({top, left}) => {
      styleEditorOptions.wTop = top
      styleEditorOptions.wLeft = left
    })

    const handleResizeDebounced = throttle(100, false, () => {
      if (!mVisible.value || !textareaRef.value) {
        return
      }
      const width = textareaRef.value.offsetWidth
      const height = textareaRef.value.offsetHeight

      codeMirrorInstance.setSize(width, height)

      styleEditorOptions.wWidth = width + 'px'
      styleEditorOptions.wHeight = height + 'px'
    })

    const handleEditorChangeDebounced = debounce(500, false, (editor) => {
      handleUpdateStyle(editor.getValue())
    })

    const errorTip = ref()
    const handleErrorTipClick = () => {
      console.warn(errorTip.value.message, {...errorTip.value})
      errorTip.value = null
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

      textareaRef.value.style.width = styleEditorOptions.wWidth
      textareaRef.value.style.height = styleEditorOptions.wHeight
    }

    const message = useMessage()
    const execBeautifyCssAction = async () => {
      const editor = codeMirrorInstance
      const textValue = editor.getValue()
      if (!textValue.trim()) {
        message.info('Please type some code to be beautified')
      } else {
        const beautifiedCSS = formatCss(textValue)
        if (textValue.trim() !== beautifiedCSS.trim()) {
          await editor.setValue(beautifiedCSS)
          await handleUpdateStyle(beautifiedCSS)
          // await editor.reInitTextComponent({pleaseIgnoreCursorActivity: true})

          message.success('Your code has been beautified :-)')
        } else {
          message.success('Your code already looks beautiful :-)')
        }
      }
      editor.focus()
    }

    const copyStyle = () => {
      copyToClipboard(codeMirrorInstance.getValue())
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
      const doc = codeMirrorInstance.getDoc()
      const cursor = doc.getCursor()
      doc.replaceRange(code, cursor)
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
      textareaRef,
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
      class="style-editor-dialog win7"
      :class="{_dark: isDarkMode}"
      ref="dialogRef"
    >
      <div class="window _window-color glass">
        <div ref="titleBarRef" class="title-bar">
          <div
            class="title-bar-text font-minecraft"
            style="display: flex; align-items: center; height: 14px"
          >
            <img src="~@/assets/textures/redstone.png" alt="tools" />
            &nbsp;Style Editor
          </div>
          <div ref="titleBarButtonsRef" class="title-bar-controls">
            <!--          <button aria-label="Minimize"></button>-->
            <!--          <button aria-label="Maximize"></button>-->
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
              class="font-code"
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

            <button title="Close" aria-label="Close" @click="mVisible = false" />
          </div>
        </div>

        <div class="_window-body">
          <!--        <section class="tabs">
          <menu role="tablist">
            <button role="tab" aria-selected="false">CSS</button>
            <button role="tab" aria-selected="true">SASS</button>
          </menu>
          <article role="tabpanel">
            <textarea
              rows="10"
              cols="50"
              style="font-family: monospace"
              @change="handleUpdateStyle"
            ></textarea>
          </article>
          <article role="tabpanel" v-show="false">Tab B is active</article>
        </section>-->
          <transition name="fade">
            <div v-show="errorTip" class="code-error-tip font-code" @click="handleErrorTipClick">
              {{ errorTip?.message }}
            </div>
          </transition>

          <div ref="textareaRef" class="code-editor-placeholder" />
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
  .title-bar {
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

  ._window-body {
    position: relative;

    .code-editor-placeholder {
      min-width: 300px;
      min-height: 300px;
      resize: both;
      overflow: auto !important;
    }

    .code-error-tip {
      position: absolute;
      left: 0;
      top: 0;
      font-size: 12px;
      max-width: 300px;
      transform-origin: top right;
      background-color: rgba(0, 0, 0, 0.7);
      color: #ff8989;
      z-index: 1;
      padding: 5px 5px 5px 10px;
    }
  }
}
</style>
