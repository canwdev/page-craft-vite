<script lang="ts">
import {defineComponent} from 'vue'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import {BlockItem} from '@/enum/page-craft/block'
import DomPreview from '@/components/PageCraft/DomPreview/DomPreview.vue'
import {loadComponentHtml, loadComponentStyle} from '@/hooks/use-component-storage'
import {throttle} from 'throttle-debounce'

export default defineComponent({
  name: 'PopFloat',
  components: {
    DomPreview,
  },
  emits: ['update:visible'],
  setup(props, {emit}) {
    const popWindowRef = ref()
    const mVisible = ref(false)
    const currentItem = ref<BlockItem | null>(null)
    const x = ref(0)
    const y = ref(0)
    const cardWidth = ref(0)
    const cardHeight = ref(0)

    const previewHtml = ref('')
    const previewCss = ref('')
    const previewCover = ref('')

    onMounted(() => {
      globalEventBus.on(GlobalEvents.ON_COMP_HOVER, handleMousemoveDebounced)
      globalEventBus.on(GlobalEvents.ON_COMP_HOVER_OUT, handleCompHoverOut)
    })
    onBeforeUnmount(() => {
      globalEventBus.off(GlobalEvents.ON_COMP_HOVER, handleMousemoveDebounced)
      globalEventBus.off(GlobalEvents.ON_COMP_HOVER_OUT, handleCompHoverOut)
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
      previewHtml.value = ''
      previewCss.value = ''
      previewCover.value = ''
      if (!val) {
        return
      }
      if (val.data.cover) {
        previewCover.value = val.data.cover
      } else {
        previewHtml.value = loadComponentHtml(val.title)
        previewCss.value = loadComponentStyle(val.title)
      }
    })

    const handleMousemoveDebounced = throttle(50, true, (options) => {
      handleCompHover(options)
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

    return {
      popWindowRef,
      mVisible,
      posStyle,
      currentItem,
      previewHtml,
      previewCss,
      previewCover,
      cardWidth,
      cardHeight,
      handleStyleCompiled,
    }
  },
})
</script>

<template>
  <transition name="mc-fade-scale">
    <div ref="popWindowRef" v-show="mVisible" class="pop-window vp-window" :style="posStyle">
      <div class="pop-window-content" v-if="currentItem">
        <img v-if="previewCover" :src="previewCover" alt="cover" class="preview-cover" />
        <DomPreview
          v-else
          :id="currentItem.id"
          :css="previewCss"
          @styleCompiled="handleStyleCompiled"
        >
          <div v-html="previewHtml"></div>
        </DomPreview>
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
  z-index: 200;
  //box-sizing: border-box;
  pointer-events: none;
  //padding: 5px;
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
