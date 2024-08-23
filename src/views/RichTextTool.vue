<script setup lang="ts">
import TinyMceEditor from '@/components/CommonUI/TinyMceEditor.vue'
import {useScriptTag, useStorage} from '@vueuse/core'
import {useMainStore} from '@/store/main'
import CommonNavbar from '@/components/CommonUI/CommonNavbar.vue'

const isLoaded = ref(false)
useScriptTag('lib/tinymce-6.0.3/tinymce.min.js', (el: HTMLScriptElement) => {
  isLoaded.value = true
})

const editorValue = useStorage('rich_text_tool_value', '')
const mainStore = useMainStore()
</script>

<template>
  <div class="rich-text-tool-wrap scrollbar-mini">
    <CommonNavbar />

    <TinyMceEditor
      :dark="mainStore.isAppDarkMode"
      :content-css="mainStore.isAppDarkMode ? 'dark' : ''"
      v-model="editorValue"
      v-if="isLoaded"
    />
    <div v-else>Loading...</div>

    <ul class="vp-bg">
      <li>
        <a href="https://word2md.com/" target="_blank">https://word2md.com/</a>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.rich-text-tool-wrap {
  height: 100%;
  overflow: auto;

  .vp-bg {
    a {
      color: $primary;
    }
  }
}
</style>
