import {BlockItem, BlockType} from '@/enum/page-craft/block'
import {TabType} from '@/enum/page-craft/inventory'
import {LdThemeType} from '@/enum/settings'
import {DEFAULT_THEME} from '@/components/CommonUI/ViewPortWindow/utils/use-theme'
import {StyleTabType} from '@/components/StyleEditor/enum'

interface IPageCraftSettings {
  // 明暗主题
  ldTheme: LdThemeType
  // 自定义主题类型
  customTheme: string
  // 主题色
  themeColor: string
  // 桌面壁纸url
  desktopWallpaper: string
  // 桌面背景色
  desktopBgColor: string
  // 禁用动画效果
  disableAnimation: boolean

  enableTopLayout: boolean
  enableSoundFx: boolean
  // 是否启用参考图
  enableReferenceMap: boolean
  enableFocusAutoAction: boolean

  showInventory: boolean
  inventoryTab: TabType
  inventoryIsLargeCard: boolean
  // inventory window docked to toolbar
  isInvDocked: boolean
  showStyleEditor: boolean
  toolbarIndex: number
  toolbarList: BlockItem[]
  // selected component dir path
  curCompPath: string

  autoCheckUpdate: boolean
  // 网页版推荐下载桌面客户端
  recommendDesktopClient: boolean
}

export const useSettingsStore = defineStore('settingsStore', {
  state: (): IPageCraftSettings => {
    return {
      ldTheme: LdThemeType.SYSTEM,
      customTheme: DEFAULT_THEME,
      themeColor: '#258292',
      desktopBgColor: '',
      desktopWallpaper: '',
      disableAnimation: false,

      enableTopLayout: false,
      enableSoundFx: true,
      enableReferenceMap: false,
      enableFocusAutoAction: false,

      showInventory: false,
      inventoryTab: TabType.COMPONENTS,
      inventoryIsLargeCard: false,
      isInvDocked: true,
      showStyleEditor: false,
      toolbarIndex: 0,
      toolbarList: [],
      curCompPath: '',

      autoCheckUpdate: true,
      recommendDesktopClient: true,
    }
  },
  persist: {
    key: 'ls_key_pagecraft_settings',
  },
})
