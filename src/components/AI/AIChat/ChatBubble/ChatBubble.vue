<script lang="ts" setup>
import type { IAiCharacter, ImageUrlObj, IMessageContent, IMessageItem } from '@/components/AI/types/ai'
import { useI18n } from 'vue-i18n'

import MessageContent from '@/components/AI/AIChat/ChatBubble/TextContent.vue'
import { formatDate } from '@/utils'
import { copy } from '@/utils/mc-utils/text-convert'

interface Props {
  isDark?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  allowRetry?: boolean
  isLoading?: boolean
  character?: IAiCharacter
  item: IMessageItem
}

const props = withDefaults(defineProps<Props>(), {
  isDark: false,
  isLoading: false,
  allowRetry: false,
  allowDelete: false,
})
const emit = defineEmits(['delete', 'retry'])
const { item, character } = toRefs(props)
const { t: $t } = useI18n()

const isEditing = ref(false)
const editInputRef = ref()
watch(isEditing, () => {
  setTimeout(() => {
    if (editInputRef.value) {
      editInputRef.value.scrollIntoView({ behavior: 'smooth' })
      editInputRef.value.focus()
    }
  })
})
const isReply = computed(() => {
  return item.value.role === 'assistant'
})
const hasAvatarImage = computed(() => {
  return character.value && character.value.avatar
})

const rootRef = ref()
function scrollToTop() {
  const el = rootRef.value
  const scrollParent = el.parentElement
  scrollParent.scrollTo({
    top: el.offsetTop - 10,
    behavior: 'smooth',
  })
}
function scrollToBottom() {
  const el = rootRef.value
  const scrollParent = el.parentElement
  scrollParent.scrollTo({
    top: el.offsetTop + el.offsetHeight - scrollParent.offsetHeight + 10,
    behavior: 'smooth',
  })
}

const imageList = computed((): ImageUrlObj[] => {
  if (!item.value) {
    return []
  }
  if (Array.isArray(item.value.content)) {
    const content = item.value.content as IMessageContent[]
    const list: ImageUrlObj[] = []
    content.forEach((item) => {
      const { type, image_url } = item
      if (type === 'image_url') {
        list.push(image_url as ImageUrlObj)
      }
    })
    return list
  }
  return []
})
const imageSrcList = computed(() => {
  return imageList.value.map(i => i.url)
})

function printLog() {
  console.log(JSON.parse(JSON.stringify(item.value)))
}
function confirmDelete(item) {
  window.$dialog
    .confirm('Delete item?', $t('actions.confirm'), {
      type: 'warning',
    })
    .then(() => {
      emit('delete', item)
    })
}

function exportMarkdown(text) {
  window.$mcUtils.handleExportFile('', text, '_chat.md')
}
</script>

<template>
  <div
    v-if="item.role === 'system'"
    ref="rootRef"
    class="ai-chat-bubble-system"
    :class="{ isEditing }"
    @click="isEditing = true"
  >
    <textarea
      v-if="isEditing"
      ref="editInputRef"
      v-model="item.content as string"
      class="vgo-input"
      rows="6"
      @blur="isEditing = false"
    />
    <div
      v-else-if="item.content"
      class="chat-content"
      :class="{ 'markdown-body-dark': isDark }"
      v-html="`[${item.role}] ${item.content}`"
    />
  </div>
  <div
    v-else
    ref="rootRef"
    class="ai-chat-bubble"
    :class="{ 'no-avatar-image': !hasAvatarImage, 'is-reply': isReply, 'is-editing': isEditing }"
  >
    <div class="chat-side">
      <div class="chat-header">
        <div
          class="chat-avatar"
          :title="
            `[${item.role}]`
              + `\n${
                character ? `${character.name}\n[${character.provider}/${character.model}]` : ''}`
          "
          @click="printLog"
        >
          <template v-if="character">
            <img v-if="character.avatar" :src="character.avatar" :alt="item.role">
            <span v-else-if="character.name">{{ character.name[0] }}</span>
          </template>
          <span v-else class="chat-username">
            {{ item.role }}
          </span>
          <span v-if="character" class="chat-username _character">
            {{ character.name }} [{{ `${character.provider}/${character.model}` }}]</span>
        </div>

        <div class="btn-jump-wrap">
          <button class="btn-no-style btn-jump" @click="scrollToTop">
            <span class="mdi mdi-chevron-up" />
          </button>
          <button class="btn-no-style btn-jump" @click="scrollToBottom">
            <span class="mdi mdi-chevron-down" />
          </button>
        </div>
      </div>
    </div>

    <div class="chat-body" :class="{ isEditing }">
      <transition-group name="fade">
        <div
          v-if="isLoading"
          class="chat-content markdown-body vgo-bg"
          :class="{ 'markdown-body-dark': isDark }"
        >
          <div
            v-loading="true"
            style="width: 50px; height: 50px"
            element-loading-background="transparent"
          />
        </div>
        <MessageContent
          v-else-if="typeof item.content === 'string'"
          v-model:text="item.content"
          :is-dark="isDark"
          :is-editing="isEditing"
        />
        <template v-else-if="Array.isArray(item.content)">
          <template v-for="(sub, subIndex) in item.content as IMessageContent[]" :key="subIndex">
            <MessageContent
              v-if="sub.type === 'text'"
              v-show="isEditing || !!sub.text"
              v-model:text="sub.text"
              :is-dark="isDark"
              :is-editing="isEditing"
            />
          </template>
          <div v-if="imageList.length" class="chat-images">
            <el-image
              v-for="(item, index) in imageList"
              :key="index"
              :src="item.url"
              :alt="item.detail"
              :preview-src-list="imageSrcList"
              :initial-index="index"
              :preview-teleported="true"
              fit="contain"
            />
          </div>
        </template>
      </transition-group>

      <div class="chat-actions">
        <div v-if="item.timestamp" class="chat-date font-code">
          {{ formatDate(item.timestamp) }}
        </div>

        <template v-if="isEditing">
          <button class="btn-no-style" @click="isEditing = false">
            <span class="mdi mdi-check" /> {{ $t('actions.done') }}
          </button>
        </template>
        <template v-else>
          <button class="btn-no-style" @click="copy(item.content)">
            <span class="mdi mdi-content-copy" /> {{ $t('actions.copy') }}
          </button>
          <button class="btn-no-style" @click="exportMarkdown(item.content)">
            <span class="mdi mdi-download" /> {{ $t('actions.download') }}
          </button>

          <button v-if="allowRetry" class="btn-no-style" @click="$emit('retry')">
            <span class="mdi mdi-refresh" /> {{ $t('actions.retry') }}
          </button>

          <button v-if="allowEdit" class="btn-no-style" @click="isEditing = true">
            <span class="mdi mdi-pencil" /> {{ $t('actions.edit') }}
          </button>
          <button v-if="allowDelete" class="btn-no-style" @click="confirmDelete">
            <span class="mdi mdi-delete-forever" /> {{ $t('actions.delete') }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-chat-bubble-system {
  margin-bottom: 8px;
  opacity: 0.6;
  background-color: var(--vgo-primary-opacity);
  display: block;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  &.isEditing {
    width: 100%;
  }
  .vgo-input {
    width: 100%;
    box-sizing: border-box;
  }
  .chat-content {
    font-size: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.ai-chat-bubble {
  margin-bottom: 4px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-direction: row-reverse;
  position: relative;

  &.is-editing {
    .chat-actions {
      opacity: 1;
      visibility: visible;
    }
  }
  &.is-reply {
    flex-direction: row;
    .chat-content {
      border-radius: 0 10px 10px;
      background-color: #f1f1f1;

      &.markdown-body-dark {
        background-color: #2f2f2f;
      }
    }
    .chat-body {
      align-items: flex-start;
    }
  }
  &.no-avatar-image {
    .chat-avatar {
      background-color: var(--vgo-primary);
      color: white;
      border-radius: 50%;
      box-shadow: 0 1px 1px var(--vgo-color-border);
    }
  }

  .chat-side {
    align-self: stretch;

    .chat-header {
      margin-bottom: 4px;
      position: sticky;
      top: 0;
    }

    .btn-jump-wrap {
      margin-top: 10px;
      display: flex;
      justify-content: center;
      gap: 4px;
      opacity: 0;
      transition: all 0.3s;
      .mdi {
        font-size: 14px;
      }
    }
    &:hover {
      .btn-jump-wrap {
        opacity: 1;
      }
    }
  }

  .chat-avatar {
    width: 32px;
    height: 32px;
    //border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    user-select: none;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .chat-username {
      &._character {
        display: none;
      }
    }
  }
  .chat-date {
    font-size: 12px;
    opacity: 0.6;
  }

  .chat-body {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex: 1;
  }

  .chat-content {
    line-height: 26px;
    display: inline-block;
    padding: 10px 10px;
    border-radius: 10px 0 10px 10px;
    max-width: 800px;
    font-size: 16px;
    background-color: var(--vgo-primary-opacity);
    box-shadow: 0 1px 1px var(--vgo-color-border);
    box-sizing: border-box;
    //transition: all 1s;
  }

  .chat-images {
    display: flex;
    & + .chat-images {
      margin-top: 4px;
    }
    .el-image {
      max-width: 200px;
      max-height: 300px;
      object-fit: contain;
    }
  }

  .chat-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    padding: 0 8px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s;
    margin-top: 4px;

    button {
      display: flex;
      align-items: center;
      gap: 4px;
      opacity: 0.8;
      font-size: 12px;
      line-height: 1;

      .mdi {
        font-size: inherit;
        line-height: inherit;
        color: var(--vgo-primary);
      }
    }
  }

  &:hover {
    .chat-actions {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
