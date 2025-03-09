<script lang="ts" setup>
import {watchThrottled} from '@vueuse/core'
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
    const isActionButton = el.classList.contains('_js-action-button')
    if (isActionButton) {
      console.log(el)

      const code = el.parentElement.nextSibling.textContent
      const lang =
        el.parentElement.querySelector('.lang-display')?.getAttribute('data-lang') || 'txt'

      console.log(el.parentElement.nextSibling)
      switch (el.getAttribute('data-action')) {
        case 'copy':
          window.$qlUtils.copy(code)
          break
        case 'download':
          window.$mcUtils.handleExportFile('', code, '_code.' + lang)
          break
      }
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
