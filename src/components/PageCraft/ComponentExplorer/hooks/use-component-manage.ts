import * as changeCase from 'change-case'
import {showInputPrompt} from '@/components/CommonUI/input-prompt'
import {useI18n} from 'vue-i18n'
import {Ref} from 'vue'
import {IEntry} from '@/components/FileManager/types/filesystem'
import {fsWebApi} from '@/components/FileManager/utils/api'
import {normalizePath} from '@/components/FileManager/utils'
import {useSettingsStore} from '@/store/settings'
import {
  IComponentExportData,
  IComponentInStore,
  IComponentItem,
  IComponentMeta,
  regComponentV2,
} from '@/components/PageCraft/ComponentExplorer/enum'
import {guid} from '@/utils'
import {useStorage} from '@vueuse/core'
import {LsKeys} from '@/enum/page-craft'
import {BlockItem, BlockType, ComponentData} from '@/enum/page-craft/block'

import {promptGetFileName} from '@/utils/mc-utils/io'

let idx = 1
const SPLIT_SIGN_V1 = '__'
// 读写组件存储
export const loadCompV1Storage = (lsKey: LsKeys, name: string) => {
  return localStorage.getItem(lsKey + SPLIT_SIGN_V1 + name) || ''
}
export const saveCompV1Storage = (lsKey: LsKeys, name: string, value: string) => {
  return localStorage.setItem(lsKey + SPLIT_SIGN_V1 + name, value)
}

const getCompInStore = (item: IComponentItem, path): IComponentInStore => {
  if (!item.meta) {
    throw new Error('item has no meta')
  }
  return {
    id: item.meta.id,
    title: item.name.replace(regComponentV2, ''),
    path: path,
    basePath: item.basePath,
  }
}

export const createFile = async (basePath, name, content) => {
  await fsWebApi.createFile({
    path: normalizePath(basePath + '/' + name),
    file: content,
    isOverride: true,
  })
}

const loadFile = async (basePath, name, mode?) => {
  return await fsWebApi.getFile({
    path: normalizePath(basePath + '/' + name),
    mode,
  })
}

type Opts = {
  files: Ref<IEntry[]>
  basePath: Ref<string>
  isLoading: Ref<boolean>
  emit: any
}
export const useComponentManage = (options: Opts) => {
  const {files, basePath, isLoading, emit} = options
  const settingsStore = useSettingsStore()

  const {t: $t} = useI18n()

  const inputPrompt = (title = '', value = '', placeholder = '') => {
    return showInputPrompt({
      title,
      value,
      placeholder,
      validateFn: (val) => {
        if (files.value.find((item) => item.name === val)) {
          return $t('msgs.name_already_exists')
        }
      },
    })
  }

  // 检查文件名是否重复
  const checkNameExist = (name) => {
    console.log(name, files.value)
    if (files.value.some((f) => f.name === name)) {
      window.$message.error('Filename already exists, please rename it!')
      return true
    }
  }
  const handleCreateComponent = async () => {
    try {
      let name = await inputPrompt(
        $t('actions.add_component'),
        `Component${idx}`,
        $t('msgs.please_enter_the_nam'),
      )
      const folderName = `${name}.comp`
      if (checkNameExist(folderName)) {
        return
      }

      isLoading.value = true
      // 设置默认HTML、SCSS代码
      const className = changeCase.paramCase(name || 'my-component')
      const id = guid()
      await importComponentJson({
        id,
        name,
        timestamp: Date.now(),
        html: `<div class="${className}"></div>`,
        style: `.${className} {\n}\n`,
      })

      idx++

      emit('refresh')

      setTimeout(() => {
        // 设置当前选中的组件
        document.querySelector(`.mc-comp-item[data-name="${folderName}"]`)?.click()
      }, 100)
    } finally {
      isLoading.value = false
    }
  }

  const importComponentJson = async (item: IComponentExportData) => {
    const folderName = `${item.name}.comp`
    const subDirPath = normalizePath(basePath.value + '/' + folderName)
    await fsWebApi.createDir({path: subDirPath})

    const meta: IComponentMeta = {
      id: item.id || guid(),
      timeCreated: item.timestamp,
    }

    await createFile(subDirPath, 'index.json', JSON.stringify(meta))
    await createFile(subDirPath, 'index.html', item.html)
    await createFile(subDirPath, 'index.scss', item.style)
    if (item.cover) {
      await createFile(subDirPath, 'cover.base64', item.cover)
    }
  }

  const importComponentAllJson = async (importList: IComponentExportData[]) => {
    for (let i = 0; i < importList.length; i++) {
      await importComponentJson(importList[i])
    }
  }

  const exportComponentJson = async (item: IComponentItem) => {
    if (!item.meta) {
      throw new Error('item must has meta')
    }
    const subDirPath = normalizePath(basePath.value + '/' + item.name)

    const html = await loadFile(subDirPath, 'index.html')
    const style = await loadFile(subDirPath, 'index.scss')

    const json: IComponentExportData = {
      id: item.meta.id,
      name: item.name.replace(regComponentV2, ''),
      timestamp: item.meta.timeCreated,
      html,
      style,
      cover: item.meta.cover,
    }

    return json
  }

  const exportComponentAllJson = async (list: IComponentItem[]) => {
    const exportFileName = await promptGetFileName('', 'PageCraftAllComponents')
    if (!exportFileName) {
      return
    }

    const res: IComponentExportData[] = []
    for (let i = 0; i < list.length; i++) {
      res.push(await exportComponentJson(list[i]))
    }

    window.$mcUtils.handleExportFile(exportFileName, JSON.stringify(res, null, 2), '.json')
  }

  return {
    handleCreateComponent,
    importComponentAllJson,
    exportComponentAllJson,
    importComponentJson,
    exportComponentJson,
  }
}

export const useComponentStorageV2 = () => {
  const settingsStore = useSettingsStore()

  const openComponent = (item: IComponentItem, path: string) => {
    settingsStore.curCompInStore = getCompInStore(item, path)
  }

  const loadCurFile = async (filename: string) => {
    if (!settingsStore.curCompInStore) {
      return loadCompV1Storage(LsKeys.DEFAULT_CANVAS, filename)
    }
    const {path} = settingsStore.curCompInStore
    return await loadFile(path, filename)
  }

  const saveCurFile = async (filename: string, content) => {
    if (!settingsStore.curCompInStore) {
      return saveCompV1Storage(LsKeys.DEFAULT_CANVAS, filename, content)
    }
    const {path} = settingsStore.curCompInStore
    return await fsWebApi.writeFile({path: normalizePath(path + '/' + filename), file: content})
  }

  const loadCurCompHtml = async () => {
    return await loadCurFile('index.html')
  }
  const saveCurCompHtml = async (text: string) => {
    return await saveCurFile('index.html', text)
  }
  const loadCurCompStyle = async () => {
    return await loadCurFile('index.scss')
  }
  const saveCurCompStyle = async (text: string) => {
    return await saveCurFile('index.scss', text)
  }

  return {
    openComponent,
    loadCurCompHtml,
    saveCurCompHtml,
    loadCurCompStyle,
    saveCurCompStyle,
  }
}

// 旧版组件迁移到V2新版文件系统
export const useComponentMigrationToV2 = (emit) => {
  const isMigrated = useStorage('component_is_migrated_v2', false)
  const isMigrating = ref(false)

  const createComponentBlockItem = (name: string, data = {}) => {
    // console.log('[createComponentBlockItem]', name, data)
    return new BlockItem({
      blockType: BlockType.COMPONENT,
      title: name,
      data: new ComponentData(data),
    })
  }

  const migrateToV2 = async () => {
    if (isMigrated.value || isMigrating.value) {
      return
    }
    isMigrating.value = true
    const rawList: any[] = JSON.parse(localStorage.getItem(LsKeys.COMP_INDEX_LIST) || 'null') || []

    const v1List: BlockItem[] = rawList.map(({name}) => {
      // 读取详细信息并组成组件列表
      return createComponentBlockItem(
        name,
        JSON.parse(loadCompV1Storage(LsKeys.COMP_META, name) || '{}'),
      )
    })

    for (let i = 0; i < v1List.length; i++) {
      const item = v1List[i]
      const {
        title,
        data: {timestamp, stared, cover},
      } = item

      const folderName = `${title}.comp`
      const subDirPath = normalizePath(
        (stared ? '/@Migrated/Stared' : '/@Migrated') + '/' + folderName,
      )
      const meta: IComponentMeta = {
        id: guid(),
        timeCreated: timestamp,
      }

      await createFile(subDirPath, 'index.json', JSON.stringify(meta))
      // 还原HTML、SCSS代码
      await createFile(subDirPath, 'index.html', loadCompV1Storage(LsKeys.COMP_HTML, title))
      await createFile(subDirPath, 'index.scss', loadCompV1Storage(LsKeys.COMP_STYLE, title))
      if (cover) {
        await createFile(subDirPath, 'cover.base64', cover)
      }
    }

    isMigrated.value = true
    emit('refresh')
  }

  onMounted(async () => {
    await migrateToV2()
  })
}
