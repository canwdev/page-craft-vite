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
import {copyToClipboard} from '@/utils'
import {ClipboardPaste20Regular, Delete20Regular} from '@vicons/fluent'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'
import FieldEdit from '@/components/VueI18nEditTool/Single/FieldEdit.vue'

export default defineComponent({
  name: 'TranslateItem',
  components: {
    FieldEdit,
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
      isKeyDuplicated,
      valueInputRef,
    }
  },
})
</script>

<template>
  <div :data-id="item.key" v-if="item" class="translate-item" :class="{isLite, isKeyDuplicated}">
    <n-space size="small" justify="space-between">
      <n-space size="small" align="center">
        <template v-if="isKeyDuplicated">
          <div class="mc-error-tip-button" title="Key duplicated, may cause bug!">!</div>
        </template>
        <n-input
          size="small"
          class="font-code translate-item-input"
          v-model:value="item.key"
          placeholder="key"
          @click="handleInputKeyClick"
          @blur="handleKeyBlur"
          :readonly="isLite"
        />

        <!--        <div>A</div>-->

        <template v-if="!isLite">
          <FieldEdit
            ref="valueInputRef"
            v-model="item.value"
            @onValueBlur="handleValueBlur"
            @previewArray="$emit('previewArray', item)"
          />
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
  </div>
</template>

<style lang="scss">
.translate-item {
  margin-left: -10px;
  padding-left: 10px;
  margin-right: -10px;
  padding-right: 10px;
  padding-top: 4px;
  padding-bottom: 4px;

  &.isLite {
    padding-top: 4px;
    padding-bottom: 4px;
  }

  &.isKeyDuplicated {
    background-color: rgba(255, 235, 59, 0.1) !important;
  }

  &:hover {
    transition: none;
    background-color: $primary_opacity;
  }
  .i18n-badge {
    //user-select: all;
  }
  .item-value-edit {
    width: 350px;
  }
}
</style>
