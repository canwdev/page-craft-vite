<script lang="ts" setup>
import {useVModel, watchThrottled} from '@vueuse/core'
import markdown from '@/utils/markdown'
import MarkdownRender from '@/components/RichText/MarkdownRender.vue'

interface Props {
  isDark?: boolean
  isEditing?: boolean
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  isDark: false,
  isEditing: false,
  text: '',
})

const {text, isEditing} = toRefs(props)
const emit = defineEmits(['update:text'])
const mText = useVModel(props, 'text', emit)
</script>

<template>
  <div
    class="chat-content vp-bg"
    :class="{'markdown-body-dark': isDark}"
    v-if="isEditing"
    style="width: 100%"
  >
    <textarea
      class="vp-input"
      v-model="mText"
      rows="10"
      ref="editInputRef"
      style="width: 100%; font-size: 16px"
    />
  </div>

  <MarkdownRender v-else class="chat-content vp-bg" :dark="isDark" :text="mText" />
</template>
