import {GptMessage} from '@/components/AI/types/openai'
import {IMessageContent, IMessageItem} from '@/components/AI/types/ai'

/**
 * 获取json批量翻译提示词
 * @param jsonTpl 翻译目标模板
 * @param iso 当前语言iso
 * @param translateContent 要翻译的内容
 */
export const promptBatchJsonTranslator = (
  jsonTpl: any,
  iso: string,
  translateContent: string,
): GptMessage[] => {
  return [
    {
      role: 'system',
      content: `你是一个后台翻译服务，负责翻译多语言文案，帮我翻译并只返回json内容，不需要markdown格式。json格式为：\`${JSON.stringify(
        jsonTpl,
      )}\``,
    },
    {
      role: 'user',
      content: `翻译内容(${iso}):
\`${translateContent}\``,
    },
  ]
}

/**
 * 会话总结标题
 * @param history 聊天历史记录
 */
export const promptConversationAssistant = (history: IMessageItem[]): GptMessage[] => {
  // 自动优化聊天内容
  const optimizeTextContent = (content: string | IMessageContent[], maxLength = 200) => {
    let text = ''
    // 如果不是纯文字则转换成纯文字（适用于上传图片的情况）
    if (typeof content !== 'string') {
      text = content.map((i) => i.text).join('\n')
    } else {
      text = content
    }
    // 限制内容长度
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...'
    }
    return text
  }
  return [
    {
      content:
        '你是一名擅长会话的助理，你需要将用户的会话总结为 10 个字以内的标题，不需要包含标点符号，输出语言为聊天内容所用的语言，对话内容如下',
      role: 'system',
    },
    {
      content: `${history.map((i) => `${i.role}:${optimizeTextContent(i.content)}`).join('\n')}`,
      role: 'user',
    },
  ]
}
