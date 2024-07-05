import {useGpt} from '@/components/AiTools/use-gpt'
import {ChatCompletion, GptMessage} from '@/components/AiTools/types/openai'
import {
  PasteResult,
  useGuiToolbox,
} from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/use-gui-toolbox'
import {useI18n} from 'vue-i18n'
import {useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'

export const useBatchTranslateRefactor = (emit) => {
  const {t: $t} = useI18n()
  const i18nMainStore = useI18nMainStore()
  const {getSubItems, getArrayFromRight, pasteJsonOverrideRight} = useGuiToolbox()

  const doDelete = async () => {
    const items = await getSubItems()
    for (const itemsKey in items) {
      const item = items[itemsKey]
      await item.handleDeleteField()
    }
    emit('reloadTranslates')
  }
  const handleDeleteKeys = () => {
    window.$dialog.warning({
      title: `Delete Keys in all languages? ${i18nMainStore.translatePath}`,
      positiveText: $t('actions.ok'),
      negativeText: $t('actions.cancel'),
      onPositiveClick: () => {
        doDelete()
      },
      onNegativeClick: () => {},
    })
  }

  const doRename = async (newPath) => {
    const items = await getSubItems()
    for (const itemsKey in items) {
      const item = items[itemsKey]
      await item.handleRenameField(newPath)
    }
    i18nMainStore.translatePath = newPath
    emit('reloadTranslates')
  }
  const handleRenameKeys = async () => {
    const oldTranslatePath = i18nMainStore.translatePath
    const newTranslatePath = await window.$mcUtils.showInputPrompt({
      title: `Rename keys in all languages: ${oldTranslatePath}`,
      value: oldTranslatePath,
      positiveText: `Save All`,
      negativeText: $t('actions.cancel'),
    })
    if (newTranslatePath === oldTranslatePath) {
      return
    }
    console.log(`${oldTranslatePath} -> ${newTranslatePath}`)
    await doRename(newTranslatePath)
  }

  const {requestChatCompletion} = useGpt()
  /**
   * 自动翻译右侧空缺的字段
   */
  const handleGptTranslate = async () => {
    try {
      i18nMainStore.isLoading = true
      const sourceList = await getArrayFromRight()
      const iso = i18nMainStore.currentIso
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
          throw new Error('No need for translation')
        }

        const ret: GptMessage[] = [
          {
            role: 'system',
            content: `你是一个后台翻译服务，负责翻译多语言文案，帮我翻译并只返回json内容，不需要markdown格式。json格式为：\`${JSON.stringify(
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
    handleDeleteKeys,
    handleRenameKeys,
    handleGptTranslate,
  }
}
