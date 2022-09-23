import {ActionBlockItems} from '@/enum/block'
import {BlockItem} from '@/enum/block'
import {LS_KEYS} from '@/enum'

type CraftStore = {
  currentBlock: BlockItem
  className: string
  innerText: string
  isSelectMode: boolean
}

export const useCraftStore = defineStore('craft', {
  state: (): CraftStore => {
    return {
      currentBlock:
        JSON.parse(localStorage.getItem(LS_KEYS.CURRENT_BLOCK) || 'null') ||
        ActionBlockItems.SELECTION,
      className: '',
      innerText: '',
      isSelectMode: false,
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    setCurrentBlock(block: BlockItem) {
      this.currentBlock = block
      localStorage.setItem(LS_KEYS.CURRENT_BLOCK, JSON.stringify(block))
    },
  },
})
