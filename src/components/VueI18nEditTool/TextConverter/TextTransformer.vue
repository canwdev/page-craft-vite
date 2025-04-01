<script lang="ts" setup>
import {ref} from 'vue'
import {copyToClipboard, readClipboardData} from '@/utils'
import {
  TextConvertMode,
  TextConvertOptions,
  textConvertMultipleLine,
} from '@/utils/mc-utils/text-convert'
import {useI18n} from 'vue-i18n'
import VueMonaco from '@/components/VgoUI/packages/VueMonaco/index.vue'
import {useDebounceFn, useStorage} from '@vueuse/core'
import RectSwitch from '@/components/VgoUI/packages/OptionUI/Tools/RectSwitch.vue'
import {useSettingsStore} from '@/store/settings'
import {LS_SettingsKey} from '@/enum/settings'

const {t: $t} = useI18n()
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

const updateFormat = () => {
  textOutput.value = textConvertMultipleLine(textInput.value, mMode.value, {
    isTrimEmptyLines: isTrimEmptyLines.value,
    htmlTagName: htmlTagName.value,
    htmlAttrs: htmlAttrs.value,
  })
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
</script>

<template>
  <div class="text-converter-wrap">
    <div class="tool-header flex-row-center-gap">
      Convert to:
      <RectSwitch :options="TextConvertOptions" v-model="mMode"> </RectSwitch>

      <el-checkbox v-model="isTrimEmptyLines">{{ $t('msgs.trim_empty_lines') }}</el-checkbox>

      <template v-if="mMode === TextConvertMode.HTML">
        <input class="vgo-input" v-model="htmlTagName" placeholder="HTML Tag Name" />
        <input v-if="htmlTagName" v-model="htmlAttrs" placeholder="HTML Attrs" class="vgo-button" />
      </template>

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
    </div>
    <div class="main-box font-code">
      <div class="input-wrapper">
        <div class="input-tip">Text Input: text</div>
        <textarea
          class="input-text vgo-input"
          type="textarea"
          v-model="textInput"
          placeholder="Text Input"
        ></textarea>
      </div>
      <div class="input-wrapper">
        <div class="input-tip">Text Output: {{ mMode }}</div>
        <VueMonaco
          v-model="textOutput"
          :language="mMode"
          class="input-text"
          ref="monacoEditorRef"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'text-converter';
</style>
