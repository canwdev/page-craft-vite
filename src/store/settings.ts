import {BlockItem, BlockType} from '@/enum/page-craft/block'
import {TabType} from '@/enum/page-craft/inventory'
import {FilterType, LdThemeType} from '@/enum/settings'
import {StyleTabType} from '@/enum/page-craft/styles'
import {CustomThemeType} from '@/components/CommonUI/ViewPortWindow/enum'

interface IPageCraftSettings {
  // 明暗主题
  ldTheme: LdThemeType
  // 自定义主题类型
  customTheme: CustomThemeType
  // 圆角主题
  enableRoundedTheme: boolean
  // 开启半透明模糊UI
  enableAeroTheme: boolean
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
  enableGlobalStyle: boolean
  // 是否启用参考图
  enableReferenceMap: boolean
  // 是否启用欢迎页面
  enableWelcomePage: boolean
  isShowIframeBrowser: boolean

  isInitialized: boolean
  showInventory: boolean
  inventoryTab: TabType
  inventoryFilterType: FilterType
  inventoryIsLargeCard: boolean
  // inventory window attached to toolbar
  isInvAttached: boolean
  showStyleEditor: boolean
  toolbarIndex: number
  toolbarList: BlockItem[]
  // selected component name
  curCompoName: string
  styleEditorTab: StyleTabType
}

export const useSettingsStore = defineStore('settingsStore', {
  state: (): IPageCraftSettings => {
    return {
      ldTheme: LdThemeType.SYSTEM,
      customTheme: CustomThemeType.DEFAULT,
      enableRoundedTheme: false,
      enableAeroTheme: false,
      themeColor: '#258292',
      desktopBgColor: '',
      desktopWallpaper: '',
      disableAnimation: false,

      enableTopLayout: false,
      enableSoundFx: true,
      enableGlobalStyle: true,
      enableReferenceMap: false,
      enableWelcomePage: true,
      isShowIframeBrowser: false,

      isInitialized: false,
      showInventory: false,
      inventoryTab: TabType.COMPONENTS,
      inventoryFilterType: FilterType.ALL,
      inventoryIsLargeCard: false,
      isInvAttached: true,
      showStyleEditor: false,
      toolbarIndex: 0,
      toolbarList: [],
      curCompoName: '',
      styleEditorTab: StyleTabType.CURRENT,
    }
  },
  persist: {
    key: 'ls_key_pagecraft_settings',
  },
})
