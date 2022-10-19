import {ActionBlockItems} from '@/enum/block'
import {BlockItem} from '@/enum/block'
import {LsKeys} from '@/enum'

type CraftStore = {
  currentBlock: BlockItem
  className: string
  innerText: string
  isSelectMode: boolean
  currentComponentName: string
}

export const useCraftStore = defineStore('craft', {
  state: (): CraftStore => {
    return {
      currentBlock:
        JSON.parse(localStorage.getItem(LsKeys.CURRENT_BLOCK) || 'null') || ActionBlockItems.DEBUG,
      className: '',
      innerText: '',
      isSelectMode: false,
      currentComponentName: '',
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
