<script lang="ts" setup>
import {copy} from '@/components/QuickLaunch/q-logics/utils'
import {formatDate} from '@/utils'
import {IAiCharacter, IMessageContent, IMessageItem} from '@/components/AI/types/ai'

import MessageContent from '@/components/AI/AIChat/ChatBubble/TextContent.vue'
import iconAi from '@/assets/textures/chat-gpt-logo.svg'

interface Props {
  isDark?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  allowRetry?: boolean
  isLoading?: boolean
  character?: IAiCharacter
  item: IMessageItem
}

const emit = defineEmits(['delete', 'retry'])
const props = withDefaults(defineProps<Props>(), {
  isDark: false,
  isLoading: false,
  allowRetry: false,
  allowDelete: false,
})
const {item} = toRefs(props)

const isEditing = ref(false)
const editInputRef = ref()
watch(isEditing, () => {
  setTimeout(() => {
    if (editInputRef.value) {
      editInputRef.value.focus()
    }
  })
})

const isReply = computed(() => {
  return item.value.role === 'assistant'
})

const rootRef = ref()
const scrollToTop = () => {
  const el = rootRef.value
  const scrollParent = el.parentElement
  scrollParent.scrollTo({
    top: el.offsetTop - 10,
    behavior: 'smooth',
  })
}
const scrollToBottom = () => {
  const el = rootRef.value
  const scrollParent = el.parentElement
  scrollParent.scrollTo({
    top: el.offsetTop + el.offsetHeight - scrollParent.offsetHeight + 10,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div
    v-if="item.role === 'system'"
    ref="rootRef"
    class="ai-chat-bubble-system"
    :class="{isEditing}"
  >
    <textarea
      ref="editInputRef"
      v-if="isEditing"
      class="vp-input"
      v-model="item.content as string"
      rows="6"
      @blur="isEditing = false"
    />
    <div
      v-else-if="item.content"
      class="chat-content"
      :class="{'markdown-body-dark': isDark}"
      v-html="`[${item.role}] ${item.content}`"
      @click="isEditing = true"
    ></div>
  </div>
  <div v-else ref="rootRef" class="ai-chat-bubble" :class="{isReply, isEditing}">
    <div class="chat-side">
      <div class="chat-header">
        <div class="chat-avatar" :title="item.role">
          <img
            v-if="character"
            :src="character.avatar || iconAi"
            :alt="item.role"
            :title="character.name"
          />
          <template v-else>
            {{ item.role }}
          </template>
        </div>

        <div class="btn-jump-wrap">
          <button class="btn-no-style btn-jump" @click="scrollToTop">
            <i class="fa fa-angle-double-up" aria-hidden="true"></i>
          </button>
          <button class="btn-no-style btn-jump" @click="scrollToBottom">
            <i class="fa fa-angle-double-down" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="chat-body" :class="{isEditing}">
      <div
        v-if="isLoading"
        class="chat-content markdown-body vp-bg"
        :class="{'markdown-body-dark': isDark}"
      >
        <div
          style="width: 50px; height: 50px"
          v-loading="true"
          element-loading-background="transparent"
        ></div>
      </div>
      <MessageContent
        v-else-if="typeof item.content === 'string'"
        v-model:text="item.content"
        :is-dark="isDark"
        :is-editing="isEditing"
      />
      <template v-else-if="typeof Array.isArray(item.content)">
        <template v-for="(sub, subIndex) in item.content as IMessageContent[]" :key="subIndex">
          <MessageContent
            v-if="sub.type === 'text'"
            v-model:text="sub.text"
            :is-dark="isDark"
            :is-editing="isEditing"
          />
          <div class="chat-images" v-else-if="sub.type === 'image_url' && sub.image_url">
            <img :src="sub.image_url.url" :alt="sub.image_url.detail" />
          </div>
        </template>
      </template>

      <div class="chat-actions">
        <div class="chat-date font-code" v-if="item.timestamp">
          {{ formatDate(item.timestamp) }}
        </div>

        <template v-if="isEditing">
          <button class="btn-no-style" @click="isEditing = false">
            ✅ {{ $t('actions.done') }}
          </button>
        </template>
        <template v-else>
          <button class="btn-no-style" @click="copy(item.content)">
            📋 {{ $t('actions.copy') }}
          </button>

          <button class="btn-no-style" v-if="allowRetry" @click="$emit('retry')">
            🔄 {{ $t('actions.retry') }}
          </button>

          <button class="btn-no-style" v-if="allowEdit" @click="isEditing = true">
            📝 {{ $t('actions.edit') }}
          </button>
          <el-popconfirm
            v-if="allowDelete"
            @confirm="$emit('delete', item)"
            :title="$t('actions.confirm')"
            :teleported="false"
          >
            <template #reference>
              <button class="btn-no-style">🗑️ {{ $t('actions.delete') }}</button>
            </template>
          </el-popconfirm>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-chat-bubble-system {
  margin-bottom: 8px;
  opacity: 0.6;
  background-color: $primary_opacity;
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
  .vp-input {
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

  &.isEditing {
    .chat-actions {
      opacity: 1;
      visibility: visible;
    }
  }
  &.isReply {
    flex-direction: row;
    .chat-avatar {
      background-color: transparent;
    }
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
      gap: 8px;
      opacity: 0;
      transition: all 0.3s;
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
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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
    padding: 6px 10px;
    border-radius: 10px 0 10px 10px;
    max-width: 800px;
    font-size: 16px;
    background-color: $primary_opacity;
    box-shadow: 0 1px 1px $color_border;
    box-sizing: border-box;
    //transition: all 1s;
  }

  .chat-images {
    display: flex;
    & + .chat-images {
      margin-top: 4px;
    }
    img {
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
</style>
