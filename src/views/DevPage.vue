<script setup lang="ts">
import FileManagerWindow from '@/components/FileManager/FileManagerWindow.vue'
import OptionUI from '@/components/CanUI/packages/OptionUI/index.vue'
import {StOptionItem, StOptionType} from '@/components/CanUI/packages/OptionUI/enum'
import CommonNavbar from '@/components/CommonUI/CommonNavbar.vue'
import CanUIDemo from '@/components/CanUI/CanUIDemo.vue'

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
      <template #extra> </template>
    </CommonNavbar>

    <CanUIDemo />
  </div>
</template>

<style scoped lang="scss">
.dev-page {
}
</style>
