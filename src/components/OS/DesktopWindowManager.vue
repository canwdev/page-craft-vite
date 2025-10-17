<script lang="ts" setup>
import type { TaskItem } from '@/enum/os'
import ViewPortWindow from '@canwdev/vgo-ui/src/components/ViewPortWindow/ViewPortWindow.vue'
import ThemedIcon from '@/components/OS/ThemedIcon.vue'
import { useMainStore } from '@/store/main'
import { useSettingsStore } from '@/store/settings'
import { useSystemStore } from '@/store/system'

const mainStore = useMainStore()
const systemStore = useSystemStore()
const settingsStore = useSettingsStore()
const vpWindowRefs = ref()
const innerComponentRefs = ref()

watch(
  () => systemStore.tasks,
  (list) => {
    if (settingsStore.isWindowed) {
      setTimeout(() => {
        // 给每一个任务设置窗口ref
        list.forEach((i: TaskItem, index) => {
          if (!i.windowRef) {
            i.windowRef = vpWindowRefs.value[index]
          }
        })
      })
    }
  },
)

function getIsMaximum(task: TaskItem) {
  return task.maximized
}

// pass key into child component
function handleWindowKeydown(event, task, index) {
  // console.log(event, task, index)
  const targetComponent = innerComponentRefs.value[index]
  if (targetComponent) {
    if (targetComponent.handleShortcutKey) {
      targetComponent.handleShortcutKey(event)
    }
  }
}

function handleRestore(index) {
  const targetWindow = vpWindowRefs.value[index]
  if (targetWindow) {
    setTimeout(() => {
      targetWindow.focus()
    })
  }
}
</script>

<template>
  <div class="desktop-window-manager" :class="{ 'preview-desktop': false }">
    <template v-for="(task, index) in systemStore.tasks" :key="task.guid">
      <ViewPortWindow
        ref="vpWindowRefs"
        v-model:maximized="task.maximized"
        v-model:minimized="task.minimized"
        class="dwm-window"
        :visible="!task.minimized && !task.isClosing"
        :wid="task.appid"
        :init-win-options="task.winOptions"
        :allow-move="!getIsMaximum(task)"
        :allow-maximum="true"
        :allow-minimum="false"
        tabindex="0"
        @on-active="systemStore.setTaskActive(task)"
        @on-close="systemStore.closeTask(task.guid)"
        @on-restored="handleRestore(index)"
        @keydown="handleWindowKeydown($event, task, index)"
      >
        <template #titleBarLeft>
          <ThemedIcon class="window-icon" :name="task.icon" :icon-class="task.iconClass" />
          <span>{{ task.title }}</span>
        </template>

        <component
          :is="task.component"
          v-if="task.component"
          ref="innerComponentRefs"
          :task="task"
          :app-params="task.params"
          @exit-app="systemStore.closeTask(task.guid)"
        />
        <iframe
          v-else-if="task.url"
          :src="task.url"
          frameborder="0"
          style="width: 100%; height: 100%"
        />
      </ViewPortWindow>
    </template>

    <slot />
  </div>
</template>

<style lang="scss">
.desktop-window-manager {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 0;
  overflow: hidden;
  //user-select: none;

  .dwm-window {
    min-width: 350px;
    min-height: 200px;
    outline: none;
  }

  &.preview-desktop {
    .dwm-window {
      color: white;
      opacity: 0.4;
      background-color: transparent !important;
      .vgo-window-body {
        opacity: 0;
      }
    }
  }
  .static-window {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    outline: none;
  }
}
</style>
