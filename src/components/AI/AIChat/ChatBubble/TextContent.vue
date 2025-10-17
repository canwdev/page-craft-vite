<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
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

const emit = defineEmits(['update:text'])
const { text, isEditing } = toRefs(props)
const mText = useVModel(props, 'text', emit)

const editInputRef = ref()
watch(isEditing, () => {
  setTimeout(() => {
    if (editInputRef.value) {
      editInputRef.value.scrollIntoView({ behavior: 'smooth' })
      editInputRef.value.focus()
    }
  })
})
</script>

<template>
  <div
    v-if="isEditing"
    class="chat-content vgo-bg"
    :class="{ 'markdown-body-dark': isDark }"
    style="width: 100%; padding: 0; display: flex; border-radius: 2px"
  >
    <textarea
      ref="editInputRef"
      v-model="mText"
      class="vgo-input font-code"
      rows="14"
      style="width: 100%; font-size: 14px; box-sizing: border-box"
    />
  </div>

  <MarkdownRender v-else class="chat-content vgo-bg" :dark="isDark" :text="mText" />
</template>
