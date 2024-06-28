<script setup lang="ts">
import {useMetaTitle} from '@/hooks/use-meta'
import FileManagerWindow from '@/components/FileManager/FileManagerWindow.vue'
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import ChatWindow from '@/components/AiTools/ChatWindow.vue'
const {metaTitle} = useMetaTitle()

const configStore = reactive({
  isShowFileManager: false,
  isShowChatWindow: true,
})

const optionList = computed((): StOptionItem[] => {
  return [
    {
      label: 'isShowFileManager',
      key: 'isShowFileManager',
      store: configStore,
      type: StOptionType.SWITCH,
    },
    {
      label: 'isShowChatWindow',
      key: 'isShowChatWindow',
      store: configStore,
      type: StOptionType.SWITCH,
    },
  ]
})
</script>

<template>
  <div class="dev-page i18n-style _scrollbar_mini">
    <div class="vp-bg navbar-wrap">
      <n-page-header subtitle="" @back="$router.push({name: 'HomePage'})">
        <template #title> {{ metaTitle }} </template>
      </n-page-header>
    </div>

    <div class="container">
      <OptionUI :option-list="optionList" />
    </div>

    <FileManagerWindow v-model:visible="configStore.isShowFileManager" />
    <ChatWindow v-model:visible="configStore.isShowChatWindow" />
  </div>
</template>

<style scoped lang="scss">
.dev-page {
  .container {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
