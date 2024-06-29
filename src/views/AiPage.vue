<script setup lang="ts">
import ChatGPT from '@/components/AiTools/ChatGPT.vue'
import CommonNavbar from '@/components/CommonUI/CommonNavbar.vue'
</script>

<template>
  <div class="ai-page _scrollbar_mini">
    <CommonNavbar />
    <ChatGPT class="gpt-wrap" />
  </div>
</template>

<style scoped lang="scss">
.ai-page {
  height: 100%;
  display: flex;
  flex-direction: column;

  .gpt-wrap {
    flex: 1;
    overflow: hidden;
  }
}
</style>
