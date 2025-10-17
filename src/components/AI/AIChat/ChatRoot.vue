<script lang="ts" setup>
import ChatContent from '@/components/AI/AIChat/ChatContent.vue'
import SideCharacters from '@/components/AI/AIChat/SideCharacters.vue'
import SideHistory from '@/components/AI/AIChat/SideHistory.vue'
</script>

<template>
  <div class="ai-chat-root vgo-panel">
    <el-splitter lazy>
      <el-splitter-panel size="200px" collapsible>
        <div class="chat-sidebar">
          <el-splitter lazy layout="vertical">
            <el-splitter-panel>
              <SideCharacters />
            </el-splitter-panel>
            <el-splitter-panel>
              <SideHistory />
            </el-splitter-panel>
          </el-splitter>
        </div>
      </el-splitter-panel>
      <el-splitter-panel>
        <ChatContent />
      </el-splitter-panel>
    </el-splitter>
  </div>
</template>

<style lang="scss">
.ai-chat-root {
  height: 100%;
  color: inherit;
  border: none !important;
  box-shadow: none !important;
  display: flex;
  border-radius: 0 !important;

  font-family:
    'Open Sans', 'Source Han Sans SC', 'PingFang SC', Arial, 'Microsoft YaHei', 'Helvetica Neue', 'Hiragino Sans GB',
    'WenQuanYi Micro Hei', sans-serif;
  font-size: 14px;
  .chat-sidebar {
    height: 100%;
    width: 100%;
    position: relative;

    .ai-side-characters,
    .ai-side-history {
      height: 100%;
    }
  }

  .chat-gpt-wrap {
    flex: 1;
    flex-shrink: 0;
    overflow: hidden;
  }

  .ai-option-ui {
    .panel-header {
      min-height: 26px;
      padding-right: 8px;
      border-radius: 0;
    }
    .c-panel-item {
      .panel-body {
        padding: 0;

        .sub-item {
          padding: 4px 8px;
          &.active {
            background-color: var(--vgo-primary-opacity);
          }
          .o-left .item-icon {
            //border-radius: 50%;
            //overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
