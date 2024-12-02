import {useAiSettingsStore} from '@/components/AI/hooks/ai-settings'
import {
  anthropicChatModelOptions,
  defaultAnthropicModel,
  OpenAIApiErrorCodeMessage,
} from '@/components/AI/types/models'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {SettingsTabType} from '@/enum/settings'
import {
  ClaudeImageSource,
  ClaudeResponseData,
  ClaudeStreamResponse,
  ClaudeStreamType,
} from '@/components/AI/types/anthropic'
import {scrollToElementAndBlink} from '@/utils/anim'
import {GptMessage} from '@/components/AI/types/open-ai'
import {IMessageContent} from '@/components/AI/types/ai'

import {formatClaudeParams, parseClaudeImageSource} from '@/components/AI/utils/format-anthropic'

export const useAnthropicClaudeAI = () => {
  const aisStore = useAiSettingsStore()

  const openAiSettings = () => {
    globalEventBus.emit(GlobalEvents.OPEN_SETTINGS, SettingsTabType.AI)
    setTimeout(() => {
      scrollToElementAndBlink('.system-settings .content-wrap [data-key="anthropic"]')
    }, 500)
  }

  /**
   * https://docs.anthropic.com/en/api/messages
   * @param params 任意覆盖参数
   * @param streamCallback 流式回调
   * @param fetchOptions fetch 覆盖参数
   */
  const requestChatStream = async (
    params: any = {},
    streamCallback?: (text: string) => void,
    fetchOptions: any = {},
  ) => {
    const apiProxy = aisStore.anthropicApiProxy || 'https://api.anthropic.com/v1/messages'

    // 全局默认参数（可覆盖）
    params = {
      // 指定要使用的模型
      model: defaultAnthropicModel,
      // 是否启用流式数据输出 https://docs.anthropic.com/en/api/messages-streaming
      stream: aisStore.stream,
      max_tokens: 4096,
      // temperature: 0.25,
      // top_p: 1,
      ...params,
    }
    formatClaudeParams(params)

    const response = await fetch(`${apiProxy}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': aisStore.anthropicApiKey,
        'anthropic-version': '2023-06-01',
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

    // 确保响应体是可读流
    if (!response.body) {
      throw new Error('Response body is null')
    }

    if (!params.stream) {
      return await response.json()
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullResponse = ''

    return new Promise((resolve, reject) => {
      function processStream({done, value}: {done: boolean; value?: Uint8Array}) {
        if (done) {
          resolve(fullResponse)
          return
        }

        if (value) {
          const chunk = decoder.decode(value, {stream: true})
          const lines = chunk.split('\n')

          lines.forEach((line) => {
            if (line.startsWith('data: ')) {
              try {
                const jsonData = JSON.parse(line.slice(6)) as ClaudeStreamResponse

                // console.log(jsonData)

                if (jsonData.type === ClaudeStreamType.CONTENT_BLOCK_DELTA) {
                  const chunkText = jsonData.delta.text
                  fullResponse += chunkText

                  // 如果提供了回调函数，则调用
                  if (streamCallback) {
                    streamCallback(chunkText)
                  }
                }

                if (jsonData.type === ClaudeStreamType.MESSAGE_STOP) {
                  resolve(fullResponse)
                }
              } catch (parseError) {
                console.error('Parse error:', parseError)
              }
            }
          })
        }

        // 继续读取下一个数据块
        reader.read().then(processStream).catch(reject)
      }

      // 开始读取流
      reader.read().then(processStream).catch(reject)
    })
  }

  const requestChatMessage = async (messages: GptMessage[], optionsOverride: any = {}) => {
    const result = (await requestChatStream({
      messages,
      stream: false,
      ...optionsOverride,
    })) as ClaudeResponseData
    // console.log(result)

    return result.content[0]?.text || ''
  }

  return {
    requestChatStream,
    requestChatMessage,
  }
}
