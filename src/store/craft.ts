import {ActionBlockItems} from '@/enum/page-craft/block'
import {BlockItem} from '@/enum/page-craft/block'
import {LsKeys} from '@/enum/page-craft'

type CraftStore = {
  currentBlock: BlockItem
  className: string
  innerText: string
  isSelectMode: boolean
  isAppDarkMode: boolean
}

export const useCraftStore = defineStore('craft', {
  state: (): CraftStore => {
    return {
      currentBlock:
        JSON.parse(localStorage.getItem(LsKeys.CURRENT_BLOCK) || 'null') || ActionBlockItems.DEBUG,
      className: '',
      innerText: '',
      isSelectMode: false,
      isAppDarkMode: true,
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    setCurrentBlock(block: BlockItem) {
      this.currentBlock = block
      localStorage.setItem(LsKeys.CURRENT_BLOCK, JSON.stringify(block))
    },
  },
})
