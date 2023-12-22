import {BlockItem, BlockType} from '@/enum/page-craft/block'
import {TabType} from '@/enum/page-craft/inventory'
import {CustomThemeType, FilterType, LdThemeType} from '@/enum/settings'

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
  // 禁用动画效果
  disableAnimation: boolean

  enableGlobalCss: boolean
  enableTopLayout: boolean
  enableSoundFx: boolean
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
  // i18n dir tool 是否为文件夹模式
  isFoldersMode: boolean
}

export const useSettingsStore = defineStore('settingsStore', {
  state: (): IPageCraftSettings => {
    return {
      ldTheme: LdThemeType.SYSTEM,
      customTheme: CustomThemeType.DEFAULT,
      enableRoundedTheme: true,
      enableAeroTheme: false,
      themeColor: '#258292',
      disableAnimation: false,

      enableGlobalCss: true,
      enableTopLayout: false,
      enableSoundFx: true,
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
      isFoldersMode: true,
    }
  },
  persist: {
    key: 'ls_key_pagecraft_settings',
  },
})
