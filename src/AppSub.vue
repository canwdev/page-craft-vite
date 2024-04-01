<script lang="ts">
import {defineComponent} from 'vue'
import {useMainStore} from '@/store/main'
import DialogTextTransformer from '@/components/VueI18nEditTool/TextConverter/DialogTextTransformer.vue'
import {formatI18nKey} from '@/enum/vue-i18n-tool'
import {
  textConvertAdvanced,
  textConvertMultipleLine,
} from '@/components/VueI18nEditTool/TextConverter/copy-enum'
import {handleExportFile, handleImportJson, handleReadSelectedFile} from '@/utils/exporter'
import QuickLaunchWindow from '@/components/QuickLaunch/QuickLaunchWindow.vue'
import {promptGetFileName} from '@/utils/exporter'
import {TextConvertMode} from '@/components/VueI18nEditTool/TextConverter/copy-enum'
import IframeBrowser from '@/components/IframeBrowser/index.vue'
import {useSettingsStore} from '@/store/settings'
import {showInputPrompt} from '@/components/CommonUI/input-prompt'

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
    window.$message = useMessage()
    window.$notification = useNotification()
    window.$dialog = useDialog()
    window.$loadingBar = useLoadingBar()

    onMounted(() => {
      window.$mcUtils = {
        formatI18nKey,
        textConvertAdvanced,
        handleExportFile,
        handleImportJson,
        handleReadSelectedFile,
        textConvertMultipleLine,
        TextConvertMode,
        promptGetFileName,
        showInputPrompt,
      }
    })

    return {
      mainStore,
      settingsStore,
    }
  },
})
</script>

<template>
  <StylusToolsDialog v-model:visible="mainStore.isShowStylusTools" />
  <DialogTextTransformer v-model:visible="mainStore.isShowTextTransformer" />
  <SystemSettings v-model:visible="mainStore.isShowSettings" />
  <QuickLaunchWindow v-model:visible="mainStore.isShowQuickLaunch" />
  <IframeBrowser v-model:visible="mainStore.isShowIframeBrowser" />
</template>
