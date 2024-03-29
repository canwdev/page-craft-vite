<script setup lang="ts">
import {sassToCSS, suggestElementClass} from './utils/css'
import {formatCss} from './utils/formater'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {
  Copy20Regular,
  CursorClick20Regular,
  CursorHover20Regular,
  PaintBrush20Regular,
  AppsAddIn20Regular,
  Wand20Regular,
} from '@vicons/fluent'
import {useI18n} from 'vue-i18n'
import TabLayout from '@/components/CommonUI/TabLayout.vue'
import monaco from '@/components/CommonUI/VueMonaco/monaco-helper'
import VueMonaco from '@/components/CommonUI/VueMonaco/index.vue'
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {useEventListener, useStorage, useVModel} from '@vueuse/core'
import {useRemoteOptions} from '@/components/CommonUI/QuickOptions/utils/use-remote-options'
import {useGlobalStyle} from './hooks/use-global-style'
import {StyleEditorKeys, StyleTabType} from './enum'
import ElementByPoint from './components/ElementByPoint.vue'
import {useSharedCssStore} from './utils/css-store'

interface Props {
  // 窗口是否可见
  visible: boolean
  // 是否处于选择元素状态
  selecting?: boolean
  // 如果传入此类名，则只在这个类以下进行选择
  selectingParentClass?: string
  // 是否启用variable和current编辑，用于组件样式
  // 传入false以只启用全局样式编辑
  showTabs?: boolean
  // current scss 代码
  styleCode?: string
}
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  selecting: false,
  selectingParentClass: undefined,
  showTabs: false,
  styleCode: '',
})
const {showTabs} = toRefs(props)
const emit = defineEmits([
  'update:visible',
  'update:selecting',
  'onFormat',
  'onInsertCode',
  'update:styleCode',
])

const {t: $t} = useI18n()
const mVisible = useVModel(props, 'visible', emit)

const cssStore = useSharedCssStore()

const {globalStyleCode} = useGlobalStyle()
const variableStyleCode = useStorage(StyleEditorKeys.VARIABLES_STYLE, '')
const currentStyleCode = useVModel(props, 'styleCode', emit, {passive: true})

watch(currentStyleCode, () => {
  handleUpdateStyle()
})

const vueMonacoRef = ref()

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
const handleUpdateStyle = async () => {
  try {
    // combine variables and styles
    const value = variableStyleCode.value + '\n' + currentStyleCode.value
    if (_prevStyleValue.value === value) {
      // console.log('prevent update')
      return
    }
    _prevStyleValue.value = value
    const result = value ? await sassToCSS(value) : ''

    cssStore.currentCSS = result

    errorTip.value = ''
  } catch (error: any) {
    // console.error(error)
    errorTip.value = error
  }
}
watch(
  variableStyleCode,
  () => {
    handleUpdateStyle()
  },
  {immediate: true}
)

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
  emit('onFormat')
}

const copyStyle = () => {
  const eIns = vueMonacoRef.value.getInstance()
  const textValue = eIns.getValue()
  window.$qlUtils.copy(textValue)
}

const isSelecting = useVModel(props, 'selecting', emit, {passive: true})

const handleSelectEl = (el) => {
  if (!isSelecting.value) {
    return
  }
  handleAddStyle({el})
  isSelecting.value = false
}

const handleAddStyle = ({el, code = '', isAppend = false}) => {
  nextTick(() => {
    if (el) {
      // el 是可选参数，如果传入了el，就生成类名选择器
      let className = suggestElementClass(el)
      if (!className) {
        return
      }
      code = `\n${className} {\n\n}\n`
    }
    if (!code) {
      return
    }
    // console.log('[handleAddStyle]', className)
    insertStyleCode(code, isAppend)
  })
}

const insertStyleCode = (code, isAppend = false) => {
  emit('onInsertCode')
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

// scss代码片段自动补全缓存
window.$monacoScssSnippets = []
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
    if (i.code || i.snippet) {
      if (i.snippet) {
        // 只把snippet放入自动补全缓存，减少性能损耗
        window.$monacoScssSnippets.push({
          label: i.label,
          code: i.snippet,
        })
      }

      r.props!.onClick = async () => {
        insertStyleCode(i.snippet || i.code)
      }
      r.props!.onContextmenu = async () => {
        window.$qlUtils.copy(i.snippet || i.code)
      }
    }
    return r
  },
})

// 创建【全局、变量】编辑器的变量字段补全
const updateEditorAutoComplete = () => {
  const style = globalStyleCode.value + variableStyleCode.value

  const set = new Set()

  // 使用正则表达式匹配类名和 SCSS 变量名
  let classRegex = /\.(\w|-)+/g
  let variableRegex = /\$[\w-]+/g
  let match

  while ((match = classRegex.exec(style)) !== null) {
    set.add(match[0])
  }

  while ((match = variableRegex.exec(style)) !== null) {
    set.add(match[0])
  }

  window.$monacoScssVariables = Array.from(set)
}

const tabList = ref([
  {label: $t('common.global_style'), value: StyleTabType.GLOBAL},
  {label: $t('common.variables'), value: StyleTabType.VARIABLES},
  {label: $t('actions.current'), value: StyleTabType.CURRENT},
])
const styleEditorTab = useStorage(StyleEditorKeys.CURRENT_TAB, StyleTabType.CURRENT)
watch(
  showTabs,
  (val) => {
    if (!val) {
      styleEditorTab.value = StyleTabType.GLOBAL
    }
  },
  {immediate: true}
)
watch(
  () => styleEditorTab,
  (val) => {
    updateEditorAutoComplete()
  }
)
onMounted(() => {
  updateEditorAutoComplete()
})

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
    isSelecting.value = !isSelecting.value
  } else if (event.altKey && key === '`') {
    isShowQuickOptions.value = !isShowQuickOptions.value
  }
})

defineExpose({
  handleAddStyle,
})
</script>

<template>
  <ElementByPoint
    v-if="isSelecting"
    @select="handleSelectEl"
    :parent-class="selectingParentClass"
  />
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
        :class="{active: isSelecting}"
        @click.stop.prevent="isSelecting = !isSelecting"
      >
        <n-icon size="20">
          <CursorHover20Regular v-if="!isSelecting" />
          <CursorClick20Regular v-else />
        </n-icon>
      </button>
      <button
        @click="isShowQuickOptions = !isShowQuickOptions"
        :title="$t('actions.add_tool_codes')"
      >
        <n-icon size="20"><AppsAddIn20Regular /></n-icon>
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
      <QuickOptions
        v-model:visible="isShowQuickOptions"
        :options="toolOptions"
        :title="`${$t('actions.add_tool_codes')} (alt+\`)`"
        class="font-code"
        style="top: 2px; right: 2px"
      />
      <div v-if="showTabs" class="style-editor-action-bar">
        <TabLayout v-model="styleEditorTab" :tab-list="tabList" horizontal />
      </div>
      <div class="code-editor-placeholder">
        <VueMonaco
          v-if="styleEditorTab === StyleTabType.GLOBAL"
          ref="vueMonacoRef"
          v-model="globalStyleCode"
          language="scss"
          :debounce-ms="500"
          show-line-numbers
        />
        <VueMonaco
          v-else-if="styleEditorTab === StyleTabType.VARIABLES"
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
