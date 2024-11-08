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

import {useMainStore} from '@/store/main'
import {useI18nToolSettingsStore} from '@/components/VueI18nEditTool/store/i18n-tool-settings'
import {
  textConvertMultipleLine,
  textConvertAdvanced,
  TextConvertMode,
} from '@/utils/mc-utils/text-convert'
import {useArrayEdit} from '@/components/VueI18nEditTool/Single/hooks/use-array-edit'
import CcFlag from '@/components/VueI18nEditTool/CcFlag.vue'
import {useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import {useSettingsStore} from '@/store/settings'

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
    const {item, index, title} = toRefs(props)
    const i18nMainStore = useI18nMainStore()
    const i18nSetStore = useI18nToolSettingsStore()
    const settingsStore = useSettingsStore()

    const handleAddChildren = () => {
      i18nMainStore.trIsManualAdd = true
      item.value.children.push(formatTranslateTreeItem({parent: item.value}))
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
        } else if (txt.includes('.')) {
          return txt.split('.')[0]
        }
      }
    })

    const rootRef = ref()
    const toggleExpand = () => {
      isExpand.value = !isExpand.value
      setTimeout(() => {
        rootRef.value.scrollIntoView({behavior: 'smooth', block: 'center'})
      })
    }
    const scrollToItemTop = () => {
      if (rootRef.value) {
        rootRef.value.scrollIntoView({behavior: 'smooth'})
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
    ref="rootRef"
    class="vp-panel vp-window-panel translate-tree-item"
    v-if="item"
    :class="{isKeyDuplicated}"
  >
    <div class="group-header vp-bg">
      <template v-if="isKeyDuplicated">
        <div class="mc-error-tip-button" title="Group namespace duplicated, may cause bug!">!</div>
      </template>

      <div v-if="isRoot" class="namespace-input-wrap font-code">
        <CcFlag @click="scrollToItemTop" v-if="i18nSetStore.enableFlag" :cc="ccName" />
        <span @click="scrollToItemTop" v-else style="color: #f44336" class="namespace-prefix">
          §
        </span>
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
        <span @click="scrollToItemTop" class="namespace-prefix">
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
      <div class="actions-buttons-wrap vp-button-group">
        <template v-if="!isLite">
          <button class="vp-button" @click="handleGetJSON" :title="`${$t('actions.copy')} JSON`">
            <span class="mdi mdi-content-copy"></span>
          </button>

          <el-popconfirm
            v-if="!isRoot"
            @confirm="$emit('onRemove')"
            :title="$t('msgs.remove_item')"
            :teleported="false"
          >
            <template #reference>
              <button class="vp-button danger" :title="$t('msgs.remove_group')">
                <span class="mdi mdi-delete"></span>
              </button>
            </template>
          </el-popconfirm>
        </template>
        <button @click="toggleExpand" :title="`Toggle Expand`" class="vp-button">
          <span v-if="isExpand" class="mdi mdi-chevron-up"></span>
          <span v-else class="mdi mdi-chevron-down"></span>
        </button>
      </div>
    </div>

    <div class="group-content" v-if="isExpand">
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
        <div class="actions-buttons-wrap vp-button-group" v-if="!isLite">
          <button title="Add translate item" @click="handleAddTranslate" class="vp-button">
            <span class="mdi mdi-plus"></span>
            {{ $t('common.field') }}
          </button>
          <button
            @click="handleAutoAdd"
            :title="$t('msgs.auto_paste_and_copy') + ` (${i18nSetStore.autoPasteTextConvertMode})`"
            class="vp-button primary js_focus_auto_action"
          >
            <span class="mdi mdi-content-paste"></span>

            {{ $t('msgs.auto_paste') }}
            <span
              v-if="settingsStore.enableFocusAutoAction"
              class="js-focus-auto-action-tip"
            ></span>
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

        <div class="actions-wrap-side">
          <button
            v-if="!isLite"
            @click="handleAddChildren"
            title="Add translate children group"
            class="vp-button primary"
          >
            <span class="mdi mdi-plus-box"></span>
            {{ $t('common.group') }}
          </button>
        </div>
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
  box-shadow: none !important;
  position: relative;
  $padding: 8px;
  padding: $padding;
  // scrollIntoView 滚动偏移量
  scroll-margin-top: 50px;

  &:hover {
    transition: none;
    border: 1px solid $primary;
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
      color: $primary;
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
    outline: 1px solid $primary;

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
