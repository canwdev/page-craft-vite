/**
 * ref https://platform.openai.com/docs/models
 * https://github.com/lobehub/lobe-chat/blob/main/src/config/modelProviders/openai.ts
 */
export enum ChatModel {
  GPT35Turbo = 'gpt-3.5-turbo',
  GPT4Turbo = 'gpt-4-turbo',
  GPT4o = 'gpt-4o',
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

export const chatModels = [
  {
    label: 'GPT-3.5 Turbo',
    value: ChatModel.GPT35Turbo,
    tokens: 16_385,
  },
  {
    label: 'GPT-4 Turbo',
    value: ChatModel.GPT4Turbo,
    tokens: 128_000,
    vision: true,
  },
  {
    label: 'GPT-4o',
    value: ChatModel.GPT4o,
    tokens: 128_000,
    vision: true,
  },
]

export type ChatUsage = {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export type ChatChoices = {
  index: number
  message: {
    role: 'assistant' | 'user' | 'system'
    content: string
  }
  logprobs: number | null
  finish_reason: 'stop' | 'length' | null
}

/**
 * https://platform.openai.com/docs/api-reference/chat/create
 */
export type ChatCompletion = {
  id: string
  object: 'chat.completion'
  created: number
  model: ChatModel
  choices: ChatChoices[]
  usage: ChatUsage
  system_fingerprint: string | null
}
