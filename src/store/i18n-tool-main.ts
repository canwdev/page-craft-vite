import {DirTreeItem} from '@/enum/vue-i18n-tool'

type IState = {
  dirTree: DirTreeItem[]
  filePathArr: string[]
  translatePath: string
}

export const useI18nMainStore = defineStore('i18nToolMain', {
  state: (): IState => {
    return {
      dirTree: [],
      filePathArr: [],
      translatePath: '',
    }
  },
})
