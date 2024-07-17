import {ChatModel} from '@/components/AI/types/openai'

export interface IMessageContent {
  type: 'text' | 'image_url'
  text?: string
  image_url?: {
    detail: string
    url: string
  }
}

export interface IMessageItem {
  content: string | IMessageContent[]
  role: 'assistant' | 'user' | 'system'
  timestamp?: number
}

export interface IAiCharacter {
  id: string
  name: string
  // 角色描述
  desc: string
  // 头像
  avatar: string
  model: ChatModel
  // 系统提示词
  systemPrompt: string
}

export interface IChatHistoryItem {
  id: string
  // 对应 IAiCharacter 的 id
  cid: string
  // 对话标题总结
  title: string
  // 对话创建时间
  timestamp: number
  history: IMessageItem[]
}
