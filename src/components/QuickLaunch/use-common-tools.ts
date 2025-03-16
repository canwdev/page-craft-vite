import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'
import {QuickOptionItem} from '@/components/CanUI/packages/QuickOptions/enum'
import {formatSiteTitle} from '@/router/router-utils'
import {useSettingsStore} from '@/store/settings'
import {WebviewWindow} from '@tauri-apps/api/window'
import {useSystemStore} from '@/store/system'
import {SettingsTabType} from '@/enum/settings'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'

export const useCommonTools = () => {
  const {t: $t} = useI18n()
  const router = useRouter()
  const route = useRoute()
  const mainStore = useMainStore()
  const systemStore = useSystemStore()

  const toolsMenuOptions = [
    {
      label: 'Stylus ' + $t('common.formatting_tool'),
      iconClass: 'mdi mdi-fleur-de-lis',
      // iconClass: 'mdi mdi-language-css3',
      search: 'stylus formatting',
      props: {
        onClick: async () => {
          systemStore.createTaskById('os.pagecraft.stylus_tools')
        },
      },
    },
    {
      label: $t('common.text_transformer'),
      search: 'text transformer',
      iconClass: 'mdi mdi-file-swap',
      props: {
        onClick: async () => {
          globalEventBus.emit(GlobalEvents.OPEN_TEXT_TRANSFORMER)
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
                systemStore.createTaskById('os.pagecraft.richtext')
              },
            },
          },
          {
            label: $t('common.file_explorer'),
            iconClass: 'mdi mdi-folder-wrench-outline',
            props: {
              onClick: async () => {
                systemStore.createTaskById('os.pagecraft.file_manager')
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
          // {split: true},
          {
            label: 'Vue 多语言提取工具 - 基于AST(抽象语法树)',
            iconClass: 'mdi mdi-vuejs',
            props: {
              onClick: async () => {
                systemStore.createTaskById('os.pagecraft.vue_lang_extractor')
              },
            },
          },
          {
            label: 'Image Info',
            iconClass: 'mdi mdi-image',
            props: {
              onClick: async () => {
                systemStore.createTaskById('os.pagecraft.image_info')
              },
            },
          },
          // {
          //   label: 'Stock Tracker',
          //   iconClass: 'mdi mdi-chart-areaspline',
          //   props: {
          //     onClick: async () => {
          //       systemStore.createTaskById('os.pagecraft.stock_tracker')
          //     },
          //   },
          // },
          // {
          //   label: 'Fire Calc',
          //   iconClass: 'mdi mdi-finance',
          //   props: {
          //     onClick: async () => {
          //       systemStore.createTaskById('os.pagecraft.fire_calc')
          //     },
          //   },
          // },
        ],
      },
      {
        label: $t('common.settings'),
        iconClass: 'mdi mdi-cog',
        search: 'settings',
        props: {
          onClick: async () => {
            globalEventBus.emit(GlobalEvents.OPEN_SETTINGS, SettingsTabType.COMMON)
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
