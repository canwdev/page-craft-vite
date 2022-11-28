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
    const {item, treeItem} = toRefs(props)

    const namespacePrefix = computed(() => {
      if (!treeItem.value) {
        return ''
      }
      const list: string[] = []
      let i: any = treeItem.value
      while (i) {
        list.push(i.namespace)
        i = i.parent || null
      }
      return list.reverse().join('.')
    })

    const nameDisplay = computed(() => {
      if (!item.value) {
        return ''
      }
      let name = item.value.key
      if (namespacePrefix.value) {
        name = namespacePrefix.value + '.' + name
      }
      return name
    })

    return {namespacePrefix, nameDisplay}
  },
})
</script>

<template>
  <n-list-item class="translate-item">
    <n-space justify="space-between">
      <n-space>
        <n-input class="font-code" v-model:value="item.key" placeholder="key" clearable />
        <n-input style="width: 350px" v-model:value="item.value" placeholder="value" clearable />
        <n-input
          class="font-code"
          size="tiny"
          style="width: 350px"
          :value="`$t('${nameDisplay}')`"
          readonly
        />
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
