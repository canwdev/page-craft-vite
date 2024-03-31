<script setup lang="ts">
import {computed, defineComponent, reactive, toRefs} from 'vue'
import {useElementBounding, useElementByPoint, useMouse} from '@vueuse/core'
import {CLASS_MAIN_CANVAS_ROOT} from '@/enum/page-craft'

interface Props {
  // 如果传入此类名，则只在这个类以下进行选择
  parentClass: string
}
const props = withDefaults(defineProps<Props>(), {
  parentClass: CLASS_MAIN_CANVAS_ROOT,
})
const {parentClass} = toRefs(props)
const parentEl = ref<Element | null>(null)
onMounted(() => {
  if (parentClass.value) {
    parentEl.value = document.querySelector(parentClass.value)
  }
})

const {x, y} = useMouse({type: 'client'})
const {element} = useElementByPoint({x, y})
const bounding = reactive(useElementBounding(element))

// 是否在允许的范围内
const isInParent = computed(() => {
  if (
    (parentEl.value && !parentEl.value.contains(element.value)) ||
    parentEl.value === element.value
  ) {
    return false
  }
  return true
})

const boxStyles = computed(() => {
  if (element.value && isInParent.value) {
    return {
      display: 'block',
      width: `${bounding.width}px`,
      height: `${bounding.height}px`,
      left: `${bounding.left}px`,
      top: `${bounding.top}px`,
      transition: 'all 0.05s linear',
    } as Record<string, string | number>
  }
  return {
    display: 'none',
  }
})

const hoveredElDisplay = computed(() => {
  if (element.value && isInParent.value) {
    let str = `${element.value.localName}`
    let className = element.value.className || ''
    if (typeof className !== 'string') {
      console.warn('className', className)
      className = ''
    }
    className = className.trim().split(' ').join('.')
    if (className) {
      str += `.${className}`
    }
    return str
  }
  return ''
})
</script>

<template>
  <div v-if="hoveredElDisplay" class="mc-indicator-info font-code">{{ hoveredElDisplay }}</div>
  <div :style="boxStyles" class="mc-indicator-box" />
</template>

<style lang="scss" scoped>
.mc-indicator-info {
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
  pointer-events: none;
}

.mc-indicator-box {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  border: 1px solid red;
  background-color: rgba(255, 0, 0, 0.2);
}
</style>
