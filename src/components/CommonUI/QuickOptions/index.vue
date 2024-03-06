<script lang="ts">
import {defineComponent} from 'vue'
import {useModelWrapper} from '@/hooks/use-model-wrapper'
import {QuickOptionItem} from './enum'

export default defineComponent({
  name: 'QuickOptions',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    options: {
      type: Array as PropType<QuickOptionItem[]>,
      default() {
        return []
      },
    },
    isStatic: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, {emit}) {
    const {options, isStatic} = toRefs(props)
    const mVisible = useModelWrapper(props, emit, 'visible')
    const quickRootRef = ref()

    const curIndex = ref(0)
    const selectPrev = () => {
      curIndex.value--
      if (curIndex.value < 0) {
        curIndex.value = mOptions.value.length
      }
    }
    const selectNext = () => {
      curIndex.value++
      if (curIndex.value > mOptions.value.length) {
        curIndex.value = 0
      }
    }
    const focus = () => {
      setTimeout(() => {
        quickRootRef.value.focus()
      }, 100)
    }

    onMounted(() => {
      if (isStatic.value) {
        focus()
      }
    })

    watch(mVisible, (val) => {
      if (val) {
        curIndex.value = 0
        focus()
      } else {
        menuStack.value = []
      }
    })

    const menuStack = ref<QuickOptionItem[][]>([])
    const mOptions = computed((): QuickOptionItem[] => {
      if (menuStack.value.length) {
        return menuStack.value[menuStack.value.length - 1]
      }
      return options.value
    })

    const handleBack = () => {
      if (menuStack.value.length) {
        menuStack.value.pop()
      } else {
        mVisible.value = false
      }
      curIndex.value = 0
    }

    const handleKeyUp = (event) => {
      // console.log('[handleKeyUp]', event)
      if (event.key === 'Escape') {
        handleBack()
      } else if (event.key === 'ArrowUp') {
        selectPrev()
      } else if (event.key === 'ArrowDown') {
        selectNext()
      } else if (event.key === 'ArrowLeft') {
        handleBack()
      } else if (event.key === 'ArrowRight') {
        handleKeyEnter()
      } else if (event.key === 'Enter') {
        // Enter key is pressed
        handleKeyEnter()
      } else if (event.key === ' ') {
        // Space key is pressed
        handleKeyEnter()
      } else if (event.keyCode >= 49 && event.keyCode <= 57) {
        // 检测按键 1~9
        const number = Number(String.fromCharCode(event.keyCode))
        if (Number.isNaN(number)) {
          return
        }

        console.log(number)
        const item = mOptions.value[number - 1]
        if (item) {
          handleOptionClick(item)
        }
      }
    }

    const handleKeyEnter = () => {
      if (curIndex.value === 0) {
        handleBack()
        return
      }
      const item = mOptions.value[curIndex.value - 1]
      handleOptionClick(item)
    }

    const handleOptionClick = (item: QuickOptionItem) => {
      if (item.children && item.children.length) {
        menuStack.value.push(item.children)
        curIndex.value = 0
      } else if (item?.props?.onClick) {
        item.props.onClick(item)
        mVisible.value = false
      }
    }

    return {
      mVisible,
      quickRootRef,
      curIndex,
      handleKeyUp,
      handleBack,
      mOptions,
      handleOptionClick,
    }
  },
})
</script>

<template>
  <div
    v-if="mVisible || isStatic"
    class="quick-options vp-panel"
    :class="{_absolute: !isStatic, _s: isStatic}"
    @keyup.stop="handleKeyUp"
    tabindex="0"
    ref="quickRootRef"
  >
    <div class="option-title" v-if="title">
      {{ title }}
      <button class="btn-no-style" @click="mVisible = false">×</button>
    </div>
    <div class="option-item _back" @click="handleBack" :class="{focus: curIndex === 0}">
      <div class="index-wrap">
        <div style="transform: scale(0.7)">
          <div class="css-arrow left"></div>
        </div>
      </div>
      Back
    </div>
    <div
      class="option-item"
      v-for="(item, index) in mOptions"
      :key="index"
      @click="handleOptionClick(item)"
      :class="{focus: curIndex === index + 1}"
    >
      <div class="index-wrap" v-if="index < 9">
        <span>{{ index + 1 }}</span>
      </div>

      {{ item.label }}
      <div v-if="item.children && item.children.length" class="arrow-wrap">
        <div class="css-arrow right"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.quick-options {
  &:focus {
    border: 1px solid $primary;
    outline: none;
  }

  &._absolute {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    overflow: hidden;
  }

  &._s {
    box-shadow: none;
    border: none;
  }

  .option-title {
    padding: 0 6px;
    font-size: 10px;
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .option-item {
    padding: 8px 24px;
    line-height: 1.2;
    min-width: 120px;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    border-bottom: 1px solid $color_border;
    transition: all 0.2s;

    &._back {
      padding: 2px 24px;
      font-size: 12px;
    }

    .index-wrap {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      span {
        opacity: 0.7;
      }
    }

    .arrow-wrap {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
    }

    &.focus {
      background-color: $primary_opacity !important;
    }

    &:focus {
      outline: none;
    }

    &:hover {
      background-color: $color_border;
      transition: all 0s;
    }

    &.active,
    &:active {
      color: white;
      background-color: $primary !important;
    }
  }
}

.css-arrow {
  border: solid currentColor;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;

  &.right {
    transform: rotate(-45deg);
  }

  &.left {
    transform: rotate(135deg);
  }

  &.up {
    transform: rotate(-135deg);
  }

  &.down {
    transform: rotate(45deg);
  }
}
</style>