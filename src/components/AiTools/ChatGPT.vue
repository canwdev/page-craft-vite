<script setup lang="ts">
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {IChatItem} from '@/components/AiTools/types/ai'
import '@/styles/markdown/github-markdown.css'
import '@/styles/markdown/github-markdown-dark.css'
import {useMainStore} from '@/store/main'
import ChatItem from '@/components/AiTools/ChatItem.vue'
import {useStorage, useThrottleFn} from '@vueuse/core'
import {useAiSettings} from '@/components/SystemSettings/use-ai-settings'
import {useAiSettingsStore} from '@/store/ai-settings'
import {useGpt} from '@/components/AiTools/use-gpt'

const aisStore = useAiSettingsStore()

const {aiSettingsOptions} = useAiSettings()
const mainStore = useMainStore()
const isLoading = ref(false)
const userInputContent = ref('')
const chatHistory = useStorage<IChatItem[]>('page_craft_ai_chat_history', [])

const resetChatHistory = () => {
  chatHistory.value = [
    {
      role: 'system',
      content: 'You are a helpful assistant.',
      timestamp: Date.now(),
    },
  ]
  tempResponseChat.value = null
}

const respContainerRef = ref()
const inputRef = ref()

// 滚动到底部
const scrollBottom = useThrottleFn(
  () => {
    setTimeout(() => {
      respContainerRef.value.scrollTop = respContainerRef.value.scrollHeight
    })
  },
  200,
  true
)
const focusInput = () => {
  setTimeout(() => {
    inputRef.value.focus()
  })
}
onMounted(() => {
  if (!chatHistory.value.length) {
    resetChatHistory()
  }
  focusInput()
  scrollBottom()
})

const tempResponseChat = ref<IChatItem | null>(null)

const {requestChatCompletion} = useGpt()
const sendAiRequest = async () => {
  if (!userInputContent.value) {
    return
  }
  try {
    isLoading.value = true
    tempResponseChat.value = {
      role: 'assistant',
      content: '',
    }

    chatHistory.value.push({
      role: 'user',
      content: userInputContent.value,
      timestamp: Date.now(),
    })
    userInputContent.value = ''
    scrollBottom()

    const chatCompletion = await requestChatCompletion(
      {
        messages: chatHistory.value.map((i) => {
          return {
            content: i.content,
            role: i.role,
          }
        }),
      },
      (text: string) => {
        tempResponseChat.value!.content += text
        scrollBottom()
      }
    )

    if (typeof chatCompletion === 'string') {
      // 流式返回完整字符串
      const chatItem = tempResponseChat.value
      tempResponseChat.value = null
      chatItem.timestamp = Date.now()
      chatHistory.value.push(chatItem)
    } else {
      // 正常POST返回 ChatCompletion
      tempResponseChat.value = null
      const message = chatCompletion.choices[0]?.message || {}
      chatHistory.value.push({
        role: 'assistant',
        content: message.content || '',
        timestamp: chatCompletion.created * 1000,
      })
    }
  } catch (error: any) {
    console.error(error)
    tempResponseChat.value = {
      role: 'assistant',
      content: error.message,
      timestamp: Date.now(),
    }
  } finally {
    isLoading.value = false
    scrollBottom()
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
</script>

<template>
  <div class="chat-gpt-wrap vp-bg">
    <div ref="respContainerRef" class="response-container _scrollbar_mini">
      <ChatItem
        v-for="(item, index) in chatHistory"
        :key="index"
        :item="item"
        :is-dark="mainStore.isAppDarkMode"
        @delete="chatHistory.splice(index, 1)"
        allow-delete
        allow-edit
      />
      <ChatItem
        :item="tempResponseChat"
        v-if="tempResponseChat"
        :is-dark="mainStore.isAppDarkMode"
      />
    </div>
    <div class="request-below">
      <textarea
        ref="inputRef"
        class="vp-input question-input"
        v-model="userInputContent"
        type="textarea"
        rows="4"
        placeholder="回车键提交，shift+回车换行"
        @keydown="handleKeyInput"
      />
      <div class="request-actions">
        <div class="action-side">
          <n-popover trigger="click">
            <template #trigger>
              <button class="vp-button">⚙️</button>
            </template>
            <OptionUI style="max-width: 400px" :option-list="aiSettingsOptions" />
          </n-popover>
        </div>

        <div class="action-side">
          <n-popconfirm @positive-click="resetChatHistory">
            <template #trigger>
              <button class="vp-button">Clear</button>
            </template>
            Clear chat history?
          </n-popconfirm>
          <button
            class="vp-button"
            :disabled="isLoading || !userInputContent"
            @click="sendAiRequest"
          >
            Send
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
        gap: 8px;
        font-size: 12px;
      }
    }
    .question-input {
      width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
