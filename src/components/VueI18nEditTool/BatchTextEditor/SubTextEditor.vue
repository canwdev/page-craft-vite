<script lang="ts">
import {defineComponent, PropType} from 'vue'
import VueMonaco from '@/components/CommonUI/VueMonaco/index.vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import {useBatchItem} from '@/components/VueI18nEditTool/Batch/batch-hooks'
import {handleReadSelectedFile} from '@/utils/exporter'
import {throttle} from 'throttle-debounce'

export default defineComponent({
  name: 'SubTextEditor',
  components: {VueMonaco},
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    dirItem: {
      type: Object as PropType<DirTreeItem>,
      required: true,
    },
    filePathArr: {
      type: Array as PropType<string[]>,
      default() {
        return []
      },
    },
    translatePath: {
      type: String,
      default: '',
    },
    // 是否为多文件夹模式，如果为否则当作单个文件处理
    isFoldersMode: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['saveChanged'],
  setup(props, {emit}) {
    const {visible} = toRefs(props)
    const {
      isLoading,
      currentItem,
      handleSaveFile,
      isLocalCreated,
      handleCreateFile: _handleCreateFile,
      handleReload,
    } = useBatchItem(props)

    // 值是否发生变化
    const isChanged = ref(false)
    const valueText = ref('')
    const vueMonacoRef = ref()

    const focusEditor = () => {
      setTimeout(() => {
        const eIns = vueMonacoRef.value.getInstance()
        eIns.focus()
      }, 100)
    }

    watch(valueText, () => {
      isChanged.value = true
    })
    watch(visible, (val) => {
      if (val) {
        nextTick(() => {
          vueMonacoRef.value?.resize()
        })
        focusEditor()
      }
    })

    const handleResizeDebounced = throttle(500, false, () => {
      nextTick(() => {
        vueMonacoRef.value?.resize()
      })
    })

    const cleanup = () => {
      valueText.value = ''
      nextTick(() => {
        isChanged.value = false
      })
    }

    onMounted(() => {
      window.addEventListener('resize', handleResizeDebounced)
      nextTick(() => {
        handleResizeDebounced()
      })
    })
    onBeforeUnmount(() => {
      cleanup()
      window.removeEventListener('resize', handleResizeDebounced)
    })

    const updateValueText = async () => {
      const file = await (currentItem.value.entry as FileSystemFileHandle).getFile()

      const str = await handleReadSelectedFile(file)
      valueText.value = str as string

      await nextTick(() => {
        isChanged.value = false
        vueMonacoRef.value?.resize()
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
      await handleSaveFile(valueText.value)
      isChanged.value = false
      if (isEmit) {
        emit('saveChanged')
      }
    }

    const handleCreateFile = async () => {
      await _handleCreateFile(/*async () => {
        await updateValueText()
      }*/)
    }

    return {
      isLoading,
      valueText,
      currentItem,
      vueMonacoRef,
      saveChange,
      isChanged,
      handleCreateFile,
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
      <!--      {{ filePathArr }} <br />
      {{ currentItem }}-->
    </div>
    <div class="editor-content-wrap">
      <div class="tip-not-exist" v-if="!currentItem">
        File does not exist, please
        <b style="text-decoration: underline; cursor: pointer" @click="handleCreateFile">
          create it
        </b>
        on your local file system
      </div>
      <VueMonaco v-else ref="vueMonacoRef" v-model="valueText" language="json" show-line-numbers />
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
  }
  .editor-content-wrap {
    flex: 1;
    overflow: hidden;
  }

  .tip-not-exist {
    color: $primary;
    margin: 10px;
  }
}
</style>
