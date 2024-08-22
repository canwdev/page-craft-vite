<script lang="ts">
import {defineComponent} from 'vue'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import DomPreview from '@/components/PageCraft/DomPreview/DomPreview.vue'
import ViewPortWindow from '@/components/CanUI/packages/ViewPortWindow/index.vue'
import {IComponentExportData} from '@/components/PageCraft/ComponentExplorer/enum'

export default defineComponent({
  name: 'PopWindow',
  components: {
    ViewPortWindow,
    DomPreview,
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const mVisible = ref(false)
    const previewData = ref<IComponentExportData | null>(null)

    onMounted(() => {
      globalEventBus.on(GlobalEvents.ON_COMP_PREVIEW, handleCompPreview)
      globalEventBus.on(GlobalEvents.ON_COMP_PREVIEW_CLOSE, handleClosePreview)
    })
    onBeforeUnmount(() => {
      globalEventBus.off(GlobalEvents.ON_COMP_PREVIEW, handleCompPreview)
      globalEventBus.off(GlobalEvents.ON_COMP_PREVIEW_CLOSE, handleClosePreview)
    })

    const previewWinRef = ref()

    const handleCompPreview = (options) => {
      const {item, maximum = false} = options || {}
      previewData.value = item
      previewWinRef.value.isMaximized = maximum
      mVisible.value = true
    }

    const handleClosePreview = (options) => {
      const {maximum = false} = options || {}
      previewWinRef.value.isMaximized = maximum
      mVisible.value = false
    }

    return {
      previewWinRef,
      mVisible,
      previewData,
    }
  },
})
</script>

<template>
  <ViewPortWindow
    ref="previewWinRef"
    class="preview-dialog"
    v-model:visible="mVisible"
    wid="preview"
    allow-maximum
    :init-win-options="{
      width: '500px',
      height: '500px',
    }"
  >
    <template #titleBarLeft> {{ $t('actions.preview') }}: {{ previewData?.name }} </template>
    <template v-if="previewData && mVisible">
      <DomPreview :id="previewData.id" :style="previewData.style">
        <div v-html="previewData.html"></div>
      </DomPreview>
    </template>
  </ViewPortWindow>
</template>

<style lang="scss" scoped>
.preview-dialog {
  width: 800px;
  height: 600px;

  &._full {
    :deep(.vp-window-body) {
      margin: 10px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  :deep(.vp-window-body) {
    overflow: auto;
    background-color: white !important;
    color: black !important;
  }
}
</style>
