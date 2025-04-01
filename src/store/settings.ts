import {BlockItem, BlockType} from '@/enum/page-craft/block'
import {TabType} from '@/enum/page-craft/inventory'
import {LS_SettingsKey, LdThemeType} from '@/enum/settings'
import {DEFAULT_THEME} from '@canwdev/vgo-ui/src/components/ViewPortWindow/utils/use-theme'
import {IComponentInStore} from '@/components/PageCraft/ComponentExplorer/enum'

type IStore = {
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
  enableFocusAutoAction: boolean

  showInventory: boolean
  inventoryTab: TabType
  // inventory window docked to toolbar
  isInvDocked: boolean
  showStyleEditor: boolean
  toolbarIndex: number
  toolbarList: BlockItem[]
  // 当前正在编辑的组件，如果为空则显示默认画布
  curCompInStore: IComponentInStore | null

  autoCheckUpdate: boolean
  // 网页版推荐下载桌面客户端
  recommendDesktopClient: boolean

  // AI
  openAiApiKey: string
  openAiApiProxy: string
}

export const useSettingsStore = defineStore('settingsStore', {
  state: (): IStore => {
    return {
      ldTheme: LdThemeType.SYSTEM,
      customTheme: DEFAULT_THEME,
      themeColor: '#009688',
      desktopBgColor: '',
      desktopWallpaper: '',
      disableAnimation: false,

      enableTopLayout: false,
      enableSoundFx: true,
      enableFocusAutoAction: false,

      showInventory: false,
      inventoryTab: TabType.COMPONENTS,
      isInvDocked: true,
      showStyleEditor: false,
      toolbarIndex: 0,
      toolbarList: [],
      curCompInStore: null,

      autoCheckUpdate: true,
      recommendDesktopClient: true,

      openAiApiKey: '',
      openAiApiProxy: '',
    }
  },
  persist: {
    key: LS_SettingsKey.LS_KEY_PAGECRAFT_SETTINGS,
  },
})
