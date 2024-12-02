import {useOpenAI_GPT} from '@/components/AI/hooks/use-gpt'
import {
  PasteResult,
  useGuiToolbox,
} from '@/components/VueI18nEditTool/BatchGUI/GuiToolbox/use-gui-toolbox'
import {useI18n} from 'vue-i18n'
import {useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import {promptBatchJsonTranslator} from '@/components/AI/utils/prompts'
import {OpenAIChatCompletion, GptMessage} from '@/components/AI/types/open-ai'
import {useCommonAi} from '@/components/AI/hooks/use-common-ai'

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
    window.$dialog
      .confirm(
        `${$t('i18n_tools.delete_keys')} (${$t('i18n_tools.in_all_languages')}): ${
          i18nMainStore.translatePath
        }`,
        $t('actions.confirm'),
        {
          type: 'warning',
        },
      )
      .then(() => {
        doDelete()
      })
      .catch()
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
      title: `${$t('i18n_tools.rename_keys')} (${$t(
        'i18n_tools.in_all_languages',
      )}): ${oldTranslatePath}`,
      value: oldTranslatePath,
      positiveText: $t('actions.save_all'),
      negativeText: $t('actions.cancel'),
    })
    if (newTranslatePath === oldTranslatePath) {
      return
    }
    console.log(`${oldTranslatePath} -> ${newTranslatePath}`)
    await doRename(newTranslatePath)
  }

  const {requestChatMessage} = useCommonAi()
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
          throw new Error($t('i18n_tools.no_need_for_transla'))
        }

        const ret: GptMessage[] = promptBatchJsonTranslator(arr, iso, find.value)

        console.log('[buildAiPrompt]', ret)
        return ret
      }

      const message = await requestChatMessage({
        messages: buildAiPrompt(),
      })
      console.log('message', message)
      const content = JSON.parse(message as string)
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
