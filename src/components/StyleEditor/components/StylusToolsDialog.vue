<script lang="ts">
import {defineComponent, ref} from 'vue'
import {copyToClipboard, readClipboardData} from '@/utils'
import VueMonaco from '@/components/CanUI/packages/VueMonaco/index.vue'
import {useI18n} from 'vue-i18n'
import {useVModel} from '@vueuse/core'

export default defineComponent({
  name: 'StylusToolsDialog',
  components: {VueMonaco},
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
    }
  },
})
</script>

<template>
  <el-dialog
    v-model="mVisible"
    :title="`Stylus ${$t('common.formatting_tool')}`"
    width="800"
    top="10vh"
  >
    <div class="style-tools">
      <div class="common-card">
        <div class="action-row flex-row-center-gap">
          <!--          <button type="primary" size="small" @click="doFormat">{{ $t('common.format') }}</button>-->

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

          <a href="https://thisismanta.github.io/stylus-supremacy/#demo" target="_blank">
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
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.style-tools {
  .action-row {
    margin-bottom: 10px;
  }

  .main-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    gap: 10px;

    .input-wrapper {
      flex: 1;
      height: 70vh;
      outline: 1px solid $color_border;
      display: flex;
      flex-direction: column;

      .input-tip {
        padding: 0 5px;
        background-color: $color_border;
      }

      .input-text {
        flex: 1;
        width: 100%;
      }
    }
  }

  .error-box {
    color: #e60036;
  }
}
</style>
