import {anthropicChatModelOptions, openAIChatModelOptions} from '@/components/AI/types/models'

interface IStore {
  // OpenAI
  openAiApiKey: string
  openAiApiProxy: string
  model: string

  // Anthropic
  anthropicApiKey: string
  anthropicApiProxy: string
  anthropicModel: string

  // 启用流式响应
  stream: boolean
  // 助手
  currentCharacterId: string
  // 当前聊天历史记录id
  currentChatHistoryId: string
  // 聊天侧边栏是否展开
  isSidebarExpand: boolean
}

export const useAiSettingsStore = defineStore('aiSettingsStore', {
  state: (): IStore => {
    return {
      openAiApiKey: '',
      openAiApiProxy: '',
      model: openAIChatModelOptions[0].value,

      anthropicApiKey: '',
      anthropicApiProxy: '',
      anthropicModel: anthropicChatModelOptions[0].value,

      stream: true,
      currentCharacterId: 'default',
      currentChatHistoryId: '',
      isSidebarExpand: true,
    }
  },
  persist: {
    key: 'ls_key_pagecraft_ai_settings',
  },
})
