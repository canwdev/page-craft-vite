<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {
  exportI18nTreeJsonObj,
  formatTranslateItem,
  formatTranslateTreeItem,
  I18nJsonObjUtils,
  ITranslateItem,
  ITranslateTreeItem,
} from '@/enum/vue-i18n-tool'
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
    isLite: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onRemove', 'onKeyClick'],
  setup(props) {
    const {item} = toRefs(props)
    const handleAddChildren = () => {
      console.log('[handleAddChildren]')
      item.value.children.push(formatTranslateTreeItem({parent: item.value}))
    }
    const handleAddTranslate = () => {
      console.log('[handleAddTranslate]')
      item.value.translates.push(formatTranslateItem())
    }
    const isExpand = ref(true)

    const isShowPreviewArray = ref(false)
    const currentPreviewItem = shallowRef<ITranslateItem | null>(null)
    const currentArrayString = ref<string | null>(null)
    watch(isShowPreviewArray, (val) => {
      if (!val) {
        currentPreviewItem.value = null
        currentArrayString.value = null
      }
    })

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
      isExpand,
      isShowPreviewArray,
      currentPreviewItem,
      currentArrayString,
      handlePreviewArray(item: ITranslateItem) {
        currentPreviewItem.value = item
        currentArrayString.value = JSON.stringify(item.value, null, 2)
        isShowPreviewArray.value = true
      },
      handleSaveArray() {
        if (currentPreviewItem.value) {
          currentPreviewItem.value.value = JSON.parse(currentArrayString.value || '[]')
          isShowPreviewArray.value = false
        }
      },
    }
  },
})
</script>

<template>
  <n-card size="small" class="tree-item" v-if="item">
    <div style="display: flex">
      <n-input
        :disabled="isRoot"
        class="font-code"
        v-model:value="item.namespace"
        placeholder="namespace"
        style="flex: 1"
      >
        <template #prefix> <span style="color: darkseagreen">§</span> </template>
      </n-input>
      <n-space style="margin-left: 10px" align="center">
        <n-button v-if="!isLite" type="info" @click="handleGetJSON">Copy JSON</n-button>
        <n-popconfirm v-if="!isRoot" @positive-click="$emit('onRemove')">
          <template #trigger>
            <n-button type="error">×</n-button>
          </template>
          Remove Group?
        </n-popconfirm>
        <n-switch v-if="!isLite" v-model:value="isExpand">
          <template #checked> 👀 </template>
          <template #unchecked> 🙈 </template>
        </n-switch>
      </n-space>
    </div>

    <n-collapse-transition :show="isExpand">
      <n-list
        size="small"
        style="margin-top: 10px"
        v-if="item.translates && item.translates.length"
      >
        <TranslateItem
          v-for="(vi, index) in item.translates"
          :item="vi"
          :tree-item="item"
          :key="index"
          :is-lite="isLite"
          @previewArray="handlePreviewArray"
          @onRemove="handleRemoveItem(index)"
          @onKeyClick="(e) => $emit('onKeyClick', e)"
        />
      </n-list>

      <n-space justify="space-between" align="center" style="margin-top: 5px">
        <n-button type="info" @click="handleAddTranslate">+ Translate</n-button>
      </n-space>

      <div style="border-top: 1px dashed darkseagreen; margin-top: 10px; margin-bottom: 10px" />

      <template v-if="item.children && item.children.length">
        <TranslateTreeItem
          v-for="(vi, index) in item.children"
          :item="vi"
          :key="index"
          :is-root="false"
          :is-lite="isLite"
          @onRemove="handleRemoveTreeItem(index)"
          @previewArray="handlePreviewArray"
          @onKeyClick="(e) => $emit('onKeyClick', e)"
        />
      </template>
      <n-button type="primary" @click="handleAddChildren">+ Children</n-button>
    </n-collapse-transition>

    <n-modal
      style="width: 80vw"
      preset="dialog"
      negative-text="Cancel"
      positive-text="Save"
      title="Array Detail"
      @positive-click="handleSaveArray"
      v-model:show="isShowPreviewArray"
    >
      <n-input
        v-if="isShowPreviewArray && currentArrayString"
        type="textarea"
        v-model:value="currentArrayString"
        class="font-code"
        rows="30"
        placeholder="Array JSON String"
      ></n-input>
    </n-modal>
  </n-card>
</template>

<style lang="scss" scoped>
.tree-item {
  &:hover {
    transition: none;
    border: 1px solid darkseagreen;
  }

  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
