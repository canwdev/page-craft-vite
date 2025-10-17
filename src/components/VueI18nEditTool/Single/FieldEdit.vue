<script lang="ts">
import { defineComponent } from 'vue'
import { useAutoPasteConvert } from '@/components/VueI18nEditTool/Single/hooks/use-auto-paste-convert'
import { useI18nToolSettingsStore } from '@/components/VueI18nEditTool/store/i18n-tool-settings'
import { useModelWrapper } from '@/hooks/use-model-wrapper'
import { readClipboardData } from '@/utils'
import { isBase64Image, isSrcHttpUrl, isUrlImage } from '@/utils/is'
import { textConvertAdvanced } from '@/utils/mc-utils/text-convert'

export default defineComponent({
  name: 'FieldEdit',
  props: {
    modelValue: {
      type: [String, Number, Array],
    },
  },
  emits: ['onValueBlur', 'previewArray', 'update:modelValue'],
  setup(props, { emit }) {
    const mValue = useModelWrapper(props, emit)
    const i18nSetStore = useI18nToolSettingsStore()

    const handleValueBlur = () => {
      emit('onValueBlur')
    }

    const { valType, autoPasteConvertMode } = useAutoPasteConvert(mValue)

    const handlePaste = async () => {
      const val: any = await readClipboardData()

      mValue.value = textConvertAdvanced(val, autoPasteConvertMode.value, {
        isTrimQuotes: i18nSetStore.autoPasteTrimQuotes,
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

    const isResUrl = computed(() => {
      if (!i18nSetStore.isAutoShowImage) {
        return false
      }
      if (valType.value !== 'string') {
        return false
      }
      return (isSrcHttpUrl(mValue.value) && isUrlImage(mValue.value)) || isBase64Image(mValue.value)
    })

    return {
      i18nSetStore,
      mValue,
      valType,
      handleValueBlur,
      handlePaste,
      autoPasteConvertMode,
      focus,
      valueInputRef,
      isResUrl,
    }
  },
})
</script>

<template>
  <div class="item-value-edit-wrap">
    <div v-if="isResUrl" class="res-preview-wrap">
      <a :href="mValue" target="_blank" rel="nofollow noopener">
        <img :src="mValue" alt="preview">
      </a>
    </div>

    <el-input-number
      v-if="valType === 'number'"
      ref="valueInputRef"
      v-model="mValue"
      placeholder="number value"
      class="item-value-edit jssl_value font-code"
    />

    <button
      v-else-if="valType === 'object'"
      :title="mValue"
      class="item-value-edit _button vgo-button"
      @click="$emit('previewArray')"
    >
      <span class="mdi mdi-text-box-edit-outline" />
      {{ $t('common.array') }}
    </button>
    <textarea
      v-else
      ref="valueInputRef"
      v-model="mValue"
      type="textarea"
      rows="1"
      class="item-value-edit vgo-input font-code"
      placeholder="text value"
      @blur="handleValueBlur"
    />

    <button
      v-if="valType !== 'object'"
      class="vgo-button primary"
      :title="`${$t('msgs.auto_paste')} [${autoPasteConvertMode}]`"
      @click="handlePaste"
    >
      <span class="mdi mdi-content-paste" />
    </button>
  </div>
</template>

<style lang="scss">
.item-value-edit-wrap {
  display: flex;
  align-items: center;
  .item-value-edit {
    flex: 1;
    min-width: 200px;
    scrollbar-width: thin;
  }

  .res-preview-wrap {
    flex: 0.5;
    margin-right: 4px;
    a {
      color: var(--vgo-primary);
    }
    img {
      width: 100%;
      max-width: 400px;
      max-height: 200px;
      transition: all 0.3s;
    }
    //&:hover {
    //  img {
    //    max-width: 800px;
    //    max-height: 800px;
    //  }
    //}
  }
}
</style>
