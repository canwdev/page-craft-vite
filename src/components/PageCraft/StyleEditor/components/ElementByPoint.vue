<script lang="ts" setup>
import {computed, reactive} from 'vue'
import {
  useElementBounding,
  useElementByPoint,
  useEventListener,
  useMounted,
  useMouse,
} from '@vueuse/core'

const emit = defineEmits(['select'])

const {x, y} = useMouse({type: 'client'})
const {element} = useElementByPoint({x, y})
const bounding = reactive(useElementBounding(element))

useEventListener('scroll', bounding.update, true)

const boxStyles = computed(() => {
  if (element.value) {
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

const pointStyles = computed<Record<string, string | number>>(() => ({
  transform: `translate(calc(${x.value}px - 50%), calc(${y.value}px - 50%))`,
}))

const isMounted = useMounted()
useEventListener('click', (event) => {
  if (!isMounted.value) {
    return
  }
  console.log('click', event)
  event.stopPropagation()
  event.preventDefault()
  emit('select', element.value)
})
</script>

<template>
  <Teleport to=".page-craft-root">
    <div :style="boxStyles" class="mc-element-by-point-box" />
    <div :style="pointStyles" class="mc-element-by-point-pointer" />
  </Teleport>
</template>

<style lang="scss">
.mc-element-by-point-box {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  border: 1px solid $primary;
  background-color: $primary_opacity;
}
.mc-element-by-point-pointer {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  width: 20px;
  height: 20px;
  border-radius: 50px;
  background-color: $primary;
  z-index: 999;
}
</style>
