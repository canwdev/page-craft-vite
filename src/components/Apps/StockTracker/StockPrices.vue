<script lang="ts" setup>
import {IStockTrackerPrices} from '@/components/Apps/StockTracker/types'
import TabLayout from '@canwdev/vgo-ui/src/components/Layouts/TabLayout.vue'
import EchartsCandlestick from '@/components/Apps/StockTracker/Graphs/EchartsCandlestick.vue'

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
  if (!stockPrices.value) {
    return []
  }
  return Object.keys(stockPrices.value).map((key) => {
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
      <template v-if="stockPrices[curTab]">
        <EchartsCandlestick
          v-if="stockPrices[curTab] && stockPrices[curTab].byDay"
          :by-day="stockPrices[curTab]!.byDay"
          :title="curTab"
        />
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
