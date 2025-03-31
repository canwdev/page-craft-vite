<script lang="ts" setup>
import {computed, reactive} from 'vue'
import {useElementBounding, useElementByPoint, useEventListener, useMouse} from '@vueuse/core'

interface Props {
  // 如果传入此类名，则只在这个类以下进行选择
  parentClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  parentClass: undefined,
})
const {parentClass} = toRefs(props)
const emit = defineEmits(['select'])

const parentEl = ref<Element | null>(null)
onMounted(() => {
  if (parentClass.value) {
    parentEl.value = document.querySelector(parentClass.value)
  }
})

const {x, y} = useMouse({type: 'client'})
const {element} = useElementByPoint({x, y})
const bounding = reactive(useElementBounding(element))

useEventListener('scroll', bounding.update, true)

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

const pointStyles = computed<Record<string, string | number>>(() => {
  return {
    transform: `translate(calc(${x.value}px - 50%), calc(${y.value}px - 50%))`,
    color: isInParent.value ? 'white' : 'grey',
  }
})

useEventListener(
  'click',
  (event) => {
    if (!isInParent.value) {
      return
    }
    event.stopPropagation()
    event.preventDefault()
    emit('select', element.value)
  },
  {
    capture: true,
  },
)
</script>

<template>
  <div :style="boxStyles" class="mc-element-by-point-box" />
  <div :style="pointStyles" class="mc-element-by-point-pointer" />
</template>

<style lang="scss">
.mc-element-by-point-box {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  border: 1px solid var(--vgo-primary);
  background-color: var(--vgo-primary-opacity);
}
.mc-element-by-point-pointer {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 8px;
  height: 8px;
  border: 2px solid currentColor;
  border-radius: 50px;
  background-color: var(--vgo-primary);
  z-index: 999;
}
</style>
