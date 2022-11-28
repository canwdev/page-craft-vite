<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {ITranslateItem, ITranslateTreeItem} from '@/enum/vue-i18n-copy-tool'

export default defineComponent({
  name: 'TranslateItem',
  props: {
    item: {
      type: Object as PropType<ITranslateItem>,
      default: null,
    },
    treeItem: {
      type: Object as PropType<ITranslateTreeItem>,
      default: null,
    },
  },
  emits: ['onRemove'],
  setup(props) {
    const {treeItem} = toRefs(props)

    const codeDisplay = computed(() => {
      if (!treeItem.value) {
        return ''
      }
      const list: string[] = []
      let i: ITranslateTreeItem = treeItem.value
      while (i) {
        list.push(i.namespace)
        i = i.parent
      }
      return list.reverse().join('.')
    })

    return {codeDisplay}
  },
})
</script>

<template>
  <n-list-item class="translate-item">
    <n-space justify="space-between">
      <n-space>
        <n-input v-model:value="item.key" placeholder="key" clearable />
        <n-input style="width: 450px" v-model:value="item.value" placeholder="value" clearable />

        <span class="i18n-badge font-code">{{ `$t('${item.key}')` }} {{ codeDisplay }}</span>
      </n-space>
      <n-space>
        <n-popconfirm @positive-click="$emit('onRemove')">
          <template #trigger>
            <n-button type="error">Remove</n-button>
          </template>
          Remove Item?
        </n-popconfirm>
      </n-space>
    </n-space>
  </n-list-item>
</template>

<style lang="scss" scoped>
.translate-item {
  .i18n-badge {
    //user-select: all;
  }
}
</style>
