<script lang="ts">
import {useCraftStore} from '@/store/craft'
import {blockList} from '@/enum/block'
import ToolItem from '@/components/ToolBar/ToolItem.vue'
import {LS_KEYS} from '@/enum'
import {createOrFindStyleNode} from '@/utils/dom'

export default defineComponent({
  name: 'ToolBar',
  components: {
    ToolItem,
  },
  setup() {
    const craftStore = useCraftStore()
    const styleEl = ref<HTMLElement | null>(null)

    const isShowGlobalStyleDialog = ref(false)
    const globalStyleText = ref('')

    const applyGlobalStyle = () => {
      if (styleEl.value) {
        styleEl.value.innerHTML = globalStyleText.value
        localStorage.setItem(LS_KEYS.GLOBAL_STYLE, globalStyleText.value)
      }
    }

    onMounted(() => {
      styleEl.value = createOrFindStyleNode(LS_KEYS.GLOBAL_STYLE)
      const style = localStorage.getItem(LS_KEYS.GLOBAL_STYLE) || ''

      if (style) {
        globalStyleText.value = style
        applyGlobalStyle()
      }
    })

    return {
      blockList,
      craftStore,
      isShowGlobalStyleDialog,
      applyGlobalStyle,
      globalStyleText,
    }
  },
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
      @positive-click="applyGlobalStyle"
    >
      <n-input
        v-model:value="globalStyleText"
        placeholder="CSS Code Only"
        rows="20"
        style="font-family: monospace"
        type="textarea"
      />
    </n-modal>

    <div class="page-craft-enhanced-toolbar-above win7">
      <n-space size="small">
        <div class="field-row">
          <label for="inputClass">Class </label>
          <input
            id="inputClass"
            type="text"
            v-model="craftStore.className"
            placeholder="CSS Class"
            style="font-family: monospace"
          />
        </div>

        <div class="field-row">
          <label for="inputContent">Content </label>
          <input
            id="inputContent"
            type="text"
            v-model="craftStore.innerText"
            placeholder="innerHTML | src | value"
          />
        </div>
      </n-space>
      <button @click="isShowGlobalStyleDialog = true">Global Style...</button>
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
  font-family: monospace;
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
