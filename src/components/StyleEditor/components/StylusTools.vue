<script lang="ts" setup>
import {defineComponent, ref} from 'vue'
import {copyToClipboard, readClipboardData} from '@/utils'
import VueMonaco from '@/components/VgoUI/packages/VueMonaco/index.vue'
import {useI18n} from 'vue-i18n'
import {useDebounceFn, useVModel} from '@vueuse/core'
import ViewPortWindow from '@/components/VgoUI/packages/ViewPortWindow/index.vue'
import {useSettingsStore} from '@/store/settings'

const {t: $t} = useI18n()
const textInput = ref('')
const textOutput = ref('')
const errorText = ref('')

watch(textInput, () => {
  doFormat()
})

function doFormat() {
  try {
    let result = window.stylusSupermacyFormat(textInput.value, {
      tabStopChar: '  ',
      selectorSeparator: ', ',
      alwaysUseZeroWithoutUnit: true,
    })

    result = result.replace(/>>>/g, '::v-deep')

    textOutput.value = result
    errorText.value = ''
  } catch (e: any) {
    console.error(e)
    errorText.value = e.message
  }
}

function doClear() {
  textInput.value = ''
  doFormat()
}

const handlePaste = async () => {
  textInput.value = await readClipboardData()
}

const handleCopy = async () => {
  await copyToClipboard(textOutput.value)
  window.$message.success($t('msgs.copy_success'))
}

const handleAutoPasteCopy = async () => {
  await handlePaste()
  setTimeout(() => {
    handleCopy()
  })
}
const settingsStore = useSettingsStore()

function showDemo() {
  textInput.value = `@require "./file.styl"
.a,.b {
  color  red
  >>> .c {
    border 1px solid currentColor
  }
}`
  doFormat()
}
</script>

<template>
  <div class="text-converter-wrap">
    <div class="tool-header flex-row-center-gap" style="justify-content: space-between">
      <div class="vgo-button-group">
        <button
          @click="handleAutoPasteCopy"
          :title="$t('msgs.auto_paste_and_copy')"
          class="vgo-button primary js_focus_auto_action"
        >
          {{ $t('actions.paste') }}+{{ $t('actions.copy') }}
          <span v-if="settingsStore.enableFocusAutoAction" class="js-focus-auto-action-tip"></span>
        </button>
        <button @click="handlePaste" class="vgo-button" title="Paste">
          {{ $t('actions.paste') }}
        </button>
        <button @click="handleCopy" class="vgo-button" title="Copy Result">
          {{ $t('actions.copy') }}
        </button>
      </div>

      <a
        style="color: #d50000"
        href="https://thisismanta.github.io/stylus-supremacy/#demo"
        target="_blank"
      >
        Stylus Supermacy
      </a>

      <div class="vgo-button-group">
        <button class="vgo-button" @click="doClear">{{ $t('actions.clear') }}</button>
        <button class="vgo-button" @click="showDemo">{{ $t('common.demo') }}</button>
      </div>
    </div>
    <div class="main-box font-code">
      <div class="input-wrapper">
        <div class="input-tip">Input Stylus Code</div>
        <VueMonaco language="stylus" v-model="textInput" class="input-text" />
      </div>
      <div class="input-wrapper">
        <div class="input-tip">Formatted (SCSS)</div>
        <VueMonaco v-model="textOutput" language="scss" class="input-text" />
      </div>
    </div>
    <div class="error-box">
      {{ errorText }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/components/VueI18nEditTool/TextConverter/text-converter';
</style>
