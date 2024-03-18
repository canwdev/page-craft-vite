<script lang="ts">
import {defineComponent} from 'vue'
import {useMainStore} from '@/store/main'
import DialogTextTransformer from '@/components/VueI18nEditTool/DialogTextTransformer.vue'
import {formatI18nKey} from '@/enum/vue-i18n-tool'
import {textConvertAdvanced, textConvertMultipleLine} from '@/components/VueI18nEditTool/copy-enum'
import {handleExportFile} from '@/utils/exporter'
import QuickLaunchWindow from '@/components/QuickLaunch/QuickLaunchWindow.vue'
import {promptGetFileName} from '@/utils/exporter'
import {TextConvertMode} from '@/components/VueI18nEditTool/copy-enum'

export default defineComponent({
  name: 'AppSub',
  components: {
    QuickLaunchWindow,
    SystemSettings: defineAsyncComponent(
      () => import('@/components/PageCraft/Settings/SystemSettings.vue')
    ),
    DialogTextTransformer,
    StylusToolsDialog: defineAsyncComponent(
      () => import('@/components/PageCraft/StyleEditor/StylusToolsDialog.vue')
    ),
  },
  setup() {
    const mainStore = useMainStore()
    window.$message = useMessage()
    window.$notification = useNotification()
    window.$dialog = useDialog()
    window.$loadingBar = useLoadingBar()

    onMounted(() => {
      window.$mcUtils = {
        formatI18nKey,
        textConvertAdvanced,
        handleExportFile,
        textConvertMultipleLine,
        TextConvertMode,
        promptGetFileName,
      }
    })

    return {
      mainStore,
    }
  },
})
</script>

<template>
  <StylusToolsDialog v-model:visible="mainStore.isShowStylusTools" />
  <DialogTextTransformer v-model:visible="mainStore.isShowTextTransformer" />
  <SystemSettings v-model:visible="mainStore.isShowSettings" />
  <QuickLaunchWindow v-model:visible="mainStore.isShowQuickLaunch" />
</template>
