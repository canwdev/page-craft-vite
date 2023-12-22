<script lang="ts">
import {defineComponent} from 'vue'
import {useMainStore} from '@/store/main'
import DialogTextTransformer from '@/components/VueI18nEditTool/DialogTextTransformer.vue'

export default defineComponent({
  name: 'AppSub',
  components: {
    SystemSettings: defineAsyncComponent(() => import('@/components/PageCraft/SystemSettings.vue')),
    DialogTextTransformer,
    StylusToolsDialog: defineAsyncComponent(
      () => import('@/components/PageCraft/StyleEditor/StylusToolsDialog.vue')
    ),
  },
  setup() {
    window.$message = useMessage()
    window.$notification = useNotification()
    window.$dialog = useDialog()
    window.$loadingBar = useLoadingBar()

    const mainStore = useMainStore()
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
</template>
