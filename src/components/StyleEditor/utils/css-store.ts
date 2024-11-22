import {useStyleTag} from '@vueuse/core'
import {sassToCSS} from './css'
import {useRoute} from 'vue-router'
import {StyleEditorKeys} from '@/enum/settings'

type IStore = {
  globalCSS: string
  currentCSS: string
}

export const useSharedCssStore = defineStore('playground', {
  state: (): IStore => {
    return {
      globalCSS: '',
      currentCSS: '',
    }
  },
  // 同步其他页面状态
  share: {
    enable: true,
    initialize: true,
  },
})

// 注册 head style 标签同步，每个页面只能注册一次
export const useCssStyleTag = () => {
  const cssStore = useSharedCssStore()
  const route = useRoute()
  const {css: globalCssTag} = useStyleTag('', {id: StyleEditorKeys.GLOBAL_STYLE})
  const {css: currentCssTag} = useStyleTag('', {id: StyleEditorKeys.CURRENT_STYLE})

  watch(
    () => cssStore.globalCSS,
    (val) => {
      globalCssTag.value = val
    },
    {immediate: true},
  )
  watch(
    () => cssStore.currentCSS,
    (val) => {
      // console.log('[cssStore.currentCSS]', val)
      currentCssTag.value = val
    },
    {immediate: false},
  )

  // 初始化时先应用全局样式
  onMounted(async () => {
    const globalStyleCode = localStorage.getItem(StyleEditorKeys.GLOBAL_STYLE) || ''
    if (globalStyleCode) {
      try {
        cssStore.globalCSS = globalStyleCode ? await sassToCSS(globalStyleCode) : ''
      } catch (e: any) {
        window.$message.error(e.message)
      }
    }
  })
}
