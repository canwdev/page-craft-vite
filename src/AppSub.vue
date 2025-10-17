<script lang="ts" setup>
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useRoute } from 'vue-router'

import { useAppList } from '@/components/Apps/app-list'
import IframeBrowser from '@/components/IframeBrowser/IframeBrowser.vue'
import DesktopWindowManager from '@/components/OS/DesktopWindowManager.vue'
import QuickLaunchWindow from '@/components/QuickLaunch/QuickLaunchWindow.vue'
import { SettingsTabType } from '@/enum/settings'
import { useMainStore } from '@/store/main'
import { useSettingsStore } from '@/store/settings'
import { useSystemStore } from '@/store/system'
import { GlobalEvents, useGlobalBusOn } from '@/utils/global-event-bus'
import { mcUtils } from '@/utils/mc-utils'
import '@/components/monaco-editor-patch'

const mainStore = useMainStore()
const settingsStore = useSettingsStore()
const systemStore = useSystemStore()
const route = useRoute()
useAppList()
window.$notification = ElNotification
window.$message = ElMessage
window.$dialog = ElMessageBox

const isLitePage = computed(() => {
  return route.name === 'PlaygroundPage'
})

onMounted(() => {
  window.$mcUtils = mcUtils
})

useGlobalBusOn(GlobalEvents.OPEN_SETTINGS, (type: SettingsTabType = SettingsTabType.COMMON) => {
  systemStore.createTaskById('os.pagecraft.settings', { curTab: type })
})
useGlobalBusOn(
  GlobalEvents.OPEN_TEXT_TRANSFORMER,
  (type: SettingsTabType = SettingsTabType.COMMON) => {
    systemStore.createTaskById('os.pagecraft.text_converter')
  },
)
</script>

<template>
  <template v-if="!isLitePage">
    <DesktopWindowManager>
      <QuickLaunchWindow v-model:visible="mainStore.isShowQuickLaunch" />
      <IframeBrowser v-model:visible="mainStore.isShowIframeBrowser" />

      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </DesktopWindowManager>
  </template>
  <RouterView v-else />
</template>
