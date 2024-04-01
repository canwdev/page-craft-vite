import {DirTreeItem, formatTranslateTreeItem, ITranslateTreeItem} from '@/enum/vue-i18n-tool'

// 批量处理文件（夹）列表
export interface BatchListItem {
  dirItem: DirTreeItem
  rootDir: DirTreeItem
  // 翻译文件的json对象
  json: object | null
}

type ChangedLabelMap = {
  [key: string]: boolean
}

type IState = {
  dirTree: DirTreeItem[]
  // 当前选中文件的翻译树
  translateTreeRoot: ITranslateTreeItem[]
  filePathArr: string[]
  translatePath: string
  changedLabelMap: ChangedLabelMap
  batchList: BatchListItem[]
}

export const useI18nMainStore = defineStore('i18nToolMain', {
  state: (): IState => {
    return {
      dirTree: [],
      translateTreeRoot: [],
      filePathArr: [],
      translatePath: '',
      changedLabelMap: {},
      batchList: [],
    }
  },
})
