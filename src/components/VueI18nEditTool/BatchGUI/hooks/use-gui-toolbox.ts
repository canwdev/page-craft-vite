import {BatchListItem, useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import {useGpt} from '@/components/AiTools/use-gpt'
import {ChatCompletion, GptMessage} from '@/components/AiTools/types/openai'
import {readClipboardData} from '@/utils'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useI18n} from 'vue-i18n'

export type PasteResult = {
  // iso，如 en-US
  label: string
  // 翻译内容
  value: string
}
export type SubInstanceItem = {
  listItem: BatchListItem
  fieldValue: string
}

const tiSelector = '.translate-item'
export const useGuiToolbox = () => {
  const {t: $t} = useI18n()
  const i18nMainStore = useI18nMainStore()

  const removeSelectedClass = () => {
    const els = Array.from(document.querySelectorAll(tiSelector))
    els.forEach((el) => {
      el.classList.remove('t_selected')
    })
  }

  // 处理字段key点击的高亮效果
  const handleKeyClick = (str, event) => {
    // console.log(str, event)
    i18nMainStore.translatePath = str
    removeSelectedClass()
    event.target.closest(tiSelector).classList.add('t_selected')
  }

  // 获取SubGuiItem组件实例
  const getSubItems = (): Promise<SubInstanceItem[]> => {
    return new Promise((resolve) => {
      globalEventBus.emit(GlobalEvents.I18N_BATCH_GUI_GET_SUBS, resolve)
    })
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

  const {requestChatCompletion} = useGpt()
  /**
   * 自动翻译右侧空缺的字段
   */
  const handleGptTranslate = async () => {
    try {
      i18nMainStore.isLoading = true
      const sourceList = await getArrayFromRight()
      const iso = i18nMainStore.filePathArr[0] || ''
      if (!iso) {
        throw new Error('iso is missing')
      }
      const find = sourceList.find((item) => item.label === iso)
      if (!find) {
        throw new Error('iso item not found')
      }
      console.log({find, sourceList})
      /**
       * 构建AI提示词
       */
      const buildAiPrompt = () => {
        // 生成示例对象
        const arr: PasteResult[] = []
        sourceList.forEach((item) => {
          if (item.label !== iso && !item.value) {
            arr.push({
              label: item.label,
              value: '',
            })
          }
        })
        if (!arr.length) {
          throw new Error('No need translate')
        }

        const ret: GptMessage[] = [
          {
            role: 'system',
            content: `你是一个后台翻译服务，负责翻译多语言文案，帮我翻译并只返回json。json格式为：\`${JSON.stringify(
              arr
            )}\``,
          },
          {
            role: 'user',
            content: `翻译内容(${iso}):
\`${find.value}\``,
          },
        ]

        console.log('[buildAiPrompt]', ret)
        return ret
      }

      const completion = (await requestChatCompletion({
        stream: false,
        messages: buildAiPrompt(),
      })) as ChatCompletion
      const message: GptMessage = completion.choices[0]?.message || {}
      console.log('message', message)
      const content = JSON.parse(message.content)
      await pasteJsonOverrideRight(content)
    } catch (error: any) {
      console.error(error)
      window.$message.error(error.message)
    } finally {
      i18nMainStore.isLoading = false
    }
  }

  return {
    removeSelectedClass,
    handleKeyClick,
    getSubItems,
    getArrayFromRight,
    pasteJsonOverrideRight,
    handleGptTranslate,
  }
}
