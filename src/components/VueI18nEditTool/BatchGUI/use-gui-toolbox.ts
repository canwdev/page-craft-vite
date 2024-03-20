import {ref} from 'vue'
import {useI18nMainStore} from '@/store/i18n-tool-main'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {readClipboardData} from '@/utils'

export const useGuiToolbox = () => {
  const i18nMainStore = useI18nMainStore()

  // 处理字段key点击的高亮效果
  const handleKeyClick = (str, event) => {
    // console.log(str, event)
    const selector = '.translate-item'
    i18nMainStore.translatePath = str

    const els = Array.from(document.querySelectorAll(selector))
    els.forEach((el) => {
      el.classList.remove('active')
    })
    event.target.closest(selector).classList.add('active')
  }

  // 获取SubGuiItem组件实例
  const getSubItems = () => {
    return new Promise((resolve) => {
      globalEventBus.emit(GlobalEvents.I18N_BATCH_GUI_GET_SUBS, resolve)
    })
  }

  const isShowToolboxMenu = ref(false)
  const guiToolboxOptions = computed((): QuickOptionItem[] => {
    const currentPath = i18nMainStore.translatePath
    return [
      {
        label: '分析翻译树 (TBD)',
        props: {
          onClick: () => {
            console.log('[translatePath]', i18nMainStore.translatePath)
            console.log('[dirTree]', i18nMainStore.dirTree)
            console.log('[filePathArr]', i18nMainStore.filePathArr)
            console.log('功能待实现！')
          },
        },
      },
      {
        label: '复制右侧内容为JSON',
        disabled: !currentPath,
        props: {
          onClick: async () => {
            const items: any = await getSubItems()
            console.log('[items]', items)
            const result: any = []
            for (const key in items) {
              // SubGuiItem实例
              const item = items[key]
              result.push({
                label: item.dirItem.label,
                // undefined 为该文件没有创建，null 为该字段内容为空。
                value: item.currentItem ? item.fieldValue : undefined,
              })
            }
            window.$qlUtils.copy(result)
          },
        },
      },
      {
        label: '粘贴JSON覆盖右侧的内容',
        disabled: !currentPath,
        props: {
          onClick: async () => {
            try {
              const data: any = await readClipboardData()
              const pastedResult: any[] = JSON.parse(data)
              console.log('[pastedResult]', pastedResult)

              const items: any = await getSubItems()
              const itemsLabelMap: any = {}
              items.forEach((item) => {
                itemsLabelMap[item.dirItem.label] = item
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
              window.$message.success('Action completed, please save manually!')
            } catch (error: any) {
              window.$message.error(error.message)
            }
          },
        },
      },
    ]
  })

  return {
    handleKeyClick,
    isShowToolboxMenu,
    guiToolboxOptions,
  }
}
