import {sassToCSS} from '../utils/css'
import {useSharedCssStore} from '../utils/css-store'
import {useStorage} from '@vueuse/core'
import {StyleEditorKeys} from '@/enum/settings'

/**
 * 使用全局样式
 */
export const useGlobalStyle = () => {
  const cssStore = useSharedCssStore()

  const globalStyleCode = useStorage(StyleEditorKeys.GLOBAL_STYLE, '')
  watch(globalStyleCode, (val) => {
    applyGlobalStyle()
  })

  const applyGlobalStyle = async () => {
    try {
      cssStore.globalCSS = globalStyleCode.value ? await sassToCSS(globalStyleCode.value) : ''
    } catch (e: any) {
      window.$message.error(e.message)
    }
  }

  return {
    globalStyleCode,
  }
}
