<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {ClipboardPaste20Regular} from '@vicons/fluent'
import {readClipboardData} from '@/utils'
import {textConvertAdvanced} from '@/components/VueI18nEditTool/copy-enum'
import {useI18nToolSettingsStore} from '@/store/i18n-tool-settings'

export default defineComponent({
  name: 'FieldEdit',
  components: {ClipboardPaste20Regular},
  props: {
    modelValue: {
      type: [String, Number, Array],
    },
  },
  emits: ['onValueBlur', 'previewArray'],
  setup(props, {emit}) {
    const mValue = useModelWrapper(props, emit)
    const intSettingsStore = useI18nToolSettingsStore()

    const valType = ref<string | null>(null)
    watch(
      mValue,
      (val) => {
        if (!val) {
          valType.value = null
          return
        }
        valType.value = typeof val
      },
      {immediate: true}
    )

    const handleValueBlur = () => {
      emit('onValueBlur')
    }

    const handlePaste = async () => {
      let val: any = await readClipboardData()

      mValue.value = textConvertAdvanced(val, intSettingsStore.autoPasteTextConvertMode, {
        isTrimQuotes: intSettingsStore.autoPasteTrimQuotes,
      })
      setTimeout(() => {
        handleValueBlur()
      })
    }

    return {
      intSettingsStore,
      mValue,
      valType,
      handleValueBlur,
      handlePaste,
    }
  },
})
</script>

<template>
  <n-input-number
    ref="valueInputRef"
    v-if="valType === 'number'"
    v-model:value="mValue"
    placeholder="number value"
    size="small"
    class="item-value-edit jssl_value"
    @blur="handleValueBlur"
  />
  <n-input-group v-else-if="!Array.isArray(mValue)">
    <n-input
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
      :title="`Auto Paste (${intSettingsStore.autoPasteTextConvertMode})`"
    >
      <template #icon>
        <ClipboardPaste20Regular />
      </template>
    </n-button>
  </n-input-group>
  <n-button
    v-else
    :title="mValue"
    size="small"
    class="item-value-edit _button"
    @click="$emit('previewArray')"
  >
    📝 {{ $t('common.array') }}
  </n-button>
</template>
