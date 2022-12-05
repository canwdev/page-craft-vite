<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {formatI18nKey, ITranslateItem, ITranslateTreeItem} from '@/enum/vue-i18n-copy-tool'
import {copyToClipboard} from '@/utils'

export default defineComponent({
  name: 'TranslateItem',
  components: {},
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
  emits: ['onRemove', 'previewArray'],
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
      if (!item.value || !item.value.value) {
        return ''
      }
      let name = item.value.key
      if (namespacePrefix.value) {
        name = namespacePrefix.value + '.' + name
      }
      return name
    })

    return {
      namespacePrefix,
      nameDisplay,
      handleCopy(type) {
        let text = `$t('${nameDisplay.value}')`

        if (type === 'html') {
          text = `{{ $t('${nameDisplay.value}') }}`
        } else if (type === 'v-html') {
          text = `v-html="$t('${nameDisplay.value}')"`
        } else if (type === 'js') {
          text = `this.$t('${nameDisplay.value}')`
        }

        copyToClipboard(text)
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
  <n-list-item size="small" v-if="item" class="translate-item">
    <n-space size="small" justify="space-between">
      <n-space size="small" align="center">
        <n-input
          size="small"
          class="font-code"
          v-model:value="item.key"
          placeholder="key"
          clearable
        />
        <n-input
          v-if="!Array.isArray(item.value)"
          size="small"
          style="width: 350px"
          v-model:value="item.value"
          placeholder="value"
          clearable
          @blur="handleBlur"
        />
        <n-button
          v-else
          :title="item.value"
          size="small"
          style="width: 350px"
          @click="$emit('previewArray', item)"
          >Array</n-button
        >

        <n-space v-if="nameDisplay" size="small">
          <n-input
            class="font-code"
            size="small"
            style="width: 300px"
            :value="`$t('${nameDisplay}')`"
            readonly
          />
          <n-button size="small" type="info" @click="handleCopy" title="Original"> Copy: </n-button>
          <n-button size="small" type="info" @click="handleCopy('html')" title="HTML template">
            H
          </n-button>
          <n-button size="small" type="info" @click="handleCopy('v-html')" title="v-html template">
            VH
          </n-button>
          <n-button size="small" type="info" @click="handleCopy('js')" title="JS Script">
            JS
          </n-button>
        </n-space>
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
