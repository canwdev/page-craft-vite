<script setup lang="ts">
import ViewPortWindow from '@/components/CanUI/packages/ViewPortWindow/index.vue'
import ChatGPT from '@/components/AI/AIChat/ChatContent.vue'
import {useVModel} from '@vueuse/core'
import ChatRoot from '@/components/AI/AIChat/ChatRoot.vue'

const emit = defineEmits(['update:visible'])
interface Props {
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
})

const mVisible = useVModel(props, 'visible', emit)
</script>

<template>
  <ViewPortWindow
    v-model:visible="mVisible"
    class="chat-window"
    wid="chat"
    allow-maximum
    :init-win-options="{
      width: '800px',
      height: '600px',
    }"
  >
    <template #titleBarLeft>
      <img src="../../../assets/textures/chat-gpt-logo.svg" alt="icon" class="chat-gpt-logo" />
      ChatGPT</template
    >
    <ChatRoot v-if="mVisible" />
  </ViewPortWindow>
</template>

<style scoped lang="scss">
.chat-window {
  min-width: 250px;
  min-height: 250px;
  .chat-gpt-logo {
    width: 16px;
    height: 16px;
    pointer-events: none;
  }
}
</style>
