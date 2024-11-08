<script setup lang="ts">
import OptionUI from '@/components/CanUI/packages/OptionUI/index.vue'
import {IMessageContent, IMessageItem} from '@/components/AI/types/ai'
import '@/styles/markdown/github-markdown.css'
import '@/styles/markdown/github-markdown-dark.css'
import {useMainStore} from '@/store/main'
import ChatItem from '@/components/AI/AIChat/ChatBubble/ChatBubble.vue'
import {useStorage, useThrottleFn} from '@vueuse/core'
import {useAiSettings} from '@/components/AI/hooks/use-ai-settings'
import {useAiSettingsStore} from '@/components/AI/hooks/ai-settings'
import {useGpt} from '@/components/AI/hooks/use-gpt'
import {useI18n} from 'vue-i18n'
import {useAiCharacters} from '@/components/AI/hooks/use-ai-characters'
import {promptConversationAssistant} from '@/components/AI/utils/prompts'
import {GlobalEvents, useGlobalBusOn} from '@/utils/global-event-bus'
import ImagePicker from '@/components/AI/AIChat/ChatBubble/ImagePicker.vue'
import {ChatModel} from '@/components/AI/types/openai'

const {t: $t, locale} = useI18n()
const aisStore = useAiSettingsStore()
const {currentCharacter, currentHistory} = useAiCharacters()

const {aiSettingsOptions} = useAiSettings()
const mainStore = useMainStore()
const isLoading = ref(false)
const userInputContent = ref('')

const tempResponseChat = ref<IMessageItem | null>(null)

const getSystemMessage = (): IMessageItem => {
  return {
    role: 'system',
    content: currentCharacter.value!.systemPrompt,
    timestamp: Date.now(),
  }
}
// 重置聊天
const resetChatHistory = () => {
  if (!currentCharacter.value || !currentHistory.value) {
    return
  }
  currentHistory.value.history = [getSystemMessage()]
  tempResponseChat.value = null
}

const respContainerRef = ref()
const inputRef = ref()

// 滚动到底部
const scrollBottom = (force = true) => {
  if (!respContainerRef.value) {
    return
  }
  setTimeout(() => {
    const scrollEl = respContainerRef.value

    // 默认强制滚动，或只有超过临界值才滚动
    if (force || scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.offsetHeight) < 400) {
      scrollEl.scrollTo({
        top: scrollEl.scrollHeight,
        behavior: 'smooth',
      })
    }
  })
}

const scrollBottomThrottled = useThrottleFn(scrollBottom, 500, true)
const focusInput = () => {
  setTimeout(() => {
    inputRef.value?.focus()
  })
}

// DOM 加载完成，自动滚动
const handleLoad = () => {
  tempResponseChat.value = null
  setTimeout(() => {
    focusInput()
    scrollBottom()
  })
}

useGlobalBusOn(GlobalEvents.ON_AI_CHARACTER_UPDATE, () => {
  if (!currentHistory.value) {
    return
  }
  // 更新当前聊天的system提示词
  currentHistory.value.history.shift()
  currentHistory.value.history.unshift(getSystemMessage())
})

const {requestChatCompletion, requestAiChatMessage, canUseVision} = useGpt()

// 自动生成聊天标题
const generateChatTitle = async () => {
  if (!currentHistory.value || !currentHistory.value.history.length) {
    return
  }
  if (currentHistory.value.title) {
    return
  }
  try {
    const history = [...currentHistory.value.history]
    // 移除系统提示词
    history.shift()

    currentHistory.value.title = await requestAiChatMessage(promptConversationAssistant(history), {
      model: ChatModel.GPT4oMini,
    })
  } catch (error: any) {
    console.error(error)
  }
}

// GPT4 以上支持vision图像识别
const isEnableVision = computed(() => {
  return canUseVision(currentCharacter.value?.model)
})
const imageList = ref<string[]>([])

const abortController = shallowRef<AbortController | null>(null)
/**
 * 发送1次聊天请求
 * @param isRetry 是否重新生成
 */
const sendAiRequest = async (isRetry = false) => {
  if (!currentCharacter.value || !currentHistory.value) {
    return
  }
  if (!isRetry && !userInputContent.value) {
    return
  }
  try {
    scrollBottom()
    isLoading.value = true
    tempResponseChat.value = {
      role: 'assistant',
      content: '',
    }

    if (!isRetry) {
      // 添加用户的对话框输入内容
      let content

      if (isEnableVision && imageList.value.length) {
        content = [
          {
            text: userInputContent.value,
            type: 'text',
          },
          // 传入图像
          ...imageList.value.map((i) => {
            return {
              type: 'image_url',
              image_url: {
                detail: 'auto',
                url: i,
              },
            }
          }),
        ]
      } else {
        content = userInputContent.value
      }

      currentHistory.value.history.push({
        role: 'user',
        content,
        timestamp: Date.now(),
      })
      userInputContent.value = ''
      imageList.value = []
    }
    scrollBottomThrottled(false)

    // 停止请求控制器
    const controller = new AbortController()
    const {signal} = controller
    abortController.value = controller

    const chatCompletion = await requestChatCompletion(
      {
        model: currentCharacter.value.model,
        messages: currentHistory.value.history.map((i) => {
          return {
            content: i.content,
            role: i.role,
          }
        }),
      },
      (text: string) => {
        tempResponseChat.value!.content += text
        scrollBottomThrottled(false)
      },
      {
        signal,
      },
    )

    if (typeof chatCompletion === 'string') {
      // 流式返回完整字符串
      const chatItem = tempResponseChat.value
      tempResponseChat.value = null
      chatItem.timestamp = Date.now()
      currentHistory.value.history.push(chatItem)
    } else {
      // 正常POST返回 ChatCompletion
      tempResponseChat.value = null
      const message = chatCompletion.choices[0]?.message || {}
      currentHistory.value.history.push({
        role: 'assistant',
        content: message.content || '',
        timestamp: chatCompletion.created * 1000,
      })
    }

    generateChatTitle()
  } catch (error: any) {
    if (abortController.value) {
      const {signal} = abortController.value
      if (signal.aborted) {
        window.$message.warning('Fetch request was aborted')

        return
      }
    }
    console.error(error)
    tempResponseChat.value = {
      role: 'assistant',
      content: error.message,
      timestamp: Date.now(),
    }
  } finally {
    isLoading.value = false
    abortController.value = null
    scrollBottomThrottled(false)
    focusInput()
  }
}

const handleKeyInput = (event) => {
  if (event.key === 'Enter') {
    if (!event.shiftKey) {
      // 如果是回车且没有按 Shift，阻止默认操作并提交
      event.preventDefault()
      sendAiRequest()
    }
    // 如果同时按下了 Shift，允许默认行为，即换行
  }
}

const handleRetry = (item: IMessageItem, index) => {
  if (!currentHistory.value) {
    return
  }
  if (item.role === 'assistant') {
    currentHistory.value.history.splice(index, 1)
  }
  sendAiRequest(true)
}

// 停止生成
const handleStop = () => {
  if (!abortController.value) {
    return
  }
  abortController.value.abort()
  if (!aisStore.stream) {
    // 非流式传输清除
    tempResponseChat.value = null
  }
}

onBeforeUnmount(() => {
  handleStop()
})

// 切换历史记录
watch(
  currentHistory,
  () => {
    handleStop()
    if (!currentHistory.value) {
      return
    }
    if (!currentHistory.value.history.length) {
      resetChatHistory()
    }
    handleLoad()
  },
  {immediate: true},
)
</script>

<template>
  <div class="chat-gpt-wrap vp-bg" v-if="currentHistory && currentCharacter">
    <div ref="respContainerRef" class="response-container">
      <ChatItem
        v-for="(item, index) in currentHistory.history"
        :key="index"
        :item="item"
        :is-dark="mainStore.isAppDarkMode"
        @delete="currentHistory.history.splice(index, 1)"
        @retry="handleRetry(item, index)"
        allow-delete
        allow-edit
        :allow-retry="index === currentHistory.history.length - 1"
        :character="item.role === 'assistant' ? currentCharacter : undefined"
      />
      <ChatItem
        :item="tempResponseChat"
        v-if="tempResponseChat"
        :is-dark="mainStore.isAppDarkMode"
        :character="currentCharacter"
        :is-loading="!tempResponseChat.content"
      />
    </div>
    <div class="request-below">
      <textarea
        ref="inputRef"
        class="vp-input question-input"
        v-model="userInputContent"
        type="textarea"
        rows="5"
        :placeholder="$t('ai.hui_che_jian_ti_jiao')"
        @keydown="handleKeyInput"
      />
      <div class="request-actions">
        <div class="action-side">
          <el-popover width="400" placement="top-start" trigger="click" :teleported="false">
            <template #reference>
              <button class="vp-button">
                <span class="mdi mdi-cog"></span>
              </button>
            </template>
            <OptionUI :option-list="aiSettingsOptions" />
          </el-popover>

          <button @click="scrollBottom()" class="vp-button">
            <span class="mdi mdi-arrow-down"></span>
          </button>
        </div>

        <div class="action-side">
          {{ currentCharacter.model }}

          <template v-if="isEnableVision">
            <ImagePicker v-model:images="imageList" :disabled="isLoading" />
          </template>

          <el-popconfirm
            @confirm="resetChatHistory"
            :title="`Confirm clear chat history?`"
            :teleported="false"
          >
            <template #reference>
              <button class="vp-button" :disabled="isLoading">{{ $t('actions.clear') }}</button>
            </template>
          </el-popconfirm>

          <button v-if="isLoading" class="vp-button" @click="handleStop">
            <span class="mdi mdi-stop-circle-outline"></span>

            {{ $t('ai.stop_generation') }}
          </button>

          <button
            v-else
            class="vp-button primary"
            :disabled="isLoading || !userInputContent"
            @click="sendAiRequest()"
          >
            <span class="mdi mdi-send"></span>
            {{ $t('actions.send') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.chat-gpt-wrap {
  position: relative;
  height: 100%;
  //width: 100%;
  display: flex;
  flex-direction: column;
  .response-container {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }
  .request-below {
    display: flex;
    flex-direction: column;
    padding: 8px;
    box-sizing: border-box;
    border-top: 1px solid $color_border;
    .request-actions {
      margin-top: 5px;
      display: flex;
      gap: 8px;
      justify-content: space-between;
      flex-wrap: wrap;

      .action-side {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 12px;
      }
    }
    .question-input {
      width: 100%;
      box-sizing: border-box;
    }
  }
  .mdi {
    font-size: 14px;
  }
}
</style>
