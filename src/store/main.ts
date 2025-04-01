import {ActionBlockItems} from '@/enum/page-craft/block'
import {BlockItem} from '@/enum/page-craft/block'
import {CopyMode} from '@/enum/vue-i18n-tool'
import {PageCraftKeys} from '@/enum'

type IStore = {
  isAppDarkMode: boolean

  // PageCraft 专用
  currentBlock: BlockItem
  className: string
  innerText: string
  // 是否处于元素选择状态
  selecting: boolean

  // 窗口打开状态
  isShowQuickLaunch: boolean
  isShowIframeBrowser: boolean

  upgradeInfo: string
}

export const useMainStore = defineStore('main', {
  state: (): IStore => {
    return {
      isAppDarkMode: true,

      currentBlock:
        JSON.parse(localStorage.getItem(PageCraftKeys.CURRENT_BLOCK) || 'null') ||
        ActionBlockItems.EMPTY,
      className: '',
      innerText: '',
      selecting: false,

      isShowQuickLaunch: false,
      isShowIframeBrowser: false,

      upgradeInfo: '',
    }
  },
  actions: {
    setCurrentBlock(block: BlockItem) {
      this.currentBlock = block
      localStorage.setItem(PageCraftKeys.CURRENT_BLOCK, JSON.stringify(block))
    },
  },
  share: {
    // 这些变量不参与多页面数据共享
    // An array of fields that the plugin will ignore.
    omit: ['isShowQuickLaunch', 'isShowIframeBrowser', 'upgradeInfo'],
    enable: true,
    initialize: true,
  },
})
