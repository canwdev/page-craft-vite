<script lang="ts">
import {defineComponent, shallowRef} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {WindowController} from '@/utils/window-controller'
import {throttle} from 'throttle-debounce'
import {LsKeys} from '@/enum/page-craft'
import {useCraftStore} from '@/store/craft'
import {useSettingsStore} from '@/store/settings'

type StyleEditorOptions = {
  wTop: string
  wLeft: string
  wWidth: string
  wHeight: string
}

export default defineComponent({
  name: 'ViewportWindow',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:visible', 'resize'],
  setup(props, {emit}) {
    const mVisible = useModelWrapper(props, emit, 'visible')
    const dialogRef = ref()
    const titleBarRef = ref()
    const titleBarButtonsRef = ref()
    const dWindow = shallowRef<any>(null)
    const craftStore = useCraftStore()
    const settingsStore = useSettingsStore()

    const styleEditorOptions = reactive<StyleEditorOptions>(
      JSON.parse(localStorage.getItem(LsKeys.STYLE_EDITOR_OPTIONS) || 'null') || {
        wTop: '100px',
        wLeft: '100px',
        wWidth: '300px',
        wHeight: '300px',
      }
    )
    watch(
      styleEditorOptions,
      () => {
        localStorage.setItem(LsKeys.STYLE_EDITOR_OPTIONS, JSON.stringify({...styleEditorOptions}))
      },
      {deep: true}
    )

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

      new ResizeObserver(() => {
        handleResizeDebounced()
      }).observe(dialogRef.value)

      initDialogStyle()
    })

    const initDialogStyle = () => {
      dialogRef.value.style.top = styleEditorOptions.wTop
      dialogRef.value.style.left = styleEditorOptions.wLeft

      dialogRef.value.style.width = styleEditorOptions.wWidth
      dialogRef.value.style.height = styleEditorOptions.wHeight
    }

    const handleMoveDebounced = throttle(500, false, ({top, left}) => {
      styleEditorOptions.wTop = top
      styleEditorOptions.wLeft = left
    })

    const handleResizeDebounced = throttle(50, false, () => {
      if (!mVisible.value || !dialogRef.value) {
        return
      }
      const width = dialogRef.value.offsetWidth
      const height = dialogRef.value.offsetHeight

      emit('resize')

      styleEditorOptions.wWidth = width + 'px'
      styleEditorOptions.wHeight = height + 'px'
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
  <transition name="none">
    <div
      v-show="mVisible"
      class="page-craft-window"
      :class="{
        _dark: craftStore.isAppDarkMode,
        _blur: settingsStore.enableAeroTheme,
        _rounded: settingsStore.enableRoundedTheme,
        _thin: !settingsStore.enableRoundedTheme,
      }"
      ref="dialogRef"
    >
      <div class="page-craft-window-content">
        <div ref="titleBarRef" class="page-craft-title-bar">
          <div
            class="page-craft-title-bar-text"
            style="display: flex; align-items: center; height: 14px"
          >
            <slot name="titleBarLeft"></slot>
          </div>
          <div ref="titleBarButtonsRef" class="page-craft-window-controls">
            <slot name="titleBarRight">
              <button title="Close" @click="mVisible = false">
                <img src="~@/assets/textures/barrier.png" alt="close" />
              </button>
            </slot>
          </div>
        </div>

        <div class="page-craft-window-body _bg">
          <slot name="main"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
.page-craft-window {
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.27), inset 0 0 1px 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 0 6px 5px;
  background: rgba(255, 255, 255, 0.8);

  .page-craft-window-content {
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
    .page-craft-window-body {
      //flex: 1;
      height: calc(100% - 30px);

      border: 1px solid rgba(0, 0, 0, 0.6);
      &._bg {
        background-color: rgba(255, 255, 255, 1);
      }
    }
  }

  .page-craft-window-controls {
    border-radius: 0;
    display: flex;
    align-items: flex-start;

    button {
      margin-top: -1px;
      height: 24px;
      min-width: 30px;
      border: 1px solid rgba(0, 0, 0, 0.5);
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      color: inherit;

      & + button {
        border-left: 0 !important;
      }

      &:hover {
        background: rgb(233, 233, 233);
        transition: all 0.1s;
        &._danger {
          background: #ffa5aa !important;
        }
      }

      &:active {
        background: rgba(181, 181, 181, 0.46);
        &._danger {
          background: #ff6a72 !important;
        }
      }

      &.active {
        background: rgba(255, 105, 180, 0.8) !important;
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

    .page-craft-window-controls {
      button {
        border: 0 !important;
        background: none;
        margin-top: 0;
        min-width: 40px;
        height: 30px;
        margin-bottom: -4px;

        &:hover {
          background: rgba(222, 222, 222, 1);
        }

        &:active {
          background: rgba(116, 116, 116, 0.46);
        }
      }
    }

    .page-craft-window-body {
      border: 0;
      height: calc(100% - 30px);
    }
  }

  &._dark {
    background: rgba(0, 0, 0, 0.6);

    .page-craft-window-content {
      .page-craft-title-bar {
        color: white;
        text-shadow: 0 0 10px black;
      }
      .page-craft-window-controls {
        button {
          border: 1px solid rgba(255, 255, 255, 0.2);

          &:hover {
            background: rgba(255, 255, 255, 0.2);
            &._danger {
              background: rgba(232, 17, 35, 0.7) !important;
            }
          }
          &:active {
            background: rgba(255, 255, 255, 0.1);
            &._danger {
              background: rgba(151, 23, 34, 0.7) !important;
            }
          }
        }
      }
    }
    .page-craft-window-body {
      &._bg {
        background-color: rgba(30, 30, 30, 1);
      }
    }

    .page-craft-window-controls {
      border-radius: 0;
      display: flex;
      align-items: flex-start;

      button {
        background: transparent;
        img {
          filter: drop-shadow(0 0 2px #fff);
        }

        &:hover {
          background: rgba(227, 227, 227, 1);
        }

        &:active {
          background: rgba(109, 109, 109, 1);
        }
      }
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
    .page-craft-window-controls {
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
    .page-craft-window-body,
    .code-editor-placeholder {
    }
  }

  &._blur {
    backdrop-filter: blur(4px);
    box-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.115), 0px 68px 80px rgba(0, 0, 0, 0.23),
      inset 0 0 1px 1px rgba(255, 255, 255, 0.2);
    .page-craft-window-body {
      &._bg {
        background-color: rgba(255, 255, 255, 0.5);
      }
    }
    &._dark {
      .page-craft-window-body {
        &._bg {
          background-color: rgba(30, 30, 30, 0.7);
        }
      }
    }
    &._rounded {
      .page-craft-window-body {
        border-bottom-left-radius: $radius;
        border-bottom-right-radius: $radius;
      }
    }
  }
}
</style>
