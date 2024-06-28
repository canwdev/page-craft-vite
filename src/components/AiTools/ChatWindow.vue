<script setup lang="ts">
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import ChatGPT from '@/components/AiTools/ChatGPT.vue'
import {useVModel} from '@vueuse/core'

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
  <ViewPortWindow v-model:visible="mVisible" class="chat-window" wid="chat" allow-maximum>
    <template #titleBarLeft>🤯 ChatGPT</template>
    <ChatGPT />
  </ViewPortWindow>
</template>

<style scoped lang="scss">
.chat-window {
  min-width: 250px;
  min-height: 250px;
}
</style>
