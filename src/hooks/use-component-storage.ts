import {useCraftStore} from '@/store/craft'
import {LsKeys} from '@/enum/page-craft'
import {useLocalStorageObject, useLocalStorageString} from '@/hooks/use-local-storage'
import {BlockItem, createComponentBlockItem, ExportItem} from '@/enum/page-craft/block'
import {syncStorageData} from '@/utils/global-event-bus'
import {getFileName, handleExportFile, handleReadSelectedFile} from '@/utils/exporter'

const splitter = '__'

const renameLocalStorageKey = (key: string, newKey: string) => {
  const value = localStorage.getItem(key) || ''
  localStorage.setItem(newKey, value)
  localStorage.removeItem(key)
}

const copyLocalStorageKey = (key: string, newKey: string) => {
  const value = localStorage.getItem(key) || ''
  localStorage.setItem(newKey, value)
}

export const loadComponentHtml = (name) => {
  return localStorage.getItem(LsKeys.MAIN_HTML + splitter + name) || ''
}
export const saveComponentHtml = (name, html = '') => {
  return localStorage.setItem(LsKeys.MAIN_HTML + splitter + name, html)
}
export const loadComponentStyle = (name) => {
  return localStorage.getItem(LsKeys.MAIN_STYLE + splitter + name) || ''
}
export const saveComponentStyle = (name, style = '') => {
  return localStorage.setItem(LsKeys.MAIN_STYLE + splitter + name, style)
}

export const useCompStorage = () => {
  const craftStore = useCraftStore()

  const getKeyWithSuffix = (key: string, suffix = craftStore.currentComponentName) => {
    if (suffix) {
      return key + splitter + suffix
    } else {
      return key
    }
  }

  const loadCurCompHtml = () => {
    return localStorage.getItem(getKeyWithSuffix(LsKeys.MAIN_HTML)) || ''
  }
  const saveCurCompHtml = (text: string) => {
    localStorage.setItem(getKeyWithSuffix(LsKeys.MAIN_HTML), text)
  }

  const loadCurCompStyle = () => {
    return localStorage.getItem(getKeyWithSuffix(LsKeys.MAIN_STYLE)) || ''
  }
  const saveCurCompStyle = (text: string) => {
    localStorage.setItem(getKeyWithSuffix(LsKeys.MAIN_STYLE), text)
  }

  const clearCompStorage = (name) => {
    localStorage.removeItem(getKeyWithSuffix(LsKeys.MAIN_HTML, name))
    localStorage.removeItem(getKeyWithSuffix(LsKeys.MAIN_STYLE, name))
  }

  const renameCompStorage = (name, newName: string) => {
    renameLocalStorageKey(
      getKeyWithSuffix(LsKeys.MAIN_HTML, name),
      getKeyWithSuffix(LsKeys.MAIN_HTML, newName)
    )
    renameLocalStorageKey(
      getKeyWithSuffix(LsKeys.MAIN_STYLE, name),
      getKeyWithSuffix(LsKeys.MAIN_STYLE, newName)
    )
  }

  const copyCompStorage = (name, newName: string) => {
    copyLocalStorageKey(
      getKeyWithSuffix(LsKeys.MAIN_HTML, name),
      getKeyWithSuffix(LsKeys.MAIN_HTML, newName)
    )
    copyLocalStorageKey(
      getKeyWithSuffix(LsKeys.MAIN_STYLE, name),
      getKeyWithSuffix(LsKeys.MAIN_STYLE, newName)
    )
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

export const useCompImportExport = () => {
  const componentList = useLocalStorageObject(LsKeys.COMPONENT_LIST, [])
  const currentComponentName = useLocalStorageString(LsKeys.CURRENT_COMPONENT_NAME, '')

  const handleImportAll = async (file) => {
    const str = await handleReadSelectedFile(file)
    const importList: ExportItem[] = JSON.parse(str as string).map((i) => new ExportItem(i))

    const newList: BlockItem[] = []
    importList.forEach((item) => {
      newList.push(createComponentBlockItem(item.name, {timestamp: item.timestamp}))
      saveComponentHtml(item.name, item.html)
      saveComponentStyle(item.name, item.style)
    })

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

    window.$message.success('Import success!')
  }

  const exportAll = async () => {
    await syncStorageData()
    const exportList: ExportItem[] = []
    componentList.value.forEach((item) => {
      exportList.push(
        new ExportItem({
          name: item.title,
          html: loadComponentHtml(item.title),
          style: loadComponentStyle(item.title),
          timestamp: item.data.timestamp,
        })
      )
    })

    // console.log(exportList)
    handleExportFile(getFileName('', 'PageCraftAllComponents'), JSON.stringify(exportList), '.json')
    window.$message.success('Exported success!')
  }
  return {
    currentComponentName,
    componentList,
    exportAll,
    handleImportAll,
  }
}
