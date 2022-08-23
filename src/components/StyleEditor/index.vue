<script lang="ts">
import {defineComponent} from 'vue'
import {setDraggableMouse} from '@/utils/draggable-mouse'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/sass/sass' // 代码高亮
import 'codemirror/theme/darcula.css'
import {debounce, throttle} from 'throttle-debounce'
import {LS_KEYS} from "@/enum";
import {createOrFindStyleNode} from "@/utils/dom";

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
    const textareaRef = ref()
    const codeEditor = ref<any>()

    const clearDraggable = ref<any>(null)
    const styleEl = ref<HTMLElement | null>(null)
    onMounted(() => {
      clearDraggable.value = setDraggableMouse({
        dragHandleEl: titleBarRef.value,
        dragTargetEl: dialogRef.value,
        allowOut: true,
      })

      const editor = CodeMirror(textareaRef.value, {
        // mode: 'application/json',
        theme: 'darcula', // 主题样式
        // lint: true,
        placeholder:
          'Write Sass code here.\nThe code gets applied immediately.\n\nExample:' +
          '\nimg {\n    opacity: 0.5;\n}',
        tabSize: 2,
        smartIndent: true, // 是否智能缩进
        styleActiveLine: true, // 当前行高亮
        lineNumbers: true, // 显示行号
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        lineWrapping: true, // 自动换行
        matchBrackets: true, // 括号匹配显示
        autoCloseBrackets: true, // 输入和退格时成对
        foldGutter: true,
      })
      editor.on('change', () => {
        handleEditorChangeDebounced(editor)
      })

      new ResizeObserver(() => {
        handleResizeDebounced()
      }).observe(textareaRef.value)
      codeEditor.value = editor

      styleEl.value = createOrFindStyleNode(LS_KEYS.MAIN_STYLE)
      const style = localStorage.getItem(LS_KEYS.MAIN_STYLE) || ''
      handleUpdateStyle(style)
      editor.setValue(style)
    })

    onBeforeUnmount(() => {
      if (clearDraggable.value) {
        clearDraggable.value()
      }
    })

    const handleResizeDebounced = throttle(100, false, () => {
      const width = textareaRef.value.offsetWidth
      const height = textareaRef.value.offsetHeight

      codeEditor.value.setSize(width, height)
    })

    const handleEditorChangeDebounced = debounce(500, false, (editor) => {
      handleUpdateStyle(editor.getValue())
    })

    const handleUpdateStyle = (value) => {
      if (styleEl.value) {
        styleEl.value.innerHTML = value
        localStorage.setItem(LS_KEYS.MAIN_STYLE, value)
      }
    }

    return {
      dialogRef,
      titleBarRef,
      mVisible,
      handleUpdateStyle,
      textareaRef,
    }
  },
})
</script>

<template>
  <div v-show="mVisible" class="style-editor-dialog win7" ref="dialogRef">
    <div class="window window-color is-bright glass">
      <div class="title-bar" ref="titleBarRef">
        <div class="title-bar-text">Style Editor</div>
        <div class="title-bar-controls">
          <!--          <button aria-label="Minimize"></button>-->
          <!--          <button aria-label="Maximize"></button>-->
          <button title="Copy code">
            <img src="~@/assets/textures/map.png" alt="copy" />
          </button>
          <button title="Format code">
            <img src="~@/assets/textures/redstone.png" alt="format" />
          </button>
          <button title="Select an element in the page to generate its CSS Selector">
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

        <div class="code-editor-placeholder" ref="textareaRef"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.style-editor-dialog {
  position: fixed;
  z-index: 998;
  top: 30%;
  left: 30%;
  .title-bar {
    user-select: none;
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

    .code-editor-placeholder {
      min-width: 300px;
      min-height: 300px;
      resize: both;
      overflow: auto !important;
    }
  }
}
</style>
