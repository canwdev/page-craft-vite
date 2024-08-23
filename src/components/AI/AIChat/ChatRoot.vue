<script lang="ts" setup>
import ChatContent from '@/components/AI/AIChat/ChatContent.vue'
import SideCharacters from '@/components/AI/AIChat/SideCharacters.vue'
import SideHistory from '@/components/AI/AIChat/SideHistory.vue'
import {useAiSettingsStore} from '@/components/AI/hooks/ai-settings'

const aisStore = useAiSettingsStore()
</script>

<template>
  <div class="ai-chat-root vp-panel">
    <div class="chat-sidebar" :class="{_expand: aisStore.isSidebarExpand}">
      <SideCharacters />
      <SideHistory />

      <button
        class="btn-toggle-expand btn-no-style"
        @click="aisStore.isSidebarExpand = !aisStore.isSidebarExpand"
      >
        <svg
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 16 16"
        >
          <g fill="none">
            <path
              d="M10.354 3.146a.5.5 0 0 1 0 .708L6.207 8l4.147 4.146a.5.5 0 0 1-.708.708l-4.5-4.5a.5.5 0 0 1 0-.708l4.5-4.5a.5.5 0 0 1 .708 0z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      </button>
    </div>
    <ChatContent />
  </div>
</template>

<style lang="scss">
.ai-chat-root {
  height: 100%;
  color: inherit;
  border: none !important;
  box-shadow: none !important;
  display: flex;

  font-family: 'Open Sans', 'Source Han Sans SC', 'PingFang SC', Arial, 'Microsoft YaHei',
    'Helvetica Neue', 'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif;
  font-size: 14px;
  .chat-sidebar {
    width: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all 0.1s;

    &._expand {
      width: 240px;
      border-right: 1px solid $color_border;
      .btn-toggle-expand {
        svg {
          transform: rotateY(0);
        }
      }
    }

    .btn-toggle-expand {
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      svg {
        transform: rotateY(180deg);
      }
    }

    .ai-side-characters {
      border-bottom: 1px solid $color_border;
    }

    .ai-side-characters,
    .ai-side-history {
      flex: 1;
    }
  }

  .chat-gpt-wrap {
    flex: 1;
    flex-shrink: 0;
    overflow: hidden;
  }

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
