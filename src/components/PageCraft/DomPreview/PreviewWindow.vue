<script lang="ts">
import {defineComponent} from 'vue'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {BlockItem} from '@/enum/page-craft/block'
import DomPreview from '@/components/PageCraft/DomPreview/DomPreview.vue'
import {loadComponentHtml, loadComponentStyle} from '@/hooks/use-component-storage'
import VpWindow from '@/components/CommonUI/VpWindow.vue'

export default defineComponent({
  name: 'PopWindow',
  components: {
    VpWindow,
    DomPreview,
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const mVisible = ref(false)
    const currentItem = ref<BlockItem | null>(null)

    const html = ref('')
    const css = ref('')

    onMounted(() => {
      globalEventBus.on(GlobalEvents.ON_COMP_PREVIEW, handleCompPreview)
    })
    onBeforeUnmount(() => {
      globalEventBus.off(GlobalEvents.ON_COMP_PREVIEW, handleCompPreview)
    })

    watch(currentItem, (val) => {
      if (!val) {
        html.value = ''
        css.value = ''
        return
      }
      html.value = loadComponentHtml(val.title)
      css.value = loadComponentStyle(val.title)
    })

    const handleCompPreview = (options) => {
      const {item} = options || {}
      currentItem.value = item
      mVisible.value = true
    }

    return {
      mVisible,
      currentItem,
      html,
      css,
    }
  },
})
</script>

<template>
  <VpWindow class="preview-dialog" v-model:visible="mVisible" wid="preview">
    <template #titleBarLeft> Preview: {{ currentItem?.title }} </template>
    <template v-if="currentItem">
      <DomPreview :id="currentItem.id" :css="css">
        <div v-html="html"></div>
      </DomPreview>
    </template>
  </VpWindow>
</template>

<style lang="scss" scoped>
.preview-dialog {
  width: 800px;
  height: 600px;
  :deep(.vp-window-body) {
    overflow: auto;
    background-color: white !important;
    color: black !important;
  }
}
</style>
