import {useOpenAI_GPT} from '@/components/AI/hooks/use-gpt'
import {useAnthropicClaudeAI} from '@/components/AI/hooks/use-claude'
import {AIProvider} from '@/components/AI/types/models'
import {GptMessage} from '@/components/AI/types/open-ai'

export const useCommonAi = () => {
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
      case AIProvider.OPEN_AI:
        return gptStream(
          {
            model,
            messages,
          },
          callback,
          fetchOptions,
        )
      case AIProvider.ANTHROPIC:
        return claudeStream(
          {
            model,
            messages,
          },
          callback,
          fetchOptions,
        )
    }
  }
  const requestChatMessage = (provider: AIProvider, model: string, messages: GptMessage[]) => {
    switch (provider) {
      case AIProvider.OPEN_AI:
        return gptMessage(messages, {model})
      case AIProvider.ANTHROPIC:
        // TODO
        return claudeMessage()
    }
  }

  return {
    requestChatStream,
    requestChatMessage,
  }
}
