<script setup lang="ts">
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {useSettingsStore} from '@/store/settings'
import {ChatCompletion, OpenAIApiErrorCodeMessage} from '@/components/AiTools/types/openai'
import {IChatItem} from '@/components/AiTools/types/ai'
import '@/styles/markdown/github-markdown.css'
import '@/styles/markdown/github-markdown-dark.css'
import {useMainStore} from '@/store/main'
import ChatItem from '@/components/AiTools/ChatItem.vue'
import {useStorage} from '@vueuse/core'
import {useAiSettings} from '@/components/SystemSettings/use-ai-settings'
import {useAiSettingsStore} from '@/store/ai-settings'

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
onMounted(() => {
  if (!chatHistory.value.length) {
    resetChatHistory()
  }
  focusInput()
  scrollBottom()
})

const respContainerRef = ref()
const inputRef = ref()

// 滚动到底部
const scrollBottom = () => {
  setTimeout(() => {
    respContainerRef.value.scrollTop = respContainerRef.value.scrollHeight
  })
}
const focusInput = () => {
  setTimeout(() => {
    inputRef.value.focus()
  })
}

const tempResponseChat = ref<IChatItem | null>(null)
const sendAiRequest = async () => {
  if (!userInputContent.value) {
    return
  }
  try {
    isLoading.value = true
    tempResponseChat.value = {
      role: 'assistant',
      content: '',
      timestamp: -1,
    }

    chatHistory.value.push({
      role: 'user',
      content: userInputContent.value,
      timestamp: Date.now(),
    })
    userInputContent.value = ''
    scrollBottom()

    const apiProxy = aisStore.openAiApiProxy || 'https://api.openai.com/v1'
    // https://platform.openai.com/docs/api-reference/chat/create
    const response = await fetch(`${apiProxy}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${aisStore.openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        // 启用流式响应
        stream: aisStore.stream,
        messages: chatHistory.value.map((i) => {
          return {
            content: i.content,
            role: i.role,
          }
        }),
      }),
    })
    const errorMessage = OpenAIApiErrorCodeMessage[response.status]
    if (errorMessage) {
      const data = await response.json()
      tempResponseChat.value = {
        role: 'assistant',
        content: `${errorMessage}\n\n${data.error.message}`,
      }
      return
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (aisStore.stream) {
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
                  tempResponseChat.value.content += text
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

      // console.log('Final result:', tempResponseChat.value.content) // 打印最终结果
      const chatItem = tempResponseChat.value
      tempResponseChat.value = null
      chatItem.timestamp = Date.now()
      chatHistory.value.push(chatItem)

      return
    }

    // 正常POST返回
    const data = await response.json()
    const chatCompletion = data as ChatCompletion
    const message = chatCompletion.choices[0]?.message || {}

    const chatItem = tempResponseChat.value
    tempResponseChat.value = null
    chatItem.content = message.content || ''
    chatItem.timestamp = chatCompletion.created * 1000
    chatHistory.value.push(chatItem)
  } catch (error: any) {
    console.error(error)
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
