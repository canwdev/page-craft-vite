<script lang="ts">
import {defineComponent, PropType, ref} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import {useBatchItemV2} from '@/components/VueI18nEditTool/BatchGUI/hooks/batch-hooks'
import {BatchListItem, useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import VueJsonEditor from '@/components/CommonUI/VueJsonEditor.vue'
import {useMainStore} from '@/store/main'
import VueMonaco from '@/components/CommonUI/VueMonaco/index.vue'

export default defineComponent({
  name: 'SubTextItem',
  components: {VueMonaco, VueJsonEditor},
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    isMonacoEditor: {
      type: Boolean,
      default: false,
    },
    listItem: {
      type: Object as PropType<BatchListItem>,
      required: true,
    },
    translatePath: {
      type: String,
      default: '',
    },
  },
  emits: ['saveChanged'],
  setup(props, {emit}) {
    const {visible, listItem} = toRefs(props)
    const i18nMainStore = useI18nMainStore()
    const {isLoading, handleSaveFile, handleCreateFile, subFilePathArr} = useBatchItemV2(props)
    const mainStore = useMainStore()

    const vueMonacoRef = ref()
    const autoFocusEditor = () => {
      if (vueMonacoRef.value) {
        setTimeout(() => {
          vueMonacoRef.value.resize()
          vueMonacoRef.value.focus()
        })
      }
    }

    watch(visible, (val) => {
      if (val) {
        autoFocusEditor()
      }
    })

    const localText = shallowRef('')

    // 值是否发生变化
    const isChanged = computed(() => {
      return i18nMainStore.changedLabelMap[listItem.value.rootDir.label]
    })

    const setChanged = (flag: boolean) => {
      i18nMainStore.changedLabelMap[listItem.value.rootDir.label] = flag
    }

    const cleanup = () => {
      isRefreshing.value = true
      localText.value = ''
      nextTick(() => {
        setChanged(false)
        isRefreshing.value = false
      })
    }

    const isRefreshing = ref(true)
    const updateLocalJson = async () => {
      isRefreshing.value = true

      localText.value = JSON.stringify(listItem.value.json, null, 2)

      await nextTick(() => {
        setChanged(false)
        isRefreshing.value = false
        autoFocusEditor()
      })
    }

    watch(
      listItem,
      async (value) => {
        if (!value) {
          cleanup()
          return
        }
        await updateLocalJson()
      },
      {immediate: true}
    )

    const saveChange = async ({isEmit = false} = {}) => {
      if (!isChanged.value) {
        return
      }
      if (isLoading.value) {
        return
      }
      try {
        isLoading.value = true
        console.log('[saveChange]', localText.value)

        if (!listItem.value.json) {
          await handleCreateFile({
            initText: localText.value,
          })
        } else {
          const text = localText.value
          await handleSaveFile(text)
          listItem.value.json = JSON.parse(text)
        }

        setChanged(false)
        if (isEmit) {
          emit('saveChanged')
        }
      } finally {
        isLoading.value = false
      }
      if (!isChanged.value) {
        return
      }
    }

    const handleChange = (text) => {
      localText.value = text
      // console.log('[handleChange]', localText.value)
      setChanged(true)
    }

    const handleJsonEditorChange = (data) => {
      // console.log('[handleChange]', data)
      if (data.text) {
        handleChange(data.text)
      } else if (data.json) {
        handleChange(JSON.stringify(data.json, null, 2))
      }
    }

    return {
      isLoading,
      localText,
      saveChange,
      isChanged,
      subFilePathArr,
      handleChange,
      isRefreshing,
      mainStore,
      vueMonacoRef,
      handleJsonEditorChange,
    }
  },
})
</script>

<template>
  <div v-show="visible" class="sub-text-editor">
    <div class="mc-loading-container" v-if="isLoading">
      <n-spin size="small" />
    </div>

    <div class="editor-action-row">
      <button class="vp-button primary" :disabled="!isChanged" @click="saveChange({isEmit: true})">
        Save All
      </button>

      <span class="path-tip">
        <span class="_primary">{{ listItem.rootDir.label }}</span
        >/{{ subFilePathArr.join('/') }}

        <span v-if="!listItem.json" class="_error">File not exist!</span>
      </span>
    </div>
    <div v-if="!isRefreshing" class="editor-content-wrap">
      <VueMonaco
        v-if="isMonacoEditor"
        ref="vueMonacoRef"
        :model-value="localText"
        @update:model-value="handleChange"
        language="json"
        show-line-numbers
      />
      <VueJsonEditor
        v-else
        ref="editorRef"
        :dark="mainStore.isAppDarkMode"
        :options="{
          content: {
            text: localText,
          },
          onChange: handleJsonEditorChange,
        }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-text-editor {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;

  .editor-action-row {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
  }
  .editor-content-wrap {
    flex: 1;
    overflow: hidden;
  }

  .path-tip {
    padding: 0 8px;
    ._primary {
      color: $primary;
    }
    ._error {
      color: #f44336;
    }
  }
}
</style>
