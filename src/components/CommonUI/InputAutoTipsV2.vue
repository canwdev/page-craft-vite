<script lang="ts" setup="">
import {useStorage, useVModel} from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue: string
    storageKey: string
  }>(),
  {},
)
const emit = defineEmits(['update:modelValue', 'onSelectTip', 'historyChanged'])
const mValue = useVModel(props, 'modelValue', emit)

interface IHistoryItem {
  label: string
  count: number
}
const historyItems = useStorage<IHistoryItem[]>(props.storageKey || `mc_input_history`, [])
const historyItemsSet = computed(() => {
  const set = new Set()
  historyItems.value.forEach((i) => {
    set.add(i.label)
  })
  return set
})
watch(
  historyItems,
  (val) => {
    emit('historyChanged', val)
  },
  {immediate: true},
)
const recordHistory = () => {
  const val = mValue.value
  if (!val || historyItemsSet.value.has(val)) {
    return
  }
  historyItems.value.push({
    label: val,
    count: 0,
  })
}

const querySearch = (queryString: string, cb: any) => {
  console.log('querySearch', queryString)
  let items = historyItems.value
  if (queryString) {
    items = items
      .filter((item) => {
        return item.label.toLowerCase().includes(queryString)
      })
      // 排序
      .sort((a, b) => {
        return b.count - a.count
      })
  } else {
    items = items.sort((a, b) => {
      return b.count - a.count
    })
  }
  const results = [
    ...items.slice(0, 20).map((item) => {
      return {
        label: `${item.label} (${item.count})`,
        value: item.label,
        onClick: () => {
          item.count++
        },
      }
    }),
    // {
    //   label: '🧹 Clear History',
    //   isClear: true,
    //   onClick: () => {
    //     window.$dialog
    //       .confirm('Confirm clear history?', '', {
    //         type: 'warning',
    //       })
    //       .then(() => {
    //         historyItems.value = []
    //       })
    //       .catch()
    //   },
    // },
  ]
  cb(results)
}
const handleSelect = (item) => {
  console.log('handleSelect', item)
  item.onClick()
  if (item.isClear) {
    mValue.value = ''
    return
  }
  mValue.value = item.value
  emit('onSelectTip', item)
}

const handleBlur = () => {
  recordHistory()
}
const autocompleteRef = ref()
const removeItem = (item) => {
  const idx = historyItems.value.findIndex((i) => i.label === item.value)
  if (idx !== -1) {
    historyItems.value.splice(idx, 1)
  }
  autocompleteRef.value.getData()
}
</script>

<template>
  <div class="input-auto-tips-wrapper">
    <el-autocomplete
      ref="autocompleteRef"
      v-model="mValue"
      :fetch-suggestions="querySearch"
      class="input-auto-tips sl-css-class-input font-code"
      placeholder="Please Input"
      v-bind="$attrs"
      size="small"
      clearable
      @select="handleSelect"
      @blur="handleBlur"
      @keyup.esc="mValue = ''"
      @keyup.enter.stop="recordHistory"
    >
      <template #default="{item}">
        <div class="input-auto-tips-select-item font-code">
          {{ item.label }}

          <button
            v-if="!item.isClear"
            type="button"
            class="btn-no-style mdi mdi-close"
            @click.stop="removeItem(item)"
          ></button>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<style lang="scss" scoped>
.input-auto-tips-wrapper {
  :deep(.el-input) {
    font-size: 12px;
    line-height: 1;
    width: 180px;
  }
}
</style>
<style lang="scss">
.input-auto-tips-select-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
  .mdi-close {
    color: #f44336;
  }
}
</style>
