<script lang="ts">
import {defineComponent, PropType, ref} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import {useBatchItem} from '@/components/VueI18nEditTool/BatchGUI/batch-hooks'
import {handleReadSelectedFile} from '@/utils/exporter'
import {useI18nMainStore} from '@/store/i18n-tool-main'
import VueJsonEditor from '@/components/CommonUI/VueJsonEditor.vue'

export default defineComponent({
  name: 'SubTextItem',
  components: {VueJsonEditor},
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    dirItem: {
      type: Object as PropType<DirTreeItem>,
      required: true,
    },
    translatePath: {
      type: String,
      default: '',
    },
  },
  emits: ['saveChanged'],
  setup(props, {emit}) {
    const {visible, dirItem} = toRefs(props)
    const i18nMainStore = useI18nMainStore()
    const {
      isLoading,
      currentItem,
      handleSaveFile,
      isLocalCreated,
      handleCreateFile,
      handleReload,
      subFilePathArr,
    } = useBatchItem(props)

    const editorRef = shallowRef()
    const valueObj = ref({})

    const expandEditor = () => {
      if (editorRef.value) {
        editorRef.value.jsonEditor.expand((path) => true)
      }
    }
    onMounted(expandEditor)

    // 值是否发生变化
    const isChanged = computed(() => {
      return i18nMainStore.changedLabelMap[dirItem.value.label]
    })

    const setChanged = (flag: boolean) => {
      i18nMainStore.changedLabelMap[dirItem.value.label] = flag
    }

    const cleanup = () => {
      isRefreshing.value = true
      valueObj.value = {}
      nextTick(() => {
        setChanged(false)
        isRefreshing.value = false
      })
    }

    const isRefreshing = ref(true)
    const updateValueText = async () => {
      isRefreshing.value = true
      const file = await (currentItem.value.entry as FileSystemFileHandle).getFile()

      const str = await handleReadSelectedFile(file)
      valueObj.value = JSON.parse(str as string)

      await nextTick(() => {
        setChanged(false)
        expandEditor()
        isRefreshing.value = false
      })
    }

    watch(
      currentItem,
      async (value) => {
        if (!value) {
          cleanup()
          return
        }
        await updateValueText()
      },
      {immediate: true}
    )

    const saveChange = async ({isEmit = false} = {}) => {
      if (!isChanged.value) {
        return
      }
      console.log('[saveChange]', valueObj.value)

      if (!currentItem.value) {
        await handleCreateFile({
          initObj: valueObj.value,
        })
      } else {
        await handleSaveFile(JSON.stringify(valueObj.value, null, 2))
      }

      setChanged(false)
      if (isEmit) {
        emit('saveChanged')
      }
    }

    const handleChange = (v) => {
      console.log(v)
      valueObj.value = v.json
      setChanged(true)
    }

    return {
      isLoading,
      valueObj,
      currentItem,
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
        <span class="_primary">{{ dirItem.label }}</span
        >/{{ subFilePathArr.join('/') }}

        <span v-if="!currentItem" class="_error">File not exist!</span>
      </span>
    </div>
    <div class="editor-content-wrap">
      <VueJsonEditor
        v-if="!isRefreshing"
        ref="editorRef"
        dark
        :options="{
          content: {
            json: valueObj,
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
