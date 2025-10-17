<script lang="ts" setup>
import RectSwitch from '@canwdev/vgo-ui/src/components/OptionUI/Tools/RectSwitch.vue'
import VueMonaco from '@canwdev/vgo-ui/src/components/VueMonaco/index.vue'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LS_SettingsKey } from '@/enum/settings'
import { useSettingsStore } from '@/store/settings'
import { copyToClipboard, readClipboardData } from '@/utils'
import {
  TextConvertMode,
  textConvertMultipleLine,
  TextConvertOptions,
} from '@/utils/mc-utils/text-convert'

const { t: $t } = useI18n()
const textInput = ref('')
const textOutput = ref('')
const mMode = useStorage(
  LS_SettingsKey.TEXT_CONVERTER_COPY_MODE,
  TextConvertMode.JSON,
  localStorage,
  {
    listenToStorageChanges: false,
  },
)
const isTrimEmptyLines = ref(true)
const htmlTagName = ref('')
const htmlAttrs = ref('')

watch(textInput, () => {
  updateFormat()
})

watch(mMode, () => {
  updateFormat()
})

watch(isTrimEmptyLines, () => {
  updateFormat()
})
watch(htmlTagName, () => {
  updateFormat()
})
watch(htmlAttrs, () => {
  updateFormat()
})

function updateFormat() {
  textOutput.value = textConvertMultipleLine(textInput.value, mMode.value, {
    isTrimEmptyLines: isTrimEmptyLines.value,
    htmlTagName: htmlTagName.value,
    htmlAttrs: htmlAttrs.value,
  })
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
</script>

<template>
  <div class="text-converter-wrap">
    <div class="tool-header flex-row-center-gap">
      Convert to:
      <RectSwitch v-model="mMode" :options="TextConvertOptions" />

      <el-checkbox v-model="isTrimEmptyLines">
        {{ $t('msgs.trim_empty_lines') }}
      </el-checkbox>

      <template v-if="mMode === TextConvertMode.HTML">
        <input v-model="htmlTagName" class="vgo-input" placeholder="HTML Tag Name">
        <input v-if="htmlTagName" v-model="htmlAttrs" placeholder="HTML Attrs" class="vgo-button">
      </template>

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
    </div>
    <div class="main-box font-code">
      <div class="input-wrapper">
        <div class="input-tip">
          Text Input: text
        </div>
        <textarea
          v-model="textInput"
          class="input-text vgo-input"
          type="textarea"
          placeholder="Text Input"
        />
      </div>
      <div class="input-wrapper">
        <div class="input-tip">
          Text Output: {{ mMode }}
        </div>
        <VueMonaco
          ref="monacoEditorRef"
          v-model="textOutput"
          :language="mMode"
          class="input-text"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'text-converter';
</style>
