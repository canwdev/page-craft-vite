import {blockDiv} from "@/enum/block";
import {BlockItem} from "@/enum/block";

const LS_KEY_CURRENT_BLOCK = 'page_craft_current_block'


export const useCraftStore = defineStore('craft', {
  state: () => {
    return {
      currentBlock: JSON.parse(localStorage.getItem(LS_KEY_CURRENT_BLOCK) || 'null') || blockDiv,
      className: '',
      innerText: '',
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    setCurrentBlock(block: BlockItem) {
      localStorage.setItem(LS_KEY_CURRENT_BLOCK, JSON.stringify(block))
      this.currentBlock = block
    },
  },
})
