<script lang="ts" setup="">
import {StOptionItem, StOptionType} from '@/components/CanUI/packages/OptionUI/enum'
import {useI18n} from 'vue-i18n'
import {useAiSettingsStore} from '@/components/AI/hooks/ai-settings'
import {
  anthropicChatModelOptions,
  chatProviderOptions,
  getModelOptions,
  openAIChatModelOptions,
} from '@/components/AI/types/models'
import OptionUI from '@/components/CanUI/packages/OptionUI/index.vue'
import {AutoFormItemType} from '@/components/CanUI/packages/AutoFormElPlus/enum'
import {useOpenAI_GPT} from '@/components/AI/hooks/use-gpt'
import {useAnthropicClaudeAI} from '@/components/AI/hooks/use-claude'
import {useCommonAi} from '@/components/AI/hooks/use-common-ai'

const {t: $t} = useI18n()
const aisStore = useAiSettingsStore()

const {requestChatMessage: gptMessage} = useOpenAI_GPT()
const {requestChatMessage: claudeMessage} = useAnthropicClaudeAI()
const {requestChatMessage} = useCommonAi()

const isLoading = ref(false)

const testConnectivity = async (fn) => {
  try {
    isLoading.value = true
    const result = await fn([{role: 'user', content: 'tell me your name briefly'}])
    window.$dialog.alert(result, 'Success', {
      type: 'success',
    })
  } catch (e: any) {
    console.error(e)
    window.$dialog.alert(e.message, 'Error', {
      type: 'error',
    })
  } finally {
    isLoading.value = false
  }
}

const getTestItem = (fn) => {
  return {
    label: $t('ai.lian_tong_xing_ce_sh'),
    key: 'test',
    iconClass: 'mdi mdi-test-tube',
    type: StOptionType.BUTTON,
    props: {
      class: 'primary',
      onClick: () => testConnectivity(fn),
    },
    value: $t('actions.test'),
  }
}
const optionList = computed((): StOptionItem[] => {
  return [
    {
      label: 'OpenAI (Chat GPT)',
      key: 'open_ai',
      children: [
        {
          label: 'OpenAI API Key',
          key: 'openAiApiKey',
          iconClass: 'mdi mdi-key',
          type: StOptionType.INPUT,
          // props: {type: 'password', showPasswordOn: 'click'},
          props: {
            placeholder: 'sk-**********',
          },
        },
        {
          label: `API ${$t('ai.dai_li_di_zhi')}`,
          tips: '推荐代理：<br>https://aihubmix.com/v1',
          key: 'openAiApiProxy',
          iconClass: 'mdi mdi-vpn',
          type: StOptionType.INPUT,
        },
        getTestItem(gptMessage),
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
          iconClass: 'mdi mdi-key',
          type: StOptionType.INPUT,
          // props: {type: 'password', showPasswordOn: 'click'},
        },
        {
          label: `API ${$t('ai.dai_li_di_zhi')}`,
          tips: '推荐代理：<br>https://aihubmix.com',
          key: 'anthropicApiProxy',
          iconClass: 'mdi mdi-vpn',
          store: aisStore,
          type: StOptionType.INPUT,
        },
        getTestItem(claudeMessage),
      ],
    },
    {
      label: $t('common.common'),
      key: 'common',
      children: [
        {
          type: AutoFormItemType.SELECT,
          options: chatProviderOptions,
          key: 'provider',
          label: $t('ai.quan_ju_mo_ren_ti_go'),
          iconClass: 'mdi mdi-domain',
          props: {
            filterable: true,
            onChange() {
              aisStore.model = getModelOptions(aisStore.provider)[0].value
            },
          },
        },
        {
          label: $t('ai.quan_ju_mo_ren_mo_xi'),
          key: 'model',
          iconClass: 'mdi mdi-head-snowflake',
          type: StOptionType.SELECT,
          options: getModelOptions(aisStore.provider),
          props: {
            // 允许动态创建项
            tag: true,
            filterable: true,
          },
        },
        getTestItem((messages) =>
          requestChatMessage({provider: aisStore.provider, model: aisStore.model, messages}),
        ),
        {
          label: $t('ai.qi_yong_liu_shi_xian'),
          subtitle: $t('ai.kuai_su_xiang_ying_d'),
          key: 'stream',
          iconClass: 'mdi mdi-network-pos',
          type: StOptionType.SWITCH,
        },
      ],
    },
  ]
})
</script>

<template>
  <OptionUI :option-list="optionList" :store="aisStore" v-loading="isLoading" />
</template>
