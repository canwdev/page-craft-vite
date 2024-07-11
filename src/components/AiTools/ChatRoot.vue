<script lang="ts" setup>
import ChatContent from '@/components/AiTools/ChatContent.vue'
import SideCharacters from '@/components/AiTools/SideCharacters.vue'
import SideHistory from '@/components/AiTools/SideHistory.vue'
</script>

<template>
  <div class="ai-chat-root vp-panel">
    <n-split
      direction="horizontal"
      default-size="256px"
      max="456px"
      min="56px"
      style="height: 100%"
      :resize-trigger-size="2"
    >
      <template #1>
        <n-split direction="vertical" style="height: 100%" :resize-trigger-size="2">
          <template #1>
            <SideCharacters />
          </template>
          <template #2>
            <SideHistory />
          </template>
        </n-split>
      </template>
      <template #2>
        <ChatContent />
      </template>
    </n-split>
  </div>
</template>

<style lang="scss">
.ai-chat-root {
  height: 100%;
  color: inherit;
  border: none !important;
  box-shadow: none !important;

  .ai-option-ui {
    .panel-header {
      padding-right: 8px;
    }
    .c-panel-item {
      .panel-body {
        padding: 0;

        .sub-item {
          padding: 4px 8px;
          &.active {
            background-color: $primary_opacity;
          }
          .o-left .item-icon {
            border-radius: 50%;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
