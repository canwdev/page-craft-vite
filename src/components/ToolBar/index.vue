<script lang="ts">
import {useCraftStore} from '@/store/craft'
import {blockList} from '@/enum/block'
import ToolItem from '@/components/ToolBar/ToolItem.vue'
import {useIsDarkMode} from '@/hooks/use-global-theme'

export default defineComponent({
  name: 'BottomToolBar',
  components: {
    ToolItem,
  },
  setup() {
    const craftStore = useCraftStore()

    return {
      blockList,
      craftStore,
      ...useIsDarkMode(),
    }
  },
})
</script>

<template>
  <div class="page-craft-enhanced-toolbar page-craft-aero-panel" :class="{_dark: isDarkMode}">
    <div class="page-craft-enhanced-toolbar-above">
      <n-space size="small">
        <div class="field-row">
          <label for="inputClass">Class </label>
          <n-input
            size="tiny"
            id="inputClass"
            type="text"
            v-model="craftStore.className"
            placeholder="CSS Class"
            style="font-family: monospace"
            clearable
          />
        </div>

        <div class="field-row">
          <label for="inputContent">Content </label>
          <n-input
            size="tiny"
            id="inputContent"
            type="text"
            v-model="craftStore.innerText"
            placeholder="innerHTML | src | value"
            clearable
          />
        </div>
      </n-space>
      <n-button size="tiny" @click="">...</n-button>
    </div>
    <div class="page-craft-enhanced-toolbar-main">
      <ToolItem
        v-for="(item, index) in blockList"
        :key="index"
        :item="item"
        @click="() => craftStore.setCurrentBlock(item)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-craft-enhanced-toolbar {
  position: sticky;
  bottom: 0;
  user-select: none;
  margin-left: auto;
  margin-right: auto;
  border-bottom: 0;
  border-bottom: 0;
  padding: 5px 10px 6px;
  z-index: 999;

  * {
    box-sizing: border-box;
  }

  .page-craft-enhanced-toolbar-above {
    padding: 2px 0 8px;
    display: flex;
    justify-content: space-between;
    label {
      text-shadow: 0 0 10px white;
    }
    .field-row {
      display: flex;
      .n-input {
        margin-left: 5px;
      }
    }
  }

  .page-craft-enhanced-toolbar-main {
    width: 724px;
    height: 44px;
    margin-left: auto;
    margin-right: auto;
    display: grid;
    grid-template-columns: repeat(18, 1fr);
    grid-template-rows: auto;
    background-image: url('@/assets/gui/widgets-bar.png');
    border-left: 2px solid black;
    border-right: 2px solid black;
  }
}
</style>
