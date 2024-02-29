<script lang="ts">
import {defineComponent} from 'vue'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {BlockItem} from '@/enum/page-craft/block'
import DomPreview from '@/components/PageCraft/DomPreview/DomPreview.vue'
import {loadCompStorage} from '@/hooks/use-component-storage'
import ViewPortWindow from '@/components/CommonUI/ViewPortWindow/index.vue'
import {LsKeys} from '@/enum/page-craft'

export default defineComponent({
  name: 'PopWindow',
  components: {
    ViewPortWindow,
    DomPreview,
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const mVisible = ref(false)
    const currentItem = ref<BlockItem | null>(null)

    const previewHtml = ref('')
    const previewCss = ref('')

    onMounted(() => {
      globalEventBus.on(GlobalEvents.ON_COMP_PREVIEW, handleCompPreview)
      globalEventBus.on(GlobalEvents.ON_COMP_PREVIEW_CLOSE, handleClosePreview)
    })
    onBeforeUnmount(() => {
      globalEventBus.off(GlobalEvents.ON_COMP_PREVIEW, handleCompPreview)
      globalEventBus.off(GlobalEvents.ON_COMP_PREVIEW_CLOSE, handleClosePreview)
    })

    watch(mVisible, (val) => {
      if (!val) {
        return
      }
      if (!currentItem.value) {
        previewHtml.value = ''
        previewCss.value = ''
        return
      }
      previewHtml.value = loadCompStorage(LsKeys.COMP_HTML, currentItem.value.title)
      previewCss.value = loadCompStorage(LsKeys.COMP_STYLE, currentItem.value.title)
    })

    const previewWinRef = ref()

    const handleCompPreview = (options) => {
      const {item, maximum = false} = options || {}
      currentItem.value = item
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
      currentItem,
      previewHtml,
      previewCss,
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
  >
    <template #titleBarLeft> {{ $t('actions.preview') }}: {{ currentItem?.title }} </template>
    <template v-if="currentItem">
      <DomPreview :id="currentItem.id" :css="previewCss">
        <div v-html="previewHtml"></div>
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
