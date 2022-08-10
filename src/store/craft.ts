import {blockDiv} from "@/enum/block";
import {BlockItem} from "@/enum/block";

export const useCraftStore = defineStore('craft', {
  state: () => {
    return {
      currentBlock: blockDiv,
      className: '',
      innerText: '',
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    setCurrentBlock(block: BlockItem) {
      console.log('block', block)
      this.currentBlock = block
    },
  },
})
