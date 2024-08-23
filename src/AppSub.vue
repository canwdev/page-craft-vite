<script lang="ts">
import {defineComponent} from 'vue'
import {useMainStore} from '@/store/main'
import {useSettingsStore} from '@/store/settings'

import {mcUtils} from '@/utils/mc-utils'
import {useRoute} from 'vue-router'
import {GlobalEvents, useGlobalBusOn} from '@/utils/global-event-bus'
import {ElMessage, ElMessageBox, ElNotification} from 'element-plus'

export default defineComponent({
  name: 'AppSub',
  components: {
    ChatWindow: defineAsyncComponent(() => import('@/components/AI/AIChat/ChatWindow.vue')),
    IframeBrowser: defineAsyncComponent(() => import('@/components/IframeBrowser/index.vue')),
    QuickLaunchWindow: defineAsyncComponent(
      () => import('@/components/QuickLaunch/QuickLaunchWindow.vue'),
    ),
    DialogTextTransformer: defineAsyncComponent(
      () => import('@/components/VueI18nEditTool/TextConverter/DialogTextTransformer.vue'),
    ),
    SystemSettings: defineAsyncComponent(
      () => import('@/components/SystemSettings/SystemSettings.vue'),
    ),
    StylusToolsDialog: defineAsyncComponent(
      () => import('@/components/StyleEditor/components/StylusToolsDialog.vue'),
    ),
  },
  setup() {
    const mainStore = useMainStore()
    const settingsStore = useSettingsStore()
    const route = useRoute()
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
    <StylusToolsDialog v-model:visible="mainStore.isShowStylusTools" />
    <DialogTextTransformer v-model:visible="mainStore.isShowTextTransformer" />
    <SystemSettings v-model:visible="mainStore.isShowSettings" />
    <QuickLaunchWindow v-model:visible="mainStore.isShowQuickLaunch" />
    <IframeBrowser v-model:visible="mainStore.isShowIframeBrowser" />
    <ChatWindow v-model:visible="mainStore.isShowAiChat" />
  </template>
</template>
