<script lang="ts" setup>
interface Props {
  iconClass?: string
}
const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
  <div class="themed-icon">
    <span v-if="iconClass" class="themed-icon-class" :class="iconClass" />
  </div>
</template>

<style lang="scss" scoped>
.themed-icon {
  display: inline-flex;
  align-content: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  .themed-icon-img {
    width: 100%;
    height: 100%;
  }
  .themed-icon-sub-img {
    width: 38%;
    height: 38%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .themed-icon-class {
    line-height: 1;
    color: var(--vgo-primary);
  }
}
</style>
