<script lang="ts">
export default {
  name: 'DesktopWindowManager',
}
</script>

<script lang="ts" setup>
import ViewPortWindow from '@/components/CanUI/packages/ViewPortWindow/index.vue'
import {useSystemStore} from '@/store/system'
import {useSettingsStore} from '@/store/settings'
import {TaskItem} from '@/enum/os'
import ThemedIcon from '@/components/OS/ThemedIcon/ThemedIcon.vue'
import {useMainStore} from '@/store/main'

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

const getIsMaximum = (task: TaskItem) => {
  return task.maximized
}

// pass key into child component
const handleWindowKeydown = (event, task, index) => {
  // console.log(event, task, index)
  const targetComponent = innerComponentRefs.value[index]
  if (targetComponent) {
    if (targetComponent.handleShortcutKey) {
      targetComponent.handleShortcutKey(event)
    }
  }
}

const handleRestore = (index) => {
  const targetWindow = vpWindowRefs.value[index]
  if (targetWindow) {
    setTimeout(() => {
      targetWindow.focus()
    })
  }
}
</script>

<template>
  <div class="desktop-window-manager" :class="{'preview-desktop': false}">
    <template v-for="(task, index) in systemStore.tasks" :key="task.guid">
      <ViewPortWindow
        class="dwm-window"
        ref="vpWindowRefs"
        @onActive="systemStore.setTaskActive(task)"
        @onClose="systemStore.closeTask(task.guid)"
        @onRestored="handleRestore(index)"
        :visible="!task.minimized && !task.isClosing"
        :wid="task.appid"
        :init-win-options="task.winOptions"
        :allow-move="!getIsMaximum(task)"
        :allow-maximum="true"
        v-model:maximized="task.maximized"
        :allow-minimum="false"
        v-model:minimized="task.minimized"
        tabindex="0"
        @keydown="handleWindowKeydown($event, task, index)"
      >
        <template #titleBarLeft>
          <ThemedIcon class="window-icon" :name="task.icon" :icon-class="task.iconClass" />
          <span>{{ task.title }}</span>
        </template>

        <component
          ref="innerComponentRefs"
          v-if="task.component"
          :is="task.component"
          :task="task"
          :appParams="task.params"
          @exitApp="systemStore.closeTask(task.guid)"
        ></component>
        <iframe
          v-else-if="task.url"
          :src="task.url"
          frameborder="0"
          style="width: 100%; height: 100%"
        ></iframe>
      </ViewPortWindow>
    </template>

    <slot></slot>
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
      .vp-window-body {
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
