<script lang="ts">
import {useCraftStore} from '@/store/craft'
import {copyToClipboard} from '@/utils'
import ToolBar from '@/components/ToolBar/index.vue'
import StyleEditor from '@/components/StyleEditor/index.vue'
import FileChooser from '@/components/FileChooser.vue'
import {throttle} from 'throttle-debounce'
import $ from 'jquery'
import {ActionType, BlockType, ComponentBlockItem} from '@/enum/block'
import {LS_KEYS, TOOL_CLASSES} from '@/enum'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {handleExportJson, handleExportVue} from '@/utils/exporter'
import {formatCss, formatHtml} from '@/utils/formater'

const removeMouseOverDomElementEffect = () => {
  const $el = $(TOOL_CLASSES.DOT_CLASS_MOUSE_OVER)
  if ($el.length) {
    $el.removeClass(TOOL_CLASSES.CLASS_MOUSE_OVER)
  }
  const $el2 = $(TOOL_CLASSES.DOT_CLASS_MOUSE_OVER_PARENT)
  if ($el2.length) {
    $el2.removeClass(TOOL_CLASSES.CLASS_MOUSE_OVER_PARENT)
  }
  $('*[class=""]').removeAttr('class')
}

type IndicatorOptions = {
  enableDevHelpClass: boolean
  enableExpand: boolean
  enableSelection: boolean
  fullWidth: boolean
  bgTransparent: boolean
  centeredElements: boolean
  showStyleEditor: boolean
  contentEditable: boolean
}

export default defineComponent({
  name: 'MainCanvas',
  components: {
    ToolBar,
    StyleEditor,
    FileChooser,
  },
  setup() {
    const mainCanvasRef = ref()
    const fileChooserRef = ref()
    const craftStore = useCraftStore()
    const message = useMessage()
    const indicatorOptions = reactive<IndicatorOptions>(
      JSON.parse(localStorage.getItem(LS_KEYS.INDICATOR_OPTIONS) || 'null') || {
        enableDevHelpClass: true,
        enableExpand: false,
        enableSelection: true,
        fullWidth: false,
        bgTransparent: false,
        centeredElements: false,
        showStyleEditor: false,
        contentEditable: false,
      }
    )
    watch(
      indicatorOptions,
      () => {
        localStorage.setItem(LS_KEYS.INDICATOR_OPTIONS, JSON.stringify({...indicatorOptions}))
      },
      {deep: true}
    )
    const isShowImportDialog = ref(false)

    onMounted(() => {
      const html = localStorage.getItem(LS_KEYS.MAIN_HTML)
      if (html) {
        setMainCanvasHtml(html)
      }
      mainCanvasRef.value.addEventListener('mousemove', handleMouseMove)
    })
    onBeforeUnmount(() => {
      mainCanvasRef.value.removeEventListener('mousemove', handleMouseMove)
    })

    const saveData = () => {
      removeMouseOverDomElementEffect()
      const innerHTML = mainCanvasRef.value.innerHTML
      localStorage.setItem(LS_KEYS.MAIN_HTML, innerHTML)
    }

    const currentHoveredEl = ref<any>(null)
    const handleMousemoveDebounced = throttle(50, false, (event: Event) => {
      const currentNode: any = event.target
      if (currentHoveredEl.value === currentNode) {
        return
      }
      currentHoveredEl.value = currentNode
      // console.log('event', event.target)
      removeMouseOverDomElementEffect()
      if (!currentNode) {
        return
      }
      if (currentNode.classList.contains(TOOL_CLASSES.CLASS_MAIN_CANVAS_ROOT)) {
        // do nothing
      } else {
        const $parent = $(currentNode).parent()
        if ($parent) {
          $parent.addClass(TOOL_CLASSES.CLASS_MOUSE_OVER_PARENT)
        }
      }
      $(currentNode).addClass(TOOL_CLASSES.CLASS_MOUSE_OVER)
    })

    const hoveredElDisplay = computed(() => {
      if (currentHoveredEl.value) {
        let str = `${currentHoveredEl.value.localName}`
        let className = currentHoveredEl.value.className || ''
        className = className.replace(TOOL_CLASSES.CLASS_MOUSE_OVER, '').trim()
        if (className) {
          str += `  ( ${className} )`
        }
        return str
      }
      return ''
    })

    const isSelectMode = computed(() => {
      return craftStore.isSelectMode || indicatorOptions.enableSelection
    })

    watch(isSelectMode, (val) => {
      if (!val) {
        removeMouseOverDomElementEffect()
      }
    })
    const handleMouseMove = (event: Event) => {
      if (!isSelectMode.value) {
        return
      }
      handleMousemoveDebounced(event)
    }

    const handleBlockClick = (event: Event) => {
      // console.log('[craftStore]', craftStore, currentBlock.value)
      const {currentBlock} = craftStore

      // console.log('[event]', event)
      let targetEl
      if (event.target) {
        targetEl = event.target
      } else {
        targetEl = mainCanvasRef.value
      }

      // console.log('[targetEl]', targetEl)

      if (currentBlock.blockType === BlockType.ACTIONS) {
        if (currentBlock.actionType === ActionType.DELETE) {
          if (targetEl === mainCanvasRef.value) {
            return
          }
          targetEl.parentNode.removeChild(targetEl)
        } else if (currentBlock.actionType === ActionType.SELECTION) {
          globalEventBus.emit(GlobalEvents.ON_NODE_SELECT, targetEl)
          return
        }
      } else if (currentBlock.blockType === BlockType.HTML_ELEMENT) {
        const tag = currentBlock.data.tag
        const addEl: any = document.createElement(tag)
        if (tag === 'img') {
          addEl.src = craftStore.innerText || ''
        } else if (tag === 'input') {
          addEl.value = craftStore.innerText || ''
        } else if (tag !== 'br') {
          addEl.innerHTML = craftStore.innerText || ''
        }
        if (craftStore.className) {
          addEl.className = craftStore.className
        }
        targetEl.appendChild(addEl)
        // console.log('[addEl]', addEl)
      }

      saveData()
    }

    const copyInnerHtml = () => {
      removeMouseOverDomElementEffect()
      copyToClipboard(formatHtml(mainCanvasRef.value.innerHTML))
      message.success('Copy Success!')

      saveData()
    }

    const handleImportJson = (data) => {
      const {html = '', style = ''} = data
      handleImportHtml(html)
      globalEventBus.emit(GlobalEvents.ON_IMPORT_STYLE, style)
      message.success('Import Success!')
    }

    const handleImportJsonSelected = (file) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          handleImportJson(JSON.parse(reader.result as string))
        } catch (error: any) {
          console.error(error)
          message.error('Import Failed! ' + error.message)
        }
      }
      reader.readAsText(file)
    }

    const getEntityData = async (): Promise<ComponentBlockItem> => {
      const html = mainCanvasRef.value.innerHTML || ''
      const style = localStorage.getItem(LS_KEYS.MAIN_STYLE) || ''

      return new ComponentBlockItem({
        html: formatHtml(html),
        style: formatCss(style),
      })
    }

    const pasteHtmlText = ref('')
    const setMainCanvasHtml = (html?: string) => {
      mainCanvasRef.value.innerHTML = html
    }

    const handleImportHtml = (html: string) => {
      setMainCanvasHtml(html)

      saveData()
    }

    const exportMenuOptions = [
      {
        label: '📥 Import JSON...',
        props: {
          onClick: async () => {
            fileChooserRef.value.chooseFile()
          },
        },
      },
      {
        label: '📃 Export JSON',
        props: {
          onClick: async () => {
            handleExportJson(await getEntityData())
          },
        },
      },
      {
        label: '📤 Export',
        children: [
          {
            label: '💚 Export Vue 2 SFC',
            props: {
              onClick: async () => {
                handleExportVue(await getEntityData())
              },
            },
          },
          {
            label: '💚 Export Vue 3 SFC',
            props: {
              onClick: async () => {
                handleExportVue(await getEntityData(), 3)
              },
            },
          },
        ],
      },
      {
        type: 'divider',
        label: 'd0',
      },
      {
        label: '📄 Paste HTML...',
        props: {
          onClick: async () => {
            isShowImportDialog.value = true
          },
        },
      },
      {
        label: '📄 Copy HTML',
        props: {
          onClick: async () => {
            copyInnerHtml()
          },
        },
      },
      {
        type: 'divider',
        label: 'd1',
      },
      {
        label: '❌ Clear All',
        props: {
          onClick: async () => {
            window.$dialog.warning({
              title: 'Confirm',
              content: `Confirm clear all code? this can not be undo!`,
              positiveText: 'OK',
              negativeText: 'Cancel',
              onPositiveClick: () => {
                handleImportHtml('')
                globalEventBus.emit(GlobalEvents.ON_IMPORT_STYLE, '')
                message.success('Clear!')
              },
              onNegativeClick: () => {},
            })
          },
        },
      },
    ]

    const toggleList = [
      {
        flag: 'enableDevHelpClass',
        title: 'Outline',
        desc: 'Add 1px outline per element for better distinction',
      },
      {flag: 'enableExpand', title: 'Padding', desc: 'Pad each element with 10px for selection'},
      {
        flag: 'contentEditable',
        title: 'Content Editable',
        desc: 'Enable HTML contenteditable feature!',
      },
      {flag: 'enableSelection', title: 'Selection', desc: 'Add cursor selection effect'},
      {flag: 'centeredElements', title: 'Centered', desc: ''},
      {flag: 'bgTransparent', title: 'Transparent BG', desc: ''},
      {flag: 'fullWidth', title: 'Full Width', desc: ''},
    ]

    const MAX_WAIT_TIME = 0.5 * 1000
    const waitingTime = ref(0)
    const waitTimer = ref<any>(null)
    const cursorX = ref(0)
    const cursorY = ref(0)
    const clearWait = () => {
      clearInterval(waitTimer.value)
      waitingTime.value = 0
      cursorX.value = 0
      cursorY.value = 0
    }
    const waitingProgress = computed(() => {
      return ((waitingTime.value / MAX_WAIT_TIME) * 100).toFixed(2)
    })
    const handleMouseDown = (event: MouseEvent) => {
      if (craftStore.currentBlock.actionType === ActionType.DELETE) {
        // 仿 Minecraft 挖掘等待时间效果
        console.log('[handleMouseDown]', event.x, event.y)
        clearWait()
        waitTimer.value = setInterval(() => {
          if (waitingTime.value > MAX_WAIT_TIME) {
            clearWait()
            // console.log('fire!!')
            handleBlockClick(event)
            return
          }
          waitingTime.value += 50
        }, 50)
        cursorX.value = event.x - 10
        cursorY.value = event.y + 10
        event.preventDefault()
        return
      }
      handleBlockClick(event)
    }
    const handleMouseUp = (event: MouseEvent) => {
      // console.log('[handleMouseUp]', event)
      if (craftStore.currentBlock.actionType === ActionType.DELETE) {
        return
      }
      clearWait()
    }

    const mainCanvasClass = computed(() => {
      const currentBlock = craftStore.currentBlock
      return {
        'page-craft-mc--dev': indicatorOptions.enableDevHelpClass,
        'page-craft-mc--cursor-insert': currentBlock.blockType !== BlockType.ACTIONS,
        'page-craft-mc--cursor-pickaxe': currentBlock.actionType === ActionType.DELETE,
        'page-craft-mc--cursor-arrow': currentBlock.actionType === ActionType.SELECTION,
        'page-craft-mc--expand': indicatorOptions.enableExpand,
        'page-craft-mc--full-width': indicatorOptions.fullWidth,
        'page-craft-mc--transparent': indicatorOptions.bgTransparent,
        'page-craft-mc--centered': indicatorOptions.centeredElements,
      }
    })

    return {
      craftStore,
      mainCanvasRef,
      fileChooserRef,
      isShowImportDialog,
      setMainCanvasHtml,
      pasteHtmlText,
      handleBlockClick,
      indicatorOptions,
      hoveredElDisplay,
      handleImportHtml,
      handleImportJsonSelected,
      BlockType: ActionType,
      toggleList,
      exportMenuOptions,
      handleMouseDown,
      handleMouseUp,
      waitingProgress,
      cursorX,
      cursorY,
      mainCanvasClass,
    }
  },
})
</script>

<template>
  <div class="page-craft-mc-wrap">
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

    <FileChooser
      ref="fileChooserRef"
      accept="application/JSON"
      @selected="handleImportJsonSelected"
    />

    <div class="page-craft-mc-indicator page-craft-aero-panel">
      <n-space align="center">
        <n-space align="center" size="small">
          <n-dropdown
            :options="exportMenuOptions"
            key-field="label"
            placement="bottom-start"
            trigger="hover"
          >
            <n-button size="tiny">Import & Export</n-button>
          </n-dropdown>

          <div v-for="item in toggleList" :key="item.flag" class="toggle-list">
            <n-checkbox
              size="small"
              :label="item.title"
              v-model:checked="indicatorOptions[item.flag]"
              :title="item.desc"
            />
          </div>
        </n-space>
        <n-button
          size="tiny"
          style="min-width: 120px"
          @click="indicatorOptions.showStyleEditor = !indicatorOptions.showStyleEditor"
        >
          {{ indicatorOptions.showStyleEditor ? 'Hide' : 'Show' }} StyleEditor
        </n-button>
        <div v-if="false" class="indicator-text">
          {{ hoveredElDisplay }}
        </div>
      </n-space>
    </div>
    <div
      ref="mainCanvasRef"
      :class="mainCanvasClass"
      class="page-craft-mc"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      :contenteditable="indicatorOptions.contentEditable"
    ></div>

    <transition name="fade">
      <div
        v-if="cursorX"
        class="action-progress win7"
        :style="{top: cursorY + 'px', left: cursorX + 'px'}"
      >
        <div role="progressbar" class="animate error">
          <div :style="`width: ${waitingProgress}%`"></div>
        </div>
      </div>
    </transition>

    <ToolBar />
    <StyleEditor v-model:visible="indicatorOptions.showStyleEditor" />
  </div>
</template>

<style lang="scss">
.page-craft-mc-wrap {
  width: 100%;
  height: 100%;
  overflow: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;

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

    .indicator-text {
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 12px;
      font-family: monospace;
      max-width: 300px;
      transform: scale(0.8);
      transform-origin: top right;
    }

    text-shadow: 0 0 10px white;
  }

  .action-progress {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 999;
    width: 50px;
    pointer-events: none;
  }
}

.page-craft-mc {
  flex: 1;
  background-color: white;
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  //cursor: url('@/assets/textures/iron_sword--cursor.png') 0 0, default;

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
    background-color: transparent;
  }
  &--centered {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.page-craft-mouse-over-dom-element,
  .page-craft-mouse-over-dom-element {
    outline: 1px solid #f7ff00 !important;
    border-color: #0066ff !important;
    background-color: rgba(144, 205, 238, 0.7) !important;
    //color: #111 !important;
    opacity: 0.85 !important;
    fill: #f7ff00 !important; /* Helps in highlighting SVG elements */
  }
}
</style>
