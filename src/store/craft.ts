import {blockDiv} from '@/enum/block'
import {BlockItem} from '@/enum/block'
import {LS_KEYS} from '@/enum'

export const useCraftStore = defineStore('craft', {
  state: () => {
    return {
      currentBlock: JSON.parse(localStorage.getItem(LS_KEYS.CURRENT_BLOCK) || 'null') || blockDiv,
      className: '',
      innerText: '',
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    setCurrentBlock(block: BlockItem) {
      localStorage.setItem(LS_KEYS.CURRENT_BLOCK, JSON.stringify(block))
      this.currentBlock = block
    },
  },
})
