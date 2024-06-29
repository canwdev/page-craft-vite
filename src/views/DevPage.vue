<script setup lang="ts">
import FileManagerWindow from '@/components/FileManager/FileManagerWindow.vue'
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {StOptionItem, StOptionType} from '@/components/CommonUI/OptionUI/enum'
import CommonNavbar from '@/components/CommonUI/CommonNavbar.vue'

const configStore = reactive({
  isShowFileManager: false,
})

const optionList = computed((): StOptionItem[] => {
  return [
    {
      label: 'isShowFileManager',
      key: 'isShowFileManager',
      store: configStore,
      type: StOptionType.SWITCH,
    },
  ]
})
</script>

<template>
  <div class="dev-page _scrollbar_mini">
    <CommonNavbar />

    <div class="container">
      <OptionUI :option-list="optionList" />
    </div>

    <FileManagerWindow v-model:visible="configStore.isShowFileManager" />
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
