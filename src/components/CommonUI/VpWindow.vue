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
    const {allowMove} = toRefs(props)
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
        opacify: 0.8,
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
      const width = dialogRef.value.offsetWidth
      const height = dialogRef.value.offsetHeight

      emit('resize')

      winOptions.wWidth = width + 'px'
      winOptions.wHeight = height + 'px'
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
        _dark: craftStore.isAppDarkMode,
        _blur: settingsStore.enableAeroTheme,
        _rounded: settingsStore.enableRoundedTheme,
        _thin: !settingsStore.enableRoundedTheme,
        _aero: settingsStore.enableAeroTheme,
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
              <button title="Close" @click="mVisible = false" class="_danger">
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
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.27), inset 0 0 1px 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 0 6px 5px;
  background-color: rgba(229, 229, 229, 0.8);
  &._allowMove {
    position: fixed;
    z-index: 100;
    top: 100px;
    left: 100px;
  }

  .vp-window-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .page-craft-title-bar {
      margin-left: -6px;
      margin-right: -6px;
      padding: 0 6px 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      text-shadow: 0 0 10px white;
      user-select: none;

      img {
        pointer-events: none;
      }

      .page-craft-title-bar-text {
        margin-top: 4px;
        img {
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
      margin-top: -1px;
      height: 24px;
      min-width: 30px;
      border: 1px solid rgba(0, 0, 0, 0.5);
      background-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      color: inherit;

      & + button {
        border-left: 0 !important;
      }

      &:hover {
        background-color: rgb(233, 233, 233);
        transition: all 0.1s;
        &._danger {
          background-color: #ffa5aa !important;
        }
      }

      &:active {
        background-color: rgba(181, 181, 181, 0.46);
        &._danger {
          background-color: #ff6a72 !important;
        }
      }

      &.active {
        background-color: rgba(255, 105, 180, 0.8) !important;
      }
    }
  }

  &._thin {
    padding: 0;

    .page-craft-title-bar {
      margin-left: 0;
      margin-right: 0;
      padding-right: 0;
    }

    .vp-window-controls {
      button {
        border: 0 !important;
        background-color: none;
        margin-top: 0;
        min-width: 40px;
        height: 30px;
        margin-bottom: -4px;

        &:hover {
          background-color: rgba(222, 222, 222, 1);
        }

        &:active {
          background-color: rgba(116, 116, 116, 0.46);
        }
      }
    }

    .vp-window-body {
      border: 0;
      height: calc(100% - 30px);
    }
  }

  &._dark {
    background-color: rgba(56, 56, 56, 0.6);

    .vp-window-content {
      .page-craft-title-bar {
        color: white;
        text-shadow: 0 0 10px black;
      }
      .vp-window-controls {
        button {
          border: 1px solid rgba(255, 255, 255, 0.2);

          &:hover {
            background-color: rgba(255, 255, 255, 0.2);
            &._danger {
              background-color: rgba(232, 17, 35, 0.7) !important;
            }
          }
          &:active {
            background-color: rgba(255, 255, 255, 0.1);
            &._danger {
              background-color: rgba(151, 23, 34, 0.7) !important;
            }
          }
        }
      }
    }

    .vp-window-body {
      &._bg {
        background-color: rgba(30, 30, 30, 1);
      }
    }

    .vp-window-controls {
      border-radius: 0;
      display: flex;
      align-items: flex-start;

      button {
        background-color: transparent;
        img {
          filter: drop-shadow(0 0 2px #fff);
        }

        &:hover {
          background-color: rgba(227, 227, 227, 1);
        }

        &:active {
          background-color: rgba(109, 109, 109, 1);
        }
      }
    }
  }

  &._active {
    background-color: rgba(255, 255, 255, 0.8);
    &._dark {
      background-color: rgba(0, 0, 0, 0.6);
    }
  }

  $radius: 8px;

  &._rounded {
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.27), inset 0 0 1px 1px rgba(255, 255, 255, 0.2);
    border-radius: $radius;

    .page-craft-title-bar {
      overflow: hidden;
      border-radius: $radius;
    }
    .vp-window-controls {
      padding-right: 1px;
      button {
        &:first-child {
          border-bottom-left-radius: 5px;
        }
        &:last-child {
          border-bottom-right-radius: 5px;
        }
      }
    }
    .vp-window-body,
    .code-editor-placeholder {
    }
  }

  &._blur {
    backdrop-filter: blur(4px);
    box-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.115), 0px 68px 80px rgba(0, 0, 0, 0.23),
      inset 0 0 1px 1px rgba(255, 255, 255, 0.2);
    .vp-window-body {
      &._bg {
        background-color: rgba(255, 255, 255, 0.5);
      }
    }
    &._dark {
      .vp-window-body {
        &._bg {
          background-color: rgba(30, 30, 30, 0.7);
        }
      }
    }
    &._rounded {
      .vp-window-body {
        border-bottom-left-radius: $radius;
        border-bottom-right-radius: $radius;
      }
    }
  }
}
</style>
