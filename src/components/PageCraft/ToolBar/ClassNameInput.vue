<script setup lang="ts">
import {useMainStore} from '@/store/main'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import InputAutoTips from '@/components/CommonUI/InputAutoTips.vue'
import {monacoStyleGlobal} from '@/components/StyleEditor/hooks/use-monaco-helper'
import {LS_SettingsKey} from '@/enum/settings'

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

const updateWindowClassNameHistory = (val) => {
  // 类名自动补全缓存
  monacoStyleGlobal.$monacoClassNameHistory = val
}
</script>

<template>
  <InputAutoTips
    v-model="mainStore.className"
    class="sl-css-class-input font-code"
    :title="`Focus shortcut: alt+1\nPress enter to insert css class\nInput without dot(.)`"
    :storageKey="LS_SettingsKey.MC_INPUT_HISTORY_CLASS"
    @keyup.enter="handleAddClassName"
    @historyChanged="updateWindowClassNameHistory"
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
