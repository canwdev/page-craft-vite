<template>
  <div class="minecraft-toolbar">
    <div class="minecraft-toolbar__inner">
      <div
        v-for="(item, index) in inventoryList"
        :key="index"
        class="list-item-frame"
      >
        <div class="list-item-inner"
             @click="currentTag = item.tag"
             :class="{active: item.tag === currentTag}"
        >
          {{ item.tag }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ToolBar',
  data() {
    return {
      currentTag: 'div',

    }
  },
  setup() {
    return {
      inventoryList: [
        {tag: 'div'},
        {tag: 'span'},
        {tag: 'button'},
        {tag: 'input'},
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.minecraft-toolbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  user-select: none;

  &__inner {
    background-color: #ccc;
    border: 5px solid #939393;
    width: 1200px;
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
      &+.list-item {
      }
    }
  }
}
</style>
