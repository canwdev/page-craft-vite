// 共享的数据库状态
import {createGlobalState} from '@vueuse/core'
import {useIDBKeyval} from '@vueuse/integrations/useIDBKeyval'
import {IAiCharacter, IChatHistoryItem} from '@/components/AI/types/ai'
import iconOpenAI from '@/assets/textures/chat-gpt-logo.svg'
import iconAnthropic from '@/assets/textures/anthropic.svg'
import {
  anthropicChatModelOptions,
  AIProvider,
  openAIChatModelOptions,
} from '@/components/AI/types/models'
import {useAiSettingsStore} from '@/components/AI/hooks/ai-settings'

/**
 * 自动覆盖相同id的数据，如果id不存在则添加
 */
export const mergeIdData = (existingData: any[], newData: any[]) => {
  // Create a Map from existing data for quick lookup and update
  const dataMap = new Map(existingData.map((item) => [item.id, item]))

  // Process new data items
  newData.forEach((item) => {
    // Update or add the data item in the Map
    dataMap.set(item.id, item)
  })

  // Convert the Map back to an array
  return Array.from(dataMap.values()).map(toRaw)
}

const useAiIdbState = createGlobalState(() => {
  const {data: characterList, isFinished: isCharacterListFinished} = useIDBKeyval<IAiCharacter[]>(
    'page_craft_ai_characters',
    [
      {
        id: 'default',
        name: 'ChatGPT',
        desc: '',
        avatar: iconOpenAI,
        provider: AIProvider.OPEN_AI,
        model: openAIChatModelOptions[0].value,
        systemPrompt: 'You are a helpful assistant.',
      },
      {
        id: 'claude',
        name: 'Claude AI',
        desc: '',
        avatar: iconAnthropic,
        provider: AIProvider.ANTHROPIC,
        model: anthropicChatModelOptions[0].value,
        systemPrompt: 'You are a helpful assistant.',
      },
    ],
  )
  const {data: allChatHistory, isFinished: isAllChatHistory} = useIDBKeyval<IChatHistoryItem[]>(
    'page_craft_ai_history_group',
    [],
  )

  return {
    characterList,
    allChatHistory,
    isCharacterListFinished,
    isAllChatHistory,
  }
})
export const useAiCharacters = () => {
  const aisStore = useAiSettingsStore()
  const {characterList, allChatHistory, isCharacterListFinished, isAllChatHistory} = useAiIdbState()

  // 当前选中的角色
  const currentCharacter = computed(() => {
    return characterList.value.find((item) => item.id === aisStore.currentCharacterId)
  })

  // 当前选中的角色的【全部】聊天历史记录数组
  const currentHistoryGroup = computed(() => {
    if (!allChatHistory.value.length) {
      return []
    }
    if (!currentCharacter.value) {
      return []
    }
    return allChatHistory.value
      .filter((group) => group.cid === currentCharacter.value!.id)
      .reverse()
  })

  // 当前选中的角色的【当前】聊天历史记录对象
  const currentHistory = computed(() => {
    if (!currentHistoryGroup.value.length) {
      return
    }
    return currentHistoryGroup.value.find((item) => item.id === aisStore.currentChatHistoryId)
  })
  return {
    characterList,
    allChatHistory,
    isCharacterListFinished,
    isAllChatHistory,
    currentCharacter,
    currentHistoryGroup,
    currentHistory,
  }
}
