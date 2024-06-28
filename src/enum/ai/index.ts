export interface IChatItem {
  content: string
  role: 'assistant' | 'user' | 'system'
  timestamp?: number
}
