import {Ref} from 'vue'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {promptGetFileName} from '@/utils/exporter'
import {TextConvertMode} from '@/components/VueI18nEditTool/copy-enum'
import {guid_S4} from '@/utils'
import {copy} from '../q-logics/utils'

const copyI18n = async (val, isObject = false) => {
  if (!val) {
    return
  }
  // 单行
  if (!val.includes('\n')) {
    const key = window.$consoleUtils.formatI18nKey(val)
    if (isObject) {
      const obj = {[key]: val}
      await copy(obj, true)
    } else {
      await copy(key, true)
    }
    return
  }

  // 支持多行
  const json = window.$consoleUtils.textConvertMultipleLine(val, TextConvertMode.JSON)
  const lines = JSON.parse(json)
  let result: any = ''
  if (isObject) {
    result = {}
  }
  lines.forEach((l) => {
    const key = window.$consoleUtils.formatI18nKey(l) || guid_S4()
    if (isObject) {
      // 检测重复键
      if (result[key]) {
        result[key + '__' + guid_S4()] = l
      } else {
        result[key] = l
      }
    } else {
      result += key + '\n'
    }
  })
  await copy(result, true)
}

export const qLogicTextConvert = (valRef: Ref<string>): QuickOptionItem => {
  return {
    label: '📝 Text Toolbox',
    children: [
      {
        label: '📋 Copy i18n key',
        props: {
          onClick: async () => {
            await copyI18n(valRef.value, false)
          },
        },
      },
      {
        label: '📋 Copy i18n object',
        props: {
          onClick: async () => {
            await copyI18n(valRef.value, true)
          },
        },
      },
      {
        label: '📃 Export to file',
        props: {
          onClick: async () => {
            window.$consoleUtils.handleExportFile(
              await promptGetFileName('filename.txt'),
              valRef.value,
              ''
            )
          },
        },
      },
      {
        label: '📋 Text Convert: JSON',
        props: {
          onClick: async () => {
            const text = window.$consoleUtils.textConvertMultipleLine(
              valRef.value,
              TextConvertMode.JSON
            )
            await copy(text, true)
          },
        },
      },
      {
        label: '📋 Text Convert: HTML',
        props: {
          onClick: async () => {
            const text = window.$consoleUtils.textConvertMultipleLine(
              valRef.value,
              TextConvertMode.HTML
            )
            await copy(text, true)
          },
        },
      },
    ],
  }
}
