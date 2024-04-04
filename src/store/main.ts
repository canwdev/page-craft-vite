import {ActionBlockItems} from '@/enum/page-craft/block'
import {BlockItem} from '@/enum/page-craft/block'
import {LsKeys} from '@/enum/page-craft'
import {CopyMode} from '@/enum/vue-i18n-tool'

type IStore = {
  isAppDarkMode: boolean

  // PageCraft 专用
  currentBlock: BlockItem
  className: string
  innerText: string
  // 是否处于元素选择状态
  selecting: boolean

  // 窗口打开状态
  isShowStylusTools: boolean
  isShowTextTransformer: boolean
  isShowSettings: boolean
  isShowQuickLaunch: boolean
  isShowIframeBrowser: boolean

  upgradeInfo: string
}

export const useMainStore = defineStore('main', {
  state: (): IStore => {
    return {
      isAppDarkMode: true,

      currentBlock:
        JSON.parse(localStorage.getItem(LsKeys.CURRENT_BLOCK) || 'null') || ActionBlockItems.EMPTY,
      className: '',
      innerText: '',
      selecting: false,

      isShowStylusTools: false,
      isShowTextTransformer: false,
      isShowSettings: false,
      isShowQuickLaunch: false,
      isShowIframeBrowser: false,

      upgradeInfo: '',
    }
  },
  actions: {
    setCurrentBlock(block: BlockItem) {
      this.currentBlock = block
      localStorage.setItem(LsKeys.CURRENT_BLOCK, JSON.stringify(block))
    },
  },
  share: {
    // 这些变量不参与多页面数据共享
    // An array of fields that the plugin will ignore.
    omit: [
      'isShowStylusTools',
      'isShowTextTransformer',
      'isShowSettings',
      'isShowQuickLaunch',
      'isShowIframeBrowser',
      'upgradeInfo',
    ],
    enable: true,
    initialize: true,
  },
})
