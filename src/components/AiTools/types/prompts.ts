import {GptMessage} from '@/components/AiTools/types/openai'
import {IChatItem} from '@/components/AiTools/types/ai'

/**
 * 批量翻译服务
 * @param jsonTpl 翻译目标模板
 * @param iso 当前语言iso
 * @param translateContent 要翻译的内容
 */
export const tplBatchTranslator = (
  jsonTpl: any,
  iso: string,
  translateContent: string
): GptMessage[] => {
  return [
    {
      role: 'system',
      content: `你是一个后台翻译服务，负责翻译多语言文案，帮我翻译并只返回json内容，不需要markdown格式。json格式为：\`${JSON.stringify(
        jsonTpl
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
 * @param iso 目标语言
 */
export const tplConversationAssistant = (history: IChatItem[], iso: string): GptMessage[] => {
  return [
    {
      content: '你是一名擅长会话的助理，你需要将用户的会话总结为 10 个字以内的标题',
      role: 'system',
    },
    {
      content: `${history.map((i) => `${i.role}:${i.content}`).join('\n')}

请总结上述对话为10个字以内的标题，不需要包含标点符号，输出语言为：${iso}`,
      role: 'user',
    },
  ]
}
