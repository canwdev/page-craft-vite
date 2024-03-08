import {DirTreeItem} from '@/enum/vue-i18n-tool'

type ChangedLabelMap = {
  [key: string]: boolean
}

type IState = {
  dirTree: DirTreeItem[]
  filePathArr: string[]
  translatePath: string
  changedLabelMap: ChangedLabelMap
}

export const useI18nMainStore = defineStore('i18nToolMain', {
  state: (): IState => {
    return {
      dirTree: [],
      filePathArr: [],
      translatePath: '',
      changedLabelMap: {},
    }
  },
})
