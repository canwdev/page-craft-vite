import {ClaudeImageSource} from '@/components/AI/types/anthropic'
import {IMessageContent, IMessageItem} from '@/components/AI/types/ai'

export const parseClaudeImageSource = (base64String: string): ClaudeImageSource | null => {
  // 匹配 data URL 的正则表达式
  const regex = /^data:(image\/(jpeg|png|gif|webp));base64,(.+)$/

  const matches = base64String.match(regex)
  if (!matches) {
    // 如果未匹配到，返回 null
    return null
  }

  const mediaType = matches[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
  const data = matches[3]

  return {
    data: data,
    media_type: mediaType,
    type: 'base64',
  }
}

/**
 * 格式化 Claude 模型参数
 * @param params
 */
export const formatClaudeParams = (params) => {
  if (params.messages && params.messages[0] && params.messages[0].role === 'system') {
    // 注意：claude 系列模型的 system 字段直接放在 params 里
    // 把 system role 信息单独设置到params，并删除 system role
    params.system = params.messages[0].content as string
    params.messages = params.messages.slice(1)

    // 转换 claude 支持的图片格式
    params.messages = params.messages.map((item: IMessageItem) => {
      if (Array.isArray(item.content)) {
        return {
          ...item,
          content: item.content
            .map((content: IMessageContent) => {
              if (content.type === 'image_url') {
                return {
                  type: 'image',
                  source: parseClaudeImageSource(content.image_url!.url),
                }
              }
              return content
            })
            .filter((content: any) => {
              if (content.type === 'image') {
                return !!content.source
              }
              // claude 要求文字不能为空
              return !!content.text
            }),
        }
      }
      return item
    })
  }
}
