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
import {useI18nToolSettingsStore} from '@/components/VueI18nEditTool/store/i18n-tool-settings'
import {
  textConvertMultipleLine,
  textConvertAdvanced,
  TextConvertMode,
} from '@/components/VueI18nEditTool/TextConverter/copy-enum'
import {useArrayEdit} from '@/components/VueI18nEditTool/Single/hooks/use-array-edit'
import CcFlag from '@/components/VueI18nEditTool/CcFlag.vue'

export default defineComponent({
  name: 'TranslateTreeItem',
  components: {
    CcFlag,
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
    const {item, index, title} = toRefs(props)
    const mainStore = useMainStore()
    const i18nSetStore = useI18nToolSettingsStore()

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

      val = textConvertAdvanced(val, i18nSetStore.autoPasteTextConvertMode, {
        isTrimQuotes: i18nSetStore.autoPasteTrimQuotes,
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

    const ccName = computed(() => {
      const txt = title.value
      if (txt) {
        if (txt.includes('/')) {
          return txt.split('/')[0]
        } else if (txt.includes('.')) {
          return txt.split('.')[0]
        }
      }
    })

    return {
      i18nSetStore,
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
      ccName,
      ...useArrayEdit(),
    }
  },
})
</script>

<template>
  <div class="vp-panel vp-window-panel translate-tree-item" v-if="item" :class="{isKeyDuplicated}">
    <div class="group-header">
      <template v-if="isKeyDuplicated">
        <n-tooltip trigger="hover">
          <template #trigger>
            <div class="mc-error-tip-button">!</div>
          </template>
          Group namespace duplicated, may cause bug!
        </n-tooltip>
      </template>

      <div v-if="isRoot" class="namespace-input-wrap font-code">
        <CcFlag v-if="i18nSetStore.enableFlag" :cc="ccName" />
        <span v-else style="color: #f44336" class="namespace-prefix"> § </span>
        <input
          ref="namespaceInputRef"
          class="font-code vp-input"
          :value="title || item.namespace"
          placeholder="namespace"
          style="flex: 1"
          :readonly="isLite"
          disabled
          @blur="checkDuplicatedGroupKey"
        />
      </div>

      <div v-else class="namespace-input-wrap font-code">
        <span class="namespace-prefix">
          § <template v-if="!isLite">{{ namespacePrefix + (namespacePrefix ? '.' : '') }}</template>
        </span>
        <input
          ref="namespaceInputRef"
          class="font-code vp-input"
          v-model="item.namespace"
          placeholder="namespace"
          style="flex: 1"
          :disabled="isLite"
          @blur="checkDuplicatedGroupKey"
        />
      </div>
      <div class="actions-buttons-wrap">
        <template v-if="!isLite">
          <button class="vp-button" @click="handleGetJSON" :title="`${$t('actions.copy')} JSON`">
            <Copy20Regular />
          </button>
          <n-popconfirm v-if="!isRoot" @positive-click="$emit('onRemove')">
            <template #trigger>
              <button class="vp-button danger">
                <Delete20Regular />
              </button>
            </template>
            {{ $t('msgs.remove_group') }}
          </n-popconfirm>
        </template>
        <button @click="isExpand = !isExpand" :title="`Toggle Expand`" class="vp-button">
          {{ !isExpand ? '🙈' : '👀' }}
        </button>
      </div>
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
        <div class="actions-buttons-wrap" v-if="!isLite">
          <button title="Add translate item" @click="handleAddTranslate" class="vp-button">
            <Add20Regular />
            {{ $t('common.field') }}
          </button>
          <button
            @click="handleAutoAdd"
            :title="$t('msgs.auto_paste_and_copy') + ` (${i18nSetStore.autoPasteTextConvertMode})`"
            class="vp-button primary focus-auto-action"
          >
            <ClipboardPaste20Regular />
            Auto Paste
          </button>
        </div>
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
        <span class="namespace-display font-code font-italic">
          {{ namespacePrefix ? namespacePrefix + '.' : '' }}{{ item.namespace }}</span
        >
        <button
          v-if="!isLite"
          @click="handleAddChildren"
          title="Add translate children group"
          class="vp-button primary"
        >
          <AddSquare20Regular />
          {{ $t('common.group') }}
        </button>
      </div>
    </div>

    <DialogTextEdit
      is-textarea
      :title="$t('common.array_detail')"
      placeholder="Array JSON String"
      v-model:visible="isShowArrayEdit"
      :text="currentArrayString"
      @onSave="handleSaveArray"
      v-if="isShowArrayEdit"
    />
  </div>
</template>

<style lang="scss">
.translate-tree-item {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  box-shadow: none !important;

  &:hover {
    transition: none;
    border: 1px solid $primary; //darkseagreen;
  }
  &.isKeyDuplicated {
    background-color: rgba(244, 67, 54, 0.1) !important;
  }

  .namespace-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 4px;
    .namespace-prefix {
      color: $primary;
    }
  }

  .group-header {
    display: flex;
    align-items: center;
    gap: 8px;

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
