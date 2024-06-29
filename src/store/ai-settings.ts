import {ChatModel} from '@/components/AiTools/types/openai'

interface IStore {
  // AI
  openAiApiKey: string
  openAiApiProxy: string
  // 启用流式响应
  stream: boolean
  model: ChatModel
}

export const useAiSettingsStore = defineStore('aiSettingsStore', {
  state: (): IStore => {
    return {
      openAiApiKey: '',
      openAiApiProxy: '',
      stream: true,
      model: ChatModel.GPT35Turbo,
    }
  },
  persist: {
    key: 'ls_key_pagecraft_ai_settings',
  },
})
