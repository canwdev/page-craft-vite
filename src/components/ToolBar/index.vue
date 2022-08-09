<script lang="ts">
import {useCraftStore} from "@/store/craft";
import {blockList} from "@/enum/block";

export default defineComponent({
  name: 'ToolBar',
  setup() {
    const craftStore = useCraftStore()

    return {
      blockList,
      craftStore,
    }
  }
})
</script>

<template>
  <div class="enhanced-toolbar">
    <div class="enhanced-toolbar-above">
      <n-button>
        {{ craftStore.currentBlock }}
      </n-button>
      <n-input v-model:value="craftStore.className" placeholder="className"/>
      <n-input v-model:value="craftStore.innerText" placeholder="innerText"/>
    </div>
    <div class="enhanced-toolbar-main">
      <div
        v-for="(item, index) in blockList"
        :key="index"
        class="list-item-frame"
      >
        <div :class="{active: item.tag === craftStore.currentBlock.tag}"
             class="list-item-inner"
             @click="() => craftStore.setCurrentBlock(item)"
        >
          {{ item.tag }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.enhanced-toolbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  user-select: none;
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  font-family: monospace;

  .enhanced-toolbar-above {
    display: flex;
  }

  .enhanced-toolbar-main {
    background-color: #ccc;
    border: 5px solid #939393;
    height: 50px;
    display: flex;

    .list-item-frame {
      border-right: 5px solid #939393;
    }

    .list-item-inner {
      width: 50px;
      height: 50px;
      background: #efefef;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;

      &.active {
        outline: 2px solid crimson;
      }

      & + .list-item {
      }
    }
  }
}
</style>
