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
import TranslateItem from '@/components/VueI18nEditTool/Single/TranslateItem.vue'
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
import {useI18nToolSettingsStore} from '@/store/i18n-tool-settings'
import {
  textConvertMultipleLine,
  textConvertAdvanced,
  TextConvertMode,
} from '@/components/VueI18nEditTool/copy-enum'
import {useArrayEdit} from '@/components/VueI18nEditTool/Single/use-array-edit'

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
    title: {
      type: String,
      default: '',
    },
  },
  emits: ['onRemove', 'onKeyClick'],
  setup(props) {
    const {item, index} = toRefs(props)
    const mainStore = useMainStore()
    const intSettingsStore = useI18nToolSettingsStore()

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
      let val: any = await readClipboardData()

      val = textConvertAdvanced(val, intSettingsStore.autoPasteTextConvertMode, {
        isTrimQuotes: intSettingsStore.autoPasteTrimQuotes,
      })

      // 生成guid用来区分
      mainStore.trAutoAddGuid = guid()
      item.value.translates.push(
        formatTranslateItem({
          key: mainStore.trAutoAddGuid,
          value: val,
        })
      )
    }

    const isExpand = ref(true)

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
      intSettingsStore,
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
      isKeyDuplicated,
      checkDuplicatedGroupKey,
      namespacePrefix,
      namespaceInputRef,
      ...useArrayEdit(),
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
            <div class="mc-error-tip-button">!</div>
          </template>
          Group namespace duplicated, may cause bug!
        </n-tooltip>
      </template>

      <n-input
        v-if="isRoot"
        ref="namespaceInputRef"
        size="small"
        class="font-code"
        :value="title || item.namespace"
        disabled
        style="flex: 1"
      >
        <template #prefix>
          <n-icon color="red" size="16">
            <Globe16Regular />
          </n-icon>
        </template>
      </n-input>

      <n-input
        v-else
        ref="namespaceInputRef"
        size="small"
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
        <n-button-group>
          <n-button
            size="small"
            tertiary
            type="info"
            @click="handleGetJSON"
            :title="`${$t('actions.copy')} JSON`"
          >
            <template #icon><Copy20Regular /></template>
          </n-button>
          <n-popconfirm v-if="!isRoot" @positive-click="$emit('onRemove')">
            <template #trigger>
              <n-button tertiary type="error" size="small">
                <template #icon>
                  <Delete20Regular />
                </template>
              </n-button>
            </template>
            {{ $t('msgs.remove_group') }}
          </n-popconfirm>
          <n-button size="small" secondary @click="isExpand = !isExpand" :title="`Toggle Expand`">
            {{ !isExpand ? '🙈' : '👀' }}
          </n-button>
        </n-button-group>
      </n-space>
    </div>

    <div v-if="isExpand">
      <div class="tr-list" v-if="item.translates && item.translates.length">
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
      </div>

      <div class="actions-wrap">
        <n-button-group v-if="!isLite">
          <n-button size="small" title="Add translate item" type="info" @click="handleAddTranslate">
            <template #icon>
              <Add20Regular />
            </template>
            {{ $t('common.field') }}
          </n-button>
          <n-button
            size="small"
            type="info"
            secondary
            @click="handleAutoAdd"
            :title="`Auto Paste (${intSettingsStore.autoPasteTextConvertMode}) and copy key`"
          >
            <template #icon>
              <ClipboardPaste20Regular />
            </template>
            Auto Paste
          </n-button>
        </n-button-group>
      </div>

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

      <div class="actions-wrap">
        <span class="namespace-display">
          {{ namespacePrefix ? namespacePrefix + '.' : '' }}{{ item.namespace }}</span
        >
        <n-button
          v-if="!isLite"
          type="primary"
          @click="handleAddChildren"
          title="Add translate children group"
        >
          <template #icon>
            <AddSquare20Regular />
          </template>
          {{ $t('common.group') }}
        </n-button>
      </div>
    </div>

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
    border: 1px solid $primary; //darkseagreen;
  }
  &.isKeyDuplicated {
    background-color: rgba(244, 67, 54, 0.1) !important;
  }

  .group-header {
    display: flex;
    align-items: center;

    .mc-error-tip-button {
      margin-right: 8px;
    }
  }

  .tr-list {
    margin-top: 10px;
  }

  .split-line {
    opacity: 0.5;
    border-top: 1px dashed $primary;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .actions-wrap {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .namespace-display {
      opacity: 0.5;
      font-size: 12px;
    }
  }
}
</style>
