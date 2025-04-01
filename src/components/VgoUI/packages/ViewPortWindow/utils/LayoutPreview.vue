<script lang="ts" setup>
import {ILayout} from '../enum'
interface Props {
  previewData: ILayout | undefined
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
  <transition name="fade-scale">
    <div
      v-if="previewData"
      class="vgo-layout-preview"
      :style="{
        top: `${previewData.yRatio * 100}%`,
        left: `${previewData.xRatio * 100}%`,
        width: `${previewData.widthRatio * 100}%`,
        height: `${previewData.heightRatio * 100}%`,
      }"
    ></div>
  </transition>
</template>

<style lang="scss" scoped>
.vgo-layout-preview {
  position: fixed;
  z-index: 1000;
  background-color: var(--vgo-primary-opacity);
  border: 2px solid var(--vgo-primary);
  pointer-events: none;
  box-sizing: border-box;
  transition: all 0.3s;
}
</style>
