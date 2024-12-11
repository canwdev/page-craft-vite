import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'
import {QuickOptionItem} from '@/components/CanUI/packages/QuickOptions/enum'
import {formatSiteTitle} from '@/router/router-utils'
import {useSettingsStore} from '@/store/settings'
import {WebviewWindow} from '@tauri-apps/api/window'

export const useCommonTools = () => {
  const {t: $t} = useI18n()
  const router = useRouter()
  const route = useRoute()
  const mainStore = useMainStore()
  const settingsStore = useSettingsStore()

  const toolsMenuOptions = [
    {
      label: 'Stylus ' + $t('common.formatting_tool'),
      iconClass: 'mdi mdi-fleur-de-lis',
      // iconClass: 'mdi mdi-language-css3',
      search: 'stylus formatting',
      props: {
        onClick: async () => {
          mainStore.isShowStylusTools = true
        },
      },
    },
    {
      label: $t('common.text_transformer'),
      search: 'text transformer',
      iconClass: 'mdi mdi-file-swap',
      props: {
        onClick: async () => {
          mainStore.isShowTextTransformer = !mainStore.isShowTextTransformer
        },
      },
    },
    {
      label: $t('common.excel_copy_tool'),
      iconClass: 'mdi mdi-file-excel-box',
      // iconClass: 'mdi mdi-microsoft-excel',
      search: 'excel copy',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'ExcelCopyTool'})
        },
      },
    },
    {
      label: `${$t('common.i18njson_editing_too')} 🌐`,
      search: 'json editor',
      iconClass: 'mdi mdi-file-marker',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'VueI18nEditTool'})
        },
      },
    },
    {
      label: `${$t('common.i18njson_batch_tool')} 🌐`,
      search: 'json editor batch',
      iconClass: 'mdi mdi-folder-marker',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'VueI18nBatchTool'})
        },
      },
    },
    {
      label: 'AI Chat (ChatGPT / Claude AI)',
      iconClass: 'mdi mdi-comment-text',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'AiPage'})
        },
      },
    },
  ]
  const qlOptions = computed((): QuickOptionItem[] => {
    let list: QuickOptionItem[] = [
      ...toolsMenuOptions,
      {
        label: `${$t('common.more')}...`,
        iconClass: 'mdi mdi-more',
        children: [
          {
            label: `${$t('common.iframe_browser')} (alt+i)`,
            iconClass: 'mdi mdi-web-box',
            props: {
              onClick: async () => {
                mainStore.isShowIframeBrowser = !mainStore.isShowIframeBrowser
              },
            },
          },
          {
            label: $t('common.rich_text_tool'),
            iconClass: 'mdi mdi-language-markdown-outline',
            props: {
              onClick: async () => {
                mainStore.isShowQuickLaunch = false
                await router.push({name: 'RichTextTool'})
              },
            },
          },
          {
            label: `AI Chat Window (alt+g)`,
            iconClass: 'mdi mdi-comment-text',
            props: {
              onClick: async () => {
                mainStore.isShowAiChat = !mainStore.isShowAiChat
              },
            },
          },
          {
            label: 'Dev Page',
            iconClass: 'mdi mdi-language-html5',
            props: {
              onClick: async () => {
                mainStore.isShowQuickLaunch = false
                await router.push({name: 'DevPage'})
              },
            },
          },
          {
            label: 'Vue 3 SFC Loader',
            iconClass: 'mdi mdi-vuejs',
            props: {
              onClick: async () => {
                const url = './vue.html'
                if (window.__TAURI__) {
                  console.log('WebviewWindow', WebviewWindow)
                  const webview = new WebviewWindow('Vue3SFCLoader', {
                    url,
                  })
                  return
                }
                window.open(url)
              },
            },
          },
          {split: true},
          {
            label: 'Stock Tracker',
            iconClass: 'mdi mdi-chart-areaspline',
            props: {
              onClick: async () => {
                mainStore.isShowQuickLaunch = false
                await router.push({name: 'StockTrackerPage'})
              },
            },
          },
          {
            label: 'Fire Calc',
            iconClass: 'mdi mdi-finance',
            props: {
              onClick: async () => {
                mainStore.isShowQuickLaunch = false
                await router.push({name: 'FireCalcPage'})
              },
            },
          },
        ],
      },
      {
        label: $t('common.settings'),
        iconClass: 'mdi mdi-cog',
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
          label: `Page Craft`,
          iconClass: 'mdi mdi-minecraft',
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
          label: $t('common.home_page'),
          iconClass: 'mdi mdi-home',
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
