<script lang="ts" setup>
import {IStockTrackerPrices} from '@/components/AppUtils/StockTracker/types'
import TabLayout from '@/components/CanUI/packages/Layouts/TabLayout.vue'

const props = withDefaults(
  defineProps<{
    stockPrices: IStockTrackerPrices
  }>(),
  {},
)
const emit = defineEmits([])
const {stockPrices} = toRefs(props)

const curTab = ref('')
const tabOptions = computed(() => {
  if (!stockPrices.value || !stockPrices.value.bySymbol) {
    return []
  }
  return Object.keys(stockPrices.value.bySymbol).map((key) => {
    return {
      label: key,
      value: key,
    }
  })
})

watch(
  tabOptions,
  (val) => {
    if (val && val[0]) {
      curTab.value = val[0].value
    }
  },
  {immediate: true},
)
</script>

<template>
  <div class="stock-prices-wrapper">
    <TabLayout v-model="curTab" :options="tabOptions" horizontal>
      <template v-if="stockPrices.bySymbol[curTab]">
        {{ stockPrices.bySymbol[curTab] }}
      </template>
    </TabLayout>
  </div>
</template>

<style lang="scss" scoped>
.stock-prices-wrapper {
  height: 100%;
  overflow: auto;
}
</style>
