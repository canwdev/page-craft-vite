import {ChatModel} from '@/components/AITools/types/openai'

interface IStore {
  // AI
  openAiApiKey: string
  openAiApiProxy: string
  // 启用流式响应
  stream: boolean
  model: ChatModel
  // 助手
  currentCharacterId: string
  // 当前聊天历史记录id
  currentChatHistoryId: string
}

export const useAiSettingsStore = defineStore('aiSettingsStore', {
  state: (): IStore => {
    return {
      openAiApiKey: '',
      openAiApiProxy: '',
      stream: true,
      model: ChatModel.GPT35Turbo,
      currentCharacterId: 'default',
      currentChatHistoryId: '',
    }
  },
  persist: {
    key: 'ls_key_pagecraft_ai_settings',
  },
})
