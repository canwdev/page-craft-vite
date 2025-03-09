import {GptMessage} from '@/components/AI/types/open-ai'

// 不允许 role 为 system 的模型
export const NotAllowSystemRoleModels = {
  'o1-mini': true,
  o1: true,
  'o1-preview': true,
}

/**
 * 格式化 GPT 模型参数
 * @param params
 */
export const formatGPTMessages = (params) => {
  if (params.messages) {
    let messages = params.messages as GptMessage[]
    messages = messages.filter((item) => {
      // 过滤空内容
      if (typeof item.content === 'string') {
        return !!item.content
      }
      return true
    })

    // 不允许 system 作为 role
    if (NotAllowSystemRoleModels[params.model]) {
      messages = messages.map((item) => {
        return {
          ...item,
          // 替换 role 的 system 为 user
          role: item.role === 'system' ? 'user' : item.role,
        }
      })
    }
    params.messages = messages
  }
}
