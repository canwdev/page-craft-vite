<script lang="ts">
import {ComputedRef, defineComponent, PropType, Ref} from 'vue'
import {QuickOptionItem} from './enum'
import {onClickOutside, useVModel} from '@vueuse/core'
import QOptionItem from './utils/QOptionItem.vue'

export default defineComponent({
  name: 'QuickOptions',
  components: {QOptionItem},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    closeOnClick: {
      type: Boolean,
      default: true,
    },
    horizontal: {
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
    autoFocus: {
      type: Boolean,
      default: true,
    },
    showIndex: {
      type: Boolean,
      default: true,
    },
    itemCls: {
      type: String,
      default: '',
    },
  },
  emits: ['onClose', 'update:visible', 'onBack', 'onEnter'],
  setup(props, {emit}) {
    const {options, horizontal, isStatic, autoFocus, closeOnClick} = toRefs(props)
    const mVisible = useVModel(props, 'visible', emit)
    const quickRootRef = ref()

    // 点击外部隐藏
    onClickOutside(quickRootRef, (event) => {
      if (!isStatic.value) {
        setTimeout(() => {
          mVisible.value = false
        })
      }
    })

    const scrollToIndex = () => {
      const el = quickRootRef.value.querySelector(`[data-index="${curIndex.value}"]`)
      nextTick(() => {
        el && el.scrollIntoView({behavior: 'instant', block: 'center'})
      })
    }

    const curIndex = ref(0)
    const getNextStep = (index) => {
      // 如果下一个选项为spilt，就跳过
      if (mOptions.value[index] && mOptions.value[index].split) {
        return 2
      }
      return 1
    }
    const selectPrev = () => {
      curIndex.value -= getNextStep(curIndex.value - 1)
      if (curIndex.value < 0) {
        curIndex.value = mOptions.value.length - 1
      }
      scrollToIndex()
    }
    const selectNext = () => {
      curIndex.value += getNextStep(curIndex.value + 1)
      if (curIndex.value > mOptions.value.length - 1) {
        curIndex.value = 0
      }
      scrollToIndex()
    }
    const focus = () => {
      setTimeout(() => {
        quickRootRef.value.focus()
      }, 10)
    }

    onMounted(() => {
      if (isStatic.value) {
        if (autoFocus.value) {
          focus()
        }
      }
    })

    watch(mVisible, (val) => {
      if (val) {
        curIndex.value = 0
        if (autoFocus.value) {
          focus()
        }
      } else {
        menuStack.value = []
        menuItemStack.value = []
      }
    })

    // 打开的菜单堆栈，支持内容为计算属性
    const menuStack = ref<QuickOptionItem[][]>([])
    // 打开的当前元素堆栈，主要用于显示标题
    const menuItemStack = ref<QuickOptionItem[]>([])
    const backTitle = computed(() => {
      if (!menuItemStack.value.length) {
        return ' '
      }
      const lastItem = menuItemStack.value[menuItemStack.value.length - 1]
      return lastItem.html || lastItem.label
    })

    const mOptions = computed((): QuickOptionItem[] => {
      if (menuStack.value.length) {
        const last: any = menuStack.value[menuStack.value.length - 1]
        // 检测列表是否为计算属性
        if (last.__v_isRef) {
          // 获取计算属性的值
          return last.value
        }
        return last
      }
      return options.value
    })

    const handleBack = () => {
      if (menuStack.value.length) {
        menuStack.value.pop()
        menuItemStack.value.pop()
        emit('onBack')
      } else {
        mVisible.value = false
        setTimeout(() => {
          emit('onClose')
        }, 100)
      }
      curIndex.value = 0
      scrollToIndex()
    }

    const handleKeyPress = (event) => {
      event.preventDefault()
      if (event.key === 'Escape' || event.key === 'q') {
        handleBack()
      } else if (event.key === 'Tab') {
        selectNext()
      } else if (event.key === 'ArrowUp') {
        if (horizontal.value) {
          handleBack()
        } else {
          selectPrev()
        }
      } else if (event.key === 'ArrowDown') {
        if (horizontal.value) {
          handleKeyEnter()
        } else {
          selectNext()
        }
      } else if (event.key === 'ArrowLeft') {
        if (horizontal.value) {
          selectPrev()
        } else {
          handleBack()
        }
      } else if (event.key === 'ArrowRight') {
        if (horizontal.value) {
          selectNext()
        } else {
          handleKeyEnter()
        }
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

        // console.log(number)
        const item = mOptions.value[number - 1]
        if (item) {
          handleOptionClick(item)
        }
      }
    }

    const handleKeyEnter = () => {
      const item = mOptions.value[curIndex.value]
      handleOptionClick(item)
    }

    const handleOptionClick = async (item: QuickOptionItem, event?, openChildrenOnly = false) => {
      if (item.disabled) {
        return
      }
      if (item?.props?.onClick && !openChildrenOnly) {
        item.props.onClick(item, event)
        if (closeOnClick.value) {
          mVisible.value = false
        }
      } else if (item.children) {
        let subList: QuickOptionItem[] | any = []
        if (typeof item.children === 'function') {
          subList = await item.children()
        } else if (item.children.length) {
          subList = item.children
        }

        menuStack.value.push(subList)
        menuItemStack.value.push(item)
        curIndex.value = 0
        emit('onEnter')
      }
      if (item?.props?.isBack) {
        if (typeof item.props.isBack === 'number') {
          for (let i = 0; i < item.props.isBack; i++) {
            handleBack()
          }
        } else {
          handleBack()
        }
      }
    }

    const handleOptionContextmenu = async (item: QuickOptionItem, event?) => {
      if (item?.props?.onContextmenu) {
        event?.preventDefault()
        item.props.onContextmenu(item, event)
      }
    }
    const isFocused = () => document.activeElement !== quickRootRef.value
    return {
      mVisible,
      quickRootRef,
      menuStack,
      curIndex,
      handleKeyPress,
      backTitle,
      handleBack,
      mOptions,
      handleOptionClick,
      handleOptionContextmenu,
      focus,
      isFocused,
    }
  },
})
</script>

<template>
  <div
    v-if="mVisible || isStatic"
    class="quick-options _scrollbar_mini"
    :class="{_absolute: !isStatic, _s: isStatic, horizontal, 'vp-panel': !horizontal && !isStatic}"
    @keydown.stop="handleKeyPress"
    tabindex="0"
    ref="quickRootRef"
  >
    <div class="option-title" v-if="title">
      {{ title }}
      <button class="btn-no-style" @click="mVisible = false">×</button>
    </div>

    <div
      v-if="menuStack.length"
      class="option-item vp-bg _back clickable"
      @click="handleBack"
      title="Back (q)"
    >
      <div class="index-wrap">
        <div style="transform: scale(0.7)">
          <div class="css-arrow left"></div>
        </div>
      </div>
      <span v-html="backTitle"></span>
    </div>

    <template v-for="(item, index) in mOptions" :key="index">
      <div v-if="item.split" class="option-split"></div>
      <n-dropdown
        v-else-if="item.dropdown"
        :options="item.dropdown"
        label-field="label"
        key-field="key"
        size="small"
      >
        <QOptionItem
          :item="item"
          :index="index"
          :cur-index="curIndex"
          :item-cls="itemCls"
          :show-index="showIndex"
          @click="handleOptionClick(item, $event)"
          @contextmenu="handleOptionContextmenu(item, $event)"
          @onArrowClick="handleOptionClick(item, $event, true)"
        />
      </n-dropdown>

      <QOptionItem
        v-else
        :item="item"
        :index="index"
        :cur-index="curIndex"
        :item-cls="itemCls"
        :show-index="showIndex"
        @click="handleOptionClick(item, $event)"
        @contextmenu="handleOptionContextmenu(item, $event)"
        @onArrowClick="handleOptionClick(item, $event, true)"
      />
    </template>
  </div>
</template>

<style lang="scss">
.quick-options {
  &:focus {
    border: 1px solid $primary;
    outline: none;
    .option-item {
      &.focus {
        outline-color: currentColor;
      }
    }
  }

  &._absolute {
    position: absolute;
    z-index: 1000;
    overflow: hidden;
  }

  &._s {
    box-shadow: none;
    border: none;
    border-radius: 0;
  }

  &.horizontal {
    display: flex;
    .option-item {
      padding: 4px 8px;
      min-width: auto;
      .index-wrap,
      .arrow-wrap {
        display: none;
      }
    }
  }

  .option-title {
    padding: 0 6px;
    font-size: 10px;
    opacity: 0.7;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .option-split {
    border-bottom: 1px solid $color_border;
    margin-top: 1px;
    margin-bottom: 1px;
  }

  .option-item {
    padding: 8px 24px;
    line-height: 1.2;
    min-width: 120px;
    position: relative;
    box-sizing: border-box;
    transition: all 0.1s;
    display: flex;
    align-items: center;
    gap: 8px;
    outline: 1px dashed transparent;
    outline-offset: -1px;

    &._back {
      padding: 2px 24px;
      font-size: 12px;
      position: sticky;
      top: 0;
      z-index: 2;
      border: none;
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

    .item-icon {
      display: inline-flex;
      width: 24px;
      height: 24px;
      img {
        width: 100%;
        height: 100%;
      }
    }

    .item-content {
      flex: 1;
      word-break: break-word;
    }

    .arrow-wrap {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      &:hover {
        color: $primary;
      }
    }

    &:focus {
      outline: none;
    }

    &:not(&._back) {
      &:hover {
        background-color: $color_hover;
        transition: all 0s;
      }
    }

    &.active {
      color: white !important;
      background-color: $primary !important;
    }

    &:not(.disabled) {
      &.clickable {
        user-select: none;
        cursor: pointer;
        &:active {
          color: white;
          background-color: $primary !important;
        }
      }
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
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
