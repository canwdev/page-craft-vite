/**
 * ref https://platform.openai.com/docs/models
 * https://github.com/lobehub/lobe-chat/blob/main/src/config/modelProviders/openai.ts
 */

export enum AIProvider {
  OPEN_AI = 'open_ai',
  ANTHROPIC = 'anthropic',
}

export interface IChatModelOption {
  label: string
  value: string
  tokens: number
  vision?: boolean
}

export const OpenAIApiErrorCodeMessage: Record<string, string> = {
  400: '[400] Bad Request',
  401: '[401] 提供错误的API密钥 | Incorrect API key provided',
  403: '[403] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
  502: '[502] 错误的网关 |  Bad Gateway',
  503: '[503] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
  504: '[504] 网关超时 | Gateway Time-out',
  500: '[500] 内部错误 | Internal Server Error',
}

export const chatProviderOptions = [
  {label: 'OpenAI', value: AIProvider.OPEN_AI, url: 'https://platform.openai.com/docs/models'},
  {
    label: 'Anthropic',
    value: AIProvider.ANTHROPIC,
    url: 'https://docs.anthropic.com/en/docs/about-claude/models',
  },
]

export const anthropicChatModelOptions: IChatModelOption[] = [
  {
    label: 'Claude 3.5 Haiku',
    value: 'claude-3-5-haiku-20241022',
    tokens: 200_000,
  },
  {
    label: 'Claude 3.5 Sonnet',
    value: 'claude-3-5-sonnet-20241022',
    tokens: 200_000,
    vision: true,
  },
]

export const openAIChatModelOptions: IChatModelOption[] = [
  {
    label: 'GPT-4o Mini',
    value: 'gpt-4o-mini',
    tokens: 128_000,
    vision: true,
  },
  {
    label: 'GPT-4o',
    value: 'gpt-4o',
    tokens: 128_000,
    vision: true,
  },
  {
    label: 'GPT-4 Turbo',
    value: 'gpt-4-turbo',
    tokens: 128_000,
    vision: true,
  },
  {
    label: 'GPT-3.5 Turbo',
    value: 'gpt-3.5-turbo',
    tokens: 16_385,
  },
]

export const getModelOptions = (provider: AIProvider) => {
  return provider === AIProvider.ANTHROPIC ? anthropicChatModelOptions : openAIChatModelOptions
}

export const modelsCanUseVision: {[key: string]: boolean} = {}
;[...anthropicChatModelOptions, ...openAIChatModelOptions].forEach((item) => {
  if (item.vision) {
    modelsCanUseVision[item.value] = true
  }
})
