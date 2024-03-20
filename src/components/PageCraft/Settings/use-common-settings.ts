import {useSettingsStore} from '@/store/settings'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import {NSpace, NSwitch} from 'naive-ui'
import {formatSiteTitle} from '@/router/router-utils'
import {useI18n} from 'vue-i18n'

export const useCommonSettings = () => {
  const {t: $t} = useI18n()
  const settingsStore = useSettingsStore()
  const commonSettingsOptions = computed((): StOptionItem[] => {
    return [
      {
        label: $t('common.others'),
        key: 'others',
        children: [
          {
            label: '视口聚焦后自动操作 (ctrl+alt+a)',
            subtitle: '视口聚焦后，自动点击上一次点击的[Auto]按钮，以提升效率',
            key: 'enableFocusAutoAction',
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
              'Github'
            ),
          },
        ],
      },
    ]
  })
  return {
    commonSettingsOptions,
  }
}
