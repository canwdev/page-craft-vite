<script setup lang="ts">
import {useStorage} from '@vueuse/core'
import {useMainStore} from '@/store/main'
import {LS_SettingsKey, SettingsTabType} from '@/enum/settings'
import {useRoute} from 'vue-router'
import TabLayout from '@/components/VgoUI/packages/Layouts/TabLayout.vue'
import MarkdownEditor from '@/components/RichText/MarkdownEditor.vue'

type AppParams = {
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

const loadReleaseNotes = async () => {
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
  {immediate: true},
)
</script>

<template>
  <div class="rich-text-tool-wrap scrollbar-mini">
    <TabLayout
      class="rich-text-tool-main"
      horizontal
      v-model="curTab"
      :options="[{label: 'Markdown', value: 'markdown'}]"
    >
      <MarkdownEditor
        v-if="curTab === 'markdown'"
        :dark="mainStore.isAppDarkMode"
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
