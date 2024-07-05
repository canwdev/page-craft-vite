<script lang="ts" setup>
import {StOptionItem} from '@/components/CommonUI/OptionUI/enum'
import OptionUI from '@/components/CommonUI/OptionUI/index.vue'
import {useAiSettingsStore} from '@/store/ai-settings'

const aisStore = useAiSettingsStore()
const optionList = computed((): StOptionItem[] => {
  return [
    {
      label: '历史记录',
      key: 'history',
      children: [],
    },
  ]
})
</script>

<template>
  <div class="ai-side-history">
    <OptionUI :option-list="optionList" />
    {{ aisStore.currentCharacterId }}
  </div>
</template>

<style lang="scss">
.ai-side-history {
  height: 100%;
  .c-panel-item {
    .panel-header {
      z-index: 0;
    }
  }
}
</style>
