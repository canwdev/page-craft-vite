import {useAiSettingsStore} from '@/components/AI/hooks/ai-settings'
import {OpenAIApiErrorCodeMessage} from '@/components/AI/types/models'
import {blinkPanel} from '@/utils/anim'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {SettingsTabType} from '@/enum/settings'
import {OpenAIChatCompletion, GptMessage} from '@/components/AI/types/open-ai'

export const useOpenAI_GPT = () => {
  const aisStore = useAiSettingsStore()

  const openAiSettings = () => {
    globalEventBus.emit(GlobalEvents.OPEN_SETTINGS, SettingsTabType.AI)
    setTimeout(() => {
      const aiPanel = document.querySelector('.system-settings .content-wrap')
      if (!aiPanel) {
        return
      }
      aiPanel.scrollIntoView({behavior: 'smooth'})
      blinkPanel(aiPanel as HTMLElement)
    }, 800)
  }

  /**
   * https://platform.openai.com/docs/api-reference/chat/create
   * @param params 任意覆盖参数
   * @param streamCallback 流式回调
   * @param fetchOptions fetch 覆盖参数
   */
  const requestChatStream = async (
    params: any = {},
    streamCallback?: (text: string) => void,
    fetchOptions: any = {},
  ) => {
    const apiProxy = aisStore.openAiApiProxy || 'https://api.openai.com/v1'

    // 全局默认参数（可覆盖）
    params = {
      // 指定要使用的模型
      model: aisStore.model,
      // 是否启用流式数据输出
      stream: aisStore.stream,
      ...params,
    }

    const response = await fetch(`${apiProxy}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${aisStore.openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
      ...fetchOptions,
    })

    const errorMessage = OpenAIApiErrorCodeMessage[response.status]
    if (errorMessage) {
      if (response.status === 401) {
        openAiSettings()
      }
      const data = await response.json()
      throw new Error(`${errorMessage}\n\n${data.error.message}`)
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (params.stream && typeof streamCallback === 'function') {
      // 处理流式响应
      const reader = response!.body!.getReader()
      const decoder = new TextDecoder('utf-8')
      const result = ''

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const {done, value} = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, {stream: true})
        const lines = chunk.split('\n').filter((line) => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.replace('data: ', '')
            if (jsonStr !== '[DONE]') {
              try {
                const json = JSON.parse(jsonStr)
                const text = json.choices[0]?.delta?.content
                if (text) {
                  streamCallback(text)
                  // result+=text
                  // console.log(text) // 实时打印每段文字到控制台
                }
              } catch (e) {
                console.error('Error parsing JSON:', e)
                console.error('JSON:', jsonStr)
              }
            }
          }
        }
      }

      // console.log('Final result:', result) // 打印最终结果

      // 返回完整字符串
      return result
    }

    // 正常POST返回 OpenAIChatCompletion
    const data = await response.json()
    return data as OpenAIChatCompletion
  }

  // 封装，直接获取AI回答
  const requestChatMessage = async (messages: GptMessage[], optionsOverride: any = {}) => {
    const completion = (await requestChatStream({
      messages,
      stream: false,
      ...optionsOverride,
    })) as OpenAIChatCompletion
    const message: GptMessage = completion.choices[0]?.message || {}
    // console.log('message', message)
    return message.content || ''
  }

  return {
    requestChatStream,
    requestChatMessage,
  }
}
