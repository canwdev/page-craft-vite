<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {
  formatTranslateItem,
  formatTranslateTreeItem,
  ITranslateTreeItem,
} from '@/enum/vue-i18n-copy-tool'
import TranslateItem from './TranslateItem.vue'

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
        console.log(JSON.stringify({...item.value}))
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
    <n-input v-model:value="item.namespace" placeholder="namespace" clearable />

    <n-space justify="space-between" style="margin-top: 10px; margin-bottom: 10px">
      <n-space>
        <n-button @click="handleAddChildren">Add Children</n-button>
        <n-button type="primary" @click="handleAddTranslate">Add Translate</n-button>
      </n-space>

      <n-space>
        <n-button @click="handleGetJSON">Get JSON</n-button>
        <n-popconfirm v-if="!isRoot" @positive-click="$emit('onRemove')">
          <template #trigger>
            <n-button type="error">Remove</n-button>
          </template>
          Remove Group?
        </n-popconfirm>
      </n-space>
    </n-space>

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
