<script setup lang="ts">
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import {useSettingsStore} from '@/store/settings'
import {marked} from 'marked'
import {copy} from '@/components/QuickLaunch/q-logics/utils'
import {ChatCompletion} from '@/enum/ai/openai'

const settingsStore = useSettingsStore()

const optionList = computed((): StOptionItem[] => {
  return []
})

const isLoading = ref(false)
const respContainerRef = ref()
const questionContent = ref('Hello!')
const chatCompletion = ref()
const answerQuestionList = ref([])

const sendAiRequest = async () => {
  try {
    isLoading.value = true
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
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.',
          },
          {
            role: 'user',
            content: questionContent.value,
          },
        ],
      }),
    })

    const data = (await response.json()) as ChatCompletion
    chatCompletion.value = data
  } catch (error: any) {
    window.$message.error(error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="chat-gpt-wrap vp-bg">
    <OptionUI style="max-width: 500px" :option-list="optionList" />
    <div ref="respContainerRef" class="response-container _scrollbar_mini">
      <textarea
        class="vp-input font-code"
        style="width: 100%; box-sizing: border-box"
        :value="JSON.stringify(chatCompletion, null, 2)"
        type="textarea"
        rows="10"
        readonly
      />

      <div
        class="answer-item"
        v-for="(item, index) in answerQuestionList"
        :key="index"
        :class="{'question-item': item.question}"
      >
        <div class="date">{{ item.date }}</div>
        <div
          class="content markdown-body"
          v-if="item.question"
          v-html="marked(item.question)"
        ></div>
        <div class="content markdown-body" v-if="item.answer" v-html="marked(item.answer)"></div>
        <div class="answer-actions">
          <button @click="copy(item.answer || item.question)">Copy</button>
        </div>
      </div>
    </div>
    <div class="request-container">
      <textarea
        class="vp-input question-input"
        v-model="questionContent"
        type="textarea"
        rows="3"
      />
      <div class="question-actions">
        <button class="vp-button" :disabled="isLoading" @click="sendAiRequest">Send</button>
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

    .answer-item {
      margin-bottom: 16px;
      .date {
        font-size: 12px;
        color: #666666;
      }
      .content {
        margin-top: 8px;
        line-height: 26px;
        display: inline-block;
        padding: 8px 12px;
        border-radius: 0 8px 8px 8px;
        max-width: 800px;
        font-size: 14px;
        background-color: #ffffff;
      }
    }
    .question-item {
      text-align: right;
      .content {
        border-radius: 8px 0 8px 8px;
        background-color: #ffdeed;
        text-align: left;
      }
    }
    .answer-actions {
      .el-button {
        font-size: 12px;
      }
    }
  }
  .request-container {
    display: flex;
    flex-direction: column;
    padding: 8px;
    box-sizing: border-box;
    border-top: 1px solid $color_border;
    .question-actions {
      margin-top: 5px;
      display: flex;
      gap: 8px;
      justify-content: end;
    }
    .question-input {
      width: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
