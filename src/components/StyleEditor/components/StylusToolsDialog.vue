<script lang="ts">
import {defineComponent, ref} from 'vue'
import {copyToClipboard, readClipboardData} from '@/utils'
import VueMonaco from '@/components/CanUI/packages/VueMonaco/index.vue'
import {useI18n} from 'vue-i18n'
import {useDebounceFn, useVModel} from '@vueuse/core'
import ViewPortWindow from '@/components/CanUI/packages/ViewPortWindow/index.vue'

export default defineComponent({
  name: 'StylusToolsDialog',
  components: {ViewPortWindow, VueMonaco},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mVisible = useVModel(props, 'visible', emit)
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
        result = result.replace(/\.styl/g, '.scss')

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
    const monacoEditorRef1 = ref()
    const monacoEditorRef2 = ref()
    const resizeMonaco = useDebounceFn(() => {
      monacoEditorRef1.value.resize()
      monacoEditorRef2.value.resize()
    }, 300)

    return {
      mVisible,
      textInput,
      textOutput,
      errorText,
      doFormat,
      doClear,
      showDemo() {
        textInput.value = `@require "./file.styl"
.a,.b {
  color  red
  >>> .c {
    border 1px solid currentColor
  }
}`
        doFormat()
      },
      handleAutoPasteCopy,
      handlePaste,
      handleCopy,
      monacoEditorRef1,
      monacoEditorRef2,
      resizeMonaco,
    }
  },
})
</script>

<template>
  <ViewPortWindow
    v-model:visible="mVisible"
    wid="stylus_tools"
    allow-maximum
    @resize="resizeMonaco"
    :init-win-options="{width: '600px', height: '500px'}"
    init-center
  >
    <template #titleBarLeft>{{ `Stylus ${$t('common.formatting_tool')}` }}</template>
    <div v-if="mVisible" class="text-converter-wrap">
      <div class="tool-header flex-row-center-gap" style="justify-content: space-between">
        <div>
          <button
            @click="handleAutoPasteCopy"
            :title="$t('msgs.auto_paste_and_copy')"
            class="vp-button primary focus-auto-action"
          >
            {{ $t('actions.copy') }}+
            {{ $t('actions.paste') }}
          </button>
          <button @click="handlePaste" class="vp-button" title="Paste">
            {{ $t('actions.paste') }}
          </button>
          <button @click="handleCopy" class="vp-button" title="Copy Result">
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

        <div>
          <button class="vp-button" @click="doClear">{{ $t('actions.clear') }}</button>
          <button class="vp-button" @click="showDemo">{{ $t('common.demo') }}</button>
        </div>
      </div>
      <div class="main-box font-code">
        <div class="input-wrapper">
          <!--            <n-input
              class="input-text"
              type="textarea"
              v-model:value="textInput"
              placeholder="Text Input"
            ></n-input>-->
          <div class="input-tip">Input Stylus Code</div>
          <VueMonaco
            ref="monacoEditorRef1"
            language="stylus"
            v-model="textInput"
            class="input-text"
          />
        </div>
        <div class="input-wrapper">
          <div class="input-tip">Formatted (SCSS)</div>
          <VueMonaco
            ref="monacoEditorRef2"
            v-model="textOutput"
            language="scss"
            class="input-text"
          />
        </div>
      </div>
      <div class="error-box">
        {{ errorText }}
      </div>
    </div>
  </ViewPortWindow>
</template>

<style lang="scss" scoped>
@import '@/components/VueI18nEditTool/TextConverter/text-converter';
</style>
