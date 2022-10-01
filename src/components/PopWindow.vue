<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'

export default defineComponent({
  name: 'PopWindow',
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')

    return {
      mVisible,
    }
  },
})
</script>

<template>
  <div v-if="mVisible" class="pop-window">This is a PopWindow</div>
</template>

<style lang="scss" scoped>
.pop-window {
  padding: 10px;
  background-color: white;
  color: black;
  border: 1px solid currentColor;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
