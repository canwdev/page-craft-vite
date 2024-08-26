<script lang="ts">
import {defineComponent, ref} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {copyToClipboard, readClipboardData} from '@/utils'
import {
  TextConvertMode,
  TextConvertOptions,
  textConvertMultipleLine,
} from '@/utils/mc-utils/text-convert'
import {useI18n} from 'vue-i18n'
import VueMonaco from '@/components/CanUI/packages/VueMonaco/index.vue'
import {useDebounceFn, useStorage} from '@vueuse/core'
import ViewPortWindow from '@/components/CanUI/packages/ViewPortWindow/index.vue'
import RectSwitch from '@/components/CanUI/packages/OptionUI/Tools/RectSwitch.vue'

export default defineComponent({
  name: 'DialogTextTransformer',
  components: {RectSwitch, ViewPortWindow, VueMonaco},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mVisible = useModelWrapper(props, emit, 'visible')
    const textInput = ref('')
    const textOutput = ref('')
    const mMode = useStorage('text_converter_copy_mode', TextConvertMode.JSON, localStorage, {
      listenToStorageChanges: false,
    })
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

    const monacoEditorRef = ref()
    const resizeMonaco = useDebounceFn(() => {
      monacoEditorRef.value.resize()
    }, 300)

    return {
      mVisible,
      textInput,
      textOutput,
      TextConvertMode,
      TextConvertOptions,
      mMode,
      isTrimEmptyLines,
      htmlTagName,
      htmlAttrs,
      handleAutoPasteCopy,
      handlePaste,
      handleCopy,
      monacoEditorRef,
      resizeMonaco,
    }
  },
})
</script>

<template>
  <ViewPortWindow
    v-model:visible="mVisible"
    wid="text_converter"
    allow-maximum
    @resize="resizeMonaco"
    :init-win-options="{width: '600px', height: '500px'}"
    init-center
  >
    <template #titleBarLeft>{{ $t('common.text_transformer') }}</template>

    <div v-if="mVisible" class="text-converter-wrap">
      <div class="tool-header flex-row-center-gap">
        Convert to:
        <RectSwitch :options="TextConvertOptions" v-model="mMode"> </RectSwitch>

        <el-checkbox v-model="isTrimEmptyLines">{{ $t('msgs.trim_empty_lines') }}</el-checkbox>

        <template v-if="mMode === TextConvertMode.HTML">
          <input class="vp-input" v-model="htmlTagName" placeholder="HTML Tag Name" />
          <input
            v-if="htmlTagName"
            v-model="htmlAttrs"
            placeholder="HTML Attrs"
            class="vp-button"
          />
        </template>

        <div>
          <button
            @click="handleAutoPasteCopy"
            :title="$t('msgs.auto_paste_and_copy')"
            class="vp-button primary focus-auto-action"
          >
            {{ $t('actions.paste') }}+{{ $t('actions.copy') }}
          </button>
          <button @click="handlePaste" class="vp-button" title="Paste">
            {{ $t('actions.paste') }}
          </button>
          <button @click="handleCopy" class="vp-button" title="Copy Result">
            {{ $t('actions.copy') }}
          </button>
        </div>
      </div>
      <div class="main-box font-code">
        <div class="input-wrapper">
          <div class="input-tip">Text Input: text</div>
          <textarea
            class="input-text vp-input"
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
  </ViewPortWindow>
</template>

<style lang="scss" scoped>
@import 'text-converter';
</style>
