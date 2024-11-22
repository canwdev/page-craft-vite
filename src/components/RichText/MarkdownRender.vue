<script lang="ts" setup>
import {useVModel, watchThrottled} from '@vueuse/core'
import markdown from '@/utils/markdown'

interface Props {
  dark?: boolean
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  dark: false,
  text: '',
})
const {text} = toRefs(props)

const renderedContent = ref('')
const renderMd = () => {
  renderedContent.value = markdown.render(text.value)
}
watchThrottled(
  text,
  (val) => {
    renderMd()
  },
  {throttle: 100, trailing: true, immediate: true},
)

const handleClick = (event) => {
  const el = event.target
  if (el) {
    if (el.tagName === 'A') {
      el.target = '_blank'
      return
    }

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
  <div
    @click="handleClick"
    class="markdown-body"
    :class="[dark ? 'markdown-body-dark' : 'markdown-body']"
    v-html="renderedContent"
  ></div>
</template>
