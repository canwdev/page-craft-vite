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
  const qlOptions = computed((): QuickOptionItem[] => {
    let list: QuickOptionItem[] = [
      ...toolsMenuOptions,
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
    if (route.name === 'CraftPage') {
      list = [
        {
          label: '🌎 Iframe Browser (alt+i)',
          props: {
            onClick: async () => {
              mainStore.isShowQuickLaunch = false
              settingsStore.isShowIframeBrowser = !settingsStore.isShowIframeBrowser
            },
          },
        },
        ...list,
      ]
    } else {
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
      if (settingsStore.enableWelcomePage) {
        list = [
          ...list,
          {
            label: '🏠 Welcome Page',
            props: {
              onClick: async () => {
                await router.push({name: 'HomePage'})
              },
            },
          },
        ]
      }
    }

    return list
  })

  return {
    toolsMenuOptions,
    qlOptions,
  }
}
