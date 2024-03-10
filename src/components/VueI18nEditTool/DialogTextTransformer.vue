<script lang="ts">
import {defineComponent, ref} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {copyToClipboard, readClipboardData} from '@/utils'
import {
  TextConvertMode,
  TextConvertOptions,
  textConvertMultipleLine,
} from '@/components/VueI18nEditTool/copy-enum'
import {ClipboardPaste20Regular, Copy20Regular} from '@vicons/fluent'
import {useI18n} from 'vue-i18n'
import VueMonaco from '@/components/CommonUI/VueMonaco/index.vue'
import {useStorage} from '@vueuse/core'

export default defineComponent({
  name: 'DialogTextTransformer',
  components: {VueMonaco, ClipboardPaste20Regular, Copy20Regular},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mVisible = useModelWrapper(props, emit, 'visible')
    const textInput = ref('')
    const textOutput = ref('')
    const mMode = useStorage('text_converter_copy_mode', TextConvertMode.JSON)
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
    }
  },
})
</script>

<template>
  <n-modal
    v-model:show="mVisible"
    preset="dialog"
    :title="$t('common.text_transformer')"
    style="min-width: 800px"
  >
    <n-space align="center" style="margin-bottom: 10px">
      Convert to:
      <n-select
        size="small"
        v-model:value="mMode"
        :options="TextConvertOptions"
        style="width: 100px"
      />

      <n-checkbox size="small" v-model:checked="isTrimEmptyLines">{{
        $t('msgs.trim_empty_lines')
      }}</n-checkbox>

      <n-input-group v-if="mMode === TextConvertMode.HTML">
        <n-input v-model:value="htmlTagName" clearable placeholder="HTML Tag Name" size="small" />
        <n-input
          v-if="htmlTagName"
          v-model:value="htmlAttrs"
          clearable
          placeholder="HTML Attrs"
          size="small"
        />
      </n-input-group>

      <n-button-group>
        <n-button
          @click="handleAutoPasteCopy"
          size="small"
          type="primary"
          title="Paste and Copy Result"
        >
          <n-icon> <ClipboardPaste20Regular /> </n-icon>+
          <n-icon>
            <Copy20Regular />
          </n-icon>
        </n-button>
        <n-button @click="handlePaste" size="small" title="Paste">
          <template #icon>
            <ClipboardPaste20Regular />
          </template>
        </n-button>
        <n-button @click="handleCopy" size="small" title="Copy Result">
          <template #icon>
            <Copy20Regular />
          </template>
        </n-button>
      </n-button-group>
    </n-space>
    <div class="style-tools">
      <div class="common-card">
        <div class="main-box font-code">
          <div class="input-wrapper">
            <div class="input-tip">Text Input: text</div>
            <n-input
              class="input-text"
              type="textarea"
              v-model:value="textInput"
              placeholder="Text Input"
            ></n-input>
          </div>
          <div class="input-wrapper">
            <div class="input-tip">Text Output: {{ mMode }}</div>
            <VueMonaco v-model="textOutput" :language="mMode" class="input-text" />
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style lang="scss" scoped>
.style-tools {
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
}
</style>
