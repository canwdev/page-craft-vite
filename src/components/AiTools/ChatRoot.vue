<script lang="ts" setup>
import ChatContent from '@/components/AiTools/ChatContent.vue'
import SideCharacters from '@/components/AiTools/SideCharacters.vue'
import SideHistory from '@/components/AiTools/SideHistory.vue'
</script>

<template>
  <div class="chat-root">
    <n-layout has-sider>
      <n-layout-sider
        collapse-mode="width"
        :collapsed-width="0"
        :width="240"
        show-trigger="arrow-circle"
        content-style=""
        bordered
      >
        <n-split direction="vertical" style="height: 100%">
          <template #1>
            <SideCharacters />
          </template>
          <template #2>
            <SideHistory />
          </template>
        </n-split>
      </n-layout-sider>
      <n-layout-content content-style="">
        <ChatContent />
      </n-layout-content>
    </n-layout>
  </div>
</template>

<style lang="scss" scoped>
.chat-root {
  height: 100%;
  .n-layout {
    height: 100%;
  }
}
</style>
