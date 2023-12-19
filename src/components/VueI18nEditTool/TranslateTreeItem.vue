<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {
  CopyMode,
  exportI18nTreeJsonObj,
  formatTranslateItem,
  formatTranslateTreeItem,
  ITranslateItem,
  ITranslateTreeItem,
} from '@/enum/vue-i18n-tool'
import TranslateItem from './TranslateItem.vue'
import {copyToClipboard, guid, readClipboardData} from '@/utils'
import DialogTextEdit from '@/components/CommonUI/DialogTextEdit.vue'
import {
  Delete20Regular,
  AddSquare20Regular,
  Add20Regular,
  Copy20Regular,
  Globe16Regular,
  ClipboardPaste20Regular,
} from '@vicons/fluent'
import {useMainStore} from '@/store/main'

export default defineComponent({
  name: 'TranslateTreeItem',
  components: {
    Delete20Regular,
    TranslateItem,
    DialogTextEdit,
    AddSquare20Regular,
    Add20Regular,
    ClipboardPaste20Regular,
    Copy20Regular,
    Globe16Regular,
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
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ['onRemove', 'onKeyClick'],
  setup(props) {
    const {item, index} = toRefs(props)
    const mainStore = useMainStore()

    const handleAddChildren = () => {
      mainStore.trIsManualAdd = true
      item.value.children.push(formatTranslateTreeItem({parent: item.value}))
    }
    const handleAddTranslate = () => {
      mainStore.trIsManualAdd = true
      item.value.translates.push(formatTranslateItem())
    }

    // 自动粘贴剪贴板的值，并自动复制翻译key值
    const handleAutoAdd = async () => {
      const text = await readClipboardData()
      // 生成guid用来区分
      mainStore.trAutoAddGuid = guid()
      item.value.translates.push(
        formatTranslateItem({
          key: mainStore.trAutoAddGuid,
          value: text,
        })
      )
    }

    const isExpand = ref(true)

    const isShowArrayEdit = ref(false)
    const currentPreviewItem = shallowRef<ITranslateItem | null>(null)
    const currentArrayString = ref<string>('')
    watch(isShowArrayEdit, (val) => {
      if (!val) {
        currentPreviewItem.value = null
        currentArrayString.value = ''
      }
    })

    const namespacePrefix = computed(() => {
      if (!item.value) {
        return ''
      }
      const list: string[] = []
      let i: any = item.value
      while (i) {
        list.push(i.namespace)
        i = i.parent || null
      }
      // remove prefix and tail
      list.pop()
      list.shift()
      return list.reverse().join('.')
    })

    // 检查重复键
    const isKeyDuplicated = ref(false)
    const checkDuplicatedGroupKey = () => {
      isKeyDuplicated.value = false
      const list = item.value?.parent?.children || []
      for (let i = 0; i < list.length; i++) {
        const _item = list[i]
        if (index.value !== i && _item.namespace === item.value.namespace) {
          isKeyDuplicated.value = true
          break
        }
      }
    }

    const namespaceInputRef = ref()
    onMounted(() => {
      if (mainStore.trIsManualAdd) {
        // 自动选择value输入框
        if (namespaceInputRef.value) {
          namespaceInputRef.value.focus()
        }
        mainStore.trIsManualAdd = false
      }
    })

    return {
      handleAddChildren,
      handleAddTranslate,
      handleAutoAdd,
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
      isShowArrayEdit,
      currentPreviewItem,
      currentArrayString,
      handlePreviewArray(item: ITranslateItem) {
        currentPreviewItem.value = item
        currentArrayString.value = JSON.stringify(item.value, null, 2)
        isShowArrayEdit.value = true
      },
      handleSaveArray(val) {
        if (currentPreviewItem.value) {
          try {
            currentPreviewItem.value.value = JSON.parse(val || '[]')
            isShowArrayEdit.value = false
          } catch (e: any) {
            console.error(e)
            window.$message.error(e.message)
          }
        }
      },
      isKeyDuplicated,
      checkDuplicatedGroupKey,
      namespacePrefix,
      namespaceInputRef,
    }
  },
})
</script>

<template>
  <n-card size="small" class="tree-item" v-if="item" :class="{isKeyDuplicated}">
    <div class="group-header">
      <template v-if="isKeyDuplicated">
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="error-tip-button">!</div>
          </template>
          Group namespace duplicated, may cause bug!
        </n-tooltip>
      </template>
      <n-input
        ref="namespaceInputRef"
        size="small"
        :disabled="isRoot"
        class="font-code"
        v-model:value="item.namespace"
        placeholder="namespace"
        style="flex: 1"
        @blur="checkDuplicatedGroupKey"
        ><!--§-->
        <template #prefix>
          <n-icon color="darkseagreen" size="16" :title="namespacePrefix">
            <Globe16Regular />
          </n-icon>
          <span v-if="!isLite" style="color: darkseagreen">
            {{ namespacePrefix + (namespacePrefix ? '.' : '') }}
          </span>
        </template>
      </n-input>
      <n-space v-if="!isLite" style="margin-left: 10px" align="center">
        <n-button
          size="small"
          secondary
          type="info"
          @click="handleGetJSON"
          :title="`${$t('actions.copy')} JSON`"
        >
          <template #icon><Copy20Regular /></template>
        </n-button>
        <n-popconfirm v-if="!isRoot" @positive-click="$emit('onRemove')">
          <template #trigger>
            <n-button secondary type="error" size="small">
              <template #icon>
                <Delete20Regular />
              </template>
            </n-button>
          </template>
          {{ $t('msgs.remove_group') }}
        </n-popconfirm>
        <n-switch size="small" v-model:value="isExpand">
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
          v-for="(vi, vIndex) in item.translates"
          :item="vi"
          :tree-item="item"
          :key="vIndex"
          :index="vIndex"
          :is-lite="isLite"
          @previewArray="handlePreviewArray"
          @onRemove="handleRemoveItem(vIndex)"
          @onKeyClick="(...args) => $emit('onKeyClick', ...args)"
        />
      </n-list>

      <n-space v-if="!isLite" align="center" style="margin-top: 5px">
        <n-button size="small" title="Add translate item" type="info" @click="handleAddTranslate">
          <template #icon>
            <Add20Regular />
          </template>
          {{ $t('common.translate') }}
        </n-button>
        <n-button
          size="small"
          title="Auto paste and copy key"
          type="info"
          secondary
          @click="handleAutoAdd"
        >
          <template #icon>
            <ClipboardPaste20Regular />
          </template>
          Auto
        </n-button>
      </n-space>

      <div class="split-line" />

      <template v-if="item.children && item.children.length">
        <TranslateTreeItem
          v-for="(vi, index) in item.children"
          :item="vi"
          :key="index"
          :index="index"
          :is-root="false"
          :is-lite="isLite"
          @onRemove="handleRemoveTreeItem(index)"
          @previewArray="handlePreviewArray"
          @onKeyClick="(...args) => $emit('onKeyClick', ...args)"
        />
      </template>
      <n-button
        v-if="!isLite"
        type="primary"
        @click="handleAddChildren"
        title="Add translate children group"
      >
        <template #icon>
          <AddSquare20Regular />
        </template>
        {{ $t('common.group') }}</n-button
      >
    </n-collapse-transition>

    <DialogTextEdit
      is-textarea
      :title="$t('common.array_detail')"
      placeholder="Array JSON String"
      v-model:visible="isShowArrayEdit"
      :text="currentArrayString"
      @onSave="handleSaveArray"
    />
  </n-card>
</template>

<style lang="scss" scoped>
.tree-item {
  margin-top: 10px;
  margin-bottom: 10px;

  &:hover {
    transition: none;
    border: 1px solid darkseagreen;
  }
  &.isKeyDuplicated {
    background-color: rgba(244, 67, 54, 0.1) !important;
  }

  .group-header {
    display: flex;
    align-items: center;

    .error-tip-button {
      margin-right: 8px;
    }
  }

  .split-line {
    opacity: 0.5;
    border-top: 1px dashed darkseagreen;
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
