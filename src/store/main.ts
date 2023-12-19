import {ActionBlockItems} from '@/enum/page-craft/block'
import {BlockItem} from '@/enum/page-craft/block'
import {LsKeys} from '@/enum/page-craft'
import {CopyMode} from '@/enum/vue-i18n-tool'

type CraftStore = {
  currentBlock: BlockItem
  className: string
  innerText: string
  isSelectMode: boolean
  isAppDarkMode: boolean
  // handleAutoAdd 专用临时id
  trAutoAddGuid: string | null
  // 上一个复制模式
  trLastCopyMode: CopyMode
  // 是否手动添加翻译项目（用于自动focus输入框）
  trIsManualAdd: boolean
}

export const useMainStore = defineStore('main', {
  state: (): CraftStore => {
    return {
      currentBlock:
        JSON.parse(localStorage.getItem(LsKeys.CURRENT_BLOCK) || 'null') || ActionBlockItems.EMPTY,
      className: '',
      innerText: '',
      isSelectMode: false,
      isAppDarkMode: true,
      trAutoAddGuid: null,
      trLastCopyMode: CopyMode.ORIGINAL,
      trIsManualAdd: false,
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
