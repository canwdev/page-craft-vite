<script lang="ts">
import {defineComponent, shallowRef} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {WindowController} from '@/utils/window-controller'
import {throttle} from 'throttle-debounce'
import {LsKeys} from '@/enum/page-craft'
import {useIsDarkMode} from '@/hooks/use-global-theme'

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
    const {isDarkMode} = useIsDarkMode()

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
      isDarkMode,
    }
  },
})
</script>

<template>
  <transition name="none">
    <div
      v-show="mVisible"
      class="page-craft-window _thin-window _rounded"
      :class="{_dark: isDarkMode}"
      ref="dialogRef"
    >
      <div class="page-craft-window-content">
        <div ref="titleBarRef" class="page-craft-title-bar">
          <div
            class="page-craft-title-bar-text font-minecraft"
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

        <div class="page-craft-window-body">
          <slot name="main"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss">
.page-craft-window {
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.27), inset 0 0 0.5px #fff;
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 0 6px 6px;
  background: rgba(255, 255, 255, 0.8);
  //backdrop-filter: blur(4px);

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
      flex: 1;

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
      cursor: pointer;

      & + button {
        border-left: 0;
      }

      &:hover {
        background: rgb(233, 233, 233);
      }

      &:active {
        background: rgba(181, 181, 181, 0.46);
      }

      &.active {
        background: rgba(255, 105, 180, 0.8) !important;
      }
    }
  }

  &._thin-window {
    padding: 0;

    .page-craft-title-bar {
      margin-left: 0;
      margin-right: 0;
      padding-right: 0;
    }

    .page-craft-window-controls {
      button {
        border: 0;
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
    background: rgba(117, 117, 117, 0.8);
    .page-craft-title-bar {
      color: white;
      text-shadow: 0 0 10px black;
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

  &._rounded {
    $radius: 5px;
    border-top-left-radius: $radius;
    border-top-right-radius: $radius;
    .page-craft-title-bar {
      overflow: hidden;
      border-top-left-radius: $radius;
      border-top-right-radius: $radius;
    }
    .page-craft-window-controls {
      padding-right: 1px;
    }
    .page-craft-window-body,
    .code-editor-placeholder {
    }
  }
}
</style>
