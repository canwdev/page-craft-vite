import {useOpenAI_GPT} from '@/components/AI/hooks/use-gpt'
import {useAnthropicClaudeAI} from '@/components/AI/hooks/use-claude'
import {AIProvider} from '@/components/AI/types/models'
import {GptMessage} from '@/components/AI/types/open-ai'
import {useAiSettingsStore} from '@/components/AI/hooks/ai-settings'

export const useCommonAi = () => {
  const aisStore = useAiSettingsStore()

  const {requestChatStream: gptStream, requestChatMessage: gptMessage} = useOpenAI_GPT()
  const {requestChatStream: claudeStream, requestChatMessage: claudeMessage} =
    useAnthropicClaudeAI()

  const requestChatStream = (
    provider: AIProvider,
    model: string,
    messages: GptMessage[],
    callback?: (text: string) => void,
    fetchOptions: any = {},
  ) => {
    switch (provider) {
      case AIProvider.ANTHROPIC:
        return claudeStream(
          {
            model,
            messages,
          },
          callback,
          fetchOptions,
        )
      default:
        return gptStream(
          {
            model,
            messages,
          },
          callback,
          fetchOptions,
        )
    }
  }

  const requestChatMessage = ({
    provider = aisStore.provider,
    model = aisStore.model,
    messages = [],
  }: {
    provider?: AIProvider
    model?: string
    messages: GptMessage[]
  }) => {
    switch (provider) {
      case AIProvider.ANTHROPIC:
        return claudeMessage(messages, {model})
      default:
        return gptMessage(messages, {model})
    }
  }

  return {
    requestChatStream,
    requestChatMessage,
  }
}
