import {createComponentBlockItem} from '@/enum/page-craft/block'
import * as changeCase from 'change-case'
import {showInputPrompt} from '@/components/CommonUI/input-prompt'
import {useI18n} from 'vue-i18n'
import {Ref} from 'vue'
import {IEntry} from '@/components/PageCraft/ComponentV2/types/filesystem'
import {fsWebApi} from '@/components/PageCraft/ComponentV2/utils/api'
import {generateTextFile, normalizePath} from '@/components/PageCraft/ComponentV2/utils'
import {useSettingsStore} from '@/store/settings'

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
      file: generateTextFile(content, name),
    })
  }

  const handleCreateComponent = async () => {
    try {
      isLoading.value = true

      let name = await inputPrompt($t('msgs.please_enter_the_nam'), `Component${idx}`)

      const folderName = `${name}.component`
      const subDirPath = normalizePath(basePath.value + '/' + folderName)
      await fsWebApi.createDir({path: subDirPath})

      const newItem = createComponentBlockItem(name)

      await createTextFile(subDirPath, 'index.json', newItem)

      // 设置默认HTML、SCSS代码
      const className = changeCase.paramCase(name || 'my-component')
      await createTextFile(subDirPath, 'index.html', `<div class="${className}"></div>`)
      await createTextFile(subDirPath, 'index.scss', `.${className} {\n}\n`)

      // 设置当前选中的组件名
      // settingsStore.curCompoName = name
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
