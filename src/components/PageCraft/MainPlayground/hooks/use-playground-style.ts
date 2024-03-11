import {usePlaygroundStore} from '@/store/playground'
// import {useHeadStyleEl} from '@/hooks/use-global-theme'
import {LsKeys} from '@/enum/page-craft'
import {useStyleTag} from '@vueuse/core'

export const usePlaygroundStyle = () => {
  const playgroundStore = usePlaygroundStore()

  const {css: globalCss} = useStyleTag('', {id: LsKeys.GLOBAL_STYLE})
  const {css: currentCss} = useStyleTag('', {id: LsKeys.COMP_STYLE})

  watch(
    () => playgroundStore.globalCSS,
    (val) => {
      globalCss.value = val
    }
  )

  watch(
    () => playgroundStore.currentCSS,
    (val) => {
      currentCss.value = val
    }
  )
}
