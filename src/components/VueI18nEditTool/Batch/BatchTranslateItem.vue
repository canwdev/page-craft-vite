<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _unset from 'lodash/unset'
import {handleReadSelectedFile} from '@/utils/exporter'
import {
  ClipboardPaste20Regular,
  Delete20Regular,
  DocumentEdit20Regular,
  SaveMultiple20Regular,
} from '@vicons/fluent'
import DialogTextEdit from '@/components/CommonUI/DialogTextEdit.vue'
import {useI18n} from 'vue-i18n'
import {readClipboardData} from '@/utils'
import {textConvertAdvanced} from '@/components/VueI18nEditTool/copy-enum'
import {useI18nToolSettingsStore} from '@/store/i18n-tool-settings'
import FieldEdit from '@/components/VueI18nEditTool/Single/FieldEdit.vue'
import {useAutoPasteConvert} from '@/components/VueI18nEditTool/Single/use-auto-paste-convert'
// import countryCodeEmoji from '@/utils/country-code-emoji'

/**
 * 创建文件夹
 * @param directoryHandle
 * @param folderPath 如：pages/solution
 */
async function createFolder(directoryHandle: FileSystemDirectoryHandle, folderPath: string) {
  if (!folderPath) {
    return directoryHandle
  }
  const folders = folderPath.split('/')

  let currentDirectory = directoryHandle

  // 逐级创建文件夹
  for (const folder of folders) {
    currentDirectory = await currentDirectory.getDirectoryHandle(folder, {create: true})
  }

  console.log(`Folder "${folderPath}" created successfully.`)
  return currentDirectory
}

/**
 * 创建文件
 * @param directoryHandle
 * @param filePath 如：pages/solution/live.json，必须提前创建父文件夹
 * @param content
 */
async function createFile(
  directoryHandle: FileSystemDirectoryHandle,
  filePath: string,
  content: string
) {
  // 获取文件的可写入流
  const fileHandle = await directoryHandle.getFileHandle(filePath, {create: true})
  const writable = await fileHandle.createWritable()

  // 将数据写入文件
  await writable.write(content)

  // 关闭文件写入流
  await writable.close()

  console.log(`File "${filePath}" created and written successfully.`)
}

export default defineComponent({
  name: 'BatchTranslateItem',
  components: {
    Delete20Regular,
    FieldEdit,
    DialogTextEdit,
    DocumentEdit20Regular,
    SaveMultiple20Regular,
    ClipboardPaste20Regular,
  },
  props: {
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
    const {t: $t} = useI18n()
    const isLoading = ref(false)
    const intSettingsStore = useI18nToolSettingsStore()
    const {dirItem, filePathArr, translatePath, isFoldersMode} = toRefs(props)

    const findNode = (): DirTreeItem | null => {
      let find: DirTreeItem | null = null
      const recursiveFindItem = (children: DirTreeItem[] | null, dirArr: string[], depth = 0) => {
        const dirName = dirArr[depth]
        if (!children) {
          return
        }
        // console.log('---', depth, dirName)

        for (let i = 0; i < children.length; i++) {
          const child = children[i]
          if (child.label === dirName) {
            if (depth === dirArr.length - 1) {
              find = child
              throw new Error('item found')
            }
          }
          if (child.children) {
            recursiveFindItem(child.children, dirArr, depth + 1)
          }
        }
      }
      try {
        recursiveFindItem(dirItem.value.children, filePathArr.value)
      } catch (e) {
        // console.warn(e)
      }
      return find
    }

    const currentItem = computed(() => {
      if (!isFoldersMode.value) {
        // 单文件读取
        return dirItem.value
      }
      return findNode()
    })

    // 翻译文件的json对象
    let translateObj = shallowRef<any | null>(null)

    // 当前翻译的字段值
    const fieldValue = ref<any>(null)

    // 字段值是否发生变化
    const isChanged = ref(false)

    const getValue = () => {
      return _get(translateObj.value, translatePath.value, null)
    }
    const setValue = (val: any) => {
      try {
        _set(translateObj.value, translatePath.value, val)
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
        throw e
      }
    }
    const deleteField = () => {
      _unset(translateObj.value, translatePath.value)
      fieldValue.value = null
      isChanged.value = true
    }

    const cleanup = () => {
      translateObj.value = null
      fieldValue.value = null
      nextTick(() => {
        isChanged.value = false
      })
    }

    onBeforeUnmount(() => {
      cleanup()
    })
    onMounted(() => {})

    watch(
      currentItem,
      async (value) => {
        if (!value) {
          cleanup()
          return
        }
        const file = await (value.entry as FileSystemFileHandle).getFile()
        const str = await handleReadSelectedFile(file)
        translateObj.value = JSON.parse(str as string)
        fieldValue.value = getValue()
        nextTick(() => {
          isChanged.value = false
        })
      },
      {immediate: true}
    )
    watch(fieldValue, () => {
      isChanged.value = true
    })
    watch(translatePath, (val) => {
      fieldValue.value = getValue()
      nextTick(() => {
        isChanged.value = false
      })
    })

    const handleSaveFile = async () => {
      try {
        isLoading.value = true
        if (!currentItem.value) {
          return
        }
        const fileHandle = currentItem.value.entry as FileSystemFileHandle
        if (!fileHandle) {
          return
        }
        // @ts-ignore
        const writable = await fileHandle.createWritable()

        // console.log('[translateObj.value]', translateObj.value)

        const txt = JSON.stringify(translateObj.value, null, 2)

        await writable.write(txt)
        await writable.close()
        const savedPath = dirItem.value.label + ': ' + fileHandle.name
        console.log('[handleSaveFile]', savedPath)
        window.$message.success(`${savedPath} ` + $t('msgs.saved'))
      } catch (error: any) {
        console.error(error)
        window.$message.error($t('msgs.error') + error.message)
        throw error
      } finally {
        isLoading.value = false
      }
    }

    // const countryFlag = computed(() => {
    //   const code = dirItem.value?.label.split('-').pop()
    //   return countryCodeEmoji(code)
    // })

    const inputRef = ref()

    const isCreatingNotSave = ref(false)
    const createField = (val) => {
      setValue(val)
      fieldValue.value = val
      isCreatingNotSave.value = true

      nextTick(() => {
        inputRef.value.focus()
      })
    }

    const handlePasteFormat = (val) => {
      val = textConvertAdvanced(val, intSettingsStore.autoPasteTextConvertMode, {
        isTrimQuotes: intSettingsStore.autoPasteTrimQuotes,
      })

      return val
    }

    const pasteCreateField = async () => {
      const val: any = await readClipboardData()
      createField(handlePasteFormat(val))
    }

    const saveChange = async ({isEmit = false, isSetValue = false} = {}) => {
      if (!isChanged.value) {
        return
      }
      if (isSetValue) {
        setValue(fieldValue.value)
      }
      await handleSaveFile()
      isChanged.value = false
      if (isEmit) {
        emit('saveChanged')
      }
    }

    const cancelChange = () => {
      if (isCreatingNotSave.value) {
        // 取消创建
        deleteField()
        isCreatingNotSave.value = false
        return
      }
      fieldValue.value = getValue()
      nextTick(() => {
        isChanged.value = false
      })
    }

    const isLocalCreated = ref(false)
    const handleCreateFile = async () => {
      try {
        isLoading.value = true

        if (!dirItem.value) {
          return
        }
        const dirHandle = dirItem.value.entry as FileSystemDirectoryHandle
        if (!dirHandle) {
          return
        }

        const fullPath = filePathArr.value.join('/')
        const folderPath = fullPath.substring(0, fullPath.lastIndexOf('/'))
        const folderHandle = await createFolder(dirHandle, folderPath)

        const txt = JSON.stringify({}, null, 2)
        await createFile(folderHandle, fullPath.substring(fullPath.lastIndexOf('/') + 1), txt)

        window.$message.success('Created ' + fullPath)
        isLocalCreated.value = true
        setTimeout(() => {
          handleReload()
        })
      } catch (e) {
        console.error(e)
        window.$message.error(e.message)
      } finally {
        isLoading.value = false
      }
    }

    const handleReload = () => {
      const btn = document.querySelector('.js_reload_btn')
      // @ts-ignore
      btn && btn.click()
    }

    const isShowArrayEdit = ref(false)
    const currentArrayString = ref<string>('')
    watch(isShowArrayEdit, (val) => {
      if (!val) {
        currentArrayString.value = ''
      }
    })
    const handlePreviewArrayText = () => {
      currentArrayString.value = JSON.stringify(fieldValue.value, null, 2)
      isShowArrayEdit.value = true
    }
    const handleSaveArray = (val) => {
      try {
        fieldValue.value = JSON.parse(val)
        isShowArrayEdit.value = false
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
      }
    }
    const handleDeleteField = () => {
      deleteField()
      saveChange()
    }

    return {
      intSettingsStore,
      currentItem,
      translateObj,
      fieldValue,
      isChanged,
      createField,
      pasteCreateField,
      saveChange,
      cancelChange,
      inputRef,
      // countryFlag,
      isLocalCreated,
      handleCreateFile,
      handleReload,

      isShowArrayEdit,
      currentArrayString,
      handlePreviewArrayText,
      handleSaveArray,
      handleDeleteField,
      isLoading,
    }
  },
})
</script>

<template>
  <n-card size="small" class="batch-translate-item">
    <div class="mc-loading-container" v-if="isLoading">
      <n-spin size="small" />
    </div>

    <div class="card-header">
      <div>
        <span class="card-title">
          <span class="text-red">{{ dirItem.label }}</span>
          <template v-if="isFoldersMode">
            {{ '/' + filePathArr.join('/') }}
          </template>
        </span>
        <span class="translate-path">
          {{ translatePath }}
        </span>
      </div>

      <template v-if="currentItem && fieldValue !== null">
        <n-popconfirm @positive-click="handleDeleteField">
          <template #trigger>
            <n-button size="small" tertiary type="error" title="Delete Field">
              <template #icon>
                <Delete20Regular />
              </template>
            </n-button>
          </template>
          {{ $t('msgs.remove_item') }}
        </n-popconfirm>
      </template>
    </div>

    <div class="tip-not-exist" v-if="!currentItem">
      <template v-if="isLocalCreated">
        <n-button secondary size="small" @click="handleReload">
          {{ $t('actions.reload') }}
        </n-button>
      </template>
      <template v-else>
        File does not exist, please
        <b style="text-decoration: underline; cursor: pointer" @click="handleCreateFile">
          create it
        </b>
        on your local file system
      </template>
    </div>
    <template v-else-if="translatePath">
      <n-space v-if="fieldValue !== null" align="center" size="small">
        <FieldEdit ref="inputRef" v-model="fieldValue" @previewArray="handlePreviewArrayText" />

        <n-button-group v-if="isChanged">
          <n-button
            size="small"
            type="primary"
            @click="saveChange({isEmit: true, isSetValue: true})"
            title="Batch Save"
          >
            <template #icon><SaveMultiple20Regular /></template>
          </n-button>
          <n-button secondary size="small" @click="cancelChange">
            {{ $t('actions.cancel') }}
          </n-button>
        </n-button-group>
      </n-space>
      <n-button-group v-else>
        <n-button
          size="small"
          @click="pasteCreateField()"
          type="primary"
          :title="`Auto Paste Create (${intSettingsStore.autoPasteTextConvertMode})`"
        >
          <template #icon>
            <ClipboardPaste20Regular />
          </template>
        </n-button>
        <n-button size="small" @click="createField('')" type="primary">{{
          $t('actions.create_text')
        }}</n-button>
        <n-button size="small" @click="createField([])">{{ $t('actions.create_array') }}</n-button>
      </n-button-group>
    </template>
    <div style="color: gray" v-else>{{ $t('msgs.please_select_a_tran') }}</div>

    <DialogTextEdit
      v-if="isShowArrayEdit"
      is-textarea
      :title="$t('common.array_detail')"
      :placeholder="$t('common.array_json_string')"
      v-model:visible="isShowArrayEdit"
      :text="currentArrayString"
      @onSave="handleSaveArray"
    />
  </n-card>
</template>

<style lang="scss">
.batch-translate-item {
  margin-bottom: 10px;
  position: relative;

  :deep(.n-card__content) {
    padding: 10px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    margin-bottom: 5px;
    .card-title {
      font-size: 14px;
      font-weight: 400;
    }
    .text-red {
      color: #f44336;
      font-weight: 500;
    }
  }

  .translate-path {
    max-width: 200px;
    font-size: 12px;
    opacity: 0.3;
    margin-left: 10px;
  }

  .item-value-edit {
    width: 450px;
    &._button {
      width: 200px;
    }
  }

  .tip-not-exist {
    color: $primary;
    margin-bottom: 10px;
  }
}
</style>
