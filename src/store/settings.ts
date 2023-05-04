import {BlockItem, BlockType} from '@/enum/page-craft/block'

export enum ThemeType {
  SYSTEM = 0,
  LIGHT = 1,
  DARK = 2,
}

export const themeOptions = [
  {
    label: 'Follow System',
    value: ThemeType.SYSTEM,
  },
  {
    label: 'Light Theme',
    value: ThemeType.LIGHT,
  },
  {
    label: 'Dark Theme',
    value: ThemeType.DARK,
  },
]

interface IPageCraftSettings {
  theme: ThemeType
  enableAeroTheme: boolean // transparent blur effect
  enableRoundedTheme: boolean
  enableGlobalCss: boolean
  enableTopLayout: boolean
  isInitialized: boolean
  showInventory: boolean
  inventoryTab: BlockType
  isInvAttached: boolean // inventory window attached to tool bar
  showStyleEditor: boolean
  toolbarIndex: number
  toolbarList: BlockItem[]
  curCompoName: string // selected component name
}

export const useSettingsStore = defineStore('settingsStore', {
  state: (): IPageCraftSettings => {
    return {
      theme: ThemeType.SYSTEM,
      enableAeroTheme: true,
      enableRoundedTheme: true,
      enableGlobalCss: true,
      enableTopLayout: false,
      isInitialized: false,
      showInventory: false,
      inventoryTab: BlockType.COMPONENT,
      isInvAttached: true,
      showStyleEditor: false,
      toolbarIndex: 0,
      toolbarList: [],
      curCompoName: '',
    }
  },
  persist: {
    key: 'ls_key_pagecraft_settings',
  },
})
