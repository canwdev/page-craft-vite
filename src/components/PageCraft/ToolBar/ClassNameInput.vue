<script setup lang="ts">
import {useMainStore} from '@/store/main'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {monacoStyleGlobal} from '@/components/StyleEditor/hooks/use-monaco-helper'
import {LS_SettingsKey} from '@/enum/settings'
import InputAutoTipsV2 from '@/components/CommonUI/InputAutoTipsV2.vue'

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
  console.log('类名自动补全缓存', val)
  monacoStyleGlobal.$monacoClassNameHistory = val
}
</script>

<template>
  <InputAutoTipsV2
    v-model="mainStore.className"
    :title="`Focus shortcut: alt+1\nPress enter to insert css class\nInput without dot(.)`"
    :storageKey="LS_SettingsKey.MC_INPUT_HISTORY_CLASS"
    @keyup.enter="handleAddClassName"
    @historyChanged="updateWindowClassNameHistory"
  />

  <el-input
    type="text"
    v-model="mainStore.innerText"
    placeholder="innerHTML | src | value"
    :title="`Focus shortcut: alt+2\nPress esc to clear`"
    class="input-item sl-inner-html-input font-code"
    size="small"
    clearable
    @keyup.esc="mainStore.innerText = ''"
  />
</template>

<style lang="scss" scoped>
.input-item {
  font-size: 12px;
  line-height: 1;
  width: 180px;
}
</style>
