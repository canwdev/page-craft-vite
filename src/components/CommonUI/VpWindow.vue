<script lang="ts">
import {defineComponent, shallowRef} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {WindowController} from '@/utils/window-controller'
import {throttle} from 'throttle-debounce'
import {useCraftStore} from '@/store/craft'
import {useSettingsStore} from '@/store/settings'
import {Dismiss20Regular} from '@vicons/fluent'

type StyleEditorOptions = {
  wTop: string
  wLeft: string
  wWidth: string
  wHeight: string
}
const LS_KEY_VP_WINDOW_OPTION = 'page_craft_vp_window'

export default defineComponent({
  name: 'ViewportWindow',
  components: {Dismiss20Regular},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    maximum: {
      type: Boolean,
      default: false,
    },
    allowMove: {
      type: Boolean,
      default: true,
    },
    wid: {
      type: [Number, String],
      default: 0,
    },
    transitionName: {
      type: String,
      default: 'mc-fade-scale',
    },
  },
  emits: ['update:visible', 'resize'],
  setup(props, {emit}) {
    const {allowMove, maximum} = toRefs(props)
    const storageKey = LS_KEY_VP_WINDOW_OPTION + '_' + props.wid
    const mVisible = useModelWrapper(props, emit, 'visible')
    const dialogRef = ref()
    const titleBarRef = ref()
    const titleBarButtonsRef = ref()
    const dWindow = shallowRef<any>(null)
    const craftStore = useCraftStore()
    const settingsStore = useSettingsStore()

    const winOptions = reactive<StyleEditorOptions>(
      JSON.parse(localStorage.getItem(storageKey) || 'null') || {
        wTop: '100px',
        wLeft: '100px',
        wWidth: '300px',
        wHeight: '300px',
      }
    )
    watch(
      winOptions,
      () => {
        localStorage.setItem(storageKey, JSON.stringify({...winOptions}))
      },
      {deep: true}
    )

    watch(allowMove, (val) => {
      dWindow.value.allowMove = val
      if (val) {
        dWindow.value.updateZIndex()
      }
    })
    watch(maximum, (val) => {
      dWindow.value.allowMove = !val
      setTimeout(() => {
        dWindow.value.updateZIndex()
      }, 100)
    })

    watch(mVisible, (val) => {
      if (val) {
        dWindow.value.updateZIndex()
      }
    })

    onMounted(() => {
      dWindow.value = new WindowController({
        dragHandleEl: titleBarRef.value,
        dragTargetEl: dialogRef.value,
        allowOut: true,
        // opacify: 0.8,
        preventNode: titleBarButtonsRef.value,
        onMove(data) {
          handleMoveDebounced(data)
        },
        autoPosOnResize: true,
        isDebug: true,
        resizeable: true,
      })
      dWindow.value.allowMove = allowMove.value

      new ResizeObserver(() => {
        handleResizeDebounced()
      }).observe(dialogRef.value)

      initDialogStyle()
    })

    const initDialogStyle = () => {
      const lsState = JSON.parse(localStorage.getItem(storageKey) || 'null')
      if (lsState) {
        winOptions.wTop = lsState.wTop
        winOptions.wLeft = lsState.wLeft
        winOptions.wWidth = lsState.wWidth
        winOptions.wHeight = lsState.wHeight
      }

      dialogRef.value.style.top = winOptions.wTop
      dialogRef.value.style.left = winOptions.wLeft
      dialogRef.value.style.width = winOptions.wWidth
      dialogRef.value.style.height = winOptions.wHeight
    }

    const handleMoveDebounced = throttle(500, false, ({top, left}) => {
      winOptions.wTop = top
      winOptions.wLeft = left
    })

    const handleResizeDebounced = throttle(50, false, () => {
      if (!mVisible.value || !dialogRef.value) {
        return
      }
      emit('resize')

      winOptions.wWidth = getComputedStyle(dialogRef.value).width
      winOptions.wHeight = getComputedStyle(dialogRef.value).height
    })

    onBeforeUnmount(() => {
      if (dWindow.value) {
        dWindow.value.destroy()
      }
    })

    return {
      mVisible,
      dialogRef,
      titleBarRef,
      titleBarButtonsRef,
      craftStore,
      settingsStore,
    }
  },
})
</script>

<template>
  <transition :name="transitionName">
    <div
      v-show="mVisible"
      class="vp-window"
      :class="{
        _allowMove: allowMove,
        _full: maximum,
      }"
      ref="dialogRef"
    >
      <div class="vp-window-content">
        <div ref="titleBarRef" class="page-craft-title-bar">
          <div
            class="page-craft-title-bar-text"
            style="display: flex; align-items: center; height: 14px"
          >
            <slot name="titleBarLeft"></slot>
          </div>
          <div ref="titleBarButtonsRef" class="vp-window-controls">
            <slot name="titleBarRightControls"> </slot>
            <slot name="titleBarRight">
              <button :title="$t('actions.close')" @click="mVisible = false" class="_danger">
                <n-icon size="20"><Dismiss20Regular /></n-icon>
              </button>
            </slot>
          </div>
        </div>

        <div class="vp-window-body _bg _scrollbar_mini">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
.vp-window {
  &._allowMove {
    position: fixed;
    z-index: 100;
    top: 100px;
    left: 100px;
  }

  &._full {
    position: fixed;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    height: 100% !important;
    padding: 0;
    border: none;
    box-shadow: none;
    border-radius: 0;
    .vp-window-content {
      .page-craft-title-bar {
        margin-left: unset;
        margin-right: unset;
      }
    }
  }

  .vp-window-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .page-craft-title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;

      .window-icon {
        pointer-events: none;
      }

      .page-craft-title-bar-text {
        .window-icon {
          margin-right: 5px;
        }
      }
    }
    .vp-window-body {
      //flex: 1;
      height: calc(100% - 30px);

      border: 1px solid rgba(0, 0, 0, 0.6);
      &._bg {
        background-color: rgba(255, 255, 255, 1);
      }
    }
  }

  .vp-window-controls {
    border-radius: 0;
    display: flex;
    align-items: flex-start;

    button {
      height: 24px;
      background-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      color: inherit;

      &.active {
        background-color: rgba(255, 105, 180, 0.8) !important;
      }
    }
  }
}
</style>
