<script lang="ts">
import {defineComponent} from 'vue'
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {useI18n} from 'vue-i18n'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import {useSettingsStore} from '@/store/settings'
import {ldThemeOptions} from '@/enum/settings'
import {NSpace, NSwitch, NButton} from 'naive-ui'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {RouterLink} from 'vue-router'
import {Settings20Filled} from '@vicons/fluent'
import {formatSiteTitle} from '@/router/router-utils'
import {customThemeOptions, CustomThemeType} from '@/components/CommonUI/ViewPortWindow/enum'
import {useCommonSettings} from '@/components/PageCraft/Settings/use-common-settings'

const getWallpaperText = () => {
  const list = [{label: 'Bing', url: 'https://api.dujin.org/bing/1920.php'}]
  let tpl = `<b><a style="color: inherit" href="https://www.dujin.org/12142.html" target="_blank">随机壁纸API</a></b>`

  list.forEach((item) => {
    tpl += `<br>${item.label}: <a style="color: inherit" href="${item.url}" target="_blank">${item.url}</a>`
  })

  return tpl
}

export default defineComponent({
  name: 'SystemSettings',
  components: {OptionUI},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mVisible = useModelWrapper(props, emit, 'visible')
    const settingsStore = useSettingsStore()

    const {commonSettingsOptions} = useCommonSettings()

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
              label: $t('actions.toggle_ld_theme'),
              key: 'ldTheme',
              store: settingsStore,
              type: StOptionType.MULTIPLE_SWITCH,
              selectOptions: ldThemeOptions,
            },
            {
              label: $t('common.theme'),
              key: 'customTheme',
              store: settingsStore,
              type: StOptionType.SELECT,
              selectOptions: customThemeOptions,
            },
            settingsStore.customTheme === CustomThemeType.DEFAULT && {
              label: $t('common.rounded'),
              key: 'enableRoundedTheme',
              store: settingsStore,
              type: StOptionType.SWITCH,
            },
            settingsStore.customTheme === CustomThemeType.DEFAULT && {
              label: 'Aero',
              key: 'enableAeroTheme',
              store: settingsStore,
              type: StOptionType.SWITCH,
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
            {
              label: $t('common.reference_map'),
              key: 'enableReferenceMap',
              store: settingsStore,
              type: StOptionType.SWITCH,
            },
            {
              label: $t('common.global_style'),
              key: 'global_style',
              actionRender: h(NSpace, {size: 'small', align: 'center'}, () => [
                h(NSwitch, {
                  value: settingsStore.enableGlobalStyle,
                  'onUpdate:value': (v) => {
                    settingsStore.enableGlobalStyle = v
                  },
                }),
              ]),
            },
          ],
        },
        ...commonSettingsOptions.value,
      ]
    })

    return {
      mVisible,
      optionList,
      dialogIconRender() {
        return h(Settings20Filled)
      },
    }
  },
})
</script>

<template>
  <n-modal
    v-model:show="mVisible"
    preset="dialog"
    :title="$t('common.settings')"
    style="padding-left: 10px; padding-right: 10px"
    :icon="dialogIconRender"
    class="system-settings"
  >
    <OptionUI :option-list="optionList" />
  </n-modal>
</template>

<style lang="scss" scoped>
.system-settings {
  a {
    color: $primary;
  }
}
</style>