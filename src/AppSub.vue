<script lang="ts">
import {defineComponent} from 'vue'
import {useMainStore} from '@/store/main'
import DialogTextTransformer from '@/components/VueI18nEditTool/TextConverter/DialogTextTransformer.vue'
import QuickLaunchWindow from '@/components/QuickLaunch/QuickLaunchWindow.vue'
import IframeBrowser from '@/components/IframeBrowser/index.vue'
import {useSettingsStore} from '@/store/settings'

import {mcUtils} from '@/utils/mc-utils'
import {useRoute} from 'vue-router'

export default defineComponent({
  name: 'AppSub',
  components: {
    IframeBrowser,
    QuickLaunchWindow,
    SystemSettings: defineAsyncComponent(
      () => import('@/components/PageCraft/Settings/SystemSettings.vue')
    ),
    DialogTextTransformer,
    StylusToolsDialog: defineAsyncComponent(
      () => import('@/components/StyleEditor/components/StylusToolsDialog.vue')
    ),
  },
  setup() {
    const mainStore = useMainStore()
    const settingsStore = useSettingsStore()
    const route = useRoute()
    window.$message = useMessage()
    window.$notification = useNotification()
    window.$dialog = useDialog()
    window.$loadingBar = useLoadingBar()

    const isLitePage = computed(() => {
      return route.name === 'CraftPlayground'
    })

    onMounted(() => {
      window.$mcUtils = mcUtils
    })

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
  </template>
</template>
