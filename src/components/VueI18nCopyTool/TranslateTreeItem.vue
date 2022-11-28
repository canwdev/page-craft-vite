<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {
  exportI18nTreeJsonObj,
  formatTranslateItem,
  formatTranslateTreeItem,
  ITranslateTreeItem,
} from '@/enum/vue-i18n-copy-tool'
import TranslateItem from './TranslateItem.vue'
import {copyToClipboard} from '@/utils'

export default defineComponent({
  name: 'TranslateTreeItem',
  components: {
    TranslateItem,
  },
  props: {
    item: {
      type: Object as PropType<ITranslateTreeItem>,
      default: null,
    },
    isRoot: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['onRemove'],
  setup(props) {
    const {item} = toRefs(props)
    const handleAddChildren = () => {
      console.log('[handleAddChildren]')
      item.value.children.push(formatTranslateTreeItem())
    }
    const handleAddTranslate = () => {
      console.log('[handleAddTranslate]')
      item.value.translates.push(formatTranslateItem())
    }
    return {
      handleAddChildren,
      handleAddTranslate,
      handleGetJSON() {
        const obj = exportI18nTreeJsonObj([item.value])
        console.log(obj)
        copyToClipboard(JSON.stringify(obj, null, 2))
        window.$message.success('JSON Copied')
      },
      handleRemoveTreeItem(index) {
        const list = [...item.value.children]
        list.splice(index, 1)
        item.value.children = list
      },
      handleRemoveItem(index) {
        const list = [...item.value.translates]
        list.splice(index, 1)
        item.value.translates = list
      },
    }
  },
})
</script>

<template>
  <n-card class="tree-item" v-if="item">
    <div style="display: flex; margin-bottom: 10px">
      <n-input
        class="font-code"
        v-model:value="item.namespace"
        placeholder="namespace"
        clearable
        style="flex: 1"
      />
      <n-space style="margin-left: 10px">
        <n-button type="info" @click="handleGetJSON">Copy JSON</n-button>
        <n-popconfirm v-if="!isRoot" @positive-click="$emit('onRemove')">
          <template #trigger>
            <n-button type="error">Remove</n-button>
          </template>
          Remove Group?
        </n-popconfirm>
      </n-space>
    </div>

    <n-list v-if="item.translates && item.translates.length">
      <TranslateItem
        v-for="(vi, index) in item.translates"
        :item="vi"
        :tree-item="item"
        :key="index"
        @onRemove="handleRemoveItem(index)"
      />
    </n-list>

    <template v-if="item.children && item.children.length">
      <TranslateTreeItem
        v-for="(vi, index) in item.children"
        :item="vi"
        :key="index"
        :is-root="false"
        @onRemove="handleRemoveTreeItem(index)"
      />
    </template>
    <n-space justify="start" style="margin-top: 10px">
      <n-button type="primary" @click="handleAddTranslate">Add Translate</n-button>
      <n-button type="primary" @click="handleAddChildren">Add Children</n-button>
    </n-space>
  </n-card>
</template>

<style lang="scss" scoped>
.tree-item {
  &:hover {
    outline: 1px solid green;
  }

  margin-bottom: 10px;
}
</style>
