import {copyToClipboard, guid, guid_S4} from '@/utils'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import moment from 'moment'
import {TextConvertMode} from '@/components/VueI18nEditTool/copy-enum'
import {promptGetFileName} from '@/utils/exporter'
import {useI18n} from 'vue-i18n'

export const useQLogics = (qlOptionsRef) => {
  const {t: $t} = useI18n()
  const filteredOptions = ref<QuickOptionItem[]>([])

  const copy = async (val) => {
    if (typeof val === 'object') {
      console.info(val)
      val = JSON.stringify(val, null, 2)
    }
    console.info(val)
    await copyToClipboard(val)
    window.$message.success($t('msgs.copy_success'))
  }
  const isTimestamp = (val) => {
    val = Number(val)
    const d = new Date(val)
    if (d.getTime() > 0) {
      return d
    }
    return false
  }

  const copyI18n = async (val, isObject = false) => {
    // 单行
    if (!val.includes('\n')) {
      const key = window.$consoleUtils.formatI18nKey(val)
      if (isObject) {
        const obj = {[key]: val}
        await copy(obj)
      } else {
        await copy(key)
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
    await copy(result)
  }

  const handleInput = (val?) => {
    let extraOptions: QuickOptionItem[] = []

    const date = isTimestamp(val)
    if (date) {
      const label = moment(date).format('YYYY-MM-DD HH:mm:ss')
      extraOptions.push({
        label: '📋 ' + label,
        props: {onClick: () => copy(label)},
      })
    } else if (val === '/?') {
      const label = `❓帮助说明：
- 支持输入时间戳，如：1709794946384
- 输入 /? 查看帮助
- 按 tab 键切换到下方功能列表，再按 esc 聚焦到输入框
- 部分功能支持多行文本`
      extraOptions.push({
        label,
      })
    }

    // 没有输入，显示默认内容
    if (!val) {
      filteredOptions.value = [...extraOptions, ...qlOptionsRef.value]
      return
    }
    filteredOptions.value = [
      ...extraOptions,
      // 过滤列表功能
      ...qlOptionsRef.value.filter((i) => {
        const sVal = val.trim().toLowerCase()
        let flag = false
        if (i.search) {
          flag = i.search.toLowerCase().includes(sVal)
        }
        if (!flag && i.label) {
          flag = i.label.toLowerCase().includes(sVal)
        }
        return flag
      }),
      {
        label: '⚡ Eval JavaScript',
        props: {
          onClick: async () => {
            try {
              const result = eval(val)
              window.$message.success(result + '')
              await copy(result)
            } catch (error: any) {
              console.log(error)
              window.$message.error(error.message)
            }
          },
        },
      },
      {
        label: '📋 Copy i18n key',
        props: {
          onClick: async () => {
            await copyI18n(val, false)
          },
        },
      },
      {
        label: '📋 Copy i18n object',
        props: {
          onClick: async () => {
            await copyI18n(val, true)
          },
        },
      },
      {
        label: '📃 Export to file',
        props: {
          onClick: async () => {
            window.$consoleUtils.handleExportFile(await promptGetFileName('filename.txt'), val, '')
          },
        },
      },
      {
        label: '📋 Text Convert: JSON',
        props: {
          onClick: async () => {
            const text = window.$consoleUtils.textConvertMultipleLine(val, TextConvertMode.JSON)
            await copy(text)
          },
        },
      },
      {
        label: '📋 Text Convert: HTML',
        props: {
          onClick: async () => {
            const text = window.$consoleUtils.textConvertMultipleLine(val, TextConvertMode.HTML)
            await copy(text)
          },
        },
      },
    ]
  }

  return {
    copy,
    isTimestamp,
    handleInput,
    filteredOptions,
  }
}
