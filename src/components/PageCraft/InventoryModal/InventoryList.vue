<script lang="ts">
import {defineComponent, PropType} from 'vue'
import BlockItemCard from '@/components/PageCraft/InventoryModal/BlockItemCard.vue'
import {BlockItem} from '@/enum/page-craft/block'

export default defineComponent({
  name: 'InventoryList',
  components: {
    BlockItemCard,
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
    largeCard: {
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
  <div class="inventory-list-wrap">
    <div class="filter-row flex-row-center-gap" v-if="showFilter">
      <slot name="filterStart"></slot>

      <input
        class="vgo-input"
        v-model="filterText"
        @keyup.esc="filterText = ''"
        :placeholder="'🔎 ' + $t('msgs.filter_items')"
      />

      <slot name="filterEnd"></slot>
    </div>
    <div v-if="!itemListFiltered.length" style="padding: 40px; text-align: center; font-size: 20px">
      {{ $t('msgs.no_items') }}
    </div>
    <div v-else class="inventory-list scrollbar-mini" :class="{_big: false}">
      <template v-for="item in itemListFiltered" :key="item.id">
        <BlockItemCard class="list-item" :item="item" @click="$emit('onItemClick', item)" />
      </template>
    </div>

    <slot name="end"></slot>
  </div>
</template>

<style lang="scss" scoped>
.inventory-list-wrap {
  height: 100%;
  min-height: 100px;
  transition: height 0.3s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  .filter-row {
    .vgo-input {
      flex: 1;
    }
  }

  .inventory-list {
    overflow: auto;
    padding: 8px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    //grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto;
    gap: 8px;

    * {
      box-sizing: border-box;
    }
    &._big {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 15px 10px;
    }
  }
}
</style>
