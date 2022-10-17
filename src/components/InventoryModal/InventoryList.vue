<script lang="ts">
import {defineComponent, PropType} from 'vue'
import BlockCard from '@/components/InventoryModal/BlockCard.vue'
import ComponentCard from '@/components/InventoryModal/ComponentCard.vue'
import {BlockItem} from '@/enum/block'

export default defineComponent({
  name: 'InventoryList',
  components: {
    BlockCard,
    ComponentCard,
  },
  props: {
    itemList: {
      type: Array as PropType<BlockItem[]>,
      default() {
        return []
      },
    },
    showFilter: {
      type: Boolean,
      default: true,
    },
    isMinHeight: {
      type: Boolean,
      default: false,
    },
    isComponentBlock: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onItemClick', 'contextmenu'],
  setup(props) {
    const {itemList} = toRefs(props)
    const filterText = ref('')

    const itemListFiltered = computed(() => {
      const text = filterText.value.toLowerCase()
      return filterText.value
        ? itemList.value.filter((item: BlockItem) => item.title.toLowerCase().includes(text))
        : itemList.value
    })

    return {
      filterText,
      itemListFiltered,
    }
  },
})
</script>

<template>
  <div class="inventory-list-wrap" :class="{'_min-height': isMinHeight}">
    <div
      v-if="showFilter"
      style="position: sticky; top: 0; left: 0; right: 0; padding: 0px; z-index: 1"
    >
      <n-input v-model:value="filterText" clearable placeholder="Filter Items" size="tiny" />
    </div>
    <div v-if="!itemListFiltered.length" style="padding: 40px; text-align: center; font-size: 20px">
      No Items.
    </div>
    <div v-else class="inventory-list" :class="{_big: isComponentBlock}">
      <template v-for="(item, index) in itemListFiltered" :key="item.id">
        <ComponentCard
          v-if="isComponentBlock"
          :item="item"
          @click="$emit('onItemClick', item, index)"
          @contextmenu="(...args) => $emit('contextmenu', ...args)"
        >
          <template #actionMenu="{item}">
            <slot name="actionMenu" :item="item"></slot>
          </template>
        </ComponentCard>
        <BlockCard v-else class="list-item" :item="item" @click="$emit('onItemClick', item)" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inventory-list-wrap {
  height: 40vh;
  min-height: 100px;
  overflow: auto;
  transition: height 0.3s;

  &._min-height {
    height: 150px;
  }
  .inventory-list {
    padding: 10px;
    display: grid;
    //grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    grid-template-columns: repeat(11, 1fr);
    grid-template-rows: auto;
    gap: 10px;
    &._big {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px 10px;
    }
  }
}
</style>
