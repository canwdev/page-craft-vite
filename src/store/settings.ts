import {BlockItem, BlockType} from '@/enum/page-craft/block'

export enum LdThemeType {
  SYSTEM = 0,
  LIGHT = 1,
  DARK = 2,
}

export const ldThemeOptions = [
  {
    label: 'Follow System',
    value: LdThemeType.SYSTEM,
  },
  {
    label: 'Light Theme',
    value: LdThemeType.LIGHT,
  },
  {
    label: 'Dark Theme',
    value: LdThemeType.DARK,
  },
]

export enum CustomThemeType {
  DEFAULT = 'theme-default',
  WIN8 = 'theme-win8',
  CLASSIC = 'theme-classic',
  MINIMALISM = 'theme-minimalism',
}

export const customThemeOptions = [
  {
    label: 'Default',
    value: CustomThemeType.DEFAULT,
  },
  {
    label: 'Minimalism',
    value: CustomThemeType.MINIMALISM,
  },
  {
    label: 'Win8',
    value: CustomThemeType.WIN8,
  },
  {
    label: 'Classic',
    value: CustomThemeType.CLASSIC,
  },
]

interface IPageCraftSettings {
  ldTheme: LdThemeType
  customTheme: string
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
      ldTheme: LdThemeType.SYSTEM,
      customTheme: CustomThemeType.DEFAULT,
      enableAeroTheme: false,
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
