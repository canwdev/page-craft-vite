<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {
  CopyMode,
  copyModeOptions,
  formatI18nKey,
  I18N_JSON_OBJ_ROOT_KEY_NAME,
  ITranslateItem,
  ITranslateTreeItem,
} from '@/enum/vue-i18n-tool'
import {copyToClipboard, readClipboardData} from '@/utils'
import {ClipboardPaste20Regular, Delete20Regular} from '@vicons/fluent'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'

export default defineComponent({
  name: 'TranslateItem',
  components: {
    ClipboardPaste20Regular,
    Delete20Regular,
  },
  props: {
    item: {
      type: Object as PropType<ITranslateItem>,
      default: null,
    },
    treeItem: {
      type: Object as PropType<ITranslateTreeItem>,
      default: null,
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
  emits: ['onRemove', 'previewArray', 'onKeyClick'],
  setup(props, {emit}) {
    const {t: $t} = useI18n()
    const mainStore = useMainStore()
    const {item, treeItem, index} = toRefs(props)

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
      if (!item.value || (!item.value.value && !item.value.key)) {
        return ''
      }
      let name = item.value.key
      if (namespacePrefix.value) {
        name = namespacePrefix.value + '.' + name
      }
      const regex = new RegExp(I18N_JSON_OBJ_ROOT_KEY_NAME + '.', 'g')
      name = name.replace(regex, '')
      return name
    })

    const valType = ref<string | null>(null)
    watch(
      item,
      (val) => {
        if (!val) {
          valType.value = null
          return
        }
        valType.value = typeof val.value
      },
      {immediate: true}
    )

    // 检查重复键
    const isKeyDuplicated = ref(false)
    const checkDuplicatedKey = () => {
      isKeyDuplicated.value = false
      const list = treeItem.value?.translates || []
      for (let i = 0; i < list.length; i++) {
        const _item = list[i]
        if (index.value !== i && _item.key === item.value.key) {
          isKeyDuplicated.value = true
          break
        }
      }
    }

    // 一键复制模板
    const highlightCopyMode = ref<CopyMode | null>(null)
    const handleCopy = (mode: CopyMode) => {
      let text = ``

      if (mode === CopyMode.ORIGINAL) {
        text = `$t('${nameDisplay.value}')`
      } else if (mode === CopyMode.TEMPLATE) {
        text = `{{ $t('${nameDisplay.value}') }}`
      } else if (mode === CopyMode.VHTML) {
        text = `v-html="$t('${nameDisplay.value}')"`
      } else if (mode === CopyMode.DOLLART) {
        text = `this.$t('${nameDisplay.value}')`
      }

      highlightCopyMode.value = mode
      mainStore.trLastCopyMode = mode

      copyToClipboard(text)
      window.$message.success($t('msgs.copy_success') + text)
    }

    const handleValueBlur = () => {
      if (!item.value.key) {
        item.value.key = formatI18nKey(item.value.value)
        checkDuplicatedKey()
      }
    }

    const valueInputRef = ref()

    onMounted(() => {
      if (!item.value) {
        return
      }

      // 如果相同，说明正在执行 handleAutoAdd 操作
      if (mainStore.trAutoAddGuid !== null && item.value.key === mainStore.trAutoAddGuid) {
        mainStore.trAutoAddGuid = null
        item.value.key = ''
        handleValueBlur()
        setTimeout(() => {
          handleCopy(mainStore.trLastCopyMode)
        })
      } else if (mainStore.trIsManualAdd) {
        // 自动选择value输入框
        if (valueInputRef.value) {
          valueInputRef.value.focus()
        }
        mainStore.trIsManualAdd = false
      }
    })

    const handlePaste = async () => {
      item.value.value = await readClipboardData()
      setTimeout(() => {
        handleValueBlur()
      })
    }

    return {
      copyModeOptions,
      namespacePrefix,
      nameDisplay,
      highlightCopyMode,
      handleCopy,
      handleValueBlur,
      handleKeyBlur() {
        checkDuplicatedKey()
      },
      handleInputKeyClick(event) {
        emit('onKeyClick', nameDisplay.value, event)
      },
      valType,
      isKeyDuplicated,
      valueInputRef,
      handlePaste,
    }
  },
})
</script>

<template>
  <n-list-item
    :data-id="item.key"
    size="small"
    v-if="item"
    class="translate-item"
    :class="{isLite, isKeyDuplicated}"
  >
    <n-space size="small" justify="space-between">
      <n-space size="small" align="center">
        <template v-if="isKeyDuplicated">
          <n-tooltip trigger="hover">
            <template #trigger>
              <div class="error-tip-button">!</div>
            </template>
            Key duplicated, may cause bug!
          </n-tooltip>
        </template>
        <n-input
          size="small"
          class="font-code translate-item-input jssl_key"
          v-model:value="item.key"
          placeholder="key"
          @click="handleInputKeyClick"
          @blur="handleKeyBlur"
        />
        <template v-if="!isLite">
          <n-input-number
            ref="valueInputRef"
            v-if="valType === 'number'"
            v-model:value="item.value"
            placeholder="number value"
            size="small"
            class="item-value-edit jssl_value"
            @blur="handleValueBlur"
          />
          <n-input-group v-else-if="!Array.isArray(item.value)">
            <n-input
              ref="valueInputRef"
              type="textarea"
              rows="1"
              size="small"
              class="item-value-edit"
              v-model:value="item.value"
              placeholder="text value"
              clearable
              @blur="handleValueBlur"
            />
            <n-button @click="handlePaste" secondary size="small" type="info" title="Paste">
              <template #icon>
                <ClipboardPaste20Regular />
              </template>
            </n-button>
          </n-input-group>
          <n-button
            v-else
            :title="item.value"
            size="small"
            class="item-value-edit"
            @click="$emit('previewArray', item)"
          >
            📝 {{ $t('common.array') }}
          </n-button>
        </template>

        <n-button-group v-if="!isLite && nameDisplay" size="small">
          <!-- 一键复制按钮 -->
          <n-button
            v-for="item in copyModeOptions"
            :key="item.value"
            :title="item.desc"
            size="small"
            :secondary="item.value !== highlightCopyMode"
            type="success"
            @click="handleCopy(item.value)"
          >
            {{ item.label }}
          </n-button>
        </n-button-group>

        <n-popconfirm v-if="!isLite" @positive-click="$emit('onRemove')">
          <template #trigger>
            <n-button tertiary size="small" type="error">
              <template #icon>
                <Delete20Regular />
              </template>
            </n-button>
            <!--× Del-->
          </template>
          {{ $t('msgs.remove_item') }}
        </n-popconfirm>
      </n-space>
      <n-space> </n-space>
    </n-space>
  </n-list-item>
</template>

<style lang="scss" scoped>
.translate-item {
  margin-left: -10px;
  padding-left: 10px;
  margin-right: -10px;
  padding-right: 10px;

  &.isLite {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  &.isKeyDuplicated {
    background-color: rgba(255, 235, 59, 0.1) !important;
  }

  &:hover {
    transition: none;
    background-color: rgba(147, 147, 147, 0.2);
  }
  .i18n-badge {
    //user-select: all;
  }
  .item-value-edit {
    width: 350px;
  }
}
</style>
