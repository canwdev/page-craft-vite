import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import {useI18n} from 'vue-i18n'
import {useAiSettingsStore} from '@/store/ai-settings'

export const useAiSettings = () => {
  const {t: $t} = useI18n()
  const aisStore = useAiSettingsStore()
  const aiSettingsOptions = computed((): StOptionItem[] => {
    return [
      {
        label: 'AI',
        key: 'ai',
        children: [
          {
            label: 'OpenAI API Key',
            subtitle: 'sk-**********',
            key: 'openAiApiKey',
            store: aisStore,
            type: StOptionType.INPUT,
            // props: {type: 'password', showPasswordOn: 'click'},
          },
          {
            label: 'API 代理地址',
            tips: 'https://aihubmix.com/v1',
            key: 'openAiApiProxy',
            store: aisStore,
            type: StOptionType.INPUT,
          },
          {
            label: '启用流式响应',
            subtitle: '快速响应，但网络不好可能丢包',
            key: 'stream',
            store: aisStore,
            type: StOptionType.SWITCH,
          },
        ],
      },
    ]
  })
  return {
    aiSettingsOptions,
  }
}
