<script setup lang="ts">
import FileManagerWindow from '@/components/FileManager/FileManagerWindow.vue'
import OptionUI from '@/components/CanUI/packages/OptionUI/index.vue'
import {StOptionItem, StOptionType} from '@/components/CanUI/packages/OptionUI/enum'
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
  <div class="dev-page scrollbar-mini">
    <CommonNavbar>
      <template #extra>
        <RouterLink :to="{name: 'CanUIDemoPage'}">UI Demo</RouterLink>
      </template>
    </CommonNavbar>

    <div class="container">
      <OptionUI style="max-width: 500px" :option-list="optionList" />
    </div>

    <FileManagerWindow v-model:visible="configStore.isShowFileManager" />
  </div>
</template>

<style scoped lang="scss">
.dev-page {
  .container {
  }
}
</style>
