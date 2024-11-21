<script lang="ts" setup="">
import {StOptionItem, StOptionType} from '@/components/CanUI/packages/OptionUI/enum'
import {useI18n} from 'vue-i18n'
import {useSettingsStore} from '@/store/settings'
import LanguageChooser from '@/i18n/LanguageChooser.vue'
import {formatSiteTitle} from '@/router/router-utils'
import {ldThemeOptions, LdThemeType} from '@/enum/settings'
import {useThemeOptions} from '@/components/CanUI/packages/ViewPortWindow/utils/use-theme'
import OptionUI from '@/components/CanUI/packages/OptionUI/index.vue'
import {useMainStore} from '@/store/main'

const {t: $t} = useI18n()
const settingsStore = useSettingsStore()

const {themeOptions} = useThemeOptions()
const getWallpaperText = () => {
  const list = [{label: 'Bing', url: 'https://api.dujin.org/bing/1920.php'}]
  let tpl = `<b><a style="color: inherit" href="https://www.dujin.org/12142.html" target="_blank">随机壁纸API</a></b>`

  list.forEach((item) => {
    tpl += `<br>${item.label}: <a style="color: inherit" href="${item.url}" target="_blank">${item.url}</a>`
  })

  return tpl
}
const mainStore = useMainStore()

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
    {
      label: $t('common.common'),
      key: 'common',
      children: [
        {
          label: $t('msgs.focus_auto_action') + ' (ctrl+alt+a)',
          subtitle: $t('msgs.focus_auto_action_desc'),
          tips: `⚡ 搭配AHK脚本使用，效率更佳！<br><pre style="max-height: 300px;overflow: auto;color: greenyellow;box-sizing:border-box;padding:5px;background-color: black">
#Persistent ; 让脚本持续运行
SetTitleMatchMode, 2 ; 设置窗口标题匹配模式为包含模式
; 按F2执行操作
F2::
    ; 按下 Ctrl+C
    Send, ^c
    ; 获取当前活动窗口的句柄
    WinGet, originalWindow, ID, A
    ; 切换到标题包含 "PageCraft" 的窗口
    IfWinExist, PageCraft
    {
        WinActivate ; 激活找到的窗口
        Sleep, 50 ; 等待50毫秒
    }
    ; 切换回原窗口
    If (originalWindow)
    {
        WinActivate, ahk_id %originalWindow% ; 激活之前活动的窗口
    }
    ; 按下 Ctrl+V
    Send, ^v
return
</pre>`,
          key: 'enableFocusAutoAction',
          store: settingsStore,
          type: StOptionType.SWITCH,
        },
      ],
    },

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
  <OptionUI :option-list="optionList" />
</template>
