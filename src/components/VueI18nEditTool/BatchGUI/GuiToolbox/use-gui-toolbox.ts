import {BatchListItem, useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import {useGpt} from '@/components/AITools/use-gpt'
import {ChatCompletion, GptMessage} from '@/components/AITools/types/openai'
import {readClipboardData} from '@/utils'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useI18n} from 'vue-i18n'
import {useBatchTranslateAnalyser} from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/use-analyser'

export type PasteResult = {
  // iso，如 en-US
  label: string
  // 翻译内容
  value: string
}

// SubGuiItem 组件实例内容
export type SubInstanceItem = {
  listItem: BatchListItem
  fieldValue: string
  handleDeleteField: any
  handleRenameField: any
  getIsJsonCreated: any
}

const tiSelector = '.translate-item'
export const useGuiToolbox = () => {
  const {t: $t} = useI18n()
  const i18nMainStore = useI18nMainStore()

  const removeSelectedClass = () => {
    const els = Array.from(document.querySelectorAll(tiSelector))
    els.forEach((el) => {
      el.classList.remove('t_selected')
      el.classList.remove('t_highlight')
      el.classList.remove('t_highlight_current')
    })
  }

  // 处理字段key点击的高亮效果
  const handleKeyClick = (str, event) => {
    // console.log(str, event)
    i18nMainStore.translatePath = str
    removeSelectedClass()
    event.target.closest(tiSelector).classList.add('t_selected')
  }

  // 获取 SubGuiItem 组件实例
  const _getAllSubItems = (): Promise<SubInstanceItem[]> => {
    return new Promise((resolve) => {
      globalEventBus.emit(GlobalEvents.I18N_BATCH_GUI_GET_SUBS, resolve)
    })
  }

  // 获取有json文件的 SubGuiItem 组件实例
  const getSubItems = async () => {
    let items: SubInstanceItem[] = await _getAllSubItems()
    items = items.filter((item) => item.getIsJsonCreated())
    return items
  }

  /**
   * 获取右侧内容为JSON
   */
  const getArrayFromRight = async () => {
    const items: SubInstanceItem[] = await getSubItems()
    const result: PasteResult[] = []
    for (const key in items) {
      // SubGuiItem实例
      const item = items[key]
      result.push({
        label: item.listItem.rootDir.label,
        // null 为该文件没有创建
        value: item.fieldValue,
      })
    }
    return result
  }

  /**
   * 粘贴JSON覆盖右侧的内容
   * @param data 类型可以为 PasteResult[]，如果传则从剪贴板读取
   */
  const pasteJsonOverrideRight = async (data?: any) => {
    try {
      if (!data) {
        data = await readClipboardData()
        data = JSON.parse(data)
      }

      // 为对象形式，尝试转换为数组，使用key为label
      if (!!data && !Array.isArray(data)) {
        const arr: PasteResult[] = []
        Object.keys(data).forEach((key) => {
          arr.push({
            label: key,
            value: data[key],
          })
        })
        data = arr
      }

      const pastedResult = data as PasteResult[]
      console.log('[pastedResult]', pastedResult)

      const items = await getSubItems()
      const itemsLabelMap: any = {}
      items.forEach((item) => {
        itemsLabelMap[item.listItem.rootDir.label] = item
      })

      console.log('[itemsLabelMap]', itemsLabelMap)
      for (const key in pastedResult) {
        // SubGuiItem实例
        const result = pastedResult[key]
        const {label, value} = result

        if (value !== undefined && value !== null) {
          const item = itemsLabelMap[label]
          if (item) {
            item.fieldValue = value
          }
        }
      }
      window.$message.success($t('msgs.action_completed_pl'))
    } catch (error: any) {
      window.$message.error(error.message)
    }
  }

  return {
    removeSelectedClass,
    handleKeyClick,
    getSubItems,
    getArrayFromRight,
    pasteJsonOverrideRight,
  }
}
