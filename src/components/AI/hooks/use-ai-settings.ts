import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import {useI18n} from 'vue-i18n'
import {useAiSettingsStore} from '@/components/AI/hooks/ai-settings'
import {chatModels} from '@/components/AI/types/openai'

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
            tips: '推荐代理：<br>https://aihubmix.com/v1',
            key: 'openAiApiProxy',
            store: aisStore,
            type: StOptionType.INPUT,
          },
          {
            label: $t('ai.quan_ju_mo_ren_mo_xi'),
            key: 'model',
            store: aisStore,
            type: StOptionType.SELECT,
            options: chatModels,
            props: {
              // 允许动态创建项
              tag: true,
              filterable: true,
            },
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
