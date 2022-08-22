<script lang="ts">
import {useCraftStore} from "@/store/craft";
import {blockList} from "@/enum/block";

const LS_KEY_GLOBAL_STYLE = 'page_craft_global_style'

export default defineComponent({
  name: 'ToolBar',
  setup() {
    const craftStore = useCraftStore()

    const isShowGlobalStyleDialog = ref(false)
    const globalStyleText = ref('')
    const handleSaveGlobalStyle = () => {
      localStorage.setItem(LS_KEY_GLOBAL_STYLE, globalStyleText.value)
      const styleEl = document.getElementById('globalStyle')
      if (styleEl) {
        styleEl.innerHTML = globalStyleText.value
      }
    }
    onMounted(() => {
      const style = localStorage.getItem(LS_KEY_GLOBAL_STYLE)
      if (style) {
        globalStyleText.value = style
        handleSaveGlobalStyle()
      }
    })

    return {
      blockList,
      craftStore,
      isShowGlobalStyleDialog,
      handleSaveGlobalStyle,
      globalStyleText,
    }
  }
})
</script>

<template>
  <div class="page-craft-enhanced-toolbar page-craft-aero-panel">
    <n-modal
      v-model:show="isShowGlobalStyleDialog"
      negative-text="Cancel"
      positive-text="Save"
      preset="dialog"
      title="Global Style"
      @positive-click="handleSaveGlobalStyle"
    >
      <n-input
        v-model:value="globalStyleText"
        placeholder="CSS Code Only"
        rows="20"
        style="font-family: monospace;"
        type="textarea"
      />
    </n-modal>

    <div class="page-craft-enhanced-toolbar-above">
      <n-space size="small">

        <n-input-group>
          <n-input-group-label>className</n-input-group-label>
          <n-input v-model:value="craftStore.className" placeholder="className"/>
        </n-input-group>
        <n-input-group>
          <n-input-group-label>innerText</n-input-group-label>
          <n-input v-model:value="craftStore.innerText" placeholder="innerText"/>
        </n-input-group>

      </n-space>
      <n-space size="small">
        <n-button type="primary" @click="isShowGlobalStyleDialog = true">Global Style</n-button>

      </n-space>
    </div>
    <div class="page-craft-enhanced-toolbar-main">
      <div
        v-for="(item, index) in blockList"
        :key="index"
        class="list-item-frame"
      >
        <div :class="{active: item.tag === craftStore.currentBlock.tag}"
             class="list-item-inner"
             @click="() => craftStore.setCurrentBlock(item)"
        >
          <img v-if="item.icon" :src="item.icon" alt="icon">
          <span class="item-text" v-else>{{ item.tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-craft-enhanced-toolbar {
  position: sticky;
  bottom: 0;
  user-select: none;
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  font-family: monospace;
  border-bottom: 0;
  border-radius: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 5px 10px;
  z-index: 999;

  .page-craft-enhanced-toolbar-above {
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
  }

  .page-craft-enhanced-toolbar-main {
    width: 724px;
    height: 44px;
    margin-left: auto;
    margin-right: auto;
    display: grid;
    grid-template-columns: repeat(18, 1fr);
    grid-template-rows: auto;
    background-image: url("@/assets/gui/widgets-bar.png");
    border-left: 2px solid black;
    border-right: 2px solid black;

    .list-item-inner {
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
  }
}
</style>
