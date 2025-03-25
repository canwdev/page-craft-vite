<script lang="ts" setup>
import {useRoute, useRouter} from 'vue-router'
import ViewPortWindow from '@/components/CanUI/packages/ViewPortWindow/index.vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import CLaunch from '@/components/CLaunch/CLaunch.vue'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useI18n} from 'vue-i18n'
import {useSystemStore} from '@/store/system'
import {useMainStore} from '@/store/main'
import {WebviewWindow} from '@tauri-apps/api/window'
import {SettingsTabType} from '@/enum/settings'
import {QuickOptionItem} from '@/components/CanUI/packages/QuickOptions/enum'
import QuickLaunch from '@/components/QuickLaunch/index.vue'

const props = withDefaults(
  defineProps<{
    visible: boolean
  }>(),
  {
    visible: false,
  },
)
const emit = defineEmits(['update:visible'])
const mVisible = useModelWrapper(props, emit, 'visible')

const router = useRouter()
const route = useRoute()
const mainStore = useMainStore()
const {t: $t} = useI18n()
const systemStore = useSystemStore()

const showClose = computed(() => {
  return route.name !== 'HomePage'
})

const cLaunchItems = computed((): QuickOptionItem[] => {
  let toolsMenuOptions: QuickOptionItem[] = [
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
      label: `${$t('common.i18njson_editing_too')}`,
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
      label: `${$t('common.i18njson_batch_tool')}`,
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
      label: 'AI Chat',
      iconClass: 'mdi mdi-comment-text',
      props: {
        onClick: async () => {
          mainStore.isShowQuickLaunch = false
          await router.push({name: 'AiPage'})
        },
      },
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
    {
      label: 'QR Code',
      iconClass: 'mdi mdi-qrcode',
      props: {
        onClick: async () => {
          systemStore.createTaskById('os.pagecraft.qrcode')
        },
      },
    },
    {
      label: `Time Converter`,
      iconClass: 'mdi mdi-clipboard-clock-outline',
      props: {
        onClick: async () => {
          systemStore.createTaskById('os.pagecraft.time_converter')
        },
      },
    },
  ]
  if (route.name !== 'CraftPage') {
    toolsMenuOptions = [
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
      ...toolsMenuOptions,
    ]
  }

  if (route.name !== 'HomePage') {
    toolsMenuOptions = [
      {
        label: $t('common.home_page'),
        iconClass: 'mdi mdi-home',
        props: {
          onClick: async () => {
            await router.push({name: 'HomePage'})
          },
        },
      },
      ...toolsMenuOptions,
    ]
  }
  return [
    {
      label: 'Common',
      value: 'common',
      children: toolsMenuOptions,
    },
    {
      label: 'More',
      value: 'more',
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
        {
          label: 'Material Design Icons Viewer',
          iconClass: 'mdi mdi-material-design',
          props: {
            onClick: async () => {
              systemStore.createTaskById('os.pagecraft.mdi_viewer')
            },
          },
        },
      ],
    },
    {
      label: 'Quick',
      value: 'ql',
    },
  ]
})
</script>

<template>
  <ViewPortWindow
    v-model:visible="mVisible"
    :show-close="showClose"
    wid="ql"
    class="quick-launch-window"
    allow-maximum
    :init-win-options="{
      width: '350px',
      height: '500px',
    }"
  >
    <template #titleBarLeft>
      <span class="mdi mdi-pine-tree"></span>
      PageCraft {{ $t('common.toolbox') }} (alt+q)
    </template>

    <CLaunch :items="cLaunchItems">
      <template #default="{value}">
        <QuickLaunch v-if="value === 'ql'" ref="qlRef" />
      </template>
    </CLaunch>
  </ViewPortWindow>
</template>

<style lang="scss">
.quick-launch-window {
  min-width: 400px;
  min-height: 400px;
  position: fixed;
}
</style>
