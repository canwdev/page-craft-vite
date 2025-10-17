<script lang="ts" setup>
import VueMonaco from '@canwdev/vgo-ui/src/components/VueMonaco/VueMonaco.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/store/settings'
import { copyToClipboard, readClipboardData } from '@/utils'
import dynamicLoadScript from '@/utils/dynamic-load-script'

const { t: $t } = useI18n()
const textInput = ref('')
const textOutput = ref('')
const errorText = ref('')

const isLoading = ref(false)
onMounted(async () => {
  isLoading.value = true
  await dynamicLoadScript('lib/stylus-supremacy-format.min.js')
  isLoading.value = false
})

watch(textInput, () => {
  doFormat()
})

function doFormat() {
  if (isLoading.value) {
    return
  }
  try {
    let result = window.stylusSupermacyFormat(textInput.value, {
      tabStopChar: '  ',
      selectorSeparator: ', ',
      alwaysUseZeroWithoutUnit: true,
    })

    result = result.replace(/>>>/g, '::v-deep')

    textOutput.value = result
    errorText.value = ''
  }
  catch (e: any) {
    console.error(e)
    errorText.value = e.message
  }
}

function doClear() {
  textInput.value = ''
  doFormat()
}

async function handlePaste() {
  textInput.value = await readClipboardData()
}

async function handleCopy() {
  await copyToClipboard(textOutput.value)
  window.$message.success($t('msgs.copy_success'))
}

async function handleAutoPasteCopy() {
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
  <div v-loading="isLoading" class="text-converter-wrap">
    <div class="tool-header flex-row-center-gap" style="justify-content: space-between">
      <div class="vgo-button-group">
        <button
          :title="$t('msgs.auto_paste_and_copy')"
          class="vgo-button primary js_focus_auto_action"
          @click="handleAutoPasteCopy"
        >
          {{ $t('actions.paste') }}+{{ $t('actions.copy') }}
          <span v-if="settingsStore.enableFocusAutoAction" class="js-focus-auto-action-tip" />
        </button>
        <button class="vgo-button" title="Paste" @click="handlePaste">
          {{ $t('actions.paste') }}
        </button>
        <button class="vgo-button" title="Copy Result" @click="handleCopy">
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
        <button class="vgo-button" @click="doClear">
          {{ $t('actions.clear') }}
        </button>
        <button class="vgo-button" @click="showDemo">
          {{ $t('common.demo') }}
        </button>
      </div>
    </div>
    <div class="main-box font-code">
      <div class="input-wrapper">
        <div class="input-tip">
          Input Stylus Code
        </div>
        <VueMonaco v-model="textInput" language="stylus" class="input-text" />
      </div>
      <div class="input-wrapper">
        <div class="input-tip">
          Formatted (SCSS)
        </div>
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
