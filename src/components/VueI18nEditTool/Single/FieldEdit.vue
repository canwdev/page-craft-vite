<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {ClipboardPaste20Regular} from '@vicons/fluent'
import {readClipboardData} from '@/utils'
import {textConvertAdvanced, TextConvertMode} from '@/components/VueI18nEditTool/copy-enum'
import {useI18nToolSettingsStore} from '@/store/i18n-tool-settings'
import {useAutoPasteConvert} from '@/components/VueI18nEditTool/Single/use-auto-paste-convert'
import {isBase64Image, isSrcHttpUrl} from '@/utils/is'

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
    const i18nSetStore = useI18nToolSettingsStore()

    const handleValueBlur = () => {
      emit('onValueBlur')
    }

    const {valType, autoPasteConvertMode} = useAutoPasteConvert(mValue)

    const handlePaste = async () => {
      let val: any = await readClipboardData()

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
      return isSrcHttpUrl(mValue.value) || isBase64Image(mValue.value)
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
    <div class="res-preview-wrap" v-if="isResUrl">
      <a :href="mValue" target="_blank" rel="nofollow noopener">
        <img :src="mValue" alt="preview" />
      </a>
    </div>
    <n-input-number
      ref="valueInputRef"
      v-if="valType === 'number'"
      v-model:value="mValue"
      placeholder="number value"
      size="small"
      class="item-value-edit jssl_value"
      @blur="handleValueBlur"
    />
    <button
      v-else-if="valType === 'object'"
      :title="mValue"
      class="item-value-edit _button vp-button"
      @click="$emit('previewArray')"
    >
      📝 {{ $t('common.array') }}
    </button>
    <textarea
      v-else
      ref="valueInputRef"
      type="textarea"
      rows="1"
      class="item-value-edit vp-input"
      v-model="mValue"
      placeholder="text value"
      @blur="handleValueBlur"
    ></textarea>

    <button
      v-if="valType !== 'object'"
      @click="handlePaste"
      class="vp-button primary"
      :title="`Auto Paste [${autoPasteConvertMode}]`"
    >
      <ClipboardPaste20Regular />
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
      color: $primary;
    }
    img {
      width: 100%;
      max-width: 400px;
      max-height: 200px;
      transition: all 0.3s;
    }
    &:hover {
      img {
        max-width: 800px;
        max-height: 800px;
      }
    }
  }
}
</style>
