<script lang="ts" setup>
import {useVModel, watchThrottled} from '@vueuse/core'
import markdown from '@/utils/markdown'

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

const renderedContent = ref('')
const renderMd = () => {
  renderedContent.value = markdown.render(text.value)
}
watchThrottled(
  text,
  (val) => {
    if (!isEditing.value) {
      renderMd()
    }
  },
  {throttle: 100, trailing: true, immediate: true}
)
watch(isEditing, (val) => {
  if (!val) {
    renderMd()
  }
})

const handleClick = (event) => {
  const el = event.target
  if (el) {
    // 处理代码块复制
    const isCopyButton = el.classList.contains('hljs-copy-button')
    if (isCopyButton) {
      const code = el.parentElement.nextSibling.textContent
      window.$qlUtils.copy(code)
    }
  }
}
</script>

<template>
  <div class="chat-content vp-bg" :class="{'markdown-body-dark': isDark}" v-if="isEditing">
    <textarea class="vp-input" v-model="mText" rows="4" cols="40" ref="editInputRef" />
  </div>
  <div
    v-else
    @click="handleClick"
    class="chat-content markdown-body vp-bg"
    :class="{'markdown-body-dark': isDark}"
    v-html="renderedContent"
  ></div>
</template>
