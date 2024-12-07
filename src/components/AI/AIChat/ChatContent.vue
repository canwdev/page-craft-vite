<script setup lang="ts">
import {IMessageItem} from '@/components/AI/types/ai'
import '@/styles/markdown/github-markdown.css'
import '@/styles/markdown/github-markdown-dark.css'
import {useMainStore} from '@/store/main'
import ChatBubble from '@/components/AI/AIChat/ChatBubble/ChatBubble.vue'
import {useThrottleFn} from '@vueuse/core'
import {useAiSettingsStore} from '@/components/AI/hooks/ai-settings'
import {useI18n} from 'vue-i18n'
import {useAiCharacters} from '@/components/AI/hooks/use-ai-characters'
import {promptConversationAssistant} from '@/components/AI/utils/prompts'
import {GlobalEvents, useGlobalBusOn} from '@/utils/global-event-bus'
import ImagePicker from '@/components/AI/AIChat/ChatBubble/ImagePicker.vue'
import {AIProvider, modelsCanUseVision} from '@/components/AI/types/models'
import {useCommonAi} from '@/components/AI/hooks/use-common-ai'
import SettingsAi from '@/components/SystemSettings/SettingsAi.vue'
import {GptMessage} from '@/components/AI/types/open-ai'
import {getChatContentHtml, printChatContent} from '@/components/AI/utils/print-content'
import DropdownMenu from '@/components/CanUI/packages/OptionUI/Tools/DropdownMenu.vue'

const {t: $t, locale} = useI18n()
const aisStore = useAiSettingsStore()
const {currentCharacter, currentHistory} = useAiCharacters()

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
const scrollBottom = (force = true, behavior = 'smooth') => {
  if (!respContainerRef.value) {
    return
  }
  setTimeout(() => {
    const scrollEl = respContainerRef.value

    // 默认强制滚动，或只有超过临界值才滚动
    if (force || scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.offsetHeight) < 400) {
      scrollEl.scrollTo({
        top: scrollEl.scrollHeight,
        behavior,
      })
    }
  })
}
// 滚动到底部
const scrollTop = (force = true) => {
  if (!respContainerRef.value) {
    return
  }
  setTimeout(() => {
    const scrollEl = respContainerRef.value
    scrollEl.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
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
    scrollBottom(true, 'auto')
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

const {requestChatStream, requestChatMessage} = useCommonAi()

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

    currentHistory.value.title = await requestChatMessage({
      provider: aisStore.provider,
      model: aisStore.model,
      messages: promptConversationAssistant(history),
    })
  } catch (error: any) {
    console.error(error)
  }
}

// GPT4 以上支持vision图像识别
const isEnableVision = computed(() => {
  // @ts-ignore
  return modelsCanUseVision[currentCharacter.value?.model] || false
})

// base64 或 图像 url 字符串数组
const imageList = ref<string[]>([])

const isAllowSend = computed(() => {
  if (!currentCharacter.value || !currentHistory.value) {
    return false
  }
  if (isLoading.value) {
    return false
  }
  if (userInputContent.value || imageList.value.length) {
    return true
  }
  return false
})

const abortController = shallowRef<AbortController | null>(null)
/**
 * 发送1次聊天请求
 * @param isRetry 是否重新生成
 */
const sendAiRequest = async (isRetry = false) => {
  if (isRetry) {
    // allow to send
  } else if (!isAllowSend.value) {
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

      currentHistory.value!.history.push({
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

    const provider = currentCharacter.value!.provider || AIProvider.OPEN_AI
    const model = currentCharacter.value!.model
    const messages = currentHistory.value!.history.map((i) => {
      return {
        content: i.content,
        role: i.role,
      }
    }) as GptMessage[]

    if (aisStore.stream) {
      await requestChatStream(
        provider,
        model,
        messages,
        (text: string) => {
          tempResponseChat.value!.content += text
          scrollBottomThrottled(false)
        },
        {
          signal,
        },
      )
      // 流式完成
      const chatItem = tempResponseChat.value
      tempResponseChat.value = null
      chatItem.timestamp = Date.now()
      currentHistory.value!.history.push(chatItem)
    } else {
      const message = await requestChatMessage({provider, model, messages})
      // 正常POST完成
      tempResponseChat.value = null
      currentHistory.value!.history.push({
        role: 'assistant',
        content: message || '',
        timestamp: Date.now(),
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
    if (aisStore.isEnterSend) {
      if (!event.shiftKey) {
        // 如果是回车且没有按 Shift，阻止默认操作并提交
        event.preventDefault()
        sendAiRequest()
      }
      // 如果同时按下了 Shift，允许默认行为，即换行
    } else {
      if (event.shiftKey || event.ctrlKey) {
        event.preventDefault()
        sendAiRequest()
      }
    }
  }
}

const handlePaste = (event) => {
  if (!isEnableVision.value) {
    return
  }
  // 获取剪贴板数据
  const clipboardData = event.clipboardData
  console.log('clipboardData', clipboardData)
  // 检查剪贴板中的项目
  const items = clipboardData.items

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    // console.log('item', item)

    // 如果是图片类型
    if (/^image/i.test(item.type)) {
      // 获取剪贴板中的图片文件
      const imageFile = item.getAsFile()

      // 使用FileReader读取图片并转换为base64
      const reader = new FileReader()

      reader.onload = function (e) {
        // 获取base64编码的图片
        const base64Image = e.target!.result

        // 打印base64图片
        // console.log('Base64 Image:', base64Image)
        if (base64Image) {
          imageList.value.push(base64Image as string)
        }
      }

      // 读取图片文件
      reader.readAsDataURL(imageFile)
    }
    // 如果是文本
    // else if (item.type === 'text/plain') {
    //   item.getAsString(function (text) {
    //     // 处理粘贴的文本
    //     console.log('Pasted Text:', text)
    //   })
    // }
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

const handlePrint = async () => {
  await printChatContent(respContainerRef.value, currentHistory.value?.title || 'Chat')
}

const handleExportHTML = async () => {
  const title = currentHistory.value?.title || 'Chat'
  window.$mcUtils.handleExportFile(
    title,
    await getChatContentHtml(respContainerRef.value, title),
    '.html',
  )
}
// const handleExportMarkdown = async () => {
//   const title = currentHistory.value?.title || 'Chat'
//   window.$mcUtils.handleExportFile(
//     title,
//     await getChatContentMarkdown(currentHistory.value!.history, title),
//     '.md',
//   )
// }

const exportImportOptions = ref([
  {
    label: 'Print to PDF...',
    iconClass: 'mdi mdi-printer',
    props: {
      onClick() {
        handlePrint()
      },
    },
  },
  {
    label: 'Save HTML file',
    iconClass: 'mdi mdi-language-html5',
    props: {
      onClick() {
        handleExportHTML()
      },
    },
  },
  // {
  //   label: 'Save Markdown file',
  //   iconClass: 'mdi mdi-language-markdown',
  //   props: {
  //     onClick() {
  //       handleExportMarkdown()
  //     },
  //   },
  // },
  {split: true},
  {
    label: 'Import JSON',
    iconClass: 'mdi mdi-import',
    props: {
      async onClick() {
        currentHistory.value!.history = await window.$mcUtils.handleImportJson()
        window.$message.success($t('msgs.import_success'))
      },
    },
  },
  {
    label: 'Export JSON',
    iconClass: 'mdi mdi-export',
    props: {
      async onClick() {
        window.$mcUtils.handleExportFile(
          await window.$mcUtils.promptGetFileName(null, currentHistory.value?.title || 'Chat'),
          JSON.stringify(currentHistory.value!.history, null, 2),
          '.json',
        )
      },
    },
  },
])
</script>

<template>
  <transition name="fade" mode="in-out">
    <div class="chat-gpt-wrap vp-bg" v-if="currentHistory && currentCharacter">
      <div ref="respContainerRef" class="response-container">
        <ChatBubble
          v-for="(item, index) in currentHistory.history"
          :key="item.timestamp"
          :item="item"
          :is-dark="mainStore.isAppDarkMode"
          @delete="currentHistory.history.splice(index, 1)"
          @retry="handleRetry(item, index)"
          allow-delete
          allow-edit
          :allow-retry="index === currentHistory.history.length - 1"
          :character="item.role === 'assistant' ? currentCharacter : undefined"
        />
        <ChatBubble
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
          :placeholder="
            aisStore.isEnterSend ? $t('ai.enter_send_tips_1') : $t('ai.enter_send_tips_2')
          "
          @keydown="handleKeyInput"
          @paste="handlePaste"
        />
        <div class="request-actions">
          <div class="action-side">
            <el-popover
              width="400"
              placement="top-start"
              trigger="click"
              :teleported="false"
              :persistent="false"
              popper-style="padding: 0"
              :auto-close="0"
            >
              <template #reference>
                <button class="vp-button" title="Settings">
                  <span class="mdi mdi-cog"></span>
                </button>
              </template>
              <SettingsAi style="max-height: 70vh; overflow-y: auto" />
            </el-popover>

            <DropdownMenu :options="exportImportOptions">
              <button class="vp-button" title="Export">
                <span class="mdi mdi-tray-arrow-down"></span>
              </button>
            </DropdownMenu>

            <button
              @click="scrollBottom()"
              @contextmenu.prevent="scrollTop()"
              class="vp-button"
              title="Scroll to bottom, right click scroll to top"
            >
              <span class="mdi mdi-unfold-more-horizontal"></span>
            </button>

            <el-popconfirm
              @confirm="resetChatHistory"
              :title="`Confirm clear chat history?`"
              :teleported="false"
            >
              <template #reference>
                <button class="vp-button" :disabled="isLoading">{{ $t('actions.clear') }}</button>
              </template>
            </el-popconfirm>
          </div>

          <div class="action-side">
            <el-tag> {{ currentCharacter.model }} </el-tag>

            <ImagePicker v-model:images="imageList" :disabled="isLoading || !isEnableVision" />

            <button v-if="isLoading" class="vp-button" @click="handleStop">
              <span class="mdi mdi-stop-circle-outline"></span>

              {{ $t('ai.stop_generation') }}
            </button>

            <button
              v-else
              class="vp-button primary"
              :disabled="!isAllowSend"
              @click="sendAiRequest()"
            >
              <span class="mdi mdi-send"></span>
              {{ $t('actions.send') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
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

        .mdi {
          font-size: 16px;
        }
      }
    }
    .question-input {
      width: 100%;
      height: 15vh;
      min-height: 100px;
      box-sizing: border-box;
    }
  }
  .mdi {
    font-size: 14px;
  }
}
</style>
