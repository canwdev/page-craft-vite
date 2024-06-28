import {useSettingsStore} from '@/store/settings'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import {useI18n} from 'vue-i18n'

export const useAiSettings = () => {
  const {t: $t} = useI18n()
  const settingsStore = useSettingsStore()
  const aiSettingsOptions = computed((): StOptionItem[] => {
    return [
      {
        label: 'AI',
        key: 'ai',
        children: [
          {
            label: 'OpenAI Api Key',
            subtitle: 'sk-**********',
            key: 'openAiApiKey',
            store: settingsStore,
            type: StOptionType.INPUT,
            props: {type: 'password', showPasswordOn: 'click'},
          },
          {
            label: 'API 代理地址',
            tips: 'https://aihubmix.com/v1',
            subtitle: '除默认地址外，必须包含 http(s)://',
            key: 'openAiApiProxy',
            store: settingsStore,
            type: StOptionType.INPUT,
          },
        ],
      },
    ]
  })
  return {
    aiSettingsOptions,
  }
}
