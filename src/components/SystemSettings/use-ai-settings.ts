import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import {useI18n} from 'vue-i18n'
import {useAiSettingsStore} from '@/store/ai-settings'
import {chatModels} from '@/components/AiTools/types/openai'

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
            label: `API ${$t('ai.dai_li_di_zhi')}`,
            tips: 'https://aihubmix.com/v1',
            key: 'openAiApiProxy',
            store: aisStore,
            type: StOptionType.INPUT,
          },
          {
            label: `全局默认模型`,
            key: 'model',
            store: aisStore,
            type: StOptionType.SELECT,
            options: chatModels,
          },
          {
            label: $t('ai.qi_yong_liu_shi_xian'),
            subtitle: $t('ai.kuai_su_xiang_ying_d'),
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
