<script lang="ts">
import {defineComponent, PropType, ref} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import {useBatchItemV2} from '@/components/VueI18nEditTool/BatchGUI/hooks/batch-hooks'
import {BatchListItem, useI18nMainStore} from '@/components/VueI18nEditTool/store/i18n-tool-main'
import VueJsonEditor from '@/components/CommonUI/VueJsonEditor.vue'

export default defineComponent({
  name: 'SubTextItem',
  components: {VueJsonEditor},
  props: {
    visible: {
      type: Boolean,
      default: true,
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
    const {listItem} = toRefs(props)
    const i18nMainStore = useI18nMainStore()
    const {isLoading, handleSaveFile, handleCreateFile, subFilePathArr} = useBatchItemV2(props)

    const editorRef = shallowRef()
    const localJson = shallowRef({})

    // 值是否发生变化
    const isChanged = computed(() => {
      return i18nMainStore.changedLabelMap[listItem.value.rootDir.label]
    })

    const setChanged = (flag: boolean) => {
      i18nMainStore.changedLabelMap[listItem.value.rootDir.label] = flag
    }

    const cleanup = () => {
      isRefreshing.value = true
      localJson.value = {}
      nextTick(() => {
        setChanged(false)
        isRefreshing.value = false
      })
    }

    const isRefreshing = ref(true)
    const updateLocalJson = async () => {
      isRefreshing.value = true

      localJson.value = JSON.parse(JSON.stringify(listItem.value.json))

      await nextTick(() => {
        setChanged(false)
        isRefreshing.value = false
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
      console.log('[saveChange]', localJson.value)

      if (!listItem.value.json) {
        await handleCreateFile({
          initObj: localJson.value,
        })
      } else {
        const text = JSON.stringify(localJson.value, null, 2)
        await handleSaveFile(text)
        listItem.value.json = JSON.parse(text)
      }

      setChanged(false)
      if (isEmit) {
        emit('saveChanged')
      }
    }

    const handleChange = (v) => {
      console.log(v)
      localJson.value = v.json
      setChanged(true)
    }

    return {
      isLoading,
      localJson,
      saveChange,
      isChanged,
      subFilePathArr,
      handleChange,
      editorRef,
      isRefreshing,
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
      <n-button
        size="small"
        type="primary"
        :disabled="!isChanged"
        @click="saveChange({isEmit: true})"
      >
        Save All
      </n-button>

      <span class="path-tip">
        <span class="_primary">{{ listItem.rootDir.label }}</span
        >/{{ subFilePathArr.join('/') }}

        <span v-if="!listItem.json" class="_error">File not exist!</span>
      </span>
    </div>
    <div class="editor-content-wrap">
      <VueJsonEditor
        v-if="!isRefreshing"
        ref="editorRef"
        dark
        :options="{
          content: {
            json: localJson,
          },
          onChange: handleChange,
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
