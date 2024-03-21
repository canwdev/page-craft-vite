import {useSettingsStore} from '@/store/settings'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import {useI18n} from 'vue-i18n'

export const useCommonSettings = () => {
  const {t: $t} = useI18n()
  const settingsStore = useSettingsStore()
  const commonSettingsOptions = computed((): StOptionItem[] => {
    return [
      {
        label: $t('common.common'),
        key: 'common',
        children: [
          {
            label: $t('msgs.focus_auto_action') + ' (ctrl+alt+a)',
            subtitle: $t('msgs.focus_auto_action_desc'),
            key: 'enableFocusAutoAction',
            store: settingsStore,
            type: StOptionType.SWITCH,
          },
        ],
      },
    ]
  })
  return {
    commonSettingsOptions,
  }
}
