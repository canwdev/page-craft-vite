import {ChatModel} from '@/components/AiTools/types/openai'

export interface IChatItem {
  content: string
  role: 'assistant' | 'user' | 'system'
  timestamp?: number
}

export interface IAiCharacter {
  id: string
  name: string
  // 角色描述
  desc: string
  model: ChatModel
  // 系统提示词
  systemPrompt: string
}

export interface IChatHistoryItem {
  id: string
  // 对应 IAiCharacter 的 id
  cid: string
  history: IChatItem[]
}
