<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {
  CopyMode,
  formatI18nKey,
  I18N_JSON_OBJ_ROOT_KEY_NAME,
  ITranslateItem,
  ITranslateTreeItem,
} from '@/enum/vue-i18n-tool'
import {copyToClipboard} from '@/utils'
import {useI18n} from 'vue-i18n'
import {useMainStore} from '@/store/main'
import FieldEdit from '@/components/VueI18nEditTool/Single/FieldEdit.vue'
import {useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import CopyButtons from '@/components/VueI18nEditTool/Single/CopyButtons.vue'

export default defineComponent({
  name: 'TranslateItem',
  components: {
    CopyButtons,
    FieldEdit,
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
    const i18nMainStore = useI18nMainStore()
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

    const handleValueBlur = () => {
      if (!item.value.key) {
        item.value.key = formatI18nKey(item.value.value)
        checkDuplicatedKey()
      }
    }

    const valueInputRef = ref()
    const cpButtonsRef = ref()

    onMounted(() => {
      if (!item.value) {
        return
      }

      // 如果相同，说明正在执行 handleAutoAdd 操作
      if (i18nMainStore.trAutoAddGuid !== null && item.value.key === i18nMainStore.trAutoAddGuid) {
        i18nMainStore.trAutoAddGuid = null
        item.value.key = ''
        handleValueBlur()
        setTimeout(() => {
          cpButtonsRef.value?.handleCopy(i18nMainStore.trLastCopyMode)
        })
      } else if (i18nMainStore.trIsManualAdd) {
        // 自动选择value输入框
        if (valueInputRef.value) {
          valueInputRef.value.focus()
        }
        i18nMainStore.trIsManualAdd = false
      }
    })

    return {
      namespacePrefix,
      nameDisplay,
      handleValueBlur,
      handleKeyBlur() {
        checkDuplicatedKey()
      },
      handleInputKeyClick(event) {
        emit('onKeyClick', nameDisplay.value, event)
      },
      isKeyDuplicated,
      valueInputRef,
      cpButtonsRef,
    }
  },
})
</script>

<template>
  <div
    :data-id="item.key"
    v-if="item"
    class="translate-item"
    :class="{isLite, isKeyDuplicated}"
    :data-translate-path="nameDisplay"
  >
    <div class="flex-row-center-gap">
      <template v-if="isKeyDuplicated">
        <div class="mc-error-tip-button" title="Key duplicated, may cause bug!">!</div>
      </template>
      <input
        class="font-code translate-item-input vp-input"
        v-model="item.key"
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

      <CopyButtons ref="cpButtonsRef" v-if="!isLite && nameDisplay" :content="nameDisplay" />

      <el-popconfirm
        v-if="!isLite"
        @confirm="$emit('onRemove')"
        :title="$t('msgs.remove_item')"
        :teleported="false"
      >
        <template #reference>
          <button class="vp-button" :title="$t('actions.delete')">
            <i class="fa fa-trash-o"></i>
          </button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<style lang="scss">
.translate-item {
  margin-left: -10px;
  margin-right: -10px;
  padding: 4px 10px;

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
