<script setup lang="ts">
import {useDebounceFn, useStorage, useThrottleFn, useVModel, watchDebounced} from '@vueuse/core'
import QuickOptions from '@/components/CommonUI/QuickOptions/index.vue'
import {QuickOptionItem} from '@/components/CommonUI/QuickOptions/enum'
import {useContextMenu} from '@/components/CommonUI/QuickOptions/utils/use-context-menu'

interface Props {
  modelValue: any
  hid: string
}

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue', 'onSelectTip'])

interface IHistoryItem {
  label: string
  count: number
}

const mValue = useVModel(props, 'modelValue', emit)
const historyItems = useStorage<IHistoryItem[]>(`mc_input_history_${props.hid}`, [])
const historyItemsSet = computed(() => {
  const set = new Set()
  historyItems.value.forEach((i) => {
    set.add(i.label)
  })
  return set
})
const recordHistory = () => {
  const val = mValue.value
  if (historyItemsSet.value.has(val)) {
    return
  }
  historyItems.value.push({
    label: val,
    count: 0,
  })
}

const tipOptions = ref<QuickOptionItem[]>([])
const refreshOptions = () => {
  // 最多显示9条，并过滤
  let items = historyItems.value

  const val = mValue.value
  if (val) {
    items = items
      .filter((item) => {
        return item.label.toLowerCase().includes(val)
      })
      // 排序
      .sort((a, b) => {
        return b.count - a.count
      })
  }
  const options = items.slice(0, 9).map((item) => {
    return {
      label: `${item.label} (${item.count})`,
      props: {
        onClick: () => {
          mValue.value = item.label
          item.count++
          emit('onSelectTip', item.label)
          focusBackInput()
        },
        onContextmenu: () => {
          if (confirm('Delete history item?')) {
            const idx = historyItems.value.findIndex((i) => i.label === item.label)
            if (idx !== -1) {
              historyItems.value.splice(idx, 1)
              refreshOptions()
            }
          }
        },
      },
    }
  })

  _updateCardSize()
  if (options.length) {
    tipOptions.value = [
      ...options,
      {
        label: 'Clear All',
        props: {
          onClick: () => {
            if (confirm('Confirm clear all?')) {
              historyItems.value = []
            }
            focusBackInput()
          },
        },
      },
    ]
    return
  }
  tipOptions.value = []
}

watchDebounced(
  mValue,
  () => {
    refreshOptions()
  },
  {debounce: 300, immediate: true}
)

const {menuRef, ctxMenuStyle, showMenuByPoint, isShow, updateCardSize} = useContextMenu({
  getExtraSize() {
    const {height} = inputRef.value.getBoundingClientRect()
    return {height, width: 0}
  },
})
const _updateCardSize = useThrottleFn(
  () => {
    updateCardSize()
  },
  300,
  true
)

const inputRef = ref()
const rootRef = ref()

const showMenu = () => {
  if (isShow.value) {
    return
  }
  const rect = rootRef.value.getBoundingClientRect()
  // console.log(rect)
  showMenuByPoint(rect.x, rect.y + rect.height)
}
const showAndFocus = () => {
  showMenu()
  setTimeout(() => {
    menuRef.value?.focus()
  })
}
const hideMenu = () => {
  setTimeout(() => {
    if (menuRef.value?.isFocused()) {
      isShow.value = false
    }
  }, 100)
}

const focusBackInput = () => {
  setTimeout(() => {
    inputRef.value.focus()
    hideMenu()
  }, 100)
}
</script>

<template>
  <div ref="rootRef" class="mc-input-auto-tips">
    <Teleport to=".page-craft-root">
      <transition name="mc-fade-scale">
        <QuickOptions
          ref="menuRef"
          :style="{...ctxMenuStyle, transition: 'all .2s'}"
          class="auto-tips-wrap"
          :options="tipOptions"
          v-model:visible="isShow"
          :auto-focus="false"
          :close-on-click="false"
          @onClose="focusBackInput"
        />
      </transition>
    </Teleport>
    <input
      ref="inputRef"
      v-model="mValue"
      type="text"
      placeholder="CSS class"
      class="vp-input sl-css-class-input"
      v-bind="$attrs"
      @focus="showMenu"
      @click="showMenu"
      @blur="hideMenu"
      @keyup.esc="mValue = ''"
      @keyup.enter="recordHistory"
      @keyup.up.prevent="showAndFocus"
      @keyup.down.prevent="showAndFocus"
      @input="showMenu"
    />
  </div>
</template>

<style lang="scss" scoped>
.mc-input-auto-tips {
  position: relative;
}
</style>
