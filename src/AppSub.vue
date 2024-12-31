<script lang="ts">
import {defineComponent} from 'vue'
import {useMainStore} from '@/store/main'
import {useSettingsStore} from '@/store/settings'

import {mcUtils} from '@/utils/mc-utils'
import {useRoute} from 'vue-router'
import {GlobalEvents, useGlobalBusOn} from '@/utils/global-event-bus'
import {ElMessage, ElMessageBox, ElNotification} from 'element-plus'
import DesktopWindowManager from '@/components/OS/DesktopWindowManager/index.vue'
import {SettingsTabType} from '@/enum/settings'
import {useSystemStore} from '@/store/system'
import {useAppList} from '@/components/Apps/app-list'

export default defineComponent({
  name: 'AppSub',
  components: {
    DesktopWindowManager,
    IframeBrowser: defineAsyncComponent(() => import('@/components/IframeBrowser/index.vue')),
    QuickLaunchWindow: defineAsyncComponent(
      () => import('@/components/QuickLaunch/QuickLaunchWindow.vue'),
    ),
  },
  setup() {
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

    useGlobalBusOn(GlobalEvents.SYNC_STORAGE_DATA, () => {})

    useGlobalBusOn(GlobalEvents.OPEN_SETTINGS, (type: SettingsTabType = SettingsTabType.COMMON) => {
      systemStore.createTaskById('os.pagecraft.settings', {curTab: type})
    })
    useGlobalBusOn(
      GlobalEvents.OPEN_TEXT_TRANSFORMER,
      (type: SettingsTabType = SettingsTabType.COMMON) => {
        systemStore.createTaskById('os.pagecraft.text_converter')
      },
    )

    return {
      mainStore,
      settingsStore,
      isLitePage,
    }
  },
})
</script>

<template>
  <template v-if="!isLitePage">
    <DesktopWindowManager>
      <QuickLaunchWindow v-model:visible="mainStore.isShowQuickLaunch" />
      <IframeBrowser v-model:visible="mainStore.isShowIframeBrowser" />

      <RouterView v-slot="{Component}">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </RouterView>
    </DesktopWindowManager>
  </template>
  <RouterView v-else />
</template>
