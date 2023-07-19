<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {
  formatI18nKey,
  I18N_JSON_OBJ_ROOT_KEY_NAME,
  ITranslateItem,
  ITranslateTreeItem,
} from '@/enum/vue-i18n-tool'
import {copyToClipboard} from '@/utils'
import {Delete20Regular, Globe16Regular} from '@vicons/fluent'

export default defineComponent({
  name: 'TranslateItem',
  components: {
    Globe16Regular,
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
  },
  emits: ['onRemove', 'previewArray', 'onKeyClick'],
  setup(props, {emit}) {
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
      handleInputKeyClick(event) {
        emit('onKeyClick', nameDisplay.value, event)
      },
      valType,
    }
  },
})
</script>

<template>
  <n-list-item size="small" v-if="item" class="translate-item" :class="{isLite}">
    <n-space size="small" justify="space-between">
      <n-space size="small" align="center">
        <n-input
          size="small"
          class="font-code translate-item-input"
          v-model:value="item.key"
          placeholder="key"
          @click="handleInputKeyClick"
        />
        <template v-if="!isLite">
          <n-input-number
            v-if="valType === 'number'"
            v-model:value="item.value"
            placeholder="number value"
            size="small"
            class="item-value-edit"
            @blur="handleBlur"
          />
          <n-input
            v-else-if="!Array.isArray(item.value)"
            type="textarea"
            rows="1"
            size="small"
            class="item-value-edit"
            v-model:value="item.value"
            placeholder="text value"
            @blur="handleBlur"
          />
          <n-button
            v-else
            :title="item.value"
            size="small"
            class="item-value-edit"
            @click="$emit('previewArray', item)"
          >
            📝 Array
          </n-button>
        </template>

        <n-space v-if="!isLite && nameDisplay" size="small">
          <n-input
            class="font-code"
            size="small"
            style="width: 300px"
            :value="`$t('${nameDisplay}')`"
            readonly
          />
          <n-button size="small" @click="handleCopy" title="Copy Original $('')"> $() </n-button>
          <n-button size="small" type="info" @click="handleCopy('html')" title="Copy HTML template">
            {{ `\{\{ \}\}` }}
          </n-button>
          <n-button
            size="small"
            type="success"
            @click="handleCopy('v-html')"
            title="Copy v-html template"
          >
            v-html
          </n-button>
          <n-button size="small" type="warning" @click="handleCopy('js')" title="Copy JavaScript">
            this.$t
          </n-button>
        </n-space>

        <n-popconfirm v-if="!isLite" @positive-click="$emit('onRemove')">
          <template #trigger>
            <n-button tertiary style="margin-left: 15px" size="small" type="error">
              <template #icon>
                <Delete20Regular />
              </template>
            </n-button>
            <!--× Del-->
          </template>
          Remove Item?
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
