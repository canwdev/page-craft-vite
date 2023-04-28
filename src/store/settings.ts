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
  enableGlobalCss: boolean
  enableTopLayout: boolean
  isInitialized: boolean
  showInventory: boolean
  inventoryTab: BlockType
  showStyleEditor: boolean
  toolbarIndex: number
  toolbarList: BlockItem[]
  curCompoName: string
}

export const useSettingsStore = defineStore('settingsStore', {
  state: (): IPageCraftSettings => {
    return {
      theme: ThemeType.SYSTEM,
      enableGlobalCss: true,
      enableTopLayout: false,
      isInitialized: false,
      showInventory: false,
      inventoryTab: BlockType.COMPONENT,
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
