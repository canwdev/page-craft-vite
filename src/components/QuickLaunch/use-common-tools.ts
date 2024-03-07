import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'

export const useCommonTools = () => {
  const {t: $t} = useI18n()
  const router = useRouter()
  const mainStore = useMainStore()

  const toolsMenuOptions = [
    {
      label: '⚜ Stylus ' + $t('common.formatting_tool'),
      search: 'stylus formatting',
      props: {
        onClick: async () => {
          mainStore.isShowStylusTools = true
        },
      },
    },
    {
      label: '📊 ' + $t('common.excel_copy_tool'),
      search: 'excel copy',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'ExcelCopyTool'})
        },
      },
    },
    {
      label: '🧬 ' + $t('common.text_transformer'),
      search: 'text transformer',
      props: {
        onClick: async () => {
          mainStore.isShowTextTransformer = true
        },
      },
    },
    {
      label: '🌐 ' + $t('common.i18njson_editing_too'),
      search: 'json editor',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'VueI18nEditTool'})
        },
      },
    },
    {
      label: '🌎 ' + $t('common.i18njson_batch_tool'),
      search: 'json editor batch',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'VueI18nBatchTool'})
        },
      },
    },
  ]

  return {
    toolsMenuOptions,
  }
}
