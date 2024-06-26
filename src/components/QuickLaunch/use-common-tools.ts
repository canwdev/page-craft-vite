import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {formatSiteTitle} from '@/router/router-utils'
import {useSettingsStore} from '@/store/settings'

export const useCommonTools = () => {
  const {t: $t} = useI18n()
  const router = useRouter()
  const route = useRoute()
  const mainStore = useMainStore()
  const settingsStore = useSettingsStore()

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
      label: '📗 ' + $t('common.excel_copy_tool'),
      search: 'excel copy',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'ExcelCopyTool'})
        },
      },
    },
    {
      label: '📑 RichText Tool',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'RichTextTool'})
        },
      },
    },
    {
      label: '🧬 ' + $t('common.text_transformer'),
      search: 'text transformer',
      props: {
        onClick: async () => {
          mainStore.isShowTextTransformer = !mainStore.isShowTextTransformer
        },
      },
    },
    {
      label: '🌐📄 ' + $t('common.i18njson_editing_too'),
      search: 'json editor',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'VueI18nEditTool'})
        },
      },
    },
    {
      label: '🌐📂 ' + $t('common.i18njson_batch_tool'),
      search: 'json editor batch',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'VueI18nBatchTool'})
        },
      },
    },
  ]
  const qlOptions = computed((): QuickOptionItem[] => {
    let list: QuickOptionItem[] = [
      ...toolsMenuOptions,
      {
        label: '🌎 Iframe Browser (alt+i)',
        props: {
          onClick: async () => {
            mainStore.isShowIframeBrowser = !mainStore.isShowIframeBrowser
          },
        },
      },
      // {
      //   label: '🗃️ File Explorer',
      //   props: {
      //     onClick: async () => {
      //       mainStore.isShowQuickLaunch = false
      //       await router.push({name: 'FileExplorer'})
      //     },
      //   },
      // },
      {
        label: '⚙️ ' + $t('common.settings'),
        search: 'settings',
        props: {
          onClick: async () => {
            mainStore.isShowSettings = true
          },
        },
      },
    ]
    if (route.name !== 'CraftPage') {
      list = [
        {
          label: '⛏️ ' + formatSiteTitle(),
          props: {
            onClick: async () => {
              mainStore.isShowQuickLaunch = false
              await router.push({name: 'CraftPage'})
            },
          },
        },
        ...list,
      ]
    }

    if (route.name !== 'HomePage') {
      list = [
        {
          label: '🏠 Welcome Page',
          props: {
            onClick: async () => {
              await router.push({name: 'HomePage'})
            },
          },
        },
        ...list,
      ]
    }

    return list
  })

  return {
    toolsMenuOptions,
    qlOptions,
  }
}
