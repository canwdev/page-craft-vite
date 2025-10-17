<script setup lang="ts">
import TabLayout from '@canwdev/vgo-ui/src/components/Layouts/TabLayout.vue'
import { useStorage } from '@vueuse/core'
import { useRoute } from 'vue-router'
import MarkdownEditor from '@/components/RichText/MarkdownEditor.vue'
import { LS_SettingsKey } from '@/enum/settings'
import { useMainStore } from '@/store/main'

interface AppParams {
  isReleaseNotes: boolean
}

const props = withDefaults(
  defineProps<{
    appParams?: AppParams
  }>(),
  {},
)

const editorValue = useStorage(LS_SettingsKey.RICH_TEXT_TOOL_VALUE, '', localStorage, {
  listenToStorageChanges: false,
})
const mainStore = useMainStore()
const route = useRoute()

const curTab = ref('markdown')

async function loadReleaseNotes() {
  const res = await fetch('./release-notes.md')
  editorValue.value = await res.text()
}
// 应用启动传参
watch(
  () => props.appParams,
  () => {
    console.log(props.appParams)
    if (!props.appParams) {
      return
    }

    if (props.appParams.isReleaseNotes) {
      loadReleaseNotes()
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="rich-text-tool-wrap scrollbar-mini">
    <TabLayout
      v-model="curTab"
      class="rich-text-tool-main"
      horizontal
      :options="[{ label: 'Markdown', value: 'markdown' }]"
    >
      <MarkdownEditor
        v-if="curTab === 'markdown'"
        v-model="editorValue"
        :dark="mainStore.isAppDarkMode"
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
