import {
  CopyMode,
  DirTreeItem,
  formatTranslateTreeItem,
  ITranslateTreeItem,
} from '@/enum/vue-i18n-tool'

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

  // 自动粘贴功能全局变量
  // handleAutoAdd 专用临时id
  trAutoAddGuid: string | null
  // 上一个复制模式
  trLastCopyMode: CopyMode
  // 是否手动添加翻译项目（用于自动focus输入框）
  trIsManualAdd: boolean
  // 是否在加载中
  isLoading: boolean
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

      // 自动粘贴功能全局变量
      trAutoAddGuid: null,
      trLastCopyMode: CopyMode.ORIGINAL,
      trIsManualAdd: false,
      isLoading: false,
    }
  },
})
