import {AIProvider} from '@/components/AI/types/models'

export type ImageUrlObj = {
  detail: string
  url: string
}

export interface IMessageContent {
  type: 'text' | 'image_url'
  text?: string
  image_url?: ImageUrlObj
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
  // 厂商
  provider: AIProvider
  // 模型
  model: string
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
