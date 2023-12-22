<script lang="ts">
import {defineComponent} from 'vue'
import {WindowController} from '@/components/CommonUI/ViewPortWindow/window-controller'
import {useContextMenu} from '@/hooks/use-context-menu'
import globalEventBus, {GlobalEvents} from '@/utils/global-event-bus'
import InventoryList from '@/components/PageCraft/InventoryModal/InventoryList.vue'

export default defineComponent({
  name: 'ReferenceMap',
  components: {InventoryList},
  props: {
    imgSrc: {
      type: String,
      default: null,
    },
  },
  emits: ['close'],
  setup(props, {emit}) {
    const dWindow = ref<any>(null)
    const imgRef = ref()
    const isDragMode = ref(false)
    const zoomPercent = ref(100)

    watch(isDragMode, (val) => {
      imgRef.value.classList[val ? 'add' : 'remove']('is-drag-mode')
    })

    onMounted(() => {
      dWindow.value = new WindowController({
        dragHandleEl: imgRef.value,
        dragTargetEl: imgRef.value,
        allowOut: true,
      })
    })

    const handleImageScrollZoom = (e) => {
      const {deltaY} = e
      const percent = Math.max(10, zoomPercent.value - deltaY / 5)
      zoomPercent.value = percent
    }

    const imgRect = ref()
    const updateImgRect = (e) => {
      const el = imgRef.value
      imgRect.value = el.getBoundingClientRect()
    }

    const imgStyle = computed(() => {
      if (!imgRect.value) {
        return
      }
      const {width, height} = imgRect.value
      const rate = zoomPercent.value / 100
      return {
        width: width * rate + 'px',
        height: height * rate + 'px',
      }
    })

    const {editingNode, nodeAction, handleContextmenu, ...contextMenuEtc} = useContextMenu(() => {
      return [
        {
          label: 'Close',
          props: {
            onClick: async () => {
              emit('close')
            },
          },
        },
      ]
    })

    return {
      isDragMode,
      imgRef,
      zoomPercent,
      handleImageScrollZoom,
      updateImgRect,
      imgStyle,
      handleContextmenu,
      ...contextMenuEtc,
    }
  },
})
</script>

<template>
  <img
    v-show="imgSrc"
    class="reference-map"
    ref="imgRef"
    :src="imgSrc"
    alt="Reference map"
    draggable="false"
    @dblclick="isDragMode = !isDragMode"
    @wheel.stop="handleImageScrollZoom"
    @load="updateImgRect"
    :style="imgStyle"
    @contextmenu="handleContextmenu"
  />
  <n-dropdown
    v-if="imgSrc"
    trigger="manual"
    placement="bottom-start"
    :show="showRightMenu"
    :options="rightMenuOptions"
    :x="xRef"
    :y="yRef"
    @select="handleSelectContextmenu"
    key-field="label"
    :on-clickoutside="handleClickOutside"
  />
</template>

<style lang="scss" scoped>
.reference-map {
  position: absolute;
  top: 0;
  left: 0;
  outline: 1px dashed $primary;
  z-index: 100;
  &.is-drag-mode {
    cursor: grab;
    opacity: 0.5;
    &:active {
      cursor: grabbing;
    }
  }
}
</style>
