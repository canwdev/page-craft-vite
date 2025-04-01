<script setup lang="ts">
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {useThrottleFn} from '@vueuse/core'

const popWindowRef = ref()
const mVisible = ref(false)
const currentItem = ref<any | null>(null)
const x = ref(0)
const y = ref(0)
const cardWidth = ref(0)
const cardHeight = ref(0)

const previewCover = ref('')

onMounted(() => {
  globalEventBus.on(GlobalEvents.ON_COMP_HOVER, handleCompHover)
  globalEventBus.on(GlobalEvents.ON_COMP_HOVER_OUT, handleCompHoverOut)
  globalEventBus.on(GlobalEvents.ON_COMP_HOVER_CLEAR, clearCurrentItem)
})
onBeforeUnmount(() => {
  globalEventBus.off(GlobalEvents.ON_COMP_HOVER, handleCompHover)
  globalEventBus.off(GlobalEvents.ON_COMP_HOVER_OUT, handleCompHoverOut)
  globalEventBus.off(GlobalEvents.ON_COMP_HOVER_CLEAR, clearCurrentItem)
})

const handleStyleCompiled = () => {
  setTimeout(() => {
    if (popWindowRef.value) {
      cardWidth.value = popWindowRef.value.offsetWidth
      cardHeight.value = popWindowRef.value.offsetHeight
    }
  }, 100)
}

watch(currentItem, (val) => {
  previewCover.value = ''
  if (!val) {
    return
  }
  if (val.meta.cover) {
    previewCover.value = val.meta.cover
  }
})

const handleCompHover = (options) => {
  const {event, item} = options || {}
  currentItem.value = item
  x.value = event.clientX
  y.value = event.clientY
  mVisible.value = true
}

const handleCompHoverOut = () => {
  // currentItem.value = null
  mVisible.value = false
}
const clearCurrentItem = () => {
  currentItem.value = null
}

const posStyle = computed(() => {
  let mx = x.value + 40
  let my = y.value + 25
  const wWidth = window.innerWidth
  const wHeight = window.innerHeight

  // 使其始终显示在屏幕内部而不超出
  const offset_left = wWidth - (mx + cardWidth.value)
  if (offset_left < 0) {
    mx += offset_left
  }
  if (mx < x.value) {
    mx = x.value - cardWidth.value - 10
  }

  const offset_top = wHeight - (my + cardHeight.value)
  if (offset_top < 0) {
    my += offset_top
  }
  if (my < y.value) {
    my = y.value - cardHeight.value - 10
  }

  return {
    left: mx + 'px',
    top: my + 'px',
  }
})
</script>

<template>
  <transition name="fade-scale">
    <div ref="popWindowRef" v-if="mVisible" class="pop-window vgo-window" :style="posStyle">
      <div class="pop-window-content" v-if="currentItem">
        <img
          v-if="previewCover"
          :src="previewCover"
          alt="cover"
          class="preview-cover"
          @load="handleStyleCompiled"
        />
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.pop-window {
  background-color: white;
  color: black;
  //border: 1px solid currentColor;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  //box-sizing: border-box;
  pointer-events: none;
  padding: 5px !important;
  overflow: hidden;
  transition: all 0.3s;
  .pop-window-content {
    min-width: 50px;
    min-height: 50px;
    max-width: 400px;
    max-height: 400px;

    .preview-cover {
      display: inline-block;
      width: 100%;
      height: auto;
      object-fit: contain;
    }
  }
}
</style>
