<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {DirTreeItem} from '@/enum/vue-i18n-tool'
import _get from 'lodash/get'
import _set from 'lodash/set'
import {handleReadSelectedFile} from '@/utils/exporter'
import {ClipboardPaste20Regular, DocumentEdit20Regular, SaveMultiple20Regular} from '@vicons/fluent'
import DialogTextEdit from '@/components/CommonUI/DialogTextEdit.vue'
import {useI18n} from 'vue-i18n'
import {readClipboardData} from '@/utils'
import {textConvertAdvanced} from '@/components/VueI18nEditTool/copy-enum'
import {useI18nToolSettingsStore} from '@/store/i18n-tool-settings'
// import countryCodeEmoji from '@/utils/country-code-emoji'

/**
 * 创建文件夹
 * @param directoryHandle
 * @param folderPath 如：pages/solution
 */
async function createFolder(directoryHandle: FileSystemDirectoryHandle, folderPath: string) {
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
    const translateObj = shallowRef<any>(null)
    const translateText = ref<string | number | null>(null)
    const isChanged = ref(false)
    const isFieldArray = ref(false)
    const isFieldNumber = ref(false)

    // 判断数据类型，并返回格式化的值
    const getFormatTextType = (val: any) => {
      isFieldArray.value = false
      isFieldNumber.value = false

      if (Array.isArray(val)) {
        isFieldArray.value = true
        // 如果是数组，则返回格式化的字符串
        return JSON.stringify(val, null, 2)
      }
      if (typeof val === 'number') {
        isFieldNumber.value = true
      }
      return val
    }
    const getText = () => {
      const res = _get(translateObj.value, translatePath.value, null)
      return getFormatTextType(res)
    }
    const setText = (val: any = translateText.value) => {
      try {
        if (isFieldArray.value && val) {
          val = JSON.parse(val)
        } else if (isFieldNumber.value) {
          val = Number(val)
        }
        _set(translateObj.value, translatePath.value, val)
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
        throw e
      }
    }

    watch(
      currentItem,
      async (value) => {
        if (!value) {
          translateObj.value = null
          translateText.value = null
          isFieldArray.value = false
          isFieldNumber.value = false
          nextTick(() => {
            isChanged.value = false
          })
          return
        }
        const file = await (value.entry as FileSystemFileHandle).getFile()
        const str = await handleReadSelectedFile(file)
        translateObj.value = JSON.parse(str as string)
        translateText.value = getText()
        nextTick(() => {
          isChanged.value = false
        })
      },
      {immediate: true}
    )
    watch(translateText, () => {
      isChanged.value = true
    })
    watch(translatePath, (val) => {
      translateText.value = getText()
      nextTick(() => {
        isChanged.value = false
      })
    })

    const handleSaveFile = async () => {
      try {
        if (!currentItem.value) {
          return
        }
        const fileHandle = currentItem.value.entry as FileSystemFileHandle
        if (!fileHandle) {
          return
        }
        const file = await fileHandle.getFile()
        // @ts-ignore
        const writable = await fileHandle.createWritable()

        // console.log('[translateObj.value]', translateObj.value)

        const txt = JSON.stringify(translateObj.value, null, 2)

        await writable.write(txt)
        await writable.close()
        window.$message.success($t('msgs.saved'))
      } catch (error: any) {
        console.error(error)
        window.$message.error($t('msgs.error') + error.message)
        throw error
      }
    }

    // const countryFlag = computed(() => {
    //   const code = dirItem.value?.label.split('-').pop()
    //   return countryCodeEmoji(code)
    // })

    const inputRef = ref()
    const isShowArrayEdit = ref(false)

    const createField = (val) => {
      setText('')
      translateText.value = val
      isFieldArray.value = Array.isArray(val)

      nextTick(() => {
        inputRef.value.focus()
      })
    }

    const handlePasteFormat = (val) => {
      val = textConvertAdvanced(val, intSettingsStore.autoPasteTextConvertMode, {
        isTrimQuotes: intSettingsStore.autoPasteTrimQuotes,
      })

      return getFormatTextType(val)
    }

    const handlePaste = async () => {
      const val: any = await readClipboardData()

      translateText.value = handlePasteFormat(val)
    }

    const pasteCreateField = async () => {
      const val: any = await readClipboardData()
      createField(handlePasteFormat(val))
    }

    const saveChange = async ({isEmit = false} = {}) => {
      if (!isChanged.value) {
        return
      }
      setText()
      await handleSaveFile()
      nextTick(() => {
        isChanged.value = false
      })
      if (isEmit) {
        emit('saveChanged')
      }
    }

    const cancelChange = () => {
      translateText.value = getText()
      nextTick(() => {
        isChanged.value = false
      })
    }

    const handleSaveArray = (val) => {
      try {
        JSON.parse(val) // validate only
        translateText.value = val
        isShowArrayEdit.value = false
      } catch (e: any) {
        console.error(e)
        window.$message.error(e.message)
      }
    }

    const isLocalCreated = ref(false)
    const handleCreateFile = async () => {
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
    }

    const handleReload = () => {
      const btn = document.querySelector('.js_reload_btn')
      // @ts-ignore
      btn && btn.click()
    }

    return {
      currentItem,
      translateObj,
      translateText,
      isChanged,
      createField,
      handlePaste,
      pasteCreateField,
      saveChange,
      cancelChange,
      handleSaveArray,
      isFieldArray,
      isFieldNumber,
      inputRef,
      isShowArrayEdit,
      // countryFlag,
      isLocalCreated,
      handleCreateFile,
      handleReload,
    }
  },
})
</script>

<template>
  <n-card size="small" class="batch-translate-item">
    <div class="card-header">
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

    <div style="color: hotpink; margin-bottom: 10px" v-if="!currentItem">
      <template v-if="isLocalCreated">
        <n-button secondary size="small" @click="handleReload">
          {{ $t('actions.reload') }}
        </n-button>
      </template>
      <template v-else>
        File does not exist, please
        <b style="text-decoration: underline; cursor: pointer" @click="handleCreateFile"
          >create it</b
        >
        on your local file system
      </template>
    </div>
    <template v-else-if="translatePath">
      <n-space v-if="translateText !== null" align="center" size="small">
        <n-input-number
          ref="valueInputRef"
          v-if="isFieldNumber"
          v-model:value="translateText"
          placeholder="number value"
          size="small"
          class="font-code"
        />
        <n-input
          v-else
          ref="inputRef"
          type="textarea"
          size="small"
          v-model:value="translateText"
          :placeholder="isFieldArray ? $t('msgs.input_array') : $t('msgs.input_text')"
          :rows="isFieldArray ? 2 : 1"
          style="width: 450px"
          :class="{'font-code': isFieldArray}"
          clearable
        />

        <n-button-group>
          <n-button @click="handlePaste" secondary size="small" type="primary" title="Auto Paste">
            <template #icon>
              <ClipboardPaste20Regular />
            </template>
          </n-button>

          <n-button
            secondary
            v-if="isFieldArray"
            @click="isShowArrayEdit = true"
            size="small"
            :title="$t('actions.edit')"
          >
            <template #icon><DocumentEdit20Regular /></template>
          </n-button>
        </n-button-group>

        <n-button-group v-if="isChanged">
          <n-button
            size="small"
            type="primary"
            @click="saveChange({isEmit: true})"
            title="Batch save"
          >
            <template #icon><SaveMultiple20Regular /></template>
          </n-button>
          <n-button secondary size="small" @click="cancelChange">
            {{ $t('actions.cancel') }}
          </n-button>
        </n-button-group>
      </n-space>
      <n-button-group v-else>
        <n-button size="small" @click="pasteCreateField()" type="primary">
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
      is-textarea
      :title="$t('common.array_detail')"
      :placeholder="$t('common.array_json_string')"
      v-model:visible="isShowArrayEdit"
      :text="translateText"
      @onSave="handleSaveArray"
    />
  </n-card>
</template>

<style lang="scss" scoped>
.batch-translate-item {
  margin-bottom: 10px;

  :deep(.n-card__content) {
    padding: 10px;
  }

  .card-header {
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
}
</style>
