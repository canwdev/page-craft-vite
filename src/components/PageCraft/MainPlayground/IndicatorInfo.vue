<script lang="ts">
import {defineComponent, toRefs} from 'vue'
import {TOOL_CLASSES} from '@/enum/page-craft'

export default defineComponent({
  name: 'IndicatorInfo',
  props: {
    currentEl: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const {currentEl} = toRefs(props)
    const hoveredElDisplay = computed(() => {
      if (currentEl.value) {
        let str = `${currentEl.value.localName}`
        let className = currentEl.value.className || ''
        if (typeof className !== 'string') {
          console.warn('className', className)
          className = ''
        }
        className = className.replace(TOOL_CLASSES.CLASS_MOUSE_OVER, '').trim().split(' ').join('.')
        if (className) {
          str += `.${className}`
        }
        return str
      }
      return ''
    })
    return {
      hoveredElDisplay,
    }
  },
})
</script>

<template>
  <div v-if="hoveredElDisplay" class="indicator-info font-code">{{ hoveredElDisplay }}</div>
</template>

<style lang="scss" scoped>
.indicator-info {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  font-size: 12px;
  max-width: 300px;
  padding: 5px;
  background-color: rgba(30, 30, 30, 0.5);
  color: white;
  line-height: 1.1;
}
</style>
