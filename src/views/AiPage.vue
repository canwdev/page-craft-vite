<script setup lang="ts">
import CommonNavbar from '@/components/CommonUI/CommonNavbar.vue'
import ChatRoot from '@/components/AiTools/ChatRoot.vue'
</script>

<template>
  <div class="ai-page _scrollbar_mini">
    <CommonNavbar />
    <ChatRoot />
  </div>
</template>

<style scoped lang="scss">
.ai-page {
  height: 100%;
  display: flex;
  flex-direction: column;

  .ai-chat-root {
    width: 100%;
    flex: 1;
    overflow: hidden;
  }
}
</style>
