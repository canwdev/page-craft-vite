<script lang="ts" setup>
import {JSONEditor} from 'vanilla-jsoneditor'
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
interface Props {
  options: any
  dark: boolean
}

const props = withDefaults(defineProps<Props>(), {})
const {options} = toRefs(props)

const editorWrap = ref()
const jsonEditor = ref()

// https://github.com/josdejong/svelte-jsoneditor
// JSONEditor properties as of version 0.3.60
const propNames = [
  'content',
  'mode',
  'mainMenuBar',
  'navigationBar',
  'statusBar',
  'readOnly',
  'indentation',
  'tabSize',
  'escapeControlCharacters',
  'escapeUnicodeCharacters',
  'validator',
  'onError',
  'onChange',
  'onChangeMode',
  'onClassName',
  'onRenderValue',
  'onRenderMenu',
  'queryLanguages',
  'queryLanguageId',
  'onChangeQueryLanguage',
  'onFocus',
  'onBlur',
]

function pickDefinedProps(object) {
  const props = {}
  for (const propName of propNames) {
    if (object[propName] !== undefined) {
      props[propName] = object[propName]
    }
  }
  return props
}

onMounted(() => {
  jsonEditor.value = new JSONEditor({
    target: editorWrap.value,
    props: pickDefinedProps(options.value),
  })

  jsonEditor.value.expand((path) => true)
})
onBeforeUnmount(() => {
  jsonEditor.value.destroy()
  jsonEditor.value = null
})

onUpdated(() => {
  jsonEditor.value.updateProps(pickDefinedProps(options.value))
})

defineExpose({
  jsonEditor,
})
</script>

<template>
  <div
    class="vue-json-editor _scrollbar_mini"
    :class="{'jse-theme-dark': dark}"
    ref="editorWrap"
  ></div>
</template>

<style lang="scss" scoped>
.vue-json-editor {
  width: 100%;
  height: 100%;
}
</style>
