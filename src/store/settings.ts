import {BlockItem, BlockType} from '@/enum/page-craft/block'
import {TabType} from '@/enum/page-craft/inventory'
import {CustomThemeType, FilterType, LdThemeType} from '@/enum/settings'

interface IPageCraftSettings {
  ldTheme: LdThemeType
  customTheme: string
  // transparent blur effect
  enableAeroTheme: boolean
  enableRoundedTheme: boolean
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
      enableAeroTheme: false,
      enableRoundedTheme: true,
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
