<script setup lang="ts">
import TinyMceEditor from '@/components/RichText/TinyMceEditor.vue'
import {useStorage} from '@vueuse/core'
import {useMainStore} from '@/store/main'
import CommonNavbar from '@/components/CommonUI/CommonNavbar.vue'
import {LS_SettingsKey, SettingsTabType} from '@/enum/settings'
import {useRoute} from 'vue-router'
import TabLayout from '@/components/CanUI/packages/Layouts/TabLayout.vue'
import MarkdownEditor from '@/components/RichText/MarkdownEditor.vue'

const editorValue = useStorage(LS_SettingsKey.RICH_TEXT_TOOL_VALUE, '')
const mainStore = useMainStore()
const route = useRoute()

const curTab = ref('markdown')

const loadReleaseNotes = async () => {
  const res = await fetch('./release-notes.md')
  editorValue.value = await res.text()
}

watch(
  () => route.query,
  (val) => {
    if (val && val.is_release_notes) {
      loadReleaseNotes()
    }
  },
  {immediate: true},
)
</script>

<template>
  <div class="rich-text-tool-wrap scrollbar-mini">
    <CommonNavbar />
    <TabLayout
      class="rich-text-tool-main"
      horizontal
      v-model="curTab"
      :options="[
        {label: 'Markdown', value: 'markdown'},
        {label: 'Tiny MCE', value: 'tinymce'},
      ]"
    >
      <MarkdownEditor
        v-if="curTab === 'markdown'"
        :dark="mainStore.isAppDarkMode"
        v-model="editorValue"
      />
      <TinyMceEditor
        v-else-if="curTab === 'tinymce'"
        :dark="mainStore.isAppDarkMode"
        :content-css="mainStore.isAppDarkMode ? 'dark' : ''"
        v-model="editorValue"
      />
    </TabLayout>
  </div>
</template>

<style scoped lang="scss">
.rich-text-tool-wrap {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;

  .rich-text-tool-main {
    flex: 1;
    overflow: hidden;
    ::v-deep(.content-wrap) {
      overflow: auto;
    }
  }
}
</style>
