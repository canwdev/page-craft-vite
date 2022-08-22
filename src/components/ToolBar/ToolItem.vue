<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {useCraftStore} from "@/store/craft";
import {BlockItem} from "@/enum/block";

export default defineComponent({
  name: 'ToolItem',
  props: {
    item: {
      type: Object as PropType<BlockItem>,
      required: true
    },
  },
  setup(props) {
    const {item} = toRefs(props)
    const craftStore = useCraftStore()

    const isActive = computed(() => {
      if (item.value.manualType) {
        return  item.value.manualType === craftStore.currentBlock.manualType
      }
      return item.value.tag === craftStore.currentBlock.tag
    })

    return {
      craftStore,
      isActive
    }
  }
})
</script>

<template>
  <div :class="{active: isActive}"
       class="tool-item"
  >
    <img v-if="item.icon" :src="item.icon" alt="icon">
    <span v-else class="item-text">{{ item.tag }}</span>
  </div>
</template>

<style lang="scss" scoped>
.tool-item {
  width: 39px;
  height: 44px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  position: relative;

  &::before {
    width: 48px;
    height: 48px;
    background-image: url("@/assets/gui/widgets-item-selected.png");
    background-size: contain;
    position: absolute;
    transform: translateX(2px);
    z-index: 0;
    content: "";
    opacity: 0;
    visibility: hidden;
    transition: all .3s;
  }

  &.active {
    &::before {
      opacity: 1;
      visibility: visible;
    }
  }

  img {
    width: 32px;
    height: 32px;
    image-rendering: pixelated;
  }

  .item-text {
    transform: rotate(-45deg);
    text-shadow: 2px 2px 0px black;
  }
}
</style>
