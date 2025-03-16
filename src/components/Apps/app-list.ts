import {ShortcutItem} from '@/enum/os'
import {useSystemStore} from '@/store/system'
import {useI18n} from 'vue-i18n'

export const useAppList = () => {
  const {t: $t} = useI18n()
  const systemStore = useSystemStore()

  const SystemAppSettings: ShortcutItem = {
    appid: 'os.pagecraft.settings',
    title: $t('common.settings'),
    iconClass: 'mdi mdi-cog',
    winOptions: {
      width: '450px',
      height: '600px',
    },
    component: defineAsyncComponent(() => import('@/components/OS/SettingsApp/index.vue')),
    singleInstance: true,
  }

  onBeforeMount(() => {
    window.$appList = [
      SystemAppSettings,
      {
        appid: 'os.pagecraft.stylus_tools',
        title: `Stylus ${$t('common.formatting_tool')}`,
        iconClass: 'mdi mdi-fleur-de-lis',
        winOptions: {
          width: '600px',
          height: '500px',
        },
        component: defineAsyncComponent(
          () => import('@/components/StyleEditor/components/StylusTools.vue'),
        ),
      },
      {
        appid: 'os.pagecraft.text_converter',
        title: $t('common.text_transformer'),
        iconClass: 'mdi mdi-file-swap',
        winOptions: {
          width: '600px',
          height: '500px',
        },
        component: defineAsyncComponent(
          () => import('@/components/VueI18nEditTool/TextConverter/TextTransformer.vue'),
        ),
      },
      {
        appid: 'os.pagecraft.richtext',
        title: `RichText Tool`,
        iconClass: 'mdi mdi-text',
        winOptions: {
          width: '700px',
          height: '600px',
        },
        component: defineAsyncComponent(() => import('@/views/RichTextTool.vue')),
      },
      // TODO {
      //   appid: 'os.pagecraft.iframe_browser',
      //   title: $t('common.text_transformer'),
      //   iconClass: 'mdi mdi-web',
      //   winOptions: {
      //     width: '350px',
      //     height: '500px',
      //   },
      //   component: defineAsyncComponent(
      //     () => import('@/components/VueI18nEditTool/TextConverter/TextTransformer.vue'),
      //   ),
      //   singleInstance: true,
      // },
      {
        appid: 'os.pagecraft.image_info',
        title: `Image Info`,
        iconClass: 'mdi mdi-image',
        winOptions: {
          width: '600px',
          height: '500px',
        },
        component: defineAsyncComponent(() => import('@/components/Apps/ImageInfo.vue')),
      },
      {
        appid: 'os.pagecraft.file_manager',
        title: $t('common.file_explorer'),
        iconClass: 'mdi mdi-folder-wrench-outline',
        winOptions: {
          width: '600px',
          height: '500px',
        },
        component: defineAsyncComponent(() => import('@/components/FileManager/index.vue')),
      },
      {
        appid: 'os.pagecraft.vue_lang_extractor',
        title: `Vue Lang Extractor`,
        iconClass: 'mdi mdi-vuejs',
        winOptions: {
          width: '700px',
          height: '600px',
        },
        component: defineAsyncComponent(
          () => import('@/components/Apps/VueLangExtractor/VueLangExtractor.vue'),
        ),
      },
      // {
      //   appid: 'os.pagecraft.stock_tracker',
      //   title: `Stock Tracker`,
      //   iconClass: 'mdi mdi-chart-areaspline',
      //   winOptions: {
      //     width: '600px',
      //     height: '500px',
      //   },
      //   component: defineAsyncComponent(() => import('@/components/Apps/StockTracker/index.vue')),
      //   singleInstance: true,
      // },
      // {
      //   appid: 'os.pagecraft.fire_calc',
      //   title: `Fire Calc`,
      //   iconClass: 'mdi mdi-finance',
      //   winOptions: {
      //     width: '600px',
      //     height: '500px',
      //   },
      //   component: defineAsyncComponent(() => import('@/components/Apps/FireCalc/index.vue')),
      // },
    ]
  })
}
