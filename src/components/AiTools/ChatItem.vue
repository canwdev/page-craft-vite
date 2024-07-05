<script lang="ts" setup="">
import {marked} from 'marked'
import {copy} from '@/components/QuickLaunch/q-logics/utils'
import {formatDate} from '@/utils'
import {IChatItem} from '@/components/AiTools/types/ai'

interface Props {
  isDark?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  item: IChatItem
}

const emit = defineEmits(['delete'])
const props = withDefaults(defineProps<Props>(), {
  isDark: false,
  allowDelete: false,
})

const isEditing = ref(false)
const editInputRef = ref()
watch(isEditing, () => {
  setTimeout(() => {
    editInputRef.value.focus()
  })
})
</script>

<template>
  <div class="chat-item-system" v-if="item.role === 'system'">
    <textarea
      ref="editInputRef"
      v-if="isEditing"
      class="vp-input"
      v-model="item.content"
      rows="2"
      cols="30"
      @blur="isEditing = false"
    />
    <div
      v-else-if="item.content"
      class="chat-content markdown-body"
      :class="{'markdown-body-dark': isDark}"
      v-html="marked(`[${item.role}] ${item.content}`)"
      @click="isEditing = true"
    ></div>
  </div>
  <div v-else class="chat-item" :class="{'is-reply': item.role === 'assistant'}">
    <div class="chat-header">
      <div class="chat-avatar" :title="item.role">
        {{ item.role }}
      </div>
    </div>

    <div class="chat-body">
      <div class="chat-content vp-bg" :class="{'markdown-body-dark': isDark}" v-if="isEditing">
        <textarea class="vp-input" v-model="item.content" rows="4" cols="30" ref="editInputRef" />
      </div>
      <template v-else>
        <div
          class="chat-content markdown-body vp-bg"
          :class="{'markdown-body-dark': isDark}"
          v-if="item.content"
          v-html="marked(item.content)"
        ></div>
        <div
          v-else
          class="chat-content markdown-body vp-bg"
          :class="{'markdown-body-dark': isDark}"
        >
          <n-spin size="small"></n-spin>
        </div>
      </template>

      <div class="chat-actions">
        <div class="chat-date font-code" v-if="item.timestamp">
          {{ formatDate(item.timestamp) }}
        </div>

        <template v-if="isEditing">
          <button class="btn-no-style" @click="isEditing = false">{{ $t('actions.done') }}</button>
        </template>
        <template v-else>
          <button class="btn-no-style" @click="copy(item.content)">{{ $t('actions.copy') }}</button>

          <button class="btn-no-style" v-if="allowEdit" @click="isEditing = true">
            {{ $t('actions.edit') }}
          </button>
          <n-popconfirm v-if="allowDelete" @positive-click="$emit('delete', item)">
            <template #trigger>
              <button class="btn-no-style">{{ $t('actions.delete') }}</button>
            </template>
            {{ $t('actions.confirm') }}
          </n-popconfirm>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-item-system {
  margin-bottom: 8px;
  opacity: 0.6;
  background-color: $primary_opacity;
  display: block;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  .chat-content {
    font-size: 12px;
  }
}

.chat-item {
  margin-bottom: 4px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-direction: row-reverse;

  &.is-reply {
    flex-direction: row;
    .chat-avatar {
      background-color: #74aa9c;
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

  .chat-header {
    margin-bottom: 4px;
    position: sticky;
    top: 0px;
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
    transition: all 1s;
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
</style>
