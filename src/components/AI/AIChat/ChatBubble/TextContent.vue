<script lang="ts" setup>
import {useVModel, watchThrottled} from '@vueuse/core'
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

const editInputRef = ref()
watch(isEditing, () => {
  setTimeout(() => {
    if (editInputRef.value) {
      editInputRef.value.scrollIntoView({behavior: 'smooth'})
      editInputRef.value.focus()
    }
  })
})
</script>

<template>
  <div
    class="chat-content vp-bg"
    :class="{'markdown-body-dark': isDark}"
    v-if="isEditing"
    style="width: 100%; padding: 0; display: flex; border-radius: 2px"
  >
    <textarea
      class="vp-input font-code"
      v-model="mText"
      rows="14"
      ref="editInputRef"
      style="width: 100%; font-size: 14px; box-sizing: border-box"
    />
  </div>

  <MarkdownRender v-else class="chat-content vp-bg" :dark="isDark" :text="mText" />
</template>
