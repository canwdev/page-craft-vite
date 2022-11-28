<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {formatI18nKey, ITranslateItem, ITranslateTreeItem} from '@/enum/vue-i18n-copy-tool'
import {copyToClipboard} from '@/utils'

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
      return `$t('${name}')`
    })

    return {
      namespacePrefix,
      nameDisplay,
      handleCopy() {
        copyToClipboard(nameDisplay.value)
        window.$message.success('Text Copied')
      },
      handleBlur() {
        if (!item.value.key) {
          item.value.key = formatI18nKey(item.value.value)
        }
      },
    }
  },
})
</script>

<template>
  <n-list-item v-if="item" class="translate-item">
    <n-space justify="space-between">
      <n-space>
        <n-input class="font-code" v-model:value="item.key" placeholder="key" clearable />
        <n-input
          style="width: 350px"
          v-model:value="item.value"
          placeholder="value"
          clearable
          @blur="handleBlur"
        />

        <n-input-group>
          <n-input
            class="font-code"
            size="tiny"
            style="width: 350px"
            :value="nameDisplay"
            readonly
          />
          <n-button size="medium" type="info" @click="handleCopy"> Copy </n-button>
        </n-input-group>
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
