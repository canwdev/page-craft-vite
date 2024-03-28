import {usePlaygroundStore} from '@/store/playground'
import {useSettingsStore} from '@/store/settings'
import {sassToCSS} from '@/components/PageCraft/StyleEditor/utils/css'
import {StyleEditorKeys} from '../enum'

/**
 * 使用全局样式
 */
export const useGlobalStyle = () => {
  const playgroundStore = usePlaygroundStore()

  const globalStyleText = ref('')
  const settingsStore = useSettingsStore()

  watch(globalStyleText, (val) => {
    applyGlobalStyle()
  })

  const applyGlobalStyle = async () => {
    try {
      const value = globalStyleText.value
      const result = value ? await sassToCSS(value) : ''
      // console.log(result)
      playgroundStore.globalCSS = result
      localStorage.setItem(StyleEditorKeys.GLOBAL_STYLE, globalStyleText.value)
    } catch (e: any) {
      window.$message.error(e.message)
    }
  }

  onMounted(() => {
    globalStyleText.value = localStorage.getItem(StyleEditorKeys.GLOBAL_STYLE) || ''
  })

  return {
    globalStyleText,
    applyGlobalStyle,
  }
}
