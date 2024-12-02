import {IMessageContent} from '@/components/AI/types/ai'

export type ChatUsage = {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}
export type GptMessage = {
  role: 'assistant' | 'user' | 'system'
  content: string | IMessageContent[]
}
export type ChatChoices = {
  index: number
  message: GptMessage
  logprobs: number | null
  finish_reason: 'stop' | 'length' | null
}
/**
 * https://platform.openai.com/docs/api-reference/chat/create
 */
export type OpenAIChatCompletion = {
  id: string
  object: 'chat.completion'
  created: number
  model: string
  choices: ChatChoices[]
  usage: ChatUsage
  system_fingerprint: string | null
}
