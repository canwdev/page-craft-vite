<script lang="ts">
import {defineComponent, PropType} from 'vue'
import InventoryItem from '@/components/InventoryModal/InventoryItem.vue'
import {BlockItem} from '@/enum/block'

export default defineComponent({
  name: 'InventoryList',
  components: {
    InventoryItem,
  },
  props: {
    blockItemList: {
      type: Array as PropType<BlockItem[]>,
      default() {
        return []
      },
    },
    showFilter: {
      type: Boolean,
      default: true,
    },
    isMini: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onItemClick'],
  setup(props) {
    const {blockItemList} = toRefs(props)
    const filterText = ref('')

    const blockItemListFiltered = computed(() => {
      return filterText.value
        ? blockItemList.value.filter((item) => item.data?.tag?.includes(filterText.value))
        : blockItemList.value
    })

    return {
      filterText,
      blockItemListFiltered,
    }
  },
})
</script>

<template>
  <div class="inventory-list-wrap" :class="{_mini: isMini}">
    <div
      v-if="showFilter"
      style="position: sticky; top: 0; left: 0; right: 0; padding: 0px; z-index: 1"
    >
      <n-input v-model:value="filterText" clearable placeholder="Filter Items" size="tiny" />
    </div>
    <div v-if="!blockItemList.length" style="padding: 40px; text-align: center; font-size: 20px">
      No Items.
    </div>
    <div v-else class="inventory-list">
      <InventoryItem
        class="list-item"
        v-for="item in blockItemListFiltered"
        :key="item.id"
        :item="item"
        bordered
        @click="$emit('onItemClick', item)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inventory-list-wrap {
  height: 40vh;
  min-height: 100px;
  overflow: auto;
  transition: height 0.3s;

  &._mini {
    height: 150px;
  }
  .inventory-list {
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    grid-template-rows: auto;
    gap: 10px;
  }
}
</style>
