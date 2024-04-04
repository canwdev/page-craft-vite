import {createComponentBlockItem} from '@/enum/page-craft/block'
import * as changeCase from 'change-case'
import {showInputPrompt} from '@/components/CommonUI/input-prompt'
import {useI18n} from 'vue-i18n'
import {Ref} from 'vue'
import {IEntry} from '@/components/FileManager/types/filesystem'
import {fsWebApi} from '@/components/FileManager/utils/api'
import {generateTextFile, normalizePath} from '@/components/FileManager/utils'
import {useSettingsStore} from '@/store/settings'
import {LsKeys} from '@/enum/page-craft'

let idx = 1

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

  const inputPrompt = (title = '', value = '') => {
    return showInputPrompt({
      title,
      value,
      validateFn: (val) => {
        if (files.value.find((item) => item.name === val)) {
          return $t('msgs.name_already_exists')
        }
      },
    })
  }

  const createTextFile = async (basePath, name, content) => {
    await fsWebApi.createFile({
      path: normalizePath(basePath + '/' + name),
      file: content,
    })
  }

  const handleCreateComponent = async () => {
    try {
      isLoading.value = true

      let name = await inputPrompt($t('msgs.please_enter_the_nam'), `Component${idx}`)

      const folderName = `${name}.comp`
      const subDirPath = normalizePath(basePath.value + '/' + folderName)
      await fsWebApi.createDir({path: subDirPath})

      const newItem = createComponentBlockItem(name)

      await createTextFile(subDirPath, 'index.json', JSON.stringify(newItem))

      // 设置默认HTML、SCSS代码
      const className = changeCase.paramCase(name || 'my-component')
      await createTextFile(subDirPath, 'index.html', `<div class="${className}"></div>`)
      await createTextFile(subDirPath, 'index.scss', `.${className} {\n}\n`)

      // 设置当前选中的组件名
      // settingsStore.curCompPath = name
      idx++

      emit('refresh')
    } finally {
      isLoading.value = false
    }
  }

  return {
    handleCreateComponent,
  }
}

export const useComponentStorageV2 = () => {
  const settingsStore = useSettingsStore()

  const openComponent = (path: string) => {
    settingsStore.curCompPath = path
  }

  const loadCurFile = async (filename: string) => {
    if (!settingsStore.curCompPath) {
      throw new Error('[loadCurFile] component not opened!')
    }
    const path = settingsStore.curCompPath
    return await fsWebApi.getFile({path: normalizePath(path + '/' + filename)})
  }

  const saveCurFile = async (filename: string, content) => {
    if (!settingsStore.curCompPath) {
      throw new Error('[saveCurFile] component not opened!')
    }
    const path = settingsStore.curCompPath
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
