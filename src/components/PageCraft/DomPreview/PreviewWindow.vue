<script lang="ts">
import {defineComponent} from 'vue'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {BlockItem} from '@/enum/page-craft/block'
import DomPreview from '@/components/PageCraft/DomPreview/DomPreview.vue'
import {loadCompStorage} from '@/hooks/use-component-storage'
import VpWindow from '@/components/CommonUI/VpWindow.vue'
import {ArrowMaximize20Regular, ArrowMinimize20Regular} from '@vicons/fluent'
import {LsKeys} from '@/enum/page-craft'

export default defineComponent({
  name: 'PopWindow',
  components: {
    ArrowMaximize20Regular,
    ArrowMinimize20Regular,
    VpWindow,
    DomPreview,
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const mVisible = ref(false)
    const isMaximum = ref(false)
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

    watch(currentItem, (val) => {
      if (!val) {
        previewHtml.value = ''
        previewCss.value = ''
        return
      }
      previewHtml.value = loadCompStorage(LsKeys.COMP_HTML, val.title)
      previewCss.value = loadCompStorage(LsKeys.COMP_STYLE, val.title)
    })

    const handleCompPreview = (options) => {
      const {item, maximum = false} = options || {}
      currentItem.value = item
      isMaximum.value = maximum
      mVisible.value = true
    }

    const handleClosePreview = (options) => {
      const {maximum = false} = options || {}
      isMaximum.value = maximum
      mVisible.value = false
    }

    return {
      mVisible,
      currentItem,
      previewHtml,
      previewCss,
      isMaximum,
    }
  },
})
</script>

<template>
  <VpWindow
    class="preview-dialog"
    v-model:visible="mVisible"
    wid="preview"
    :maximum="isMaximum"
    :allow-move="!isMaximum"
  >
    <template #titleBarLeft> {{ $t('actions.preview') }}: {{ currentItem?.title }} </template>
    <template #titleBarRightControls>
      <button @click="isMaximum = !isMaximum">
        <n-icon size="20">
          <ArrowMinimize20Regular v-if="isMaximum" />
          <ArrowMaximize20Regular v-else />
        </n-icon>
      </button>
    </template>
    <template v-if="currentItem">
      <DomPreview :id="currentItem.id" :css="previewCss">
        <div v-html="previewHtml"></div>
      </DomPreview>
    </template>
  </VpWindow>
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
