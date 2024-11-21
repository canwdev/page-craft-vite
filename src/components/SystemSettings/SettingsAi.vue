<script lang="ts" setup="">
import {StOptionItem, StOptionType} from '@/components/CanUI/packages/OptionUI/enum'
import {useI18n} from 'vue-i18n'
import {useAiSettingsStore} from '@/components/AI/hooks/ai-settings'
import {anthropicChatModelOptions, openAIChatModelOptions} from '@/components/AI/types/models'
import OptionUI from '@/components/CanUI/packages/OptionUI/index.vue'

const {t: $t} = useI18n()
const aisStore = useAiSettingsStore()
const optionList = computed((): StOptionItem[] => {
  return [
    {
      label: 'OpenAI (Chat GPT)',
      key: 'open_ai',
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
          options: openAIChatModelOptions,
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
    {
      label: 'Anthropic (Claude AI)',
      key: 'anthropic',
      children: [
        {
          label: 'Anthropic API Key',
          subtitle: '',
          key: 'anthropicApiKey',
          store: aisStore,
          type: StOptionType.INPUT,
          // props: {type: 'password', showPasswordOn: 'click'},
        },
        {
          label: `API ${$t('ai.dai_li_di_zhi')}`,
          tips: '推荐代理：<br>https://aihubmix.com',
          key: 'anthropicApiProxy',
          store: aisStore,
          type: StOptionType.INPUT,
        },
        {
          label: $t('ai.quan_ju_mo_ren_mo_xi'),
          key: 'anthropicModel',
          store: aisStore,
          type: StOptionType.SELECT,
          options: anthropicChatModelOptions,
          props: {
            // 允许动态创建项
            tag: true,
            filterable: true,
          },
        },
      ],
    },
    {
      label: 'Common',
      key: 'common',
      children: [
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
</script>

<template>
  <OptionUI :option-list="optionList" />
</template>
