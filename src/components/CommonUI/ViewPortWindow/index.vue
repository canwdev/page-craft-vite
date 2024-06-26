<script lang="ts">
import {defineComponent, PropType, shallowRef} from 'vue'
import {WindowController} from './utils/window-controller'
import {
  ArrowMaximize20Regular,
  ArrowMinimize20Regular,
  Dismiss20Regular,
  Subtract20Filled,
} from '@vicons/fluent'
import LayoutHelper from './utils/LayoutHelper.vue'
import {useDynamicClassName, useMouseOver} from './utils/use-utils'
import {useThrottleFn, useVModel, watchDebounced} from '@vueuse/core'
import {checkWindowAttach, ILayout, WinOptions} from './enum'
import LayoutPreview from './utils/LayoutPreview.vue'

const LS_KEY_VP_WINDOW_OPTION = 'vp_window'

export default defineComponent({
  name: 'ViewPortWindow',
  components: {
    LayoutPreview,
    LayoutHelper,
    Subtract20Filled,
    ArrowMinimize20Regular,
    ArrowMaximize20Regular,
    Dismiss20Regular,
  },
  props: {
    // 是否显示窗口
    visible: {
      type: Boolean,
      default: true,
    },
    // 是否显示关闭按钮
    showClose: {
      type: Boolean,
      default: true,
    },
    // 是否允许最大化
    allowMaximum: {
      type: Boolean,
      default: false,
    },
    // 外部传入的是否最大化属性，支持双向绑定
    maximized: {
      type: Boolean,
      default: false,
    },
    allowMinimum: {
      type: Boolean,
      default: false,
    },
    minimized: {
      type: Boolean,
      default: false,
    },
    // 是否允许移动窗口
    allowMove: {
      type: Boolean,
      default: true,
    },
    // 传入此参数用于保存窗口大小和位置
    wid: {
      type: [String],
      default: null,
    },
    // 窗口初始化配置，可传入部分 WinOptions
    initWinOptions: {
      type: Object,
      default: null,
    },
    // 初始化使窗口在视口中间
    initCenter: {
      type: Boolean,
      default: true,
    },
    // 窗口出现/隐藏的过度动画名字
    transitionName: {
      type: String,
      default: 'fade-scale',
    },
  },
  emits: [
    'update:visible',
    'resize',
    'onActive',
    'onClose',
    'update:minimized',
    'update:maximized',
  ],
  setup(props, {emit}) {
    const {allowMaximum, allowMove} = toRefs(props)
    const storageKey = LS_KEY_VP_WINDOW_OPTION + '_' + props.wid
    const mVisible = useVModel(props, 'visible', emit)
    const rootRef = ref()
    const titleBarRef = ref()
    const titleBarButtonsRef = ref()
    const dWindow = shallowRef<any>(null)

    const isMaximized = useVModel(props, 'maximized', emit, {passive: true})
    const isMinimized = useVModel(props, 'minimized', emit, {passive: true})

    const isTransition = ref(false)
    const setIsTransition = (val: boolean) => {
      if (val) {
        isTransition.value = val
      } else {
        setTimeout(() => {
          // 等待动画播放结束
          isTransition.value = val
        }, 300)
      }
    }

    // 请勿使用vue :class="{}" 进行类的绑定，因为vue会覆盖DOM动态添加的class
    useDynamicClassName(rootRef, '_visible', mVisible)
    useDynamicClassName(rootRef, '_maximized', isMaximized)
    useDynamicClassName(rootRef, '_transition', isTransition)
    const isAllowMove = computed(() => {
      return allowMove.value && !isMaximized.value
    })
    useDynamicClassName(rootRef, '_allow_move', isAllowMove)

    let defaultWinOptions: WinOptions = {
      top: '10px',
      left: '10px',
      width: '300px',
      height: 'auto',
      maximized: false,
    }

    const winOptions = reactive<WinOptions>({...defaultWinOptions})
    watchDebounced(
      winOptions,
      () => {
        if (isMaximized.value) {
          // 最大化时只更新最大化状态
          const s = JSON.parse(localStorage.getItem(storageKey) || 'null')
          if (s) {
            localStorage.setItem(
              storageKey,
              JSON.stringify({
                ...s,
                maximized: isMaximized.value,
              })
            )
          }
          return
        }
        if (props.wid) {
          // console.log(`save ${storageKey}`, {...winOptions})
          localStorage.setItem(storageKey, JSON.stringify({...winOptions}))
        }
      },
      {deep: Boolean(props.wid), debounce: 500}
    )

    watch(allowMove, (val) => {
      dWindow.value.allowMove = val
      if (val) {
        dWindow.value.updateZIndex()
      }
    })
    watch(isMaximized, (val) => {
      dWindow.value.allowMove = !val
      dWindow.value.maximized = val

      winOptions.maximized = val
    })

    watch(mVisible, (val) => {
      if (val) {
        if (!isInit.value) {
          initWindowStyle()
        }
        dWindow.value.updateZIndex()
      }
    })

    onMounted(() => {
      dWindow.value = new WindowController({
        dragHandleEl: titleBarRef.value,
        dragTargetEl: rootRef.value,
        allowOut: true,
        // opacify: 0.8,
        preventNode: titleBarButtonsRef.value,
        onMove: handleMove,
        onActive() {
          emit('onActive')
        },
        autoPosOnResize: true,
        isDebug: false,
        resizeable: true,
        maximized: winOptions.maximized || false,
      })
      isMaximized.value = winOptions.maximized || false
      dWindow.value.allowMove = allowMove.value

      new ResizeObserver(() => {
        handleResizeDebounced()
      }).observe(rootRef.value)

      initWindowStyle()
    })

    const setPos = (dir: string, value: string) => {
      rootRef.value.style[dir] = winOptions[dir] = value
    }

    const isInit = ref(false)
    const initWindowStyle = () => {
      if (!mVisible.value) {
        // 防止初始化不可见时的位置错误
        return
      }
      let defaultOptions = {
        ...defaultWinOptions,
      }
      if (props.initWinOptions) {
        defaultOptions = {
          ...defaultOptions,
          ...props.initWinOptions,
        }
      }

      let lsState
      let lsVal
      if (!props.wid) {
        lsState = defaultOptions
      } else {
        lsVal = JSON.parse(localStorage.getItem(storageKey) || 'null')
        // console.log(`load ${storageKey}`, lsVal)
        lsState = lsVal || defaultOptions
      }
      setPos('left', lsState.left)
      setPos('top', lsState.top)
      setPos('width', lsState.width)
      setPos('height', lsState.height)
      isInit.value = true

      setTimeout(() => {
        if (props.initCenter && !lsVal) {
          const rect = rootRef.value.getBoundingClientRect()
          // console.log(rect)
          const cx = Math.round(window.innerWidth / 2 - rect.width / 2)
          const cy = Math.round(window.innerHeight / 2 - rect.height / 2)

          winOptions.left = rootRef.value.style.left = cx + 'px'
          winOptions.top = rootRef.value.style.top = cy + 'px'
        } else {
          // 初始化后检查窗口是否在视口外，如果在则修复
          dWindow.value.handleResizeDebounced()
        }
      })
    }

    const fixWindowInScreen = (delayMs = 400): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const rect = rootRef.value.getBoundingClientRect()
          // console.log(rect)
          let flagFixed = false
          if (rect.y < 0) {
            setPos('top', 0 + 'px')
            flagFixed = true
          }
          if (rect.x <= -rect.width) {
            setPos('left', 0 + 'px')
            flagFixed = true
          }
          if (!flagFixed) {
            if (rect.y > window.innerHeight) {
              setPos('top', window.innerHeight - rect.height + 'px')
            }
            if (rect.x > window.innerWidth) {
              setPos('left', window.innerWidth - rect.width + 'px')
            }
          }

          resolve()
        }, delayMs)
      })
    }

    const checkAttach = useThrottleFn(
      (params) => {
        layoutPreviewData.value = checkWindowAttach(params)
      },
      150,
      true
    )

    const handleMove = async (data) => {
      // console.log('[onMove]', data)
      if (data.moveStop) {
        setTimeout(() => {
          layoutPreviewData.value = undefined
        }, 151)
        await fixWindowInScreen(0)
        if (data.attachLayout) {
          setWindowLayout(data.attachLayout)
        }
        return
      }
      const {top, left, pointerX, pointerY} = data

      checkAttach({x: pointerX, y: pointerY})

      winOptions.top = top
      winOptions.left = left
    }

    const handleResizeDebounced = useThrottleFn(
      () => {
        if (!mVisible.value || !rootRef.value) {
          return
        }

        const size = getComputedStyle(rootRef.value)

        winOptions.width = size.width
        winOptions.height = size.height
        emit('resize', winOptions)
      },
      50,
      true
    )

    onBeforeUnmount(() => {
      if (dWindow.value) {
        dWindow.value.destroy()
      }
    })

    const setActive = () => {
      dWindow.value.updateZIndex({preventOnActive: true})
    }

    const toggleMaximized = () => {
      if (allowMaximum.value) {
        setIsTransition(true)
        isMaximized.value = !isMaximized.value
        setIsTransition(false)
      }
    }

    const handleClose = () => {
      mVisible.value = false
      emit('onClose')
    }

    const isShowLayoutHelper = ref(false)

    const setWindowLayout = (layout: ILayout) => {
      const {xRatio, yRatio, widthRatio, heightRatio, maximize} = layout
      if (maximize) {
        toggleMaximized()
        return
      }

      const {innerWidth: maxWidth, innerHeight: maxHeight} = window
      const left = Math.ceil(maxWidth * xRatio)
      const top = Math.ceil(maxHeight * yRatio)
      const width = Math.ceil(maxWidth * widthRatio)
      const height = Math.ceil(maxHeight * heightRatio)

      if (isMaximized.value) {
        isMaximized.value = false
      }
      setIsTransition(true)

      setTimeout(() => {
        setPos('left', left + 'px')
        setPos('top', top + 'px')
        setPos('width', width + 'px')
        setPos('height', height + 'px')
        setIsTransition(false)
      })
    }

    // 鼠标悬浮一定时间后，显示
    const mButtonRef = ref()
    useMouseOver(mButtonRef, {
      timeout: 800,
      onEnter: () => {
        isShowLayoutHelper.value = true
      },
    })

    const layoutPreviewData = ref<ILayout | undefined>(undefined)

    return {
      isInit,
      mVisible,
      rootRef,
      titleBarRef,
      titleBarButtonsRef,
      handleClose,
      setActive,
      isMaximized,
      isMinimized,
      toggleMaximized,
      isTransition,
      isShowLayoutHelper,
      setWindowLayout,
      setPos,
      mButtonRef,
      layoutPreviewData,
    }
  },
})
</script>

<template>
  <transition :name="transitionName">
    <div v-show="isInit && mVisible" class="vp-window" ref="rootRef">
      <LayoutPreview :preview-data="layoutPreviewData" />
      <LayoutHelper v-model:visible="isShowLayoutHelper" @setWindowLayout="setWindowLayout" />
      <div class="vp-window-content">
        <div ref="titleBarRef" class="vp-window-title-bar" @dblclick="toggleMaximized">
          <div class="vp-window-title-bar-text text-overflow">
            <slot name="titleBarLeft"></slot>
          </div>
          <div @dblclick.stop ref="titleBarButtonsRef" class="vp-window-controls">
            <slot name="titleBarRightControls"> </slot>
            <slot name="titleBarRight">
              <button v-if="allowMinimum" @click="isMinimized = true" class="is-minimize">
                <n-icon size="20">
                  <Subtract20Filled />
                </n-icon>
              </button>

              <button
                v-if="allowMaximum"
                ref="mButtonRef"
                @click="toggleMaximized"
                :class="[isMaximized ? 'is-restore' : 'is-maximize']"
              >
                <n-icon size="20">
                  <ArrowMinimize20Regular v-if="isMaximized" />
                  <ArrowMaximize20Regular v-else />
                </n-icon>
              </button>

              <button v-if="showClose" :title="`Close`" @click="handleClose" class="is-close">
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
  z-index: 100;
  min-height: 50px;
  min-width: 50px;
  box-sizing: border-box;
  &._allow_move {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
  }

  &._maximized {
    position: fixed;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    height: 100% !important;
    padding: 0;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    .vp-window-content {
      .vp-window-title-bar {
        margin-left: unset;
        margin-right: unset;
      }
      .vp-window-body {
        border-left: 0;
        border-right: 0;
      }
    }
    .draggable-window-resize {
      pointer-events: none;
    }
  }

  &._transition {
    transition: all 0.2s !important;
  }

  &._dragging {
    .vp-window-body {
      // 拖拽时禁用内部鼠标事件，防止鼠标陷入
      pointer-events: none;
    }
  }

  .vp-window-content {
    height: 100%;
    display: flex;
    flex-direction: column;

    .vp-window-title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;

      .window-icon {
        width: 16px;
        height: 16px;
        pointer-events: none;
      }

      .vp-window-title-bar-text {
        display: flex;
        align-items: center;
        gap: 4px;
        line-height: 1.4;
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
        background-color: $primary !important;
      }
    }
  }
}
</style>
