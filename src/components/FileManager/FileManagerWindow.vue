<script setup lang="ts">
import ViewPortWindow from '@/components/CanUI/packages/ViewPortWindow/index.vue'
import {useVModel} from '@vueuse/core'
import FileManager from './index.vue'

interface Props {
  visible: boolean
}
const props = withDefaults(defineProps<Props>(), {
  visible: true,
})
const emit = defineEmits(['update:visible'])
const mVisible = useVModel(props, 'visible', emit)
</script>

<template>
  <ViewPortWindow
    ref="iframeWinRef"
    class="iframe-browser-vp-window"
    v-model:visible="mVisible"
    wid="iframe_browser"
    allow-maximum
    :init-win-options="{
      width: '600px',
      height: '500px',
    }"
  >
    <template #titleBarLeft>🗃️ {{ $t('common.file_explorer') }}</template>
    <FileManager v-if="mVisible" />
  </ViewPortWindow>
</template>

<style lang="scss"></style>
