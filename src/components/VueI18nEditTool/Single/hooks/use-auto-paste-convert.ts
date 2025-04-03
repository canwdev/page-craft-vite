import {TextConvertMode} from '@/utils/mc-utils/text-convert'
import {useI18nToolSettingsStore} from '@/components/VueI18nEditTool/store/i18n-tool-settings'

export const useAutoPasteConvert = (valueRef) => {
  const i18nSetStore = useI18nToolSettingsStore()

  const valType = ref<string | null>(null)
  watch(
    valueRef,
    (val) => {
      if (val === undefined || val === null) {
        valType.value = null
        return
      }
      valType.value = typeof val
    },
    {immediate: true},
  )

  // 自动根据当前输入框类型判断粘贴类型
  const autoPasteConvertMode = computed(() => {
    const type = valType.value
    if (type === 'number') {
      return TextConvertMode.NUMBER
    }
    if (type === 'string') {
      if (i18nSetStore.autoPasteTextConvertMode === TextConvertMode.HTML) {
        return TextConvertMode.HTML
      }
      return TextConvertMode.TEXT
    }
    if (type === 'object') {
      return TextConvertMode.JSON
    }
    return i18nSetStore.autoPasteTextConvertMode
  })
  return {
    autoPasteConvertMode,
    valType,
  }
}
