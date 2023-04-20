<script lang="ts">
import {defineComponent, PropType} from 'vue'
import BlockItemCard from '@/components/PageCraft/InventoryModal/BlockItemCard.vue'
import ComponentCard from '@/components/PageCraft/InventoryModal/ComponentCard.vue'
import {BlockItem} from '@/enum/page-craft/block'

export default defineComponent({
  name: 'InventoryList',
  components: {
    BlockItemCard,
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
    <div class="filter-row" v-if="showFilter">
      <n-input v-model:value="filterText" clearable placeholder="🔎 Filter Items" size="tiny" />
    </div>
    <div v-if="!itemListFiltered.length" style="padding: 40px; text-align: center; font-size: 20px">
      No Items.
    </div>
    <div v-else class="inventory-list _scrollbar_mini" :class="{_big: isComponentBlock}">
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
        <BlockItemCard v-else class="list-item" :item="item" @click="$emit('onItemClick', item)" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inventory-list-wrap {
  height: 40vh;
  min-height: 100px;
  transition: height 0.3s;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &._min-height {
    height: 150px;
  }
  .filter-row {
    .n-input {
      border-radius: 0;
    }
  }

  .inventory-list {
    overflow: auto;
    padding: 10px;
    display: grid;
    //grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto;
    gap: 10px;
    &._big {
      grid-template-columns: repeat(4, 1fr);
      gap: 20px 10px;
    }
  }
}
</style>
