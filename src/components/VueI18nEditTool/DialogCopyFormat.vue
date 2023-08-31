<script lang="ts">
import {defineComponent, ref} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {copyToClipboard} from '@/utils'
import {CopyMode, CopyModeOptions, formatMultipleLine} from '@/components/VueI18nEditTool/copy-enum'

export default defineComponent({
  name: 'DialogCopyFormat',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')
    const textInput = ref('')
    const textOutput = ref('')
    const mMode = ref(CopyMode.json)
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
      textOutput.value = formatMultipleLine(textInput.value, mMode.value, {
        isTrimEmptyLines: isTrimEmptyLines.value,
        htmlTagName: htmlTagName.value,
        htmlAttrs: htmlAttrs.value,
      })
    }

    return {
      mVisible,
      textInput,
      textOutput,
      CopyMode,
      CopyModeOptions,
      mMode,
      isTrimEmptyLines,
      htmlTagName,
      htmlAttrs,
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
      {{ $t('common.mode') }}:
      <n-select
        size="small"
        v-model:value="mMode"
        :options="CopyModeOptions"
        style="width: 100px"
      />

      <n-checkbox size="small" v-model:checked="isTrimEmptyLines">{{
        $t('msgs.trim_empty_lines')
      }}</n-checkbox>

      <template v-if="mMode === CopyMode.html">
        <n-input v-model:value="htmlTagName" clearable placeholder="HTML Tag Name" size="small" />
        <n-input
          v-if="htmlTagName"
          v-model:value="htmlAttrs"
          clearable
          placeholder="HTML Attrs"
          size="small"
        />
      </template>
    </n-space>
    <div class="style-tools">
      <div class="common-card">
        <div class="main-box font-code">
          <n-input
            class="input-text"
            type="textarea"
            v-model:value="textInput"
            placeholder="Text Input"
          ></n-input>
          <n-input
            class="input-text"
            type="textarea"
            v-model:value="textOutput"
            placeholder="Text Output"
          ></n-input>
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

    .input-text {
      flex: 1;
      height: 50vh;
      padding: 5px;
      & + .input-text {
        margin-left: 10px;
      }
    }
  }
}
</style>
