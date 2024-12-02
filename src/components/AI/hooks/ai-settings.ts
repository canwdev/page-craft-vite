import {
  AIProvider,
  anthropicChatModelOptions,
  defaultOpenAIModel,
  openAIChatModelOptions,
} from '@/components/AI/types/models'
import {LS_SettingsKey} from '@/enum/settings'

interface IStore {
  // OpenAI
  openAiApiKey: string
  openAiApiProxy: string

  // Anthropic
  anthropicApiKey: string
  anthropicApiProxy: string

  // 通用
  // 全局默认提供商
  provider: AIProvider
  // 全局默认模型
  model: string
  // 启用流式响应
  stream: boolean

  // 助手
  currentCharacterId: string
  // 当前聊天历史记录id
  currentChatHistoryId: string
  // 聊天侧边栏是否展开
  isSidebarExpand: boolean

  // 是否按回车键直接发送，按shift+enter换行
  isEnterSend: boolean
}

export const useAiSettingsStore = defineStore('aiSettingsStore', {
  state: (): IStore => {
    return {
      openAiApiKey: '',
      openAiApiProxy: '',

      anthropicApiKey: '',
      anthropicApiProxy: '',

      provider: AIProvider.OPEN_AI,
      model: defaultOpenAIModel,
      stream: true,

      currentCharacterId: 'default',
      currentChatHistoryId: '',
      isSidebarExpand: true,
      isEnterSend: true,
    }
  },
  persist: {
    key: LS_SettingsKey.LS_KEY_PAGECRAFT_AI_SETTINGS,
  },
})
