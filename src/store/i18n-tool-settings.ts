import {TextConvertMode} from '@/components/VueI18nEditTool/copy-enum'

type IState = {
  // 文件夹编辑器:是否为文件夹模式
  isFoldersMode: boolean
  // 自动粘贴: 去掉引号
  autoPasteTrimQuotes: boolean
  // 自动粘贴: 文本转换器模式
  autoPasteTextConvertMode: TextConvertMode
  ignoreFolders: string[]
}

export const useI18nToolSettingsStore = defineStore('i18nToolSettings', {
  state: (): IState => {
    return {
      isFoldersMode: true,
      autoPasteTrimQuotes: true,
      autoPasteTextConvertMode: TextConvertMode.TEXT,
      ignoreFolders: ['node_modules', '.git', '.idea', '.vscode', '.DS_Store'],
    }
  },
  getters: {
    ignoreFoldersMap(): {[key: string]: boolean} {
      const map = {}
      this.ignoreFolders.forEach((item) => {
        map[item] = true
      })

      return map
    },
  },
  persist: {
    key: 'ls_key_i18n_tool_settings',
  },
})
