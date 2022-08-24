<script lang="ts">
import {defineComponent} from 'vue'
import {setDraggableMouse} from '@/utils/draggable-mouse'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/sass/sass' // 代码高亮
import 'codemirror/theme/dracula.css'
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
import {LS_KEYS} from '@/enum'
import {createOrFindStyleNode} from '@/utils/dom'
import 'codemirror-colorpicker/dist/codemirror-colorpicker.css'
import 'codemirror-colorpicker'
import {beautifyCSS, sassToCSS} from '@/utils/css'
import {copyToClipboard, isCharacterKeyPress} from '@/utils'
import {useCraftStore} from '@/store/craft'
import {BlockItem, blockSelection} from '@/enum/block'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'

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
      JSON.parse(localStorage.getItem(LS_KEYS.STYLE_EDITOR_OPTIONS) || 'null') || {
        wTop: '100px',
        wLeft: '100px',
        wWidth: '300px',
        wHeight: '300px',
      }
    )
    watch(
      styleEditorOptions,
      () => {
        localStorage.setItem(LS_KEYS.STYLE_EDITOR_OPTIONS, JSON.stringify({...styleEditorOptions}))
      },
      {deep: true}
    )

    watch(mVisible, () => {
      if (mVisible) {
        codeMirrorInstance.refresh()
      }
    })

    onMounted(() => {
      clearDraggable.value = setDraggableMouse({
        dragHandleEl: titleBarRef.value,
        dragTargetEl: dialogRef.value,
        allowOut: true,
        preventNode: titleBarButtonsRef.value,
        onMove(data) {
          handleMoveDebounced(data)
        },
      })

      styleEl.value = createOrFindStyleNode(LS_KEYS.MAIN_STYLE)
      const style = localStorage.getItem(LS_KEYS.MAIN_STYLE) || ''

      codeMirrorInstance = CodeMirror(textareaRef.value, {
        value: style,
        mode: 'text/x-scss',
        placeholder: 'Write your SASS(SCSS) code here...',
        lint: true,
        theme: 'dracula', // 主题样式
        keyMap: 'sublime',
        undoDepth: 1000,
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

      // codeMirrorInstance.on('keypress', (cm, evt) => {
      //   if (isCharacterKeyPress(evt)) {
      //     if (CodeMirror.showHint) {
      //       CodeMirror.showHint(cm)
      //     }
      //   }
      // })

      new ResizeObserver(() => {
        handleResizeDebounced()
      }).observe(textareaRef.value)

      handleUpdateStyle(style)

      initDialogStyle()

      globalEventBus.on(GlobalEvents.ON_NODE_SELECT, handleNodeSelect)
    })

    onBeforeUnmount(() => {
      if (clearDraggable.value) {
        clearDraggable.value()
      }
      globalEventBus.off(GlobalEvents.ON_NODE_SELECT, handleNodeSelect)
    })

    const handleMoveDebounced = throttle(500, false, ({top, left}) => {
      styleEditorOptions.wTop = top
      styleEditorOptions.wLeft = left
    })

    const handleResizeDebounced = throttle(100, false, () => {
      if (!mVisible.value) {
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

    const errorTip = ref('')
    const handleUpdateStyle = async (value) => {
      if (styleEl.value) {
        try {
          styleEl.value.innerHTML = await sassToCSS(value)
          localStorage.setItem(LS_KEYS.MAIN_STYLE, value)

          errorTip.value = ''
        } catch (error: any) {
          console.error(error)
          // message.error(error.message)
          errorTip.value = error.message
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
        const beautifiedCSS = await beautifyCSS(textValue)
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
      craftStore.currentBlock = blockSelection
    }
    const exitSelectMode = () => {
      craftStore.currentBlock = backupBlock.value
      craftStore.isSelectMode = false
      backupBlock.value = null
    }
    const handleNodeSelect = (el) => {
      console.log('[handleNodeSelect]', el)
      exitSelectMode()
    }

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
    }
  },
})
</script>

<template>
  <transition name="zoom">
    <div v-show="mVisible" class="style-editor-dialog win7" ref="dialogRef">
      <div class="window window-color is-bright glass">
        <div class="title-bar" ref="titleBarRef">
          <div class="title-bar-text">Style Editor</div>
          <div class="title-bar-controls" ref="titleBarButtonsRef">
            <!--          <button aria-label="Minimize"></button>-->
            <!--          <button aria-label="Maximize"></button>-->

            <button @click="copyStyle" title="Copy code">
              <img src="~@/assets/textures/map.png" alt="copy" />
            </button>

            <button @click="execBeautifyCssAction" title="Format code">
              <img src="~@/assets/textures/redstone.png" alt="format" />
            </button>

            <button
              @click="enterSelectMode"
              title="Select an element in the page to generate its CSS Selector"
              :class="{active: craftStore.isSelectMode}"
            >
              <img
                src="~@/assets/textures/arrow.png"
                alt="select"
                style="transform: rotateY(180deg)"
              />
            </button>

            <button title="Close" aria-label="Close" @click="mVisible = false"></button>
          </div>
        </div>

        <div class="window-body-1">
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
            <div v-show="errorTip" class="code-error-tip">{{ errorTip }}</div>
          </transition>

          <div class="code-editor-placeholder" ref="textareaRef"></div>
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
  .window-color::before,
  .window-color > .title-bar {
    background-color: #8dbc5d;
  }

  .window-body-1 {
    margin: 0 6px 6px;
    position: relative;

    .code-editor-placeholder {
      min-width: 300px;
      min-height: 300px;
      resize: both;
      overflow: auto !important;
    }

    .code-error-tip {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 12px;
      font-family: monospace;
      max-width: 300px;
      transform-origin: top right;
      background-color: rgba(0, 0, 0, 0.5);
      color: #ff6a6a;
      z-index: 1;
      padding: 5px 5px 5px 10px;
    }
  }
}
</style>
