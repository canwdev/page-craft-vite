<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {readClipboardData} from '@/utils'
import {textConvertAdvanced, TextConvertMode} from '@/utils/mc-utils/text-convert'
import {useI18nToolSettingsStore} from '@/components/VueI18nEditTool/store/i18n-tool-settings'
import {useAutoPasteConvert} from '@/components/VueI18nEditTool/Single/hooks/use-auto-paste-convert'
import {isBase64Image, isSrcHttpUrl, isUrlImage} from '@/utils/is'

export default defineComponent({
  name: 'FieldEdit',
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
    <div class="res-preview-wrap" v-if="isResUrl">
      <a :href="mValue" target="_blank" rel="nofollow noopener">
        <img :src="mValue" alt="preview" />
      </a>
    </div>

    <el-input-number
      ref="valueInputRef"
      v-if="valType === 'number'"
      v-model="mValue"
      placeholder="number value"
      class="item-value-edit jssl_value font-code"
    />

    <button
      v-else-if="valType === 'object'"
      :title="mValue"
      class="item-value-edit _button vp-button"
      @click="$emit('previewArray')"
    >
      <span class="mdi mdi-text-box-edit-outline"></span>
      {{ $t('common.array') }}
    </button>
    <textarea
      v-else
      ref="valueInputRef"
      type="textarea"
      rows="1"
      class="item-value-edit vp-input font-code"
      v-model="mValue"
      placeholder="text value"
      @blur="handleValueBlur"
    ></textarea>

    <button
      v-if="valType !== 'object'"
      @click="handlePaste"
      class="vp-button primary"
      :title="`${$t('msgs.auto_paste')} [${autoPasteConvertMode}]`"
    >
      <span class="mdi mdi-content-paste"></span>
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
    //&:hover {
    //  img {
    //    max-width: 800px;
    //    max-height: 800px;
    //  }
    //}
  }
}
</style>
