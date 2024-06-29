import {useAiSettingsStore} from '@/store/ai-settings'
import {ChatCompletion, OpenAIApiErrorCodeMessage} from '@/components/AiTools/types/openai'
import {useMainStore} from '@/store/main'
import {blinkPanel} from '@/utils/anim'

export const useGpt = () => {
  const aisStore = useAiSettingsStore()
  const mainStore = useMainStore()

  const openAiSettings = () => {
    mainStore.isShowSettings = true
    setTimeout(() => {
      const aiPanel = document.querySelector('.system-settings .c-panel-item[data-key="ai"]')
      if (!aiPanel) {
        return
      }
      aiPanel.scrollIntoView({behavior: 'smooth'})
      blinkPanel(aiPanel as HTMLElement)
    }, 800)
  }

  /**
   * https://platform.openai.com/docs/api-reference/chat/create
   * @param options 任意覆盖参数
   * @param streamCallback 流式回调
   */
  const requestChatCompletion = async (
    options: any = {},
    streamCallback?: (text: string) => void
  ) => {
    const apiProxy = aisStore.openAiApiProxy || 'https://api.openai.com/v1'

    options = {
      // 全局默认参数（可覆盖）
      model: aisStore.model,
      stream: aisStore.stream,
      ...options,
    }

    const response = await fetch(`${apiProxy}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${aisStore.openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
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

    if (options.stream && typeof streamCallback === 'function') {
      // 处理流式响应
      const reader = response!.body!.getReader()
      const decoder = new TextDecoder('utf-8')
      let result = ''

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

    // 正常POST返回 ChatCompletion
    const data = await response.json()
    return data as ChatCompletion
  }

  return {
    requestChatCompletion,
  }
}
