import type { IMessageContent } from '@/components/AI/types/ai'

export interface ChatUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}
export interface GptMessage {
  role: 'assistant' | 'user' | 'system'
  content: string | IMessageContent[]
}
export interface ChatChoices {
  index: number
  message: GptMessage
  logprobs: number | null
  finish_reason: 'stop' | 'length' | null
}
/**
 * https://platform.openai.com/docs/api-reference/chat/create
 */
export interface OpenAIChatCompletion {
  id: string
  object: 'chat.completion'
  created: number
  model: string
  choices: ChatChoices[]
  usage: ChatUsage
  system_fingerprint: string | null
}
