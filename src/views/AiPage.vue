<script setup lang="ts">
import CommonNavbar from '@/components/CommonUI/CommonNavbar.vue'
import ChatRoot from '@/components/AI/AIChat/ChatRoot.vue'
</script>

<template>
  <div class="ai-page scrollbar-mini">
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
