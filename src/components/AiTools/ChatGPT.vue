<script setup lang="ts">
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import {useSettingsStore} from '@/store/settings'
import {marked} from 'marked'
import {copy} from '@/components/QuickLaunch/q-logics/utils'
import {ChatCompletion, ChatUsage, OpenAIApiErrorCodeMessage} from '@/enum/ai/openai'
import {IChatItem} from '@/enum/ai'
import {formatDate} from '@/utils'
import '@/styles/markdown/github-markdown.css'
import '@/styles/markdown/github-markdown-dark.css'
import {useMainStore} from '@/store/main'

const settingsStore = useSettingsStore()

const optionList = computed((): StOptionItem[] => {
  return []
})
const mainStore = useMainStore()
const isLoading = ref(false)
const questionContent = ref('Hello!')
const chatHistory = ref<IChatItem[]>([])

const resetChatHistory = () => {
  chatHistory.value = [
    {
      role: 'system',
      content: 'You are a helpful assistant.',
      timestamp: Date.now(),
    },
  ]
}
onMounted(() => {
  resetChatHistory()
  focusInput()
})

const respContainerRef = ref()
const inputRef = ref()
const usageData = ref<ChatUsage>({
  prompt_tokens: 0,
  completion_tokens: 0,
  total_tokens: 0,
})
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

const sendAiRequest = async () => {
  try {
    isLoading.value = true

    chatHistory.value.push({
      role: 'user',
      content: questionContent.value,
      timestamp: Date.now(),
    })
    questionContent.value = ''
    scrollBottom()

    const apiProxy = settingsStore.openAiApiProxy || 'https://api.openai.com/v1'
    // https://platform.openai.com/docs/api-reference/chat/create
    const response = await fetch(`${apiProxy}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settingsStore.openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: chatHistory.value,
      }),
    })
    const data = await response.json()
    const errorMessage = OpenAIApiErrorCodeMessage[response.status]
    if (errorMessage) {
      chatHistory.value.push({
        role: 'assistant',
        content: `${errorMessage}\n\n${data.error.message}`,
        timestamp: Date.now(),
      })
    } else {
      const chatCompletion = data as ChatCompletion
      const message = chatCompletion.choices[0]?.message || {}
      chatHistory.value.push({
        timestamp: chatCompletion.created * 1000,
        ...message,
      })
      usageData.value = chatCompletion.usage
    }

    scrollBottom()
    focusInput()
  } catch (error: any) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="chat-gpt-wrap vp-bg">
    <OptionUI style="max-width: 500px" :option-list="optionList" />
    <div ref="respContainerRef" class="response-container _scrollbar_mini">
      <div
        class="chat-item"
        v-for="(item, index) in chatHistory"
        :key="index"
        :class="{'is-reply': item.role === 'assistant'}"
      >
        <div class="chat-header">
          <div class="chat-avatar" :title="item.role">
            {{ item.role }}
          </div>
        </div>

        <div class="chat-body">
          <div
            class="chat-content markdown-body vp-bg"
            :class="{'markdown-body-dark': mainStore.isAppDarkMode}"
            v-if="item.content"
            v-html="marked(item.content)"
          ></div>
          <div class="chat-actions">
            <div class="chat-date">{{ formatDate(item.timestamp) }}</div>
            <button class="btn-no-style" @click="copy(item.content)">Copy</button>
          </div>
        </div>
      </div>
    </div>
    <div class="request-below">
      <textarea
        ref="inputRef"
        class="vp-input question-input"
        v-model="questionContent"
        type="textarea"
        rows="3"
      />
      <div class="request-actions">
        <div class="action-side">
          <span class="font-code">{{
            `Prompt: ${usageData.prompt_tokens} | Completion: ${usageData.completion_tokens} | Total: ${usageData.total_tokens}`
          }}</span>
        </div>

        <div class="action-side">
          <button class="vp-button" @click="resetChatHistory" tabindex="-1">Reset</button>
          <button
            class="vp-button"
            :disabled="isLoading || !questionContent"
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

    .chat-item {
      margin-bottom: 4px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      flex-direction: row-reverse;

      &.is-reply {
        flex-direction: row;
        .chat-content {
          border-radius: 0 10px 10px;
        }
      }

      .chat-header {
        margin-bottom: 4px;
      }
      .chat-avatar {
        width: 32px;
        height: 32px;
        background-color: $primary;
        color: white;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        user-select: none;
        box-shadow: 0 1px 1px $color_border;
      }
      .chat-date {
        font-size: 12px;
        opacity: 0.6;
      }

      .chat-body {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .chat-content {
        line-height: 26px;
        display: inline-block;
        padding: 6px 12px;
        border-radius: 10px 0 10px 10px;
        max-width: 800px;
        font-size: 14px;
        background-color: $primary_opacity;
        box-shadow: 0 1px 1px $color_border;
      }

      .chat-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 12px;
        padding: 0 8px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s;

        button {
          opacity: 0.6;
          font-size: 12px;
        }
      }

      &:hover {
        .chat-actions {
          opacity: 1;
          visibility: visible;
        }
      }
    }
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
