import {LsKeys} from '@/enum/page-craft'
import {
  BlockItem,
  ComponentData,
  ComponentExportData,
  createComponentBlockItem,
} from '@/enum/page-craft/block'
import globalEventBus, {GlobalEvents, syncStorageData} from '@/utils/global-event-bus'
import {getFileName, handleExportFile, handleReadSelectedFile} from '@/utils/exporter'
import {useSettingsStore} from '@/store/settings'

const SPLIT_SIGN = '__'

const renameLsKey = (key: string, newKey: string) => {
  const value = localStorage.getItem(key) || ''
  localStorage.setItem(newKey, value)
  localStorage.removeItem(key)
}

const copyLsKey = (key: string, newKey: string) => {
  const value = localStorage.getItem(key) || ''
  localStorage.setItem(newKey, value)
}

// 读写组件存储
export const loadCompStorage = (lsKey: LsKeys, name: string) => {
  return localStorage.getItem(lsKey + SPLIT_SIGN + name) || ''
}
export const saveCompStorage = (lsKey: LsKeys, name: string, value: string) => {
  return localStorage.setItem(lsKey + SPLIT_SIGN + name, value)
}

export const useCompStorage = () => {
  const settingsStore = useSettingsStore()

  const getKeyWithSuffix = (key: string, suffix = settingsStore.curCompoName) => {
    if (suffix) {
      return key + SPLIT_SIGN + suffix
    } else {
      return key
    }
  }

  const loadCurCompHtml = () => {
    return localStorage.getItem(getKeyWithSuffix(LsKeys.COMP_HTML)) || ''
  }
  const saveCurCompHtml = (text: string) => {
    localStorage.setItem(getKeyWithSuffix(LsKeys.COMP_HTML), text)
  }

  const loadCurCompStyle = () => {
    return localStorage.getItem(getKeyWithSuffix(LsKeys.COMP_STYLE)) || ''
  }
  const saveCurCompStyle = (text: string) => {
    localStorage.setItem(getKeyWithSuffix(LsKeys.COMP_STYLE), text)
  }

  const availableKeys = [LsKeys.COMP_HTML, LsKeys.COMP_STYLE, LsKeys.COMP_META]

  const clearCompStorage = (name: string) => {
    availableKeys.forEach((key) => {
      localStorage.removeItem(getKeyWithSuffix(key, name))
    })
  }

  const renameCompStorage = (name: string, newName: string) => {
    availableKeys.forEach((key) => {
      renameLsKey(getKeyWithSuffix(key, name), getKeyWithSuffix(key, newName))
    })
  }

  const copyCompStorage = (name: string, newName: string) => {
    availableKeys.forEach((key) => {
      copyLsKey(getKeyWithSuffix(key, name), getKeyWithSuffix(key, newName))
    })
  }

  return {
    loadCurCompHtml,
    saveCurCompHtml,
    loadCurCompStyle,
    saveCurCompStyle,
    clearCompStorage,
    renameCompStorage,
    copyCompStorage,
  }
}

/**
 * 自动升级数据 COMPONENT_LIST -> COMP_INDEX_LIST
 */
const autoMigrateData = () => {
  const oldList: null | any[] = JSON.parse(localStorage.getItem(LsKeys.COMPONENT_LIST) || 'null')
  if (oldList && oldList.length) {
    oldList.forEach((item) => {
      const data = item.data
      delete data.name
      saveCompStorage(LsKeys.COMP_META, item.title, JSON.stringify(data))
    })
    localStorage.setItem(
      LsKeys.COMP_INDEX_LIST,
      JSON.stringify(
        oldList.map((item) => {
          return {name: item.title}
        })
      )
    )
    localStorage.removeItem(LsKeys.COMPONENT_LIST)
    console.log('[autoMigrateData] complete!')
  }
}
autoMigrateData()

export const useCompImportExport = () => {
  // const componentList = useLocalStorageObject(LsKeys.COMPONENT_LIST, [])

  const loadComponentList = (): BlockItem[] => {
    const rawList: any[] = JSON.parse(localStorage.getItem(LsKeys.COMP_INDEX_LIST) || 'null') || []

    return rawList.map(({name}) => {
      // 读取详细信息并组成组件列表
      return createComponentBlockItem(
        name,
        JSON.parse(loadCompStorage(LsKeys.COMP_META, name) || '{}')
      )
    })
  }
  const componentList = ref<BlockItem[]>(loadComponentList())

  watch(componentList, (val) => {
    if (val) {
      // 只保存组件名
      localStorage.setItem(
        LsKeys.COMP_INDEX_LIST,
        JSON.stringify(
          val.map((item) => {
            return {name: item.title}
          })
        )
      )
    } else {
      localStorage.removeItem(LsKeys.COMP_INDEX_LIST)
    }
  })

  /**
   * 更新组件元数据，注意：创建、复制或更新组件都要调用此函数！
   * @param name 组件名
   * @param data 组件元数据
   */
  const updateCompMeta = (name: string, data: ComponentData) => {
    globalEventBus.emit(GlobalEvents.ON_COMP_HOVER_CLEAR)
    saveCompStorage(LsKeys.COMP_META, name, JSON.stringify(data))
  }

  const handleImportAllJson = async (file) => {
    const str = await handleReadSelectedFile(file)
    const importList: ComponentExportData[] = JSON.parse(str as string)

    const newList: BlockItem[] = []
    importList.forEach((item: ComponentExportData) => {
      const meta: ComponentData = {...item}
      delete meta.name
      newList.push(createComponentBlockItem(item.name, meta))
      saveCompStorage(LsKeys.COMP_HTML, item.name, item.html)
      saveCompStorage(LsKeys.COMP_STYLE, item.name, item.style)
      saveCompStorage(LsKeys.COMP_META, item.name, JSON.stringify(new ComponentData(meta)))
    })

    /*merge items start*/
    // Merge old item if name is same
    const list1: BlockItem[] = []
    const list2: BlockItem[] = [...componentList.value]
    newList.forEach((item) => {
      const idx = list2.findIndex((i) => i.title === item.title)
      if (idx > -1) {
        list2.splice(idx, 1, item)
      } else {
        list1.push(item)
      }
    })
    componentList.value = [...list1, ...list2]
    /*merge items end*/

    window.$message.success('Import success!')
  }

  type ExportOptions = {
    list: BlockItem[]
  }
  const handleExportAllJson = async ({list}: ExportOptions) => {
    await syncStorageData()
    let exportList: ComponentExportData[] = []
    list = list || componentList.value

    list.forEach((item: BlockItem) => {
      exportList.push(
        new ComponentExportData({
          name: item.title,
          html: loadCompStorage(LsKeys.COMP_HTML, item.title),
          style: loadCompStorage(LsKeys.COMP_STYLE, item.title),
          timestamp: item.data.timestamp,
          stared: item.data.stared,
          cover: item.data.cover,
        })
      )
    })

    // console.log(exportList)
    handleExportFile(getFileName('', 'PageCraftAllComponents'), JSON.stringify(exportList), '.json')
    window.$message.success('Exported success!')
  }

  return {
    componentList,
    handleExportAllJson,
    handleImportAllJson,
    updateCompMeta,
  }
}
