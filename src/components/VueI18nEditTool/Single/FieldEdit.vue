<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {ClipboardPaste20Regular} from '@vicons/fluent'
import {readClipboardData} from '@/utils'
import {textConvertAdvanced, TextConvertMode} from '@/components/VueI18nEditTool/copy-enum'
import {useI18nToolSettingsStore} from '@/store/i18n-tool-settings'
import {useAutoPasteConvert} from '@/components/VueI18nEditTool/Single/use-auto-paste-convert'

export default defineComponent({
  name: 'FieldEdit',
  components: {ClipboardPaste20Regular},
  props: {
    modelValue: {
      type: [String, Number, Array],
    },
  },
  emits: ['onValueBlur', 'previewArray', 'update:modelValue'],
  setup(props, {emit}) {
    const mValue = useModelWrapper(props, emit)
    const intSettingsStore = useI18nToolSettingsStore()

    const handleValueBlur = () => {
      emit('onValueBlur')
    }

    const {valType, autoPasteConvertMode} = useAutoPasteConvert(mValue)

    const handlePaste = async () => {
      let val: any = await readClipboardData()

      mValue.value = textConvertAdvanced(val, autoPasteConvertMode.value, {
        isTrimQuotes: intSettingsStore.autoPasteTrimQuotes,
      })
      setTimeout(() => {
        handleValueBlur()
      })
    }

    const valueInputRef = ref()
    const focus = () => {
      setTimeout(() => {
        valueInputRef.value.focus()
      })
    }

    return {
      intSettingsStore,
      mValue,
      valType,
      handleValueBlur,
      handlePaste,
      autoPasteConvertMode,
      focus,
      valueInputRef,
    }
  },
})
</script>

<template>
  <div class="item-value-edit-wrap">
    <n-input-number
      ref="valueInputRef"
      v-if="valType === 'number'"
      v-model:value="mValue"
      placeholder="number value"
      size="small"
      class="item-value-edit jssl_value"
      @blur="handleValueBlur"
    />
    <n-button
      v-else-if="valType === 'object'"
      :title="mValue"
      size="small"
      class="item-value-edit _button"
      @click="$emit('previewArray')"
    >
      📝 {{ $t('common.array') }}
    </n-button>
    <n-input
      v-else
      ref="valueInputRef"
      type="textarea"
      rows="1"
      size="small"
      class="item-value-edit"
      v-model:value="mValue"
      placeholder="text value"
      @blur="handleValueBlur"
    />

    <n-button
      @click="handlePaste"
      secondary
      size="small"
      type="info"
      :title="`Auto Paste [${autoPasteConvertMode}]`"
    >
      <template #icon>
        <ClipboardPaste20Regular />
      </template>
    </n-button>
  </div>
</template>

<style lang="scss">
.item-value-edit-wrap {
  display: flex;
  .item-value-edit {
    flex: 1;
  }
}
</style>
