<script lang="ts">
import {useCraftStore} from "@/store/craft";
import {blockList} from "@/enum/block";

const LS_KEY_GLOBAL_STYLE = 'ls_key_global_style'

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
  <div class="enhanced-toolbar">
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

    <div class="enhanced-toolbar-above">
      <n-space size="small">
        <n-button>
          {{ craftStore.currentBlock }}
        </n-button>
        <n-input v-model:value="craftStore.className" placeholder="className"/>
        <n-input v-model:value="craftStore.innerText" placeholder="innerText"/>
      </n-space>
      <n-space size="small">
        <n-button type="primary" @click="isShowGlobalStyleDialog = true">Global Style</n-button>

      </n-space>
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
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
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
