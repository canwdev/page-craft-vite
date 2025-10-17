<script lang="ts">
import type { PropType } from 'vue'
import type {
  ITranslateTreeItem,
} from '@/enum/vue-i18n-tool'
import { defineComponent } from 'vue'
import DialogTextEdit from '@/components/CommonUI/DialogTextEdit.vue'
import CcFlag from '@/components/VueI18nEditTool/CcFlag.vue'
import { useArrayEdit } from '@/components/VueI18nEditTool/Single/hooks/use-array-edit'
import TranslateItem from '@/components/VueI18nEditTool/Single/TranslateItem.vue'

import { useI18nMainStore } from '@/components/VueI18nEditTool/store/i18n-tool-main'
import { useI18nToolSettingsStore } from '@/components/VueI18nEditTool/store/i18n-tool-settings'
import {
  exportI18nTreeJsonObj,
  formatTranslateItem,
  formatTranslateTreeItem,
} from '@/enum/vue-i18n-tool'
import { useSettingsStore } from '@/store/settings'
import { copyToClipboard, guid, readClipboardData } from '@/utils'
import {
  textConvertAdvanced,
} from '@/utils/mc-utils/text-convert'

export default defineComponent({
  name: 'TranslateTreeItem',
  components: {
    CcFlag,
    TranslateItem,
    DialogTextEdit,
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
    const { item, index, title } = toRefs(props)
    const i18nMainStore = useI18nMainStore()
    const i18nSetStore = useI18nToolSettingsStore()
    const settingsStore = useSettingsStore()

    const handleAddChildren = () => {
      i18nMainStore.trIsManualAdd = true
      item.value.children.push(formatTranslateTreeItem({ parent: item.value }))
    }
    const handleAddTranslate = () => {
      i18nMainStore.trIsManualAdd = true
      item.value.translates.push(formatTranslateItem())
    }

    // 自动粘贴剪贴板的值，并自动复制翻译key值
    const handleAutoAdd = async () => {
      let val: any = await readClipboardData()

      val = textConvertAdvanced(val, i18nSetStore.autoPasteTextConvertMode, {
        isTrimQuotes: i18nSetStore.autoPasteTrimQuotes,
      })

      // 生成guid用来区分
      i18nMainStore.trAutoAddGuid = guid()
      item.value.translates.push(
        formatTranslateItem({
          key: i18nMainStore.trAutoAddGuid,
          value: val,
        }),
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
      if (i18nMainStore.trIsManualAdd) {
        // 自动选择value输入框
        if (namespaceInputRef.value) {
          namespaceInputRef.value.focus()
        }
        i18nMainStore.trIsManualAdd = false
      }
    })

    const ccName = computed(() => {
      const txt = title.value
      if (txt) {
        if (txt.includes('/')) {
          return txt.split('/')[0]
        }
        else if (txt.includes('.')) {
          return txt.split('.')[0]
        }
      }
    })

    const rootRef = ref()
    const toggleExpand = () => {
      isExpand.value = !isExpand.value
      setTimeout(() => {
        rootRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }
    const scrollToItemTop = () => {
      if (rootRef.value) {
        rootRef.value.scrollIntoView({ behavior: 'smooth' })
      }
    }

    return {
      i18nSetStore,
      settingsStore,
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
      toggleExpand,
      rootRef,
      isKeyDuplicated,
      checkDuplicatedGroupKey,
      namespacePrefix,
      namespaceInputRef,
      ccName,
      scrollToItemTop,
      ...useArrayEdit(),
    }
  },
})
</script>

<template>
  <div
    v-if="item"
    ref="rootRef"
    class="vgo-panel vgo-window-panel translate-tree-item"
    :class="{ isKeyDuplicated }"
  >
    <div class="group-header vgo-bg">
      <template v-if="isKeyDuplicated">
        <div class="mc-error-tip-button" title="Group namespace duplicated, may cause bug!">
          !
        </div>
      </template>

      <div v-if="isRoot" class="namespace-input-wrap font-code">
        <CcFlag v-if="i18nSetStore.enableFlag" :cc="ccName" @click="scrollToItemTop" />
        <span v-else style="color: #f44336" class="namespace-prefix" @click="scrollToItemTop">
          §
        </span>
        <input
          ref="namespaceInputRef"
          class="font-code vgo-input"
          :value="title || item.namespace"
          placeholder="namespace"
          style="flex: 1"
          :readonly="isLite"
          disabled
          @blur="checkDuplicatedGroupKey"
        >
      </div>

      <div v-else class="namespace-input-wrap font-code">
        <span class="namespace-prefix" @click="scrollToItemTop">
          § <template v-if="!isLite">{{ namespacePrefix + (namespacePrefix ? '.' : '') }}</template>
        </span>
        <input
          ref="namespaceInputRef"
          v-model="item.namespace"
          class="font-code vgo-input"
          placeholder="namespace"
          style="flex: 1"
          :disabled="isLite"
          @blur="checkDuplicatedGroupKey"
        >
      </div>
      <div class="actions-buttons-wrap vgo-button-group">
        <template v-if="!isLite">
          <button class="vgo-button" :title="`${$t('actions.copy')} JSON`" @click="handleGetJSON">
            <span class="mdi mdi-content-copy" />
          </button>

          <el-popconfirm
            v-if="!isRoot"
            :title="$t('msgs.remove_item')"
            :teleported="false"
            @confirm="$emit('onRemove')"
          >
            <template #reference>
              <button class="vgo-button danger" :title="$t('msgs.remove_group')">
                <span class="mdi mdi-delete" />
              </button>
            </template>
          </el-popconfirm>
        </template>
        <button title="Toggle Expand" class="vgo-button" @click="toggleExpand">
          <span v-if="isExpand" class="mdi mdi-chevron-up" />
          <span v-else class="mdi mdi-chevron-down" />
        </button>
      </div>
    </div>

    <div v-if="isExpand" class="group-content">
      <div v-if="item.translates && item.translates.length" class="tr-list">
        <TranslateItem
          v-for="(vi, vIndex) in item.translates"
          :key="vIndex"
          :item="vi"
          :tree-item="item"
          :index="vIndex"
          :is-lite="isLite"
          @preview-array="handlePreviewArray"
          @on-remove="handleRemoveItem(vIndex)"
          @on-key-click="(...args) => $emit('onKeyClick', ...args)"
        />
      </div>

      <div class="actions-wrap">
        <div v-if="!isLite" class="actions-buttons-wrap vgo-button-group">
          <button title="Add translate item" class="vgo-button" @click="handleAddTranslate">
            <span class="mdi mdi-plus" />
            {{ $t('common.field') }}
          </button>
          <button
            :title="`${$t('msgs.auto_paste_and_copy')} (${i18nSetStore.autoPasteTextConvertMode})`"
            class="vgo-button primary js_focus_auto_action"
            @click="handleAutoAdd"
          >
            <span class="mdi mdi-content-paste" />

            {{ $t('msgs.auto_paste') }}
            <span
              v-if="settingsStore.enableFocusAutoAction"
              class="js-focus-auto-action-tip"
            />
          </button>
        </div>
      </div>

      <div class="split-line" />

      <template v-if="item.children && item.children.length">
        <TranslateTreeItem
          v-for="(vi, index) in item.children"
          :key="index"
          :item="vi"
          :index="index"
          :is-root="false"
          :is-lite="isLite"
          @on-remove="handleRemoveTreeItem(index)"
          @preview-array="handlePreviewArray"
          @on-key-click="(...args) => $emit('onKeyClick', ...args)"
        />
      </template>

      <div class="actions-wrap">
        <span class="namespace-display font-code font-italic">
          {{ namespacePrefix ? `${namespacePrefix}.` : '' }}{{ item.namespace }}</span>

        <div class="actions-wrap-side">
          <button
            v-if="!isLite"
            title="Add translate children group"
            class="vgo-button primary"
            @click="handleAddChildren"
          >
            <span class="mdi mdi-plus-box" />
            {{ $t('common.group') }}
          </button>
        </div>
      </div>
    </div>

    <DialogTextEdit
      v-if="isShowArrayEdit"
      v-model:visible="isShowArrayEdit"
      is-textarea
      :title="$t('common.array_detail')"
      placeholder="Array JSON String"
      :text="currentArrayString"
      @on-save="handleSaveArray"
    />
  </div>
</template>

<style lang="scss">
.translate-tree-item {
  margin-top: 10px;
  margin-bottom: 10px;
  box-shadow: none !important;
  position: relative;
  $padding: 8px;
  padding: $padding;
  // scrollIntoView 滚动偏移量
  scroll-margin-top: 50px;

  &:hover {
    transition: none;
    border: 1px solid var(--vgo-primary);
    & > .group-header {
    }
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
      color: var(--vgo-primary);
      cursor: pointer;
      user-select: none;
    }
  }

  .group-header {
    display: flex;
    align-items: center;
    gap: 8px;
    position: sticky;
    top: 33px;
    z-index: 1;
    margin-left: -$padding;
    margin-right: -$padding;
    margin-top: -$padding;
    padding: $padding;
    outline: 1px solid var(--vgo-primary);

    .mc-error-tip-button {
      margin-right: 8px;
    }
  }

  .tr-list {
    margin-top: 10px;
  }

  .split-line {
    opacity: 0.5;
    border-top: 1px dashed var(--vgo-primary);
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .actions-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;

    .namespace-display {
      opacity: 0.5;
      font-size: 12px;
    }

    .actions-wrap-side {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
}
</style>
