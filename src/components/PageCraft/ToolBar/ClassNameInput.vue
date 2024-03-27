<script setup lang="ts">
import {useMainStore} from '@/store/main'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import InputAutoTips from '@/components/CommonUI/InputAutoTips.vue'
import monaco from '@/components/CommonUI/VueMonaco/monaco-helper'

const mainStore = useMainStore()

const handleAddClassName = () => {
  const value = mainStore.className
  if (!value) {
    return
  }
  let sl = ''
  value.split(' ').forEach((c) => {
    sl += '.' + c
  })
  const code = `\n${sl} {\n}\n`
  globalEventBus.emit(GlobalEvents.ON_ADD_STYLE, {code, isAppend: false})

  mainStore.className = ''
}

// 编辑器自动提示
const updateClassNamesSuggestions = (items) => {
  // console.log('[updateClassNamesSuggestions]', items)
  monaco.languages.registerCompletionItemProvider('scss', {
    triggerCharacters: ['.'],
    provideCompletionItems: (model, position) => {
      return {
        suggestions: items.map((item) => {
          let sl = ''
          item.label.split(' ').forEach((c) => {
            sl += '.' + c
          })
          return {
            label: sl,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: `${sl} {\${1:}}`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column - 2,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            },
          }
        }),
      }
    },
  })
}
</script>

<template>
  <InputAutoTips
    v-model="mainStore.className"
    class="sl-css-class-input font-code"
    :title="`Focus shortcut: alt+1\nPress enter to insert css class\nInput without dot(.)`"
    hid="class"
    @keyup.enter="handleAddClassName"
    @historyChanged="updateClassNamesSuggestions"
  />

  <input
    type="text"
    v-model="mainStore.innerText"
    placeholder="innerHTML | src | value"
    :title="`Focus shortcut: alt+2\nPress esc to clear`"
    class="vp-input sl-inner-html-input font-code"
    @keyup.esc="mainStore.innerText = ''"
  />
</template>
