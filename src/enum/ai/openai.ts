/**
 * ref https://platform.openai.com/docs/models
 * https://github.com/lobehub/lobe-chat/blob/main/src/config/modelProviders/openai.ts
 */
export enum ChatModel {
  GPT35Turbo = 'gpt-3.5-turbo',
  GPT4 = 'gpt-4',
  GPT4Turbo = 'gpt-4-turbo',
  GPT4o = 'gpt-4o',
}

export const chatModels = [
  {
    label: 'GPT-3.5 Turbo',
    value: ChatModel.GPT35Turbo,
    tokens: 16_385,
  },
  {
    label: 'GPT-4',
    value: ChatModel.GPT4,
    tokens: 8192,
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
    role: string
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
