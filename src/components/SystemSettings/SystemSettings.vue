<script setup lang="ts">
import {defineComponent} from 'vue'
import OptionUI from '@/components/CanUI/packages/OptionUI/index.vue'
import {useI18n} from 'vue-i18n'
import {StOptionItem, StOptionType} from '@/components/CanUI/packages/OptionUI/enum'
import {useSettingsStore} from '@/store/settings'
import {ldThemeOptions, LdThemeType} from '@/enum/settings'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {useCommonSettings} from '@/components/SystemSettings/use-common-settings'
import {useThemeOptions} from '@/components/CanUI/packages/ViewPortWindow/utils/use-theme'
import {formatSiteTitle} from '@/router/router-utils'
import LanguageChooser from '@/i18n/LanguageChooser.vue'
import {useMainStore} from '@/store/main'
import {useAiSettings} from '@/components/AI/hooks/use-ai-settings'
import ViewPortWindow from '@/components/CanUI/packages/ViewPortWindow/index.vue'
import {useVModel} from '@vueuse/core'

const getWallpaperText = () => {
  const list = [{label: 'Bing', url: 'https://api.dujin.org/bing/1920.php'}]
  let tpl = `<b><a style="color: inherit" href="https://www.dujin.org/12142.html" target="_blank">随机壁纸API</a></b>`

  list.forEach((item) => {
    tpl += `<br>${item.label}: <a style="color: inherit" href="${item.url}" target="_blank">${item.url}</a>`
  })

  return tpl
}

const emit = defineEmits(['update:visible'])
interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
})

const mVisible = useVModel(props, 'visible', emit)

const {t: $t} = useI18n()
const settingsStore = useSettingsStore()
const mainStore = useMainStore()

const {commonSettingsOptions} = useCommonSettings()
const {aiSettingsOptions} = useAiSettings()
const {themeOptions} = useThemeOptions()

const optionList = computed((): StOptionItem[] => {
  return [
    {
      label: $t('common.personalization'),
      key: 'personalization',
      children: [
        {
          label: $t('common.theme_color'),
          key: 'themeColor',
          store: settingsStore,
          type: StOptionType.COLOR_PICKER,
        },
        {
          label: $t('common.wallpaper'),
          key: 'desktopWallpaper',
          store: settingsStore,
          type: StOptionType.INPUT,
          tips: getWallpaperText(),
          placeholder: 'optional',
        },
        !settingsStore.desktopWallpaper && {
          label: $t('common.bg_color'),
          key: 'desktopBgColor',
          store: settingsStore,
          type: StOptionType.COLOR_PICKER,
        },
        {
          label: $t('common.theme'),
          key: 'customTheme',
          store: settingsStore,
          type: StOptionType.SELECT,
          options: themeOptions.value,
          props: {
            'onUpdate:value': (val) => {
              settingsStore.ldTheme = LdThemeType.LIGHT
            },
          },
        },
        {
          label: $t('actions.toggle_ld_theme'),
          key: 'ldTheme',
          store: settingsStore,
          type: StOptionType.MULTIPLE_SWITCH,
          options: ldThemeOptions,
        },
        {
          label: $t('common.disable_animation'),
          subtitle: $t('common.eink_optimization'),
          key: 'disableAnimation',
          store: settingsStore,
          type: StOptionType.SWITCH,
        },
      ].filter(Boolean),
    },
    {
      label: 'PageCraft',
      key: 'pagecraft',
      children: [
        {
          label: $t('common.top_layout'),
          key: 'enableTopLayout',
          store: settingsStore,
          type: StOptionType.SWITCH,
        },
        {
          label: $t('common.sound_fx'),
          key: 'enableSoundFx',
          store: settingsStore,
          type: StOptionType.SWITCH,
        },
      ],
    },
    ...commonSettingsOptions.value,
    ...aiSettingsOptions.value,
    {
      label: $t('common.system'),
      key: 'system',
      children: [
        {
          label: 'Language',
          key: 'language',
          actionRender: h(LanguageChooser),
        },
        window.__TAURI__ && {
          label: $t('msgs.auto_check_update'),
          key: 'autoCheckUpdate',
          subtitle: mainStore.upgradeInfo,
          store: settingsStore,
          type: StOptionType.SWITCH,
        },
        {
          label: formatSiteTitle(),
          subtitle: `Copyright © 2022-${new Date().getFullYear()} canwdev`,
          actionRender: h(
            'a',
            {
              style: 'color: inherit;',
              href: 'https://github.com/canwdev/page-craft-vite',
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            'Github',
          ),
        },
      ].filter(Boolean),
    },
  ]
})
</script>

<template>
  <ViewPortWindow
    v-model:visible="mVisible"
    class="system-settings-window"
    wid="settings"
    :init-win-options="{
      width: '380px',
      height: '500px',
    }"
  >
    <template #titleBarLeft>⚙️ {{ $t('common.settings') }}</template>
    <OptionUI class="system-settings" :option-list="optionList" />
  </ViewPortWindow>
</template>

<style lang="scss" scoped>
.system-settings-window {
  max-height: 80vh;
  min-width: 450px;
  .system-settings {
    height: 100%;
    overflow: auto;
  }
  a {
    color: $primary;
  }
}
</style>
