import {LsKeys} from '@/enum/page-craft'
import {useLocalStorageObject, useLocalStorageString} from '@/hooks/use-local-storage'
import {
  BlockItem,
  createComponentBlockItem,
  ComponentData,
  BlockType,
} from '@/enum/page-craft/block'
import {syncStorageData} from '@/utils/global-event-bus'
import {getFileName, handleExportFile, handleReadSelectedFile} from '@/utils/exporter'
import {useSettingsStore} from '@/store/settings'
import {
  autoCreateParentFolderSync,
  copyFolderSync,
  deleteFolderRecursiveSync,
  fs,
} from '@/utils/bfs'

export const folderPrefix = '/pagecraft'
if (!fs.existsSync(folderPrefix)) {
  fs.mkdirSync(folderPrefix)
}

export const loadComponentHtml = (name) => {
  if (!name) {
    return ''
  }
  const content = fs.readFileSync(`${folderPrefix}/${name}/template.html`)
  return content.toString()
}
export const saveComponentHtml = (name, html = '') => {
  const filepath = `${folderPrefix}/${name}/template.html`
  autoCreateParentFolderSync(filepath)
  fs.writeFile(filepath, html)
}
export const loadComponentStyle = (name) => {
  if (!name) {
    return ''
  }
  const content = fs.readFileSync(`${folderPrefix}/${name}/style.scss`)
  return content.toString()
}
export const saveComponentStyle = (name, style = '') => {
  const filepath = `${folderPrefix}/${name}/style.scss`
  autoCreateParentFolderSync(filepath)
  fs.writeFile(filepath, style)
}

export const useCompStorage = () => {
  const settingsStore = useSettingsStore()

  const loadCurCompHtml = () => {
    return loadComponentHtml(settingsStore.curCompoName)
  }
  const saveCurCompHtml = (html: string) => {
    saveComponentHtml(settingsStore.curCompoName, html)
  }

  const loadCurCompStyle = () => {
    return loadComponentStyle(settingsStore.curCompoName)
  }
  const saveCurCompStyle = (style: string) => {
    saveComponentStyle(settingsStore.curCompoName, style)
  }

  const clearCompStorage = (name) => {
    deleteFolderRecursiveSync(`${folderPrefix}/${name}`)
  }

  const renameCompStorage = (name, newName: string) => {
    fs.renameSync(`${folderPrefix}/${name}`, `${folderPrefix}/${newName}`)
  }

  const copyCompStorage = (name, newName: string) => {
    copyFolderSync(`${folderPrefix}/${name}`, `${folderPrefix}/${newName}`)
    // 更新时间
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

// 从文件系统读取所有组件
const loadAllComponents = () => {
  const list: BlockItem[] = []
  const files = fs.readdirSync(folderPrefix)
  files.forEach((filename) => {
    const isDirectory = fs.lstatSync(`${folderPrefix}/${filename}`).isDirectory()
    if (isDirectory) {
      let data = {}
      // 组件元数据
      const dataPath = `${folderPrefix}/${filename}/index.json`
      if (fs.existsSync(dataPath)) {
        const res = fs.readFileSync(dataPath)
        data = JSON.parse(res.toString())
      }
      list.push(createComponentBlockItem(filename, data))
    }
  })
  return list
}

export const useCompImportExport = () => {
  const componentList = ref(loadAllComponents())

  const updateCompMeta = (name: string, data: ComponentData) => {
    const filepath = `${folderPrefix}/${name}/index.json`
    autoCreateParentFolderSync(filepath)
    fs.writeFile(filepath, JSON.stringify(data))
  }

  const handleImportAllJson = async (file) => {
    const str = await handleReadSelectedFile(file)
    const importList: ComponentData[] = JSON.parse(str as string).map((i) => new ComponentData(i))

    const newList: BlockItem[] = []
    importList.forEach((item) => {
      newList.push(createComponentBlockItem(item.name, item))

      const metaPath = `${folderPrefix}/${item.name}/index.json`
      autoCreateParentFolderSync(metaPath)
      // 组件元数据
      fs.writeFile(
        metaPath,
        JSON.stringify(
          new ComponentData({
            timestamp: item.cover,
            stared: item.cover,
            cover: item.cover,
          })
        )
      )
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

  const handleExportAllJson = async ({list}) => {
    await syncStorageData()
    let exportList: ComponentData[] = []
    list = list || componentList.value

    list.forEach((item) => {
      exportList.push(
        new ComponentData({
          name: item.title,
          html: loadComponentHtml(item.title),
          style: loadComponentStyle(item.title),
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
