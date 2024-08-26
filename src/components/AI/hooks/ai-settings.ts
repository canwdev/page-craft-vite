import {ChatModel} from '@/components/AI/types/openai'

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
  // 聊天侧边栏是否展开
  isSidebarExpand: boolean
}

export const useAiSettingsStore = defineStore('aiSettingsStore', {
  state: (): IStore => {
    return {
      openAiApiKey: '',
      openAiApiProxy: '',
      stream: true,
      model: ChatModel.GPT4oMini,
      currentCharacterId: 'default',
      currentChatHistoryId: '',
      isSidebarExpand: true,
    }
  },
  persist: {
    key: 'ls_key_pagecraft_ai_settings',
  },
})
