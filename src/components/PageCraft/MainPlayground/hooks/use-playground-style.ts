import {usePlaygroundStore} from '@/store/playground'
import {useHeadStyleEl} from '@/hooks/use-global-theme'
import {LsKeys} from '@/enum/page-craft'
import {useBroadcastMessage} from '@/components/PageCraft/MainPlayground/hooks/use-broadcast-messae'

export const usePlaygroundStyle = () => {
  const playgroundStore = usePlaygroundStore()

  const {styleEl: globalStyleEl} = useHeadStyleEl(LsKeys.GLOBAL_STYLE)
  const {styleEl: currentStyleEl} = useHeadStyleEl(LsKeys.COMP_STYLE)

  watch(
    () => playgroundStore.globalCSS,
    (val) => {
      globalStyleEl.value!.innerHTML = val
    }
  )

  watch(
    () => playgroundStore.currentCSS,
    (val) => {
      currentStyleEl.value!.innerHTML = val
    }
  )
}
