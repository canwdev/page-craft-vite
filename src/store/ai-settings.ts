interface IStore {
  // AI
  openAiApiKey: string
  openAiApiProxy: string
  // 启用流式响应
  stream: boolean
}

export const useAiSettingsStore = defineStore('aiSettingsStore', {
  state: (): IStore => {
    return {
      openAiApiKey: '',
      openAiApiProxy: '',
      stream: true,
    }
  },
  persist: {
    key: 'ls_key_pagecraft_ai_settings',
  },
})
